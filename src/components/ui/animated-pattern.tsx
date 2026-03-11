"use client";

import { useEffect, useRef } from "react";

interface AnimatedPatternProps {
  /** Base opacity of the pattern. Default 0.08 */
  opacity?: number;
  /** Neon glow color. Default emerald */
  color?: "emerald" | "amber" | "violet";
  /** Pattern density. Default "normal" */
  density?: "sparse" | "normal" | "dense";
}

const COLOR_MAP = {
  emerald: { stroke: "#34d399", glow: "#10b981" },
  amber: { stroke: "#fbbf24", glow: "#f59e0b" },
  violet: { stroke: "#a78bfa", glow: "#8b5cf6" },
};

/**
 * Animated Islamic geometric pattern with subtle neon glow effects.
 * Renders on a canvas for performance — use as an absolute overlay.
 */
export function AnimatedPattern({
  opacity = 0.08,
  color = "emerald",
  density = "normal",
}: AnimatedPatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = COLOR_MAP[color];
    const cellSize = density === "sparse" ? 80 : density === "dense" ? 40 : 60;

    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = opacity;

      const cols = Math.ceil(width / cellSize) + 1;
      const rows = Math.ceil(height / cellSize) + 1;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const cx = col * cellSize + cellSize / 2;
          const cy = row * cellSize + cellSize / 2;

          // Staggered pulse: each cell has a phase offset
          const phase = (col * 0.7 + row * 1.1) % (Math.PI * 2);
          const pulse = 0.4 + 0.6 * Math.sin(time * 0.0008 + phase);

          const r = cellSize * 0.38;
          const innerR = r * 0.45;

          // Outer diamond
          ctx.beginPath();
          ctx.moveTo(cx, cy - r);
          ctx.lineTo(cx + r, cy);
          ctx.lineTo(cx, cy + r);
          ctx.lineTo(cx - r, cy);
          ctx.closePath();
          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = 0.6;
          ctx.globalAlpha = opacity * pulse;
          ctx.stroke();

          // Inner circle with glow
          ctx.beginPath();
          ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
          ctx.strokeStyle = colors.glow;
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = opacity * pulse * 0.8;

          // Neon glow effect via shadow
          ctx.shadowColor = colors.glow;
          ctx.shadowBlur = 4 * pulse;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Inner diamond (rotated 45deg = smaller aligned)
          const ir2 = innerR * 0.9;
          ctx.beginPath();
          ctx.moveTo(cx, cy - ir2);
          ctx.lineTo(cx + ir2, cy);
          ctx.lineTo(cx, cy + ir2);
          ctx.lineTo(cx - ir2, cy);
          ctx.closePath();
          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = 0.3;
          ctx.globalAlpha = opacity * pulse * 0.5;
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [opacity, color, density]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
