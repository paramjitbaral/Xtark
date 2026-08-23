import React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const pageVariants: Variants = {
  initial: {
    scale: 0.6,
    clipPath: "inset(100% 0% 0% 0%)",
    opacity: 0.45,
  },
  animate: {
    scale: 1,
    clipPath: "inset(0% 0% 0% 0%)",
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.645, 0.045, 0.355, 1] as any, // power3.inOut equivalent
    },
  },
  exit: {
    scale: 0.6,
    opacity: 0.45,
    transition: {
      duration: 0.8,
      ease: [0.645, 0.045, 0.355, 1] as any,
    },
  },
};

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="w-full min-h-screen bg-bg"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 2,
        willChange: "transform, opacity, clip-path",
      }}
    >
      {children}
    </motion.div>
  );
}
