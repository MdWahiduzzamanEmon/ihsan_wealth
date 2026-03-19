"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EidConfettiProps {
  trigger: boolean;
  onComplete: () => void;
}

const COLORS = ["#10b981", "#f59e0b", "#14b8a6", "#f43f5e", "#8b5cf6", "#06b6d4", "#eab308"];
const PARTICLE_COUNT = 50;

interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  rotation: number;
  shape: "square" | "circle" | "star";
}

function createParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: 30 + Math.random() * 40,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 5 + Math.random() * 8,
    rotation: Math.random() * 360,
    shape: (["square", "circle", "star"] as const)[Math.floor(Math.random() * 3)],
  }));
}

export function EidConfetti({ trigger, onComplete }: EidConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger) {
      setParticles(createParticles());
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[10000] overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                x: `${p.x}vw`,
                y: "60vh",
                opacity: 1,
                rotate: 0,
                scale: 1,
              }}
              animate={{
                x: `${p.x + (Math.random() - 0.5) * 50}vw`,
                y: `${-20 + Math.random() * 120}vh`,
                opacity: [1, 1, 0],
                rotate: p.rotation + Math.random() * 720,
                scale: [1, 1.2, 0.5],
              }}
              transition={{
                duration: 1.8 + Math.random() * 1,
                ease: "easeOut",
              }}
              style={{
                position: "absolute",
                width: p.size,
                height: p.size,
                backgroundColor: p.shape !== "star" ? p.color : undefined,
                borderRadius: p.shape === "circle" ? "50%" : p.shape === "square" ? "2px" : undefined,
              }}
            >
              {p.shape === "star" && (
                <svg viewBox="0 0 10 10" width={p.size} height={p.size}>
                  <polygon points="5,0 6.2,3.5 10,3.5 7,5.8 8,10 5,7.5 2,10 3,5.8 0,3.5 3.8,3.5" fill={p.color} />
                </svg>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
