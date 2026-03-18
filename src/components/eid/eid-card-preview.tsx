"use client";

import { forwardRef } from "react";
import type { CardDesign, CardLayout } from "@/lib/eid-content";
import { CARD_LAYOUT_CONFIG } from "@/lib/eid-content";

interface EidCardPreviewProps {
  design: CardDesign;
  message: string;
  name: string;
  recipientName?: string;
  messageSize: string;
  nameSize: string;
  isRTL: boolean;
  eidMubarakText: string;
  layout?: CardLayout;
  fontClass?: string;
  toLabel?: string;
  fromLabel?: string;
}

// ─── SVG pattern components ───

function GeometricPattern({ id }: { id: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={`geo-${id}`} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="30" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <circle cx="0" cy="0" r="5" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <circle cx="60" cy="0" r="5" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <circle cx="0" cy="60" r="5" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <circle cx="60" cy="60" r="5" fill="none" stroke="currentColor" strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#geo-${id})`} />
    </svg>
  );
}

function StarsPattern({ id }: { id: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={`stars-${id}`} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <polygon points="40,5 45,30 70,30 50,45 57,70 40,55 23,70 30,45 10,30 35,30" fill="none" stroke="currentColor" strokeWidth="0.4" />
          <circle cx="10" cy="10" r="1.5" fill="currentColor" />
          <circle cx="70" cy="65" r="1" fill="currentColor" />
          <circle cx="15" cy="70" r="0.8" fill="currentColor" />
          <circle cx="68" cy="12" r="1.2" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#stars-${id})`} />
    </svg>
  );
}

function FloralPattern({ id }: { id: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={`floral-${id}`} x="0" y="0" width="70" height="70" patternUnits="userSpaceOnUse">
          <circle cx="35" cy="35" r="12" fill="none" stroke="currentColor" strokeWidth="0.4" />
          <circle cx="35" cy="35" r="6" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <path d="M35 23 Q42 29 35 35 Q28 29 35 23Z" fill="currentColor" fillOpacity="0.15" />
          <path d="M35 47 Q42 41 35 35 Q28 41 35 47Z" fill="currentColor" fillOpacity="0.15" />
          <path d="M23 35 Q29 28 35 35 Q29 42 23 35Z" fill="currentColor" fillOpacity="0.15" />
          <path d="M47 35 Q41 28 35 35 Q41 42 47 35Z" fill="currentColor" fillOpacity="0.15" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#floral-${id})`} />
    </svg>
  );
}

function MosquePattern() {
  return (
    <svg className="absolute bottom-0 left-0 right-0 h-2/5 opacity-[0.07]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150" preserveAspectRatio="xMidYMax slice">
      <path d="M0 150 L0 100 L30 100 L30 60 Q50 20 70 60 L70 100 L90 100 L90 80 Q100 50 110 80 L110 100 L140 100 L140 40 Q160 0 180 40 L180 100 L200 100 L200 40 Q220 0 240 40 L240 100 L270 100 L270 80 Q280 50 290 80 L290 100 L320 100 L320 60 Q340 20 360 60 L360 100 L400 100 L400 150Z" fill="currentColor" />
      <rect x="155" y="25" width="5" height="35" fill="currentColor" />
      <circle cx="157.5" cy="22" r="4" fill="currentColor" />
      <rect x="235" y="25" width="5" height="35" fill="currentColor" />
      <circle cx="237.5" cy="22" r="4" fill="currentColor" />
    </svg>
  );
}

function LanternPattern() {
  return (
    <svg className="absolute top-0 left-0 right-0 h-1/3 opacity-[0.07]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" preserveAspectRatio="xMidYMin slice">
      {[60, 140, 200, 260, 340].map((x, i) => (
        <g key={i}>
          <line x1={x} y1="0" x2={x} y2={25 + i * 5} stroke="currentColor" strokeWidth="0.5" />
          <path d={`M${x-8} ${25+i*5} Q${x} ${15+i*5} ${x+8} ${25+i*5} L${x+6} ${50+i*5} Q${x} ${55+i*5} ${x-6} ${50+i*5} Z`} fill="none" stroke="currentColor" strokeWidth="0.6" />
          <circle cx={x} cy={55 + i * 5} r="2" fill="currentColor" fillOpacity="0.3" />
        </g>
      ))}
    </svg>
  );
}

