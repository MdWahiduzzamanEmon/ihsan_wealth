"use client";

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
  { type: "crescent", left: "4%",  size: 32, duration: 22, delay: 0,  opacity: 0.12, swayAmount: 12 },
  { type: "star",     left: "13%", size: 18, duration: 16, delay: 4,  opacity: 0.15, swayAmount: 8  },
  { type: "crescent", left: "24%", size: 22, duration: 26, delay: 8,  opacity: 0.10, swayAmount: 16 },
  { type: "star",     left: "38%", size: 26, duration: 19, delay: 2,  opacity: 0.12, swayAmount: 10 },
  { type: "crescent", left: "52%", size: 28, duration: 24, delay: 11, opacity: 0.10, swayAmount: 14 },
  { type: "star",     left: "63%", size: 16, duration: 14, delay: 6,  opacity: 0.15, swayAmount: 6  },
  { type: "crescent", left: "75%", size: 20, duration: 20, delay: 1,  opacity: 0.12, swayAmount: 10 },
  { type: "star",     left: "85%", size: 22, duration: 18, delay: 9,  opacity: 0.13, swayAmount: 8  },
];

export function FloatingIslamicDecor() {
  return (
    <>
      <style>{`
        @keyframes float-up {
          from { transform: translateY(0) translateX(0); }
          to   { transform: translateY(-115vh) translateX(var(--sway)); }
        }
        .islamic-decor-item {
          position: absolute;
          bottom: -80px;
          will-change: transform;
          animation: float-up var(--dur) var(--del) linear infinite;
        }
      `}</style>
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
        {DECORS.map((d, i) => (
          <div
            key={i}
            className="islamic-decor-item"
            style={{
              left: d.left,
              "--dur": `${d.duration}s`,
              "--del": `${d.delay}s`,
              "--sway": `${d.swayAmount}px`,
            } as React.CSSProperties}
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
          </div>
        ))}
      </div>
    </>
  );
}
