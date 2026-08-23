import React from "react";
import { motion } from "framer-motion";

const entries = [
  {
    title: "The Art of Motion: Animating for Premium Experiences",
    image: "/fabric.png",
    readTime: "4 min read",
    date: "Aug 20, 2026",
  },
  {
    title: "Grid & Geometry: Finding Order in Modern Architecture",
    image: "/gym.png",
    readTime: "6 min read",
    date: "Jul 15, 2026",
  },
  {
    title: "Humanizing Digital Interfaces: A Case Study on Perspective",
    image: "/f.shop.png",
    readTime: "5 min read",
    date: "Jun 28, 2026",
  },
  {
    title: "The Power of Less: Building Minimalist Brand Systems",
    image: "/smartq.png",
    readTime: "3 min read",
    date: "May 10, 2026",
  },
];

export default function Journal() {
  return (
    <div className="bg-bg py-24 md:py-32 select-none min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em] font-medium">Journal</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-text-primary">
              Recent <span className="font-display italic">thoughts</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted max-w-sm mt-3 leading-relaxed">
              Writing about design philosophy, systems thinking, and creative technology.
            </p>
          </div>
        </motion.div>

        {/* Entries list */}
        <div className="flex flex-col gap-4">
          {entries.map((entry, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.1 }}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[32px] sm:rounded-full bg-surface/30 hover:bg-surface border border-stroke cursor-pointer transition-all duration-350"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={entry.image}
                  alt={entry.title}
                  className="w-12 h-12 rounded-full object-cover border border-stroke group-hover:scale-105 transition-transform duration-500 flex-shrink-0"
                />
                <h3 className="text-sm sm:text-base font-medium text-text-primary truncate group-hover:translate-x-1 transition-transform duration-300 min-w-0">
                  {entry.title}
                </h3>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 pl-16 sm:pl-0">
                <span className="text-xs text-muted font-sans whitespace-nowrap">{entry.readTime}</span>
                <span className="text-xs text-muted font-sans whitespace-nowrap">{entry.date}</span>
                <div className="w-8 h-8 rounded-full border border-stroke bg-bg flex items-center justify-center text-xs text-text-primary transition-all duration-300 group-hover:bg-text-primary group-hover:text-bg group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0">
                  <span>↗</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
