import React from "react";

const projects = [
  { title: "Fabric", subtitle: "Creative Agency / 2026", image: "/fabric.png", tag: "Strategy & Design" },
  { title: "Gym", subtitle: "Fitness App / 2026", image: "/gym.png", tag: "Mobile Experience" },
  { title: "Compass", subtitle: "Navigation System / 2026", image: "/compass.png", tag: "Product Design" },
  { title: "Shop", subtitle: "E-Commerce / 2026", image: "/f.shop.png", tag: "E-Commerce" },
  { title: "Klians", subtitle: "Brand Identity / 2026", image: "/klians.png", tag: "Branding" },
  { title: "SmartQ", subtitle: "SaaS Platform / 2026", image: "/smartq.png", tag: "Web Application" },
];

export default function Work({ isViewActive }: { isViewActive?: boolean }) {
  return (
    <div className="w-full bg-bg text-white pt-24 pb-16 md:pb-32 px-6 md:px-12 lg:px-24 flex flex-col items-center z-10 relative font-sans">
      
      {/* Minimal Header */}
      <div className="w-full max-w-[1200px] mb-20 flex flex-col md:flex-row md:items-end justify-between border-t border-white/10 pt-12">
        <h2 className="text-3xl md:text-4xl font-display uppercase tracking-wider text-white font-medium leading-none">
          Selected Works
        </h2>
        <div className="flex flex-col mt-6 md:mt-0 max-w-[280px]">
          <p className="text-white/40 text-xs tracking-[0.2em] uppercase leading-relaxed font-light">
            A curated selection of our finest digital experiences.
          </p>
        </div>
      </div>

      {/* 2-Column Minimal Grid */}
      <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-16 md:gap-y-24">
        {projects.map((project, idx) => (
          <div 
            key={idx} 
            className="w-full flex flex-col group cursor-pointer"
          >
            {/* Standardized Aspect Ratio Image Container */}
            <div className="w-full aspect-video overflow-hidden bg-[#111] relative rounded-md mb-6">
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-90 group-hover:opacity-100"
              />
              {/* Subtle hover overlay */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
            </div>

            {/* Clean Typography */}
            <div className="w-full flex items-start justify-between">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-2xl font-display uppercase tracking-wider font-medium text-white/90 group-hover:text-white transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase font-light">
                  {project.subtitle}
                </p>
              </div>
              <span className="text-white/20 text-[10px] tracking-[0.2em] uppercase">
                0{idx + 1}
              </span>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
