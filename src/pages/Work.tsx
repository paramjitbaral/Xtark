import React from "react";

const projects = [
  { 
    number: "01",
    title: "Fabric", 
    category: "Strategy & Design", 
    year: "2026",
    description: "Translating tactile luxury into an immersive digital storefront for a premium material weaver, utilizing fluid transitions and editorial layouts.",
    image: "/fabric.png", 
    url: "https://anantin-com.vercel.app/" 
  },
  { 
    number: "02",
    title: "Gym", 
    category: "Mobile Experience", 
    year: "2026",
    description: "A high-performance athletic application designed to merge raw, dark-mode training aesthetics with seamless booking workflows.",
    image: "/gym.png", 
    url: "https://gym-xtark.vercel.app/" 
  },
  { 
    number: "03",
    title: "Compass", 
    category: "Product Design", 
    year: "2026",
    description: "An interactive pathfinding navigation engine built to simplify complex data streams and workflows for modern SaaS platforms.",
    image: "/compass.png", 
    url: "https://compass-launch.vercel.app/" 
  },
  { 
    number: "04",
    title: "Shop", 
    category: "E-Commerce", 
    year: "2026",
    description: "A sleek, motion-heavy luxury fashion experience, featuring micro-interactions and optimized one-page checkout funnels.",
    image: "/f.shop.png", 
    url: "https://anantin-com.vercel.app/shop" 
  },
  { 
    number: "05",
    title: "Klians", 
    category: "Brand Identity", 
    year: "2026",
    description: "Visual identity and editorial digital home for a contemporary architectural studio, focusing on grid structures and typography.",
    image: "/klians.png", 
    url: "https://klians.vercel.app/" 
  },
  { 
    number: "06",
    title: "SmartQ", 
    category: "Web Application", 
    year: "2026",
    description: "A robust workflow analytics dashboard that transforms complex backend statistics into intuitive, real-time performance insights.",
    image: "/smartq.png", 
    url: "https://klsmartq.vercel.app/" 
  },
];

export default function Work() {
  return (
    <div className="w-full bg-bg text-white pt-24 pb-20 md:pb-40 px-6 md:px-12 lg:px-24 flex flex-col items-center z-10 relative font-sans">
      
      {/* Minimal Header */}
      <div className="w-full max-w-[1100px] mb-24 md:mb-32 flex flex-col md:flex-row md:items-end justify-between border-t border-white/10 pt-12">
        <h2 className="text-3xl md:text-4xl font-display uppercase tracking-wider text-white font-medium leading-none">
          Selected Works
        </h2>
        <div className="flex flex-col mt-6 md:mt-0 max-w-[280px]">
          <p className="text-white/40 text-xs tracking-[0.2em] uppercase leading-relaxed font-light">
            A curated selection of our finest digital experiences.
          </p>
        </div>
      </div>

      {/* Case Study Rows Layout */}
      <div className="w-full max-w-[1100px] flex flex-col gap-28 md:gap-44">
        {projects.map((project, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div 
              key={idx}
              className={`w-full grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center`}
            >
              {/* IMAGE COLUMN (7 Cols) */}
              <div 
                className={`w-full lg:col-span-7 ${isEven ? "lg:order-1" : "lg:order-2"}`}
              >
                <a 
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block group overflow-hidden bg-zinc-950 rounded-[20px] shadow-[0_10px_35px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 transition-all duration-500 cursor-pointer"
                >
                  <div className="w-full aspect-[16/10] overflow-hidden relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-[1.02] transition-transform duration-750 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-90 group-hover:opacity-100"
                    />
                    
                    {/* View Badge */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black font-sans text-[10px] uppercase tracking-[0.25em] font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out shadow-2xl">
                        <span className="pl-1">View</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-[1px]">
                          <path d="M7 7h10v10"/>
                          <path d="M7 17 17 7"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>
              </div>

              {/* TEXT COLUMN (5 Cols) */}
              <div 
                className={`w-full lg:col-span-5 flex flex-col gap-5 ${isEven ? "lg:order-2 lg:pl-8" : "lg:order-1 lg:pr-8"}`}
              >
                {/* Meta details */}
                <div className="flex items-center gap-4 text-[10px] tracking-[0.25em] uppercase text-white/30 font-light">
                  <span>{project.number}</span>
                  <span className="w-1.5 h-1.5 bg-white/10 rounded-full"></span>
                  <span>{project.category}</span>
                </div>

                {/* Project Title */}
                <h3 className="text-3xl md:text-4xl font-display uppercase tracking-wider font-semibold text-white/95 leading-none">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-white/50 text-[13px] leading-relaxed font-light font-sans max-w-[420px]">
                  {project.description}
                </p>

                {/* Text CTA */}
                <div className="mt-2">
                  <a 
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-medium text-white/60 hover:text-white transition-colors duration-300 border-b border-white/20 hover:border-white pb-1"
                  >
                    <span>Visit Live Website</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 7h10v10"/>
                      <path d="M7 17 17 7"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
