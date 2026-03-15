import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "IhsanWealth — Your Complete Islamic Companion";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #022c22 0%, #064e3b 40%, #065f46 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top gold accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #f59e0b, #fbbf24, #f59e0b, transparent)",
          }}
        />

        {/* Decorative circle top-right */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            border: "1px solid rgba(251,191,36,0.15)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-40px",
            width: "240px",
            height: "240px",
            borderRadius: "50%",
            border: "1px solid rgba(251,191,36,0.1)",
            display: "flex",
          }}
        />

        {/* Decorative circle bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-100px",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            border: "1px solid rgba(16,185,129,0.15)",
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "56px 72px",
            flex: 1,
          }}
        >
          {/* Header: logo + name */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "36px" }}>
            {/* Icon box */}
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "18px",
                background: "linear-gradient(135deg, #059669, #064e3b)",
                border: "2px solid rgba(251,191,36,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "36px",
              }}
            >
              ☽
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: "48px", fontWeight: 800, letterSpacing: "-1px" }}>
                <span style={{ color: "#fbbf24" }}>Ihsan</span>
                <span style={{ color: "#ffffff" }}>Wealth</span>
              </div>
              <div style={{ color: "rgba(167,243,208,0.6)", fontSize: "16px", marginTop: "2px" }}>
                إحسان الثروة — Your Complete Islamic Companion
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div
            style={{
              color: "#ffffff",
              fontSize: "32px",
              fontWeight: 700,
              lineHeight: 1.3,
              marginBottom: "40px",
              maxWidth: "700px",
            }}
          >
            Free Zakat Calculator, Salat Tracker,
            <br />
            Quran, AI Assistant & More
          </div>

          {/* Feature pills row */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {[
              "🌙 Zakat Calculator",
              "🕌 Salat Tracker",
              "🤖 IhsanAI",
              "📖 Quran + Tafsir",
              "🤲 30+ Duas",
              "💰 Sadaqah Tracker",
              "🧭 Qibla",
              "📿 Tasbih",
            ].map((feature) => (
              <div
                key={feature}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "999px",
                  padding: "8px 18px",
                  color: "rgba(209,250,229,0.9)",
                  fontSize: "15px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 72px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <div style={{ color: "rgba(167,243,208,0.6)", fontSize: "15px", display: "flex" }}>
            🌍 7 Languages · 100% Free · No Ads
          </div>
          <div
            style={{
              background: "linear-gradient(90deg, #f59e0b, #fbbf24)",
              borderRadius: "8px",
              padding: "10px 24px",
              color: "#022c22",
              fontSize: "15px",
              fontWeight: 700,
              display: "flex",
            }}
          >
            ihsan-wealth.onrender.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