function CrescentPattern() {
  return (
    <svg className="absolute top-6 right-8 w-28 h-28 opacity-[0.08]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M50 5 A45 45 0 1 1 50 95 A35 35 0 1 0 50 5Z" fill="currentColor" />
      <polygon points="82,25 84,31 90,31 85,35 87,41 82,37 77,41 79,35 74,31 80,31" fill="currentColor" />
      <polygon points="15,15 16,18 19,18 17,20 17.5,23 15,21 12.5,23 13,20 11,18 14,18" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

const PATTERN_COMPONENTS: Record<string, React.FC<{ id: string }>> = {
  geometric: GeometricPattern,
  stars: StarsPattern,
  floral: FloralPattern,
  mosque: MosquePattern as unknown as React.FC<{ id: string }>,
  lantern: LanternPattern as unknown as React.FC<{ id: string }>,
  crescent: CrescentPattern as unknown as React.FC<{ id: string }>,
};

// ─── Mini card thumbnail (for design picker) ───

export function EidCardMini({ design }: { design: CardDesign }) {
  const PatternComponent = PATTERN_COMPONENTS[design.pattern] || GeometricPattern;

  return (
    <div className={`relative overflow-hidden rounded-lg ${design.bg} ${design.textColor} w-full h-full`}>
      <PatternComponent id={`mini-${design.id}`} />
      <div className="relative flex flex-col items-center justify-center h-full px-1 py-1.5 text-center">
        <p className={`font-arabic text-[8px] leading-none ${design.accent} opacity-70`} dir="rtl">
          عِيدٌ مُبَارَكٌ
        </p>
        <div className={`h-px w-6 my-0.5 ${design.accent} opacity-20 bg-current`} />
        <p className={`text-[6px] ${design.textColor} opacity-50 leading-tight`}>
          {design.name}
        </p>
      </div>
    </div>
  );
}

// ─── Full card preview ───

export const EidCardPreview = forwardRef<HTMLDivElement, EidCardPreviewProps>(
  function EidCardPreview({ design, message, name, recipientName, messageSize, nameSize, isRTL, eidMubarakText, layout = "portrait", fontClass = "font-sans", toLabel = "To", fromLabel = "From" }, ref) {
    const PatternComponent = PATTERN_COMPONENTS[design.pattern] || GeometricPattern;
    const layoutConfig = CARD_LAYOUT_CONFIG[layout];
    const isLandscape = layout === "landscape";

    return (
      <div
        ref={ref}
        className={`relative overflow-hidden rounded-2xl ${design.bg} ${design.textColor} border-2 ${design.border} shadow-2xl w-full ${fontClass}`}
        style={{ aspectRatio: layoutConfig.aspectRatio, maxWidth: layoutConfig.maxWidth }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Background Pattern */}
        <div className={design.accent}>
          <PatternComponent id={`card-${design.id}`} />
        </div>

        {/* Corner ornaments */}
        <div className={`absolute top-3 left-3 ${design.accent} opacity-20`}>
          <svg width="24" height="24" viewBox="0 0 24 24"><path d="M0 0 L12 0 Q0 0 0 12Z" fill="currentColor" /><path d="M4 0 Q0 4 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" /></svg>
        </div>
        <div className={`absolute top-3 right-3 ${design.accent} opacity-20 scale-x-[-1]`}>
          <svg width="24" height="24" viewBox="0 0 24 24"><path d="M0 0 L12 0 Q0 0 0 12Z" fill="currentColor" /><path d="M4 0 Q0 4 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" /></svg>
        </div>
        <div className={`absolute bottom-3 left-3 ${design.accent} opacity-20 scale-y-[-1]`}>
          <svg width="24" height="24" viewBox="0 0 24 24"><path d="M0 0 L12 0 Q0 0 0 12Z" fill="currentColor" /><path d="M4 0 Q0 4 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" /></svg>
        </div>
        <div className={`absolute bottom-3 right-3 ${design.accent} opacity-20 scale-[-1]`}>
          <svg width="24" height="24" viewBox="0 0 24 24"><path d="M0 0 L12 0 Q0 0 0 12Z" fill="currentColor" /><path d="M4 0 Q0 4 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" /></svg>
        </div>

        {/* Content wrapper */}
        <div className={`relative flex h-full ${isLandscape ? "flex-row" : "flex-col"} ${isLandscape ? "px-6 py-6" : "px-8 py-8 sm:px-10 sm:py-10"}`}>
          {/* Left/Top section: Title area */}
          <div className={`${isLandscape ? "w-2/5 flex flex-col justify-center items-center border-r border-current/10 pr-5" : ""}`}>
            {/* Top decorative line (portrait/square only) */}
            {!isLandscape && (
              <div className={`flex items-center gap-2 mb-2 ${design.accent} opacity-30`}>
                <div className="h-px flex-1 bg-current" />
                <span className="text-base">&#10022;</span>
                <div className="h-px flex-1 bg-current" />
              </div>
            )}

            {/* Bismillah */}
            <p className={`font-arabic ${isLandscape ? "text-[10px]" : "text-xs"} ${design.accent2} opacity-50 text-center ${isLandscape ? "mb-2" : "mb-4"}`} dir="rtl">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>

            {/* Recipient name */}
            {recipientName && (
              <div className={`text-center ${isLandscape ? "mb-2" : "mb-3"}`}>
                <p className={`${design.accent2} text-[10px] opacity-50 tracking-wider uppercase`}>
                  {toLabel}
                </p>
                <p className={`text-sm font-semibold ${design.accent}`}>
                  {recipientName}
                </p>
              </div>
            )}

            {/* Eid Mubarak title */}
            <div className={`text-center ${isLandscape ? "mb-2" : "mb-2"}`}>
              <h2 className={`font-arabic ${isLandscape ? "text-2xl" : "text-4xl sm:text-5xl"} font-bold ${design.accent} leading-tight`} dir="rtl">
                عِيدٌ مُبَارَكٌ
              </h2>
              <p className={`${isLandscape ? "text-sm" : "text-lg sm:text-xl"} font-semibold ${design.textColor} opacity-85 mt-1`}>
                {eidMubarakText}
              </p>
            </div>
          </div>

          {/* Right/Bottom section: Message + Name */}
          <div className={`${isLandscape ? "w-3/5 flex flex-col justify-center pl-5" : "flex-1 flex flex-col"}`}>
            {/* Decorative separator */}
            {!isLandscape && (
              <div className={`flex items-center gap-3 my-3 ${design.accent} opacity-25`}>
                <div className="h-px flex-1 bg-current" />
                <span className="text-[10px] tracking-[0.3em]">&#9733; &#10022; &#9733;</span>
                <div className="h-px flex-1 bg-current" />
              </div>
            )}

            {/* Message */}
            <div className={`flex-1 flex items-center justify-center ${isLandscape ? "py-1" : "py-2"}`}>
              <p className={`${messageSize} leading-relaxed ${design.textColor} opacity-90 text-center max-w-[95%]`}>
                {message || (
                  <span className="opacity-30 italic text-sm">
                    {isRTL ? "رسالتك هنا..." : "Your message will appear here..."}
                  </span>
                )}
              </p>
            </div>

            {/* Decorative separator */}
            <div className={`flex items-center gap-3 ${isLandscape ? "my-2" : "my-3"} ${design.accent} opacity-25`}>
              <div className="h-px flex-1 bg-current" />
              <span className="text-[10px]">✦</span>
              <div className="h-px flex-1 bg-current" />
            </div>

            {/* From Name */}
            {name ? (
              <div className={`text-center ${isLandscape ? "mb-1" : "mb-3"}`}>
                <p className={`${design.accent2} text-[10px] opacity-50 mb-0.5 tracking-wider uppercase`}>
                  {fromLabel}
                </p>
                <p className={`${nameSize} font-bold ${design.accent}`}>
                  {name}
                </p>
              </div>
            ) : (
              <div className={isLandscape ? "h-4" : "h-8"} />
            )}
          </div>

          {/* Bottom decorative line (portrait/square) */}
          {!isLandscape && (
            <>
              <div className={`flex items-center gap-2 ${design.accent} opacity-30`}>
                <div className="h-px flex-1 bg-current" />
                <span className="text-base">&#10022;</span>
                <div className="h-px flex-1 bg-current" />
              </div>
              <p className={`${design.accent2} opacity-20 text-[8px] text-center mt-2 tracking-wider`}>
                ihsanwealth.onrender.com
              </p>
            </>
          )}
        </div>
      </div>
    );
  }
);
