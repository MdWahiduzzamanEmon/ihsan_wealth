"use client";

import { motion } from "framer-motion";

const CRESCENT = "M17 6 A9 9 0 1 0 17 18 A6 6 0 1 1 17 6Z";
const STAR4 = "M12 2 C12.55 7.45 14.55 9.45 20 10 C14.55 10.55 12.55 12.55 12 18 C11.45 12.55 9.45 10.55 4 10 C9.45 9.45 11.45 7.45 12 2Z";

interface Decor {
  type: "crescent" | "star";
  left: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  swayAmount: number;
}

const DECORS: Decor[] = [
  { type: "crescent", left: "4%",  size: 32, duration: 22, delay: 0,    opacity: 0.12, swayAmount: 12 },
  { type: "star",     left: "13%", size: 18, duration: 16, delay: 4,    opacity: 0.15, swayAmount: 8  },
  { type: "crescent", left: "24%", size: 22, duration: 26, delay: 8,    opacity: 0.10, swayAmount: 16 },
  { type: "star",     left: "38%", size: 26, duration: 19, delay: 2,    opacity: 0.12, swayAmount: 10 },
  { type: "crescent", left: "52%", size: 28, duration: 24, delay: 11,   opacity: 0.10, swayAmount: 14 },
  { type: "star",     left: "63%", size: 16, duration: 14, delay: 6,    opacity: 0.15, swayAmount: 6  },
  { type: "crescent", left: "75%", size: 20, duration: 20, delay: 1,    opacity: 0.12, swayAmount: 10 },
  { type: "star",     left: "85%", size: 22, duration: 18, delay: 9,    opacity: 0.13, swayAmount: 8  },
  { type: "star",     left: "91%", size: 14, duration: 15, delay: 3,    opacity: 0.14, swayAmount: 6  },
  { type: "crescent", left: "47%", size: 18, duration: 28, delay: 14,   opacity: 0.09, swayAmount: 18 },
  { type: "star",     left: "30%", size: 12, duration: 13, delay: 7,    opacity: 0.14, swayAmount: 5  },
  { type: "crescent", left: "68%", size: 36, duration: 30, delay: 17,   opacity: 0.09, swayAmount: 20 },
];

export function FloatingIslamicDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {DECORS.map((d, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: d.left, bottom: "-80px" }}
          initial={{ y: 0, x: 0 }}
          animate={{
            y: ["0px", "-115vh"],
            x: [0, d.swayAmount, -d.swayAmount * 0.6, d.swayAmount * 0.3, 0],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: "linear",
            x: { duration: d.duration, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <svg
            width={d.size}
            height={d.size}
            viewBox="0 0 24 24"
            fill="none"
            style={{ opacity: d.opacity }}
          >
            {d.type === "crescent" ? (
              <path d={CRESCENT} fill="#059669" />
            ) : (
              <path d={STAR4} fill="#065f46" />
            )}
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
