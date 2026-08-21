"use client";

import React from "react";
import DriftWall from "../components/DriftWall";

interface AboutProps {
  isDark?: boolean;
}

const items = [
  { image: "https://picsum.photos/id/1015/600/400", title: "Peaks" },
  { image: "https://picsum.photos/id/1025/600/400", title: "Pup" },
  { image: "https://picsum.photos/id/1039/600/400", title: "Falls" },
  { image: "https://picsum.photos/id/1043/600/400", title: "Dunes" },
  { image: "https://picsum.photos/id/1044/600/400", title: "Coast" },
  { image: "https://picsum.photos/id/1050/600/400", title: "Ridge" },
];

const About = ({ isDark = false }: AboutProps) => {
  return (
    <section className="relative z-10 w-full flex flex-col md:flex-row items-stretch min-h-screen font-[Inter]">
      {/* Left: DriftWall visual */}
      <div className="w-full md:w-1/2 h-[400px] md:h-auto">
        <DriftWall
          items={items}
          columns={3}
          tileWidth={224}
          tileHeight={132}
          gap={24}
          tilt={10}
          turn={15}
          perspective={1250}
          depth={120}
          speed={32}
          direction="up"
          variance={0.45}
          parallax={0}
          lift={52}
          fade={0.55}
          dim={0.55}
          overlayColor={isDark ? "#1a0a2e" : "#8f8f8f"}
          radius={13}
          roll={0}
          pauseOnHover={false}
          grayscale={isDark ? true : false}
        />
      </div>

      {/* Right: About content */}
      <div className="relative z-10 w-full md:w-1/2 flex flex-col justify-center px-8 md:px-12 py-12">
        {/* Heading */}
        <h2 
  className={`text-4xl md:text-5xl font-extrabold leading-tight uppercase ${
    isDark ? "text-white" : "text-[#0a1128]" 
  }`} 
>
  Technology solutions 
  <br /> 
  built around real 
  <br /> 
  business needs. 
</h2>
        {/* Divider accent */}
        <div className="w-14 h-1 bg-cyan-400 rounded-full mt-6 mb-8" />

        {/* Description */}
        <p
          className={`text-base md:text-lg leading-relaxed mb-4 ${
            isDark ? "text-white/70" : "text-gray-600"
          }`}
        >
          Kodalic is a technology solutions company helping businesses turn
          ideas, challenges, and opportunities into practical digital
          solutions.
        </p>
        <p
          className={`text-base md:text-lg leading-relaxed mb-10 ${
            isDark ? "text-white/70" : "text-gray-600"
          }`}
        >
          We combine software engineering, AI, automation, and product
          development to create reliable technology that improves how
          businesses operate, connect, and grow.
        </p>
      </div>
    </section>
  );
};

export default About;