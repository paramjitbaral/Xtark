"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type ExpertiseItem = {
  type: "text" | "image";
  title?: string;
  desc?: string;
  src?: string;
  bgColor?: string;
  textColor?: string;
};

const expertiseItems: ExpertiseItem[] = [
  // Column 1
  { type: "text", title: "Digital Product Design", desc: "Intuitive, engaging, and beautiful user interfaces that drive conversion.", bgColor: "#f4f4f5", textColor: "#1d1d1f" },
  { type: "image", src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop" },
  { type: "text", title: "Web Development", desc: "Robust, scalable, and ultra-fast web architectures.", bgColor: "#f4f4f5", textColor: "#1d1d1f" },
  
  // Column 2
  { type: "image", src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop" },
  { type: "text", title: "Branding & Identity", desc: "Unique visual identities that cut through the noise.", bgColor: "#f4f4f5", textColor: "#1d1d1f" },
  { type: "image", src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600&auto=format&fit=crop" },

  // Column 3
  { type: "text", title: "Motion & Animation", desc: "Immersive micro-interactions and smooth GSAP-powered animations.", bgColor: "#f4f4f5", textColor: "#1d1d1f" },
  { type: "text", title: "E-Commerce", desc: "High-converting online stores engineered for global scale.", bgColor: "#f4f4f5", textColor: "#1d1d1f" },
  { type: "image", src: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=600&auto=format&fit=crop" },

  // Column 4
  { type: "image", src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop" },
  { type: "text", title: "Cloud Architecture", desc: "Serverless edge compute and global database scaling.", bgColor: "#f4f4f5", textColor: "#1d1d1f" },
  { type: "text", title: "Strategy & SEO", desc: "Data-driven insights to completely dominate your market.", bgColor: "#f4f4f5", textColor: "#1d1d1f" },
];

const OurExpertiseSection = () => {
  const gallery = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const { height } = dimension;
  const y = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);

  useEffect(() => {
    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <main className="w-full text-[#1d1d1f] bg-transparent">
      {/* Tighter overall space, guaranteed gap between title and scroll text */}
      <div className="w-full flex flex-col items-center justify-center relative z-10" style={{ paddingTop: '100px', paddingBottom: '40px' }}>
        <h2 className="text-6xl md:text-8xl font-bold tracking-tight text-[#050505] text-center" style={{ marginBottom: '50px' }}>Our Expertise.</h2>
        <span className="relative max-w-[15ch] text-xs uppercase leading-tight opacity-50 text-[#050505] after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:to-black after:content-[''] text-center">
          scroll to explore
        </span>
      </div>

      <div
        ref={gallery}
        className="relative w-full box-border flex h-[150vh] overflow-hidden"
        style={{ padding: '2vw 2vw', gap: '2vw' }}
      >
        <Column items={[expertiseItems[0], expertiseItems[1], expertiseItems[2]]} y={y} />
        <Column items={[expertiseItems[3], expertiseItems[4], expertiseItems[5]]} y={y2} />
        <Column items={[expertiseItems[6], expertiseItems[7], expertiseItems[8]]} y={y3} />
        <Column items={[expertiseItems[9], expertiseItems[10], expertiseItems[11]]} y={y4} />
      </div>
    </main>
  );
};

type ColumnProps = {
  items: ExpertiseItem[];
  y: MotionValue<number>;
};

const Column = ({ items, y }: ColumnProps) => {
  return (
    <motion.div
      className="relative -top-[45%] flex h-full flex-1 min-w-0 flex-col gap-[2vw] first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%]"
      style={{ y }}
    >
      {items.map((item, i) => (
        <div key={i} className="group relative h-full w-full overflow-hidden rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow duration-500" style={{ backgroundColor: item.bgColor || 'transparent', border: item.type === 'text' ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
          {item.type === 'image' ? (
            <img
              src={`${item.src}`}
              alt="Expertise visual"
              className="pointer-events-none object-cover h-full w-full transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col justify-between h-full w-full transition-transform duration-500 group-hover:-translate-y-1 cursor-pointer" style={{ padding: '40px', color: item.textColor }}>
              
              <div className="flex justify-end items-start w-full mb-auto">
                <div className="rounded-full border flex items-center justify-center transition-all duration-500 group-hover:bg-[#edff00] group-hover:border-[#edff00] group-hover:text-black" style={{ width: '48px', height: '48px', minWidth: '48px', minHeight: '48px', flexShrink: 0, borderColor: item.textColor === '#ffffff' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)', backgroundColor: `transparent` }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-500">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-3xl font-bold tracking-tight mb-4 leading-snug">{item.title}</h3>
                <p className="text-base font-light opacity-60 leading-relaxed">{item.desc}</p>
              </div>

            </div>
          )}
        </div>
      ))}
    </motion.div>
  );
};

export { OurExpertiseSection };
