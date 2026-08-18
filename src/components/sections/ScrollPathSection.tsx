"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

const ScrollPathSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  return (
    <section
      ref={ref}
      className="mx-auto flex h-[100vh] w-full flex-col items-center justify-between overflow-hidden bg-[#eeeeeb] px-4 text-[#050505]"
    >
      <div className="mt-40 relative flex w-full max-w-[1280px] flex-col items-center justify-center gap-6 text-center">
        {/* Subtle Studio Pill */}
        <div 
          style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '999px',
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            marginBottom: '12px'
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#050505' }} />
          <span style={{ color: '#52525b', fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
            Interactive Journey
          </span>
        </div>

        <h2 className="relative z-10 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#050505] leading-[1.05]">
          The Path That <br /> Drives Digital Growth
        </h2>
        <p className="relative z-10 max-w-2xl text-lg md:text-xl font-normal text-[#71717a]">
          Scroll down to see the effect
        </p>

      </div>

      <div className="rounded-[40px] w-full max-w-[1400px] mx-auto mt-auto mb-20 bg-[#050505] pb-10 text-[#ffffff] overflow-hidden relative shadow-2xl">
        <h1 className="mt-16 text-center text-[12vw] md:text-[10vw] font-bold leading-[0.9] tracking-tighter text-[#ffffff]">
          xtark.agency
        </h1>
        <div className="mt-40 flex w-full flex-col items-start gap-8 px-8 md:px-16 pb-12 font-medium lg:mt-32 lg:flex-row lg:justify-between opacity-80">
          <div className="flex w-full items-center justify-between gap-12 uppercase lg:w-fit lg:justify-center">
            <p className="w-fit text-sm leading-relaxed text-[#a1a1aa]">
              <span className="text-[#ffffff]">LOCATION</span> <br />
              Global & Online
            </p>
            <p className="w-fit text-right text-sm lg:text-left leading-relaxed text-[#a1a1aa]">
              <span className="text-[#ffffff]">ESTABLISHED</span> <br /> 
              2026
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center justify-between gap-12 uppercase lg:w-fit lg:justify-center">
            <p className="w-fit text-sm leading-relaxed text-[#a1a1aa]">
              <span className="text-[#ffffff]">AVAILABILITY</span> <br /> 
              Accepting Projects
            </p>
            <p className="w-fit text-right text-sm lg:text-left leading-relaxed text-[#a1a1aa]">
              <span className="text-[#ffffff]">STARTING AT</span> <br /> 
              $5,000 USD
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollPathSection;


