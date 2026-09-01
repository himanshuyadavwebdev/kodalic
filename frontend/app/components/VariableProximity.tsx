"use client";

import React, { CSSProperties, RefObject, useEffect, useMemo, useRef } from "react";

type Falloff = "linear" | "exponential" | "gaussian";

interface VariableProximityProps {
  label: string;
  containerRef: RefObject<HTMLElement | null>;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  radius?: number;
  falloff?: Falloff;
  className?: string;
  style?: CSSProperties;
}

const parseSettings = (settings: string) =>
  new Map(
    settings
      .split(",")
      .map((setting) => setting.trim())
      .map((setting) => {
        const [axis, value] = setting.split(/\s+/);
        return [axis.replace(/["']/g, ""), Number.parseFloat(value)];
      })
  );

export default function VariableProximity({
  label,
  containerRef,
  fromFontVariationSettings = "'wght' 400, 'opsz' 14",
  toFontVariationSettings = "'wght' 10000, 'opsz' 72",
  radius = 150,
  falloff = "linear",
  className = "",
  style,
}: VariableProximityProps) {
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const frameRef = useRef<number | null>(null);
  const strengthRef = useRef<number[]>([]);

  const parsedSettings = useMemo(() => {
    const from = parseSettings(fromFontVariationSettings);
    const to = parseSettings(toFontVariationSettings);
    return Array.from(from.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: to.get(axis) ?? fromValue,
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      pointerRef.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
        active: true,
      };
    };

    const reset = () => {
      pointerRef.current.active = false;
      strengthRef.current = [];
      letterRefs.current.forEach((letter) => {
        if (!letter) return;
        letter.style.fontVariationSettings = fromFontVariationSettings;
        letter.style.transform = "translate3d(0, 0, 0) scale(1) rotate(0deg)";
        letter.style.filter = "none";
      });
    };

    const onPointerMove = (event: PointerEvent) => updatePointer(event.clientX, event.clientY);
    const onPointerLeave = () => reset();
    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) updatePointer(touch.clientX, touch.clientY);
    };
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) updatePointer(touch.clientX, touch.clientY);
    };
    const onTouchEnd = () => reset();

    const animate = () => {
      if (pointerRef.current.active) {
        const containerRect = container.getBoundingClientRect();
        const { x, y } = pointerRef.current;

        letterRefs.current.forEach((letter, index) => {
          if (!letter) return;
          const rect = letter.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2 - containerRect.left;
          const centerY = rect.top + rect.height / 2 - containerRect.top;
          const distance = Math.hypot(x - centerX, y - centerY);
          const normalized = Math.max(0, Math.min(1, 1 - distance / radius));

          let strength = normalized;
          if (falloff === "exponential") strength = normalized ** 2;
          if (falloff === "gaussian") {
            strength = distance >= radius ? 0 : Math.exp(-((distance / (radius / 2)) ** 2) / 2);
          }

          // Stronger than the previous version: broaden the active area and
          // intensify the peak so the morph is obvious immediately.
          strength = Math.min(1, Math.pow(strength, 0.52) * 1.35);
          const previousStrength = strengthRef.current[index] ?? 0;
          const smoothedStrength = previousStrength + (strength - previousStrength) * 0.34;
          strengthRef.current[index] = smoothedStrength;

          const settings = parsedSettings
            .map(({ axis, fromValue, toValue }) => {
              const value = fromValue + (toValue - fromValue) * smoothedStrength;
              return `'${axis}' ${value}`;
            })
            .join(", ");

          letter.style.fontVariationSettings = settings;
          // Add a clearly visible physical morph on top of the variable-font axes.
          const lift = -smoothedStrength * 6.2;
          const scale = 1 + smoothedStrength * 0.16;
          const rotate = (x - centerX) * 0.035 * smoothedStrength;
          letter.style.transform = `translate3d(0, ${lift}px, 0) scale(${scale}) rotate(${rotate}deg)`;
          letter.style.filter = smoothedStrength > 0.12
            ? `drop-shadow(0 ${smoothedStrength * 2}px ${smoothedStrength * 5}px rgba(109, 40, 217, ${smoothedStrength * 0.16}))`
            : "none";
        });
      }
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    container.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerleave", onPointerLeave);
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onTouchEnd, { passive: true });
    container.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      container.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [containerRef, falloff, fromFontVariationSettings, parsedSettings, radius]);

  let index = 0;
  const words = label.split(" ");

  return (
    <span
      className={`variable-proximity ${className}`}
      style={{
        display: "inline",
        fontFamily: "'Roboto Flex', sans-serif",
        fontOpticalSizing: "auto",
        ...style,
      }}
      aria-label={label}
    >
      {words.map((word, wordIndex) => (
        <React.Fragment key={`${word}-${wordIndex}`}>
          <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {Array.from(word).map((letter) => {
              const currentIndex = index++;
              return (
                <span
                  key={currentIndex}
                  ref={(element) => {
                    letterRefs.current[currentIndex] = element;
                  }}
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    fontVariationSettings: fromFontVariationSettings,
                    transition: "font-variation-settings 45ms linear, transform 45ms cubic-bezier(0.16, 1, 0.3, 1), filter 80ms ease",
                    willChange: "font-variation-settings, transform",
                  }}
                >
                  {letter}
                </span>
              );
            })}
          </span>
          {wordIndex < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </span>
  );
}
