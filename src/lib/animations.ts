import type { Variants, Transition } from "framer-motion";

export const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const slideUp: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.2 } },
};

export const slideFromRight: Variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.2 } },
};

export const slideFromLeft: Variants = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, x: 40, transition: { duration: 0.2 } },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: springTransition },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

export const staggerContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export const pulseGlow: Variants = {
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(16, 185, 129, 0)",
      "0 0 0 8px rgba(16, 185, 129, 0.15)",
      "0 0 0 0 rgba(16, 185, 129, 0)",
    ],
    transition: { duration: 2, repeat: Infinity },
  },
};

export const countUp = (duration: number = 1.5) => ({
  type: "spring" as const,
  stiffness: 50,
  damping: 20,
  duration,
});
