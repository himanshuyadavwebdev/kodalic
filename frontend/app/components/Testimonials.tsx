"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Renderer, Triangle, Program, Mesh, Texture } from "ogl";
import { gsap } from "gsap";
import { DEMO_MODE, DEMO_TESTIMONIALS } from "../data/demoData";

interface VerifiedTestimonial {
  quote: string;
  name: string;
  company: string;
  role?: string;
  avatar?: string;
  logo?: string;
  verified: boolean;
  demo?: boolean;
  label?: string;
}

const TESTIMONIALS: VerifiedTestimonial[] = [];

type Direction = 1 | -1;

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform sampler2D tCurrent;
uniform sampler2D tNext;
uniform float uProgress;
uniform float uIntensity;
uniform float uScale;
uniform float uAberration;
uniform float uDrift;
uniform float uTime;
uniform vec2 uPointer;
uniform vec3 uOverlay;

varying vec2 vUv;

const float PI = 3.14159265359;

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  float p = clamp(uProgress, 0.0, 1.0);
  float env = sin(p * PI);
  vec2 uv = vUv;

  // Subtle living drift, matching the React Bits Morph Slider feel.
  uv += vec2(
    sin(uTime * 0.25 + uv.y * 4.0),
    cos(uTime * 0.22 + uv.x * 4.0)
  ) * uDrift * 0.008;

  vec2 pointerWarp = uv - uPointer;
  float pointerDistance = length(pointerWarp);
  float hoverInfluence = smoothstep(0.72, 0.0, pointerDistance) * 0.0025;
  uv += normalize(pointerWarp + 0.0001) * hoverInfluence;

  float nn = fbm(uv * uScale + uTime * 0.03);
  float warp = fbm(uv * uScale * 1.7 - uTime * 0.02);
  vec2 displacement = vec2(nn, warp) - 0.5;

  vec2 uvCurrent = uv + displacement * uIntensity * 0.50 * p;
  vec2 uvNext = uv - displacement * uIntensity * 0.50 * (1.0 - p);
  float mixAmount = smoothstep(nn - 0.15, nn + 0.15, p);

  float ca = uAberration * env * 0.025;

  vec3 currentColor = vec3(
    texture2D(tCurrent, uvCurrent + vec2(ca, 0.0)).r,
    texture2D(tCurrent, uvCurrent).g,
    texture2D(tCurrent, uvCurrent - vec2(ca, 0.0)).b
  );

  vec3 nextColor = vec3(
    texture2D(tNext, uvNext + vec2(ca, 0.0)).r,
    texture2D(tNext, uvNext).g,
    texture2D(tNext, uvNext - vec2(ca, 0.0)).b
  );

  vec3 color = mix(currentColor, nextColor, mixAmount);
  float vignette = smoothstep(1.15, 0.28, length(uv - 0.5));
  color = mix(color, uOverlay, (1.0 - vignette) * 0.08);

  gl_FragColor = vec4(color, 1.0);
}
`;

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const value = parseInt(clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean, 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth || !line) {
      line = next;
    } else {
      lines.push(line);
      line = word;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function createCardCanvas(
  testimonial: VerifiedTestimonial,
  width: number,
  height: number,
  isDark: boolean,
  dpr: number
) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * dpr));
  canvas.height = Math.max(1, Math.round(height * dpr));

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  const padding = Math.min(58, Math.max(28, width * 0.075));
  const bg = isDark ? "#17141f" : "#ffffff";
  const text = isDark ? "#ffffff" : "#161221";
  const muted = isDark ? "rgba(255,255,255,0.62)" : "rgba(22,18,33,0.58)";
  const border = isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.07)";

  // Base card.
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(width * 0.12, height * 0.04, 0, width * 0.12, height * 0.04, width * 0.9);
  glow.addColorStop(0, isDark ? "rgba(164,120,255,0.08)" : "rgba(145,90,255,0.035)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = border;
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, width - 1, height - 1);

  const quoteSize = Math.min(72, Math.max(46, width * 0.075));
  ctx.fillStyle = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.09)";
  ctx.font = `400 ${quoteSize}px Georgia, serif`;
  ctx.fillText("“", padding, padding + quoteSize * 0.42);

  const quoteFont = Math.min(24, Math.max(16, width * 0.027));
  const lineHeight = quoteFont * 1.58;
  const maxQuoteWidth = width - padding * 2;
  ctx.font = `400 ${quoteFont}px Arial, sans-serif`;
  ctx.fillStyle = text;

  const lines = wrapText(ctx, testimonial.quote, maxQuoteWidth);
  const quoteTop = Math.min(height * 0.28, padding + quoteSize * 0.95);
  const maxQuoteHeight = Math.max(0, height - quoteTop - padding - 104);
  const visibleLines = Math.max(1, Math.floor(maxQuoteHeight / lineHeight));
  const renderLines = lines.slice(0, visibleLines);

  renderLines.forEach((line, index) => {
    let value = line;
    if (index === renderLines.length - 1 && lines.length > visibleLines) {
      while (ctx.measureText(`${value}…`).width > maxQuoteWidth && value.length > 0) value = value.slice(0, -1);
      value += "…";
    }
    ctx.fillText(value, padding, quoteTop + index * lineHeight);
  });

  const identityY = height - padding - 54;
  const initials = testimonial.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  ctx.beginPath();
  ctx.arc(padding + 24, identityY + 24, 24, 0, Math.PI * 2);
  ctx.fillStyle = isDark ? "#ffffff" : "#161221";
  ctx.fill();
  ctx.fillStyle = isDark ? "#161221" : "#ffffff";
  ctx.font = "600 13px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(initials, padding + 24, identityY + 24);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  const identityX = padding + 64;
  ctx.fillStyle = text;
  ctx.font = `600 ${Math.min(15, Math.max(13, width * 0.017))}px Arial, sans-serif`;
  ctx.fillText(testimonial.name, identityX, identityY + 19);

  ctx.fillStyle = muted;
  ctx.font = `400 ${Math.min(13, Math.max(11, width * 0.015))}px Arial, sans-serif`;
  const subtitle = testimonial.role ? `${testimonial.role} · ${testimonial.company}` : testimonial.company;
  ctx.fillText(subtitle, identityX, identityY + 42);

  return canvas;
}

class TestimonialMorphEngine {
  private container: HTMLDivElement;
  private slides: VerifiedTestimonial[];
  private isDark: boolean;
  private reducedMotion: boolean;
  private onIndexChange: (index: number) => void;
  private renderer: Renderer;
  private gl: Renderer["gl"];
  private canvas: HTMLCanvasElement;
  private geometry: Triangle;
  private program: Program;
  private mesh: Mesh;
  private textures: Texture[] = [];
  private current: number;
  private animating = false;
  private dragging = false;
  private dragDirection: Direction = 1;
  private tween: gsap.core.Tween | null = null;
  private resizeObserver: ResizeObserver;
  private raf = 0;
  private width = 1;
  private height = 1;
  private textureDpr = 1;
  private boundLoop: (time: number) => void;

  constructor({
    container,
    slides,
    startIndex,
    isDark,
    reducedMotion,
    onIndexChange,
  }: {
    container: HTMLDivElement;
    slides: VerifiedTestimonial[];
    startIndex: number;
    isDark: boolean;
    reducedMotion: boolean;
    onIndexChange: (index: number) => void;
  }) {
    this.container = container;
    this.slides = slides;
    this.current = startIndex;
    this.isDark = isDark;
    this.reducedMotion = reducedMotion;
    this.onIndexChange = onIndexChange;

    this.renderer = new Renderer({
      alpha: false,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0.05, 0.05, 0.06, 1);

    this.canvas = this.gl.canvas as HTMLCanvasElement;
    this.canvas.className = "testimonial-morph-canvas";
    this.container.appendChild(this.canvas);

    this.geometry = new Triangle(this.gl);
    const fallback = new Texture(this.gl, { generateMipmaps: false });
    const fallbackCanvas = createCardCanvas(slides[startIndex], 1, 1, isDark, 1);
    fallback.image = fallbackCanvas;

    this.program = new Program(this.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        tCurrent: { value: fallback },
        tNext: { value: fallback },
        uProgress: { value: 0 },
        uIntensity: { value: 0.55 },
        uScale: { value: 2.4 },
        uAberration: { value: 0.35 },
        uDrift: { value: 0.4 },
        uTime: { value: 0 },
        uPointer: { value: [0.5, 0.5] },
        uOverlay: { value: hexToRgb(isDark ? "#0d0b12" : "#f7f5fb") },
      },
    });

    this.mesh = new Mesh(this.gl, { geometry: this.geometry, program: this.program });

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();

    this.boundLoop = this.loop.bind(this);
    this.raf = requestAnimationFrame(this.boundLoop);
  }

  private buildTextures() {
    const previousTextures = this.textures;
    this.textures = this.slides.map((slide) => {
      const texture = new Texture(this.gl, { generateMipmaps: false });
      texture.image = createCardCanvas(slide, this.width, this.height, this.isDark, this.textureDpr);
      return texture;
    });

    previousTextures.forEach((texture) => {
      if (texture.texture) this.gl.deleteTexture(texture.texture);
    });

    this.program.uniforms.tCurrent.value = this.textures[this.current];
    this.program.uniforms.tNext.value = this.textures[this.current];
  }

  private resize() {
    const rect = this.container.getBoundingClientRect();
    this.width = Math.max(1, Math.round(rect.width));
    this.height = Math.max(1, Math.round(rect.height));
    this.textureDpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setSize(this.width, this.height);
    this.buildTextures();
  }

  private loop(time: number) {
    this.program.uniforms.uTime.value = time * 0.001;
    this.renderer.render({ scene: this.mesh });
    this.raf = requestAnimationFrame(this.boundLoop);
  }

  private wrap(index: number) {
    return ((index % this.slides.length) + this.slides.length) % this.slides.length;
  }

  private transition(direction: Direction) {
    if (this.animating || this.dragging || this.slides.length < 2) return;
    const target = this.wrap(this.current + direction);
    this.program.uniforms.tCurrent.value = this.textures[this.current];
    this.program.uniforms.tNext.value = this.textures[target];
    this.animating = true;

    if (this.reducedMotion) {
      this.commit(target);
      return;
    }

    this.tween = gsap.fromTo(
      this.program.uniforms.uProgress,
      { value: 0 },
      {
        value: 1,
        duration: 1.1,
        ease: "power2.inOut",
        onComplete: () => this.commit(target),
      }
    );
  }

  private commit(target: number) {
    this.current = target;
    this.program.uniforms.tCurrent.value = this.textures[target];
    this.program.uniforms.tNext.value = this.textures[target];
    this.program.uniforms.uProgress.value = 0;
    this.animating = false;
    this.tween = null;
    this.onIndexChange(target);
  }

  next() {
    this.transition(1);
  }

  prev() {
    this.transition(-1);
  }

  setPointer(clientX: number, clientY: number) {
    const rect = this.container.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (clientX - rect.left) / Math.max(rect.width, 1)));
    const y = Math.min(1, Math.max(0, 1 - (clientY - rect.top) / Math.max(rect.height, 1)));
    this.program.uniforms.uPointer.value = [x, y];
  }

  beginDrag() {
    if (this.animating || this.slides.length < 2) return false;
    this.dragging = true;
    return true;
  }

  drag(normalizedDeltaX: number) {
    if (!this.dragging) return;
    this.dragDirection = normalizedDeltaX < 0 ? 1 : -1;
    const target = this.wrap(this.current + this.dragDirection);
    this.program.uniforms.tCurrent.value = this.textures[this.current];
    this.program.uniforms.tNext.value = this.textures[target];
    this.program.uniforms.uProgress.value = Math.min(Math.abs(normalizedDeltaX), 1);
  }

  endDrag() {
    if (!this.dragging) return;
    this.dragging = false;
    const progress = this.program.uniforms.uProgress.value as number;
    const target = this.wrap(this.current + this.dragDirection);
    this.animating = true;

    if (this.reducedMotion || progress > 0.4) {
      this.tween = gsap.to(this.program.uniforms.uProgress, {
        value: 1,
        duration: this.reducedMotion ? 0 : 0.45,
        ease: "power2.out",
        onComplete: () => this.commit(target),
      });
    } else {
      this.tween = gsap.to(this.program.uniforms.uProgress, {
        value: 0,
        duration: 0.35,
        ease: "power2.out",
        onComplete: () => {
          this.animating = false;
          this.tween = null;
        },
      });
    }
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.tween?.kill();
    this.resizeObserver.disconnect();
    this.textures.forEach((texture) => {
      if (texture.texture) this.gl.deleteTexture(texture.texture);
    });
    if (this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
  }
}

export default function Testimonials({ isDark = false }: { isDark?: boolean }) {
  const source = DEMO_MODE && TESTIMONIALS.length === 0 ? DEMO_TESTIMONIALS : TESTIMONIALS;
  const list = (DEMO_MODE ? source : source.filter((testimonial) => testimonial.verified)) as VerifiedTestimonial[];

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<TestimonialMorphEngine | null>(null);
  const pointerStart = useRef<{ x: number; pointerId: number } | null>(null);
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const swipeHintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swipeHintCanReplayRef = useRef(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || list.length < 2) return undefined;

    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        if (!entry.isIntersecting || entry.intersectionRatio < 0.45) {
          swipeHintCanReplayRef.current = true;
          return;
        }

        if (!isMobile() || !swipeHintCanReplayRef.current) return;

        swipeHintCanReplayRef.current = false;
        if (swipeHintTimerRef.current) clearTimeout(swipeHintTimerRef.current);
        setShowSwipeHint(true);
        swipeHintTimerRef.current = setTimeout(() => {
          setShowSwipeHint(false);
          swipeHintTimerRef.current = null;
        }, 1400);
      },
      { threshold: [0, 0.45, 0.7] }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      if (swipeHintTimerRef.current) clearTimeout(swipeHintTimerRef.current);
    };
  }, [list.length]);

  useEffect(() => {
    if (!stageRef.current || list.length === 0) return undefined;

    const engine = new TestimonialMorphEngine({
      container: stageRef.current,
      slides: list,
      startIndex: 0,
      isDark,
      reducedMotion: reduced,
      onIndexChange: setIndex,
    });

    engineRef.current = engine;
    setIndex(0);

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
    // The slide data is static for the mounted page. Recreating WebGL for every render is unnecessary.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark, reduced, list.length]);

  const prev = useCallback(() => engineRef.current?.prev(), []);
  const next = useCallback(() => engineRef.current?.next(), []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    pointerStart.current = { x: event.clientX, pointerId: event.pointerId };
    engineRef.current?.setPointer(event.clientX, event.clientY);
    const active = engineRef.current?.beginDrag();
    if (active) event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    engineRef.current?.setPointer(event.clientX, event.clientY);
    if (!pointerStart.current) return;
    const width = event.currentTarget.getBoundingClientRect().width || 1;
    engineRef.current?.drag((event.clientX - pointerStart.current.x) / width);
  };

  const onPointerUp = () => {
    pointerStart.current = null;
    engineRef.current?.endDrag();
  };

  if (list.length === 0) return null;

  const current = list[index];

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-background py-16 sm:py-24" aria-label="Testimonials">
      <div className="mx-auto max-w-3xl px-6 sm:px-8 lg:px-10">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium tracking-[0.18em] text-black/45 dark:text-white/45">CLIENT TESTIMONIALS</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#161221] dark:text-white sm:text-4xl">
            What our clients say
          </h2>

          {list.length > 1 && (
            <div
              className={`testimonial-swipe-hint mt-3 flex items-center justify-center gap-2 text-xs font-medium tracking-[0.16em] text-black/45 transition-all duration-300 dark:text-white/45 sm:hidden ${
                showSwipeHint ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-1 scale-90 opacity-0"
              }`}
              aria-hidden={!showSwipeHint}
            >
              <span aria-hidden="true">←</span>
              <span>SWIPE</span>
              <span aria-hidden="true">→</span>
            </div>
          )}
        </div>

        <div
          ref={stageRef}
          className="testimonial-morph-stage relative h-[430px] w-full overflow-hidden rounded-[32px] border bg-card shadow-[0_20px_50px_rgba(0,0,0,0.04)] sm:h-[470px]"
          style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }}
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              prev();
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              next();
            }
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-black/[0.02] to-transparent dark:from-white/[0.02]" />

          {list.length > 1 && (
            <>
              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={prev}
                aria-label="Previous testimonial"
                className="absolute left-[6px] top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/55 bg-white/55 text-lg text-black/70 shadow-[0_10px_28px_rgba(17,12,31,0.14),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 hover:scale-105 hover:bg-white/70 hover:text-black/90 hover:shadow-[0_14px_34px_rgba(17,12,31,0.18),inset_0_1px_0_rgba(255,255,255,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/40 active:scale-95 dark:border-white/20 dark:bg-white/12 dark:text-white/80 dark:shadow-[0_10px_28px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.12)] dark:hover:bg-white/20 dark:hover:text-white sm:flex"
              >
                ←
              </button>
              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={next}
                aria-label="Next testimonial"
                className="absolute right-[6px] top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/55 bg-white/55 text-lg text-black/70 shadow-[0_10px_28px_rgba(17,12,31,0.14),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 hover:scale-105 hover:bg-white/70 hover:text-black/90 hover:shadow-[0_14px_34px_rgba(17,12,31,0.18),inset_0_1px_0_rgba(255,255,255,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/40 active:scale-95 dark:border-white/20 dark:bg-white/12 dark:text-white/80 dark:shadow-[0_10px_28px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.12)] dark:hover:bg-white/20 dark:hover:text-white sm:flex"
              >
                →
              </button>
            </>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center gap-2">
            {list.map((testimonial, dotIndex) => (
              <span
                key={`${testimonial.name}-${dotIndex}`}
                className={`h-2 rounded-full transition-all duration-300 ${dotIndex === index ? "w-6 bg-white" : "w-2 bg-white/45"}`}
                aria-hidden
              />
            ))}
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {current.quote} {current.name}, {current.company}
        </p>

      </div>

      <style jsx>{`
        .testimonial-morph-stage {
          touch-action: pan-y;
          cursor: grab;
          user-select: none;
        }

        .testimonial-morph-stage:active {
          cursor: grabbing;
        }

        .testimonial-morph-stage:focus-visible {
          outline: 2px solid rgba(139, 92, 246, 0.8);
          outline-offset: 4px;
        }

        :global(.testimonial-morph-canvas) {
          display: block;
          width: 100%;
          height: 100%;
        }

        @media (prefers-reduced-motion: reduce) {
          .testimonial-morph-stage,
          .testimonial-morph-stage * {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
