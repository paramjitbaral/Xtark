import React from "react";
import { motion } from "framer-motion";
import ResearchBentoGrid from "../components/ResearchBentoGrid";

export default function HowWeWork() {
  return (
    <div className="w-full min-h-screen bg-bg flex flex-col items-center justify-center py-16 select-none">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 px-6"
      >
        <span className="text-xs text-muted uppercase tracking-[0.3em] font-medium block mb-4">
          How We Work
        </span>
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-text-primary">
          Built for <span className="font-display italic">scale</span>
        </h2>
      </motion.div>

      {/* Bento Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15 }}
        className="w-full max-w-[1200px] px-4"
      >
        <ResearchBentoGrid
          monthlyPrice={1990}
          previousPrice={32000}
          currency="USD"
          locale="en-US"
          userLabel="You"
          collaboratorLabel="Xtark"
        />
      </motion.div>
    </div>
  );
}
