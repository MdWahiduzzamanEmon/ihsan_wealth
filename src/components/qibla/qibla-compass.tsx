"use client";

import { motion } from "framer-motion";

interface QiblaCompassProps {
  /** Qibla bearing in degrees (0-360 from North) */
  qiblaBearing: number;
  /** Device compass heading in degrees (null if not available) */
  compassHeading: number | null;
  /** Whether compass is actively tracking */
  isLive: boolean;
}

export function QiblaCompass({
  qiblaBearing,
  compassHeading,
  isLive,
}: QiblaCompassProps) {
  // If we have a live compass heading, rotate the compass so North aligns,
  // and the Qibla needle points in the correct visual direction.
  // If no compass, show static with Qibla bearing from North.
  const compassRotation = compassHeading !== null ? -compassHeading : 0;
  const qiblaAngle = qiblaBearing;

  // Check if the device is roughly pointing toward Qibla (within 5 degrees)
  const isPointingAtQibla =
    compassHeading !== null &&
    Math.abs(((qiblaBearing - compassHeading + 540) % 360) - 180) < 5;

  const size = 320;
  const center = size / 2;
  const outerRadius = 148;
  const innerRadius = 130;
  const tickOuterRadius = 142;
  const labelRadius = 118;

  // Generate degree tick marks
  const ticks = [];
  for (let i = 0; i < 360; i += 5) {
    const isMajor = i % 30 === 0;
    const isCardinal = i % 90 === 0;
    const tickInner = isMajor ? innerRadius - 4 : tickOuterRadius - 4;
    const tickOuter = tickOuterRadius;
    const rad = (i * Math.PI) / 180;

    ticks.push(
      <line
        key={`tick-${i}`}
        x1={center + tickInner * Math.sin(rad)}
        y1={center - tickInner * Math.cos(rad)}
        x2={center + tickOuter * Math.sin(rad)}
        y2={center - tickOuter * Math.cos(rad)}
        stroke={isCardinal ? "#d97706" : isMajor ? "#065f46" : "#065f4660"}
        strokeWidth={isCardinal ? 2.5 : isMajor ? 1.5 : 0.8}
        strokeLinecap="round"
      />
    );
  }

  // Cardinal direction labels
  const cardinals = [
    { angle: 0, label: "N", color: "#d97706" },
    { angle: 90, label: "E", color: "#065f46" },
    { angle: 180, label: "S", color: "#065f46" },
    { angle: 270, label: "W", color: "#065f46" },
  ];

  // Intercardinal labels
  const intercardinals = [
    { angle: 45, label: "NE" },
    { angle: 135, label: "SE" },
    { angle: 225, label: "SW" },
    { angle: 315, label: "NW" },
  ];

  // Qibla needle endpoint
  const qiblaRad = (qiblaAngle * Math.PI) / 180;
  const needleLength = 100;
  const qiblaX = center + needleLength * Math.sin(qiblaRad);
  const qiblaY = center - needleLength * Math.cos(qiblaRad);

  // Kaaba icon position (at the edge of the compass)
  const kaabaRadius = innerRadius - 22;
  const kaabaX = center + kaabaRadius * Math.sin(qiblaRad);
  const kaabaY = center - kaabaRadius * Math.cos(qiblaRad);

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow when pointing at Qibla */}
      {isPointingAtQibla && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size + 24,
            height: size + 24,
            background:
              "radial-gradient(circle, rgba(217,119,6,0.15) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-xl"
        animate={{ rotate: compassRotation }}
        transition={{
          type: "spring",
          stiffness: 60,
          damping: 20,
        }}
      >
        <defs>
          {/* Outer ring gradient */}
          <linearGradient id="outerRing" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#065f46" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>

          {/* Gold gradient for Qibla */}
          <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Inner decorative pattern */}
          <pattern
            id="islamicInner"
            x="0"
            y="0"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M12 0L24 12L12 24L0 12Z"
              fill="none"
              stroke="#065f46"
              strokeWidth="0.3"
              opacity="0.2"
            />
            <circle
              cx="12"
              cy="12"
              r="5"
              fill="none"
              stroke="#065f46"
              strokeWidth="0.3"
              opacity="0.15"
            />
          </pattern>

          {/* Compass glow */}
          <radialGradient id="compassBg" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#f0fdf4" />
            <stop offset="60%" stopColor="#ecfdf5" />
            <stop offset="100%" stopColor="#d1fae5" />
          </radialGradient>

          {/* Shadow filter */}
          <filter id="needleShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#00000030" />
          </filter>

          {/* Kaaba shadow */}
          <filter id="kaabaShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#d9770660" />
          </filter>
        </defs>

        {/* Outer decorative ring */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="none"
          stroke="url(#outerRing)"
          strokeWidth="8"
          opacity="0.9"
        />
        <circle
          cx={center}
          cy={center}
          r={outerRadius + 4}
          fill="none"
          stroke="#065f46"
          strokeWidth="0.5"
          opacity="0.3"
        />

        {/* Compass background */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius + 6}
          fill="url(#compassBg)"
        />

        {/* Inner Islamic geometric pattern */}
        <clipPath id="compassClip">
          <circle cx={center} cy={center} r={innerRadius - 10} />
        </clipPath>
        <rect
          x="0"
          y="0"
          width={size}
          height={size}
          fill="url(#islamicInner)"
          clipPath="url(#compassClip)"
        />

        {/* Inner decorative circles */}
        <circle
          cx={center}
          cy={center}
          r={80}
          fill="none"
          stroke="#065f46"
          strokeWidth="0.5"
          opacity="0.15"
        />
        <circle
          cx={center}
          cy={center}
          r={50}
          fill="none"
          stroke="#065f46"
          strokeWidth="0.5"
          opacity="0.1"
        />

        {/* 8-pointed star at center */}
        <g opacity="0.08">
          {[0, 45, 90, 135].map((angle) => {
            const r = (angle * Math.PI) / 180;
            return (
              <line
                key={`star-${angle}`}
                x1={center + 30 * Math.sin(r)}
                y1={center - 30 * Math.cos(r)}
                x2={center - 30 * Math.sin(r)}
                y2={center + 30 * Math.cos(r)}
                stroke="#065f46"
                strokeWidth="0.8"
              />
            );
          })}
        </g>

        {/* Tick marks */}
        {ticks}

        {/* Cardinal direction labels */}
        {cardinals.map(({ angle, label, color }) => {
          const rad = (angle * Math.PI) / 180;
          const x = center + labelRadius * Math.sin(rad);
          const y = center - labelRadius * Math.cos(rad);
          return (
            <text
              key={label}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={color}
              fontSize={label === "N" ? "16" : "13"}
              fontWeight="bold"
              fontFamily="system-ui, sans-serif"
            >
              {label}
            </text>
          );
        })}

        {/* Intercardinal labels */}
        {intercardinals.map(({ angle, label }) => {
          const rad = (angle * Math.PI) / 180;
          const x = center + (labelRadius - 4) * Math.sin(rad);
          const y = center - (labelRadius - 4) * Math.cos(rad);
          return (
            <text
              key={label}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#065f46"
              fontSize="9"
              fontWeight="500"
              opacity="0.5"
              fontFamily="system-ui, sans-serif"
            >
              {label}
            </text>
          );
        })}

        {/* Qibla direction line */}
        <line
          x1={center}
          y1={center}
          x2={qiblaX}
          y2={qiblaY}
          stroke="url(#goldGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#needleShadow)"
        />

        {/* Qibla arrowhead */}
        <polygon
          points={`
            ${qiblaX},${qiblaY}
            ${qiblaX - 8 * Math.cos(qiblaRad)},${qiblaY - 8 * Math.sin(qiblaRad)}
            ${qiblaX + 8 * Math.cos(qiblaRad)},${qiblaY + 8 * Math.sin(qiblaRad)}
          `}
          fill="#d97706"
          filter="url(#needleShadow)"
        />

        {/* Kaaba icon at Qibla direction (simple geometric Kaaba) */}
        <g filter="url(#kaabaShadow)">
          {/* Kaaba body - rotated square */}
          <rect
            x={kaabaX - 10}
            y={kaabaY - 10}
            width={20}
            height={20}
            rx={2}
            fill="#1a1a1a"
            stroke="#d97706"
            strokeWidth="1.5"
          />
          {/* Gold band (Kiswah detail) */}
          <line
            x1={kaabaX - 10}
            y1={kaabaY - 2}
            x2={kaabaX + 10}
            y2={kaabaY - 2}
            stroke="#d97706"
            strokeWidth="2"
          />
          {/* Door */}
          <rect
            x={kaabaX - 3}
            y={kaabaY + 1}
            width={6}
            height={9}
            rx={1}
            fill="#d97706"
            opacity="0.8"
          />
        </g>

        {/* Center point */}
        <circle
          cx={center}
          cy={center}
          r={6}
          fill="#065f46"
          stroke="white"
          strokeWidth="2"
        />
        <circle cx={center} cy={center} r={2.5} fill="white" />
      </motion.svg>

      {/* "Qibla" label overlay */}
      {isPointingAtQibla && (
        <motion.div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-4 py-1 text-xs font-bold text-white shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Pointing at Qibla
        </motion.div>
      )}

      {/* Live indicator */}
      {isLive && (
        <div className="absolute top-2 right-2 flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] text-emerald-600 font-medium">LIVE</span>
        </div>
      )}
    </div>
  );
}
