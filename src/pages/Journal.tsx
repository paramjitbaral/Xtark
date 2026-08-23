import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const entries = [
  {
    title: "The Art of Motion: Animating for Premium Experiences",
    image: "/fabric.png",
    readTime: "4 min read",
    date: "Aug 20, 2026",
    content: "When designing high-end digital experiences, motion shouldn't just be decorative—it needs to be functional and deeply integrated into the user journey. In this exploration, we look at how subtle micro-interactions, deliberate easing curves, and performant hardware-accelerated animations can elevate a brand's perception from standard to premium without sacrificing accessibility or usability."
  },
  {
    title: "Grid & Geometry: Finding Order in Modern Architecture",
    image: "/gym.png",
    readTime: "6 min read",
    date: "Jul 15, 2026",
    content: "The best digital layouts borrow heavily from classic editorial design and Swiss typography. By strictly adhering to an underlying structural grid, we can create asymmetric layouts that still feel incredibly balanced and intentional. This write-up explores how to break the grid effectively by first mastering its rigid geometric constraints."
  },
  {
    title: "Humanizing Digital Interfaces: A Case Study on Perspective",
    image: "/f.shop.png",
    readTime: "5 min read",
    date: "Jun 28, 2026",
    content: "Interfaces often feel cold and sterile. By introducing organic shapes, soft lighting gradients, and typography that scales fluidly with the viewport, we can create environments that feel more tactile. We analyze recent shifts away from flat design into 'soft UI' and how it impacts user trust and engagement metrics."
  },
  {
    title: "The Power of Less: Building Minimalist Brand Systems",
    image: "/smartq.png",
    readTime: "3 min read",
    date: "May 10, 2026",
    content: "Minimalism isn't just about removing elements; it's about making the remaining elements perform perfectly. We discuss the challenge of extreme reductionism in brand identity design, ensuring that even with only two colors and one typeface, a brand remains highly recognizable and infinitely scalable across touchpoints."
  },
];

export default function Journal() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

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
          {entries.map((entry, idx) => {
            const isExpanded = expandedIndex === idx;
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.1 }}
                onClick={() => toggleExpand(idx)}
                className={`group flex flex-col justify-between gap-4 p-4 ${isExpanded ? 'rounded-[32px]' : 'rounded-[32px] sm:rounded-full'} bg-surface/30 hover:bg-surface border border-stroke cursor-pointer transition-all duration-500 overflow-hidden`}
              >
                {/* Top Row: Always Visible */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={entry.image}
                      alt={entry.title}
                      className="w-12 h-12 rounded-full object-cover border border-stroke group-hover:scale-105 transition-transform duration-500 flex-shrink-0"
                    />
                    <h3 className="text-sm sm:text-base font-medium text-text-primary line-clamp-2 sm:truncate group-hover:translate-x-1 transition-transform duration-300 min-w-0">
                      {entry.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 pl-16 sm:pl-0">
                    <span className="text-[10px] sm:text-xs text-muted font-sans whitespace-nowrap">{entry.readTime}</span>
                    <span className="text-[10px] sm:text-xs text-muted font-sans whitespace-nowrap">{entry.date}</span>
                    <div className="w-8 h-8 rounded-full border border-stroke bg-bg flex items-center justify-center text-xs text-text-primary transition-all duration-300 group-hover:bg-text-primary group-hover:text-bg flex-shrink-0">
                      <motion.span
                        animate={{ rotate: isExpanded ? 45 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        +
                      </motion.span>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pl-2 pr-2 sm:pl-[4.5rem] sm:pr-6 pb-2 pt-4 sm:pt-0">
                        <p className="text-sm text-muted leading-relaxed max-w-3xl font-sans font-light">
                          {entry.content}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
