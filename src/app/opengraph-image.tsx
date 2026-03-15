import { ImageResponse } from "next/og";

export const alt = "IhsanWealth — Your Complete Islamic Companion";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  const features = [
    "Zakat Calculator",
    "Salat Tracker",
    "IhsanAI Assistant",
    "Quran + Tafsir",
    "30+ Duas",
    "Sadaqah Tracker",
    "Qibla Finder",
    "Tasbih Counter",
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #065f46 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top gold line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #f59e0b, #fbbf24, #f59e0b, transparent)",
            display: "flex",
          }}
        />

        {/* Decorative ring top-right */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            border: "1px solid rgba(251,191,36,0.12)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            border: "1px solid rgba(251,191,36,0.08)",
            display: "flex",
          }}
        />

        {/* Decorative ring bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "-120px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            border: "1px solid rgba(16,185,129,0.12)",
            display: "flex",
          }}
        />

        {/* Main content area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "52px 72px 32px 72px",
            flex: 1,
          }}
        >
          {/* Logo row */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "20px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                width: "68px",
                height: "68px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #059669, #064e3b)",
                border: "2px solid rgba(251,191,36,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                fontWeight: 900,
                color: "#fbbf24",
                letterSpacing: "-1px",
              }}
            >
              IW
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  fontSize: "46px",
                  fontWeight: 900,
                  letterSpacing: "-1px",
                }}
              >
                <span style={{ color: "#fbbf24" }}>Ihsan</span>
                <span style={{ color: "#ffffff" }}>Wealth</span>
              </div>
              <div
                style={{
                  display: "flex",
                  color: "rgba(167,243,208,0.55)",
                  fontSize: "15px",
                }}
              >
                Your Complete Islamic Companion
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: "30px",
              fontWeight: 700,
              lineHeight: 1.35,
              marginBottom: "36px",
              maxWidth: "680px",
            }}
          >
            Free Zakat Calculator, Salat Tracker, Quran, AI Assistant &amp; More
          </div>

          {/* Feature pills */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {features.map((feature) => (
              <div
                key={feature}
                style={{
                  display: "flex",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.13)",
                  borderRadius: "999px",
                  padding: "8px 18px",
                  color: "rgba(209,250,229,0.9)",
                  fontSize: "14px",
                  fontWeight: 500,
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
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 72px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(0,0,0,0.25)",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "rgba(167,243,208,0.55)",
              fontSize: "15px",
            }}
          >
            7 Languages · 100% Free · No Ads · Open Source
          </div>
          <div
            style={{
              display: "flex",
              background: "linear-gradient(90deg, #f59e0b, #fbbf24)",
              borderRadius: "8px",
              padding: "10px 22px",
              color: "#022c22",
              fontSize: "15px",
              fontWeight: 700,
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
