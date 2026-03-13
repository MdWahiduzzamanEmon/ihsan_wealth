"use client";

import { useRef, useCallback, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import type { SalatStats } from "@/hooks/use-salat-tracker";
import type { SalatTrackerTexts } from "@/lib/salat-tracker-texts";
import { getLocalDateStr } from "@/lib/date-utils";
import { formatHijriDate } from "@/lib/hijri-utils";

interface SalatReportExportProps {
  stats: SalatStats;
  t: SalatTrackerTexts;
  countryCode?: string;
}

export function SalatReportExport({ stats, t, countryCode }: SalatReportExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleExport = useCallback(async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(reportRef.current, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        width: reportRef.current.scrollWidth,
        height: reportRef.current.scrollHeight,
      });

      const link = document.createElement("a");
      link.download = `salat-report-${getLocalDateStr()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export report:", err);
    } finally {
      setIsExporting(false);
    }
  }, []);

  const gregorianDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const hijriDate = formatHijriDate(new Date(), countryCode || "US");

  return (
    <div>
      {/* Export button */}
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
      >
        {isExporting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {t.exportAsImage}
      </button>

      {/* Exportable report card (hidden off-screen, rendered for export) */}
      <div className="fixed left-[-9999px] top-0">
        <div
          ref={reportRef}
          style={{
            width: "440px",
            background: "#fff",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: "#1a1a1a",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative border */}
          <div
            style={{
              position: "absolute",
              inset: "8px",
              border: "2px solid #059669",
              borderRadius: "12px",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: "12px",
              border: "1px solid #d4a017",
              borderRadius: "10px",
              pointerEvents: "none",
            }}
          />

          {/* Corner ornaments */}
          {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => (
            <div
              key={pos}
              style={{
                position: "absolute",
                width: "32px",
                height: "32px",
                ...(pos.includes("top") ? { top: "14px" } : { bottom: "14px" }),
                ...(pos.includes("left") ? { left: "14px" } : { right: "14px" }),
              }}
            >
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="#059669" strokeWidth="1" opacity="0.4" />
                <circle cx="20" cy="20" r="8" fill="none" stroke="#d4a017" strokeWidth="0.8" opacity="0.5" />
              </svg>
            </div>
          ))}

          <div style={{ padding: "28px 24px 20px" }}>
            {/* Bismillah */}
            <div style={{ textAlign: "center", marginBottom: "12px" }}>
              <p
                style={{
                  fontFamily: "'Amiri', 'Traditional Arabic', serif",
                  fontSize: "18px",
                  color: "#d4a017",
                  margin: "0 0 4px",
                  lineHeight: 1.4,
                }}
                dir="rtl"
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p style={{ fontSize: "9px", color: "#9ca3af", margin: 0, fontStyle: "italic" }}>
                In the name of Allah, the Most Gracious, the Most Merciful
              </p>
            </div>

            {/* Logo & Title */}
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #059669, #047857)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  IW
                </div>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#065f46",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    <span style={{ color: "#d4a017" }}>Ihsan</span>Wealth
                  </p>
                </div>
              </div>
              <h2
                style={{
                  margin: "4px 0 2px",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1f2937",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Salat Progress Report
              </h2>
              <p
                style={{
                  fontFamily: "'Amiri', 'Traditional Arabic', serif",
                  fontSize: "14px",
                  color: "#059669",
                  margin: "2px 0 0",
                }}
                dir="rtl"
              >
                تقرير أداء الصلاة
              </p>
            </div>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                margin: "10px 0",
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, #059669, transparent)" }} />
              <span style={{ fontFamily: "'Amiri', serif", color: "#d4a017", fontSize: "14px" }}>&#10022;</span>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, #059669, transparent)" }} />
            </div>

            {/* Date info */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                fontSize: "10px",
                color: "#4b5563",
                marginBottom: "14px",
                padding: "6px 12px",
                background: "#f0fdf4",
                borderRadius: "8px",
                border: "1px solid #d1fae5",
              }}
            >
              <span>{gregorianDate}</span>
              {hijriDate && <span style={{ color: "#059669" }}>({hijriDate})</span>}
            </div>

            {/* Streak highlight */}
            <div
              style={{
                textAlign: "center",
                padding: "14px",
                marginBottom: "14px",
                borderRadius: "12px",
                background: stats.currentStreak > 0
                  ? "linear-gradient(135deg, #fff7ed, #ffedd5)"
                  : "linear-gradient(135deg, #f9fafb, #f3f4f6)",
                border: stats.currentStreak > 0
                  ? "2px solid #fb923c"
                  : "2px solid #d1d5db",
              }}
            >
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: stats.currentStreak > 0 ? "#9a3412" : "#6b7280",
                  margin: "0 0 4px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {t.dayStreak}
              </p>
              <p
                style={{
                  fontSize: "42px",
                  fontWeight: 800,
                  color: stats.currentStreak > 0 ? "#ea580c" : "#9ca3af",
                  margin: "0",
                  lineHeight: 1,
                }}
              >
                {stats.currentStreak}
                <span style={{ fontSize: "16px", fontWeight: 600, marginLeft: "4px" }}>{t.days}</span>
              </p>
              <p style={{ fontSize: "10px", color: "#9ca3af", margin: "4px 0 0" }}>
                {t.longestStreak}: {stats.longestStreak} {t.days}
              </p>
            </div>

            {/* Stats grid */}
            <div style={{ marginBottom: "14px" }}>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#1f2937",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span style={{ display: "inline-block", width: "3px", height: "14px", background: "#059669", borderRadius: "2px" }} />
                Performance Overview (Last 30 Days)
                <span style={{ fontFamily: "'Amiri', serif", fontSize: "11px", color: "#059669", marginLeft: "4px" }}>ملخص الأداء</span>
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "8px",
                }}
              >
                <ReportStatBox label={t.completionRate} value={`${stats.completionRate}%`} color="#059669" bgColor="#ecfdf5" borderColor="#a7f3d0" />
                <ReportStatBox label={t.onTimeRate} value={`${stats.onTimeRate}%`} color="#0284c7" bgColor="#f0f9ff" borderColor="#bae6fd" />
                <ReportStatBox label={t.jamaahRate} value={`${stats.jamaahRate}%`} color="#7c3aed" bgColor="#f5f3ff" borderColor="#ddd6fe" />
              </div>
            </div>

            {/* Prayer counts */}
            <div style={{ marginBottom: "14px" }}>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#1f2937",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span style={{ display: "inline-block", width: "3px", height: "14px", background: "#d4a017", borderRadius: "2px" }} />
                Prayer Statistics
                <span style={{ fontFamily: "'Amiri', serif", fontSize: "11px", color: "#059669", marginLeft: "4px" }}>إحصائيات الصلاة</span>
              </p>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "11px",
                }}
              >
                <tbody>
                  <ReportTableRow label={t.fardCompleted} value={`${stats.totalFardPrayed}`} even />
                  <ReportTableRow label={t.onTime} value={`${stats.totalOnTime}`} />
                  <ReportTableRow label={t.jamaah} value={`${stats.totalJamaah}`} even />
                  <ReportTableRow label={t.sunnahPrayers} value={`${stats.totalSunnah}`} />
                </tbody>
              </table>
            </div>

            {/* Weekly goals */}
            <div style={{ marginBottom: "14px" }}>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#1f2937",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span style={{ display: "inline-block", width: "3px", height: "14px", background: "#059669", borderRadius: "2px" }} />
                {t.weeklyGoals}
                <span style={{ fontFamily: "'Amiri', serif", fontSize: "11px", color: "#059669", marginLeft: "4px" }}>الأهداف الأسبوعية</span>
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                <GoalBox label={t.allFardGoal} current={stats.weeklyAllFardDays} target={7} unit={t.days} />
                <GoalBox label={t.allOnTimeGoal} current={stats.weeklyOnTimePrayers} target={35} unit={t.prayers} />
                <GoalBox label={t.jamaahGoal} current={stats.weeklyJamaahDays} target={3} unit={t.days} />
                <GoalBox label={t.sunnahGoal} current={stats.weeklySunnahCount} target={10} unit={t.prayers} />
              </div>
            </div>

            {/* Quranic verse about prayer */}
            <div
              style={{
                textAlign: "center",
                padding: "12px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)",
                border: "1px solid #a7f3d0",
                marginBottom: "14px",
              }}
            >
              <p
                style={{
                  fontFamily: "'Amiri', 'Traditional Arabic', serif",
                  fontSize: "15px",
                  color: "#d4a017",
                  margin: "0 0 4px",
                  lineHeight: 1.6,
                }}
                dir="rtl"
              >
                إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا
              </p>
              <p style={{ fontSize: "9px", color: "#4b5563", margin: "0 0 2px", fontStyle: "italic" }}>
                &ldquo;Indeed, prayer has been decreed upon the believers a decree of specified times.&rdquo;
              </p>
              <p style={{ fontSize: "8px", color: "#9ca3af", margin: 0 }}>— Surah An-Nisa 4:103</p>
            </div>

            {/* Closing Dua */}
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
              <p
                style={{
                  fontFamily: "'Amiri', serif",
                  fontSize: "13px",
                  color: "#059669",
                  margin: "0 0 2px",
                }}
                dir="rtl"
              >
                تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ
              </p>
              <p style={{ fontSize: "9px", color: "#6b7280", margin: 0, fontStyle: "italic" }}>
                May Allah accept from us and from you
              </p>
            </div>

            {/* Footer divider */}
            <div style={{ height: "1px", background: "linear-gradient(to right, transparent, #d1d5db, transparent)", marginBottom: "8px" }} />

            {/* Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "8px",
                color: "#9ca3af",
              }}
            >
              <span>Generated by IhsanWealth — ihsanwealth.onrender.com</span>
              <span>May Allah accept your prayers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportStatBox({
  label,
  value,
  color,
  bgColor,
  borderColor,
}: {
  label: string;
  value: string;
  color: string;
  bgColor: string;
  borderColor: string;
}) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "10px 8px",
        borderRadius: "8px",
        background: bgColor,
        border: `1px solid ${borderColor}`,
      }}
    >
      <p style={{ fontSize: "22px", fontWeight: 800, color, margin: "0 0 2px" }}>{value}</p>
      <p style={{ fontSize: "9px", color: "#6b7280", margin: 0, fontWeight: 500 }}>{label}</p>
    </div>
  );
}

function ReportTableRow({ label, value, even }: { label: string; value: string; even?: boolean }) {
  return (
    <tr style={{ background: even ? "#fafafa" : "transparent", borderBottom: "1px solid #f3f4f6" }}>
      <td style={{ padding: "6px 10px", fontWeight: 500, color: "#374151" }}>{label}</td>
      <td style={{ padding: "6px 10px", textAlign: "right", fontWeight: 700, color: "#059669" }}>{value}</td>
    </tr>
  );
}

function GoalBox({ label, current, target, unit }: { label: string; current: number; target: number; unit: string }) {
  const progress = Math.min(100, Math.round((current / target) * 100));
  const isComplete = current >= target;
  return (
    <div
      style={{
        padding: "8px 10px",
        borderRadius: "8px",
        border: isComplete ? "1px solid #a7f3d0" : "1px solid #e5e7eb",
        background: isComplete ? "#ecfdf5" : "#fafafa",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
        <span style={{ fontSize: "9px", fontWeight: 600, color: isComplete ? "#059669" : "#4b5563" }}>
          {isComplete ? "✓ " : ""}{label}
        </span>
        <span style={{ fontSize: "10px", fontWeight: 700, color: isComplete ? "#059669" : "#6b7280" }}>
          {current}/{target}
        </span>
      </div>
      <div style={{ height: "4px", borderRadius: "2px", background: "#e5e7eb" }}>
        <div
          style={{
            height: "100%",
            borderRadius: "2px",
            width: `${progress}%`,
            background: isComplete
              ? "linear-gradient(to right, #10b981, #059669)"
              : "linear-gradient(to right, #34d399, #6ee7b7)",
          }}
        />
      </div>
    </div>
  );
}
