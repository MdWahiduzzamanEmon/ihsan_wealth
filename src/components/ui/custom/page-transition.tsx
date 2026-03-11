"use client";

import { motion, AnimatePresence } from "framer-motion";

interface PageTransitionProps {
  id: string | number;
  direction?: "left" | "right";
  children: React.ReactNode;
}

const variants = {
  enter: (direction: "left" | "right") => ({
    x: direction === "right" ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  exit: (direction: "left" | "right") => ({
    x: direction === "right" ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" as const },
  }),
};

export function PageTransition({ id, direction = "right", children }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={id}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
