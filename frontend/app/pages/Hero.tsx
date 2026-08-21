import React from "react";

interface HeroProps {
  isDark?: boolean;
}

const Hero = ({ isDark = false }: HeroProps) => {
  return (
    <div
      className={`${
        isDark ? "text-white" : "text-black"
      } relative z-10 w-full min-h-screen lg:h-screen flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 px-6 sm:px-10 lg:px-20 pt-28 pb-12 lg:py-0 font-[Inter]`}
    >
      {/* Left: copy */}
      <div className="flex flex-col gap-4 max-w-xl text-center lg:text-left items-center lg:items-start">
        <img
          src={isDark ? "/trustpilot-dark.png" : "/trustpilot-light.png"}
          alt="Trustpilot"
          className="w-[173px] h-[63px] object-contain rounded-4xl"
        />

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.02] tracking-[-0.04em] uppercase">
          Engineering what
          <br />
          businesses{" "}
          <img
            src="/stack.png"
            alt=""
            className="inline-block h-[0.75em] w-auto align-middle rounded-xl object-cover mx-1 -translate-y-[0.06em]"
          />{" "}
          become next.
        </h1>

        <p
          className={`${
            isDark ? "text-white/70" : "text-black/60"
          } text-base sm:text-lg leading-relaxed max-w-md`}
        >
          Kodalic builds intelligent technology solutions that help
          businesses evolve, automate, and compete in a digital-first
          world.
        </p>

        <button
          className={`${
            isDark
              ? "bg-white text-black hover:bg-white/90"
              : "bg-black text-white hover:bg-black/85"
          } px-8 py-4 rounded-full font-semibold text-sm sm:text-base transition-colors duration-200 active:scale-95`}
        >
          Contact Us
        </button>
      </div>

      {/* Right: product image */}
      <div className="flex-shrink-0 w-full max-w-[200px] sm:max-w-[300px] lg:max-w-[450px] lg:-translate-x-16 lg:translate-y-8">
        <img
          src="/Kodalic.png"
          alt="Kodalic"
          className="w-full h-auto object-contain rounded-full "
        />
      </div>
    </div>
  );
};

export default Hero;