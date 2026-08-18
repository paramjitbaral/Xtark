"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

interface GlobalScrollPathProps {
  containerRef?: React.RefObject<HTMLElement | null>;
}

const GlobalScrollPath = ({ containerRef }: GlobalScrollPathProps) => {
  const localRef = useRef<HTMLDivElement>(null);
  const target = containerRef || localRef;

  const { scrollYProgress } = useScroll({
    target: target,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 35,
    restDelta: 0.0001,
  });

  return (
    <div 
      ref={localRef} 
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-10"
      style={{ minHeight: '100%' }}
    >
      <svg
        className="w-full h-full absolute inset-0 pointer-events-none"
        viewBox="0 0 1200 6000"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Subtle background guide path for aesthetic depth */}
        <path
          d="M600 40 C750 40, 880 140, 860 260 C840 380, 700 420, 580 400 C440 380, 380 260, 430 180 C480 100, 660 110, 740 220 C820 340, 760 480, 620 560 C420 670, 180 780, 200 1020 C220 1240, 480 1340, 700 1400 C950 1470, 1090 1600, 1060 1820 C1020 2050, 820 2180, 600 2240 C360 2300, 150 2440, 180 2680 C210 2900, 460 3020, 740 3080 C1020 3140, 1140 3300, 1090 3520 C1040 3740, 780 3880, 520 3940 C280 4000, 140 4150, 170 4380 C200 4600, 440 4720, 720 4790 C980 4860, 1080 5020, 990 5240 C900 5440, 680 5580, 460 5660 C280 5730, 220 5850, 350 5930 C480 6000, 720 5970, 800 6000"
          stroke="#050505"
          strokeWidth="1.5"
          strokeDasharray="4 10"
          strokeOpacity="0.08"
          vectorEffect="non-scaling-stroke"
        />

        {/* Dynamic active neon stroke that perfectly follows scroll progress */}
        <motion.path
          d="M600 40 C750 40, 880 140, 860 260 C840 380, 700 420, 580 400 C440 380, 380 260, 430 180 C480 100, 660 110, 740 220 C820 340, 760 480, 620 560 C420 670, 180 780, 200 1020 C220 1240, 480 1340, 700 1400 C950 1470, 1090 1600, 1060 1820 C1020 2050, 820 2180, 600 2240 C360 2300, 150 2440, 180 2680 C210 2900, 460 3020, 740 3080 C1020 3140, 1140 3300, 1090 3520 C1040 3740, 780 3880, 520 3940 C280 4000, 140 4150, 170 4380 C200 4600, 440 4720, 720 4790 C980 4860, 1080 5020, 990 5240 C900 5440, 680 5580, 460 5660 C280 5730, 220 5850, 350 5930 C480 6000, 720 5970, 800 6000"
          stroke="#22c55e"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          style={{
            pathLength: smoothProgress,
          }}
        />
      </svg>
    </div>
  );
};

export default GlobalScrollPath;
