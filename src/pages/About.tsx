import React from "react";
import { motion } from "framer-motion";

const stats = [
  {
    value: "20+",
    label: "Years Experience",
    description: "Over two decades of designing, building, and deploying world-class digital systems and interactive layouts.",
  },
  {
    value: "95+",
    label: "Projects Done",
    description: "Delivered premium bespoke websites, mobile interfaces, and digital architectures from concept to final product.",
  },
  {
    value: "200%",
    label: "Satisfied Clients",
    description: "A track record of absolute quality, leading to consistent repeat partnerships and long-term business growth.",
  },
];

export default function About() {
  return (
    <div className="bg-bg pt-8 pb-24 md:py-32 select-none min-h-screen flex items-center">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 w-full">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <span className="text-xs text-muted uppercase tracking-[0.3em] font-medium block mb-4">
            Metrics & Experience
          </span>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-text-primary">
            Proven <span className="font-display italic">statistics</span>
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.15 }}
              className="group relative bg-surface border border-stroke rounded-3xl p-8 md:p-10 flex flex-col justify-between min-h-[280px] transition-all duration-350 hover:border-white/30 hover:bg-white/[0.03]"
            >
              <div>
                <div className="w-8 h-[2px] bg-white/20 mb-8 group-hover:w-16 group-hover:bg-[#89AACC] transition-all duration-500 rounded-full" />
                <h4 className="text-xs uppercase tracking-widest text-muted mb-4 font-semibold">
                  {stat.label}
                </h4>
                <p className="text-xs sm:text-sm text-muted leading-relaxed mb-8">
                  {stat.description}
                </p>
              </div>

              <div className="font-display italic text-6xl text-text-primary group-hover:scale-105 transition-all duration-500 origin-left">
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
