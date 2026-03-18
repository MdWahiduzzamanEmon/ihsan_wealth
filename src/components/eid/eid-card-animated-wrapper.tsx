"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { EidCardPreview } from "./eid-card-preview";
import type { CardDesign, CardLayout } from "@/lib/eid-content";
import type { TransLang } from "@/lib/islamic-content";

interface EidCardAnimatedWrapperProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  design: CardDesign;
  message: string;
  name: string;
  recipientName: string;
  messageSize: string;
  nameSize: string;
  isRTL: boolean;
  eidMubarakText: string;
  layout: CardLayout;
  fontClass: string;
  toLabel: string;
  fromLabel: string;
  replayLabel: string;
}

export function EidCardAnimatedWrapper({
  cardRef,
  design,
  message,
  name,
  recipientName,
  messageSize,
  nameSize,
  isRTL,
  eidMubarakText,
  layout,
  fontClass,
  toLabel,
  fromLabel,
  replayLabel,
}: EidCardAnimatedWrapperProps) {
  const [showFront, setShowFront] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  // Auto-reveal after mount
  useState(() => {
    const timer = setTimeout(() => setShowFront(true), 800);
    return () => clearTimeout(timer);
  });

  const handleReplay = useCallback(() => {
    setShowFront(false);
    setAnimKey((k) => k + 1);
    setTimeout(() => setShowFront(true), 600);
  }, []);

  return (
    <div className="relative">
      {/* 3D flip container */}
      <div style={{ perspective: "1200px" }}>
        <motion.div
          key={animKey}
          initial={{ rotateY: 180 }}
          animate={{ rotateY: showFront ? 0 : 180 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front (actual card) */}
          <div style={{ backfaceVisibility: "hidden" }}>
            <EidCardPreview
              ref={cardRef}
              design={design}
              message={message}
              name={name}
              recipientName={recipientName}
              messageSize={messageSize}
              nameSize={nameSize}
              isRTL={isRTL}
              eidMubarakText={eidMubarakText}
              layout={layout}
              fontClass={fontClass}
              toLabel={toLabel}
              fromLabel={fromLabel}
            />
          </div>

          {/* Back (decorative cover) — positioned absolutely behind */}
          <div
            className={`absolute inset-0 rounded-2xl ${design.bg} border-2 ${design.border} flex items-center justify-center`}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="text-center">
              <p className={`font-arabic text-4xl font-bold ${design.accent} mb-2`} dir="rtl">
                عِيدٌ مُبَارَكٌ
              </p>
              <p className={`text-sm ${design.textColor} opacity-50`}>{eidMubarakText}</p>
              <div className={`flex items-center gap-2 mt-4 ${design.accent} opacity-30`}>
                <div className="h-px w-12 bg-current" />
                <span className="text-xs">&#10022;</span>
                <div className="h-px w-12 bg-current" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Replay button */}
      <button
        type="button"
        onClick={handleReplay}
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full bg-white shadow-md border border-gray-200 text-xs text-gray-500 hover:text-emerald-600 hover:border-emerald-300 transition-all z-10"
      >
        <RotateCcw className="h-3 w-3" />
        {replayLabel}
      </button>
    </div>
  );
}
