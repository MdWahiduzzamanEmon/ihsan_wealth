"use client";

import type { ZakatResult } from "@/types/zakat";
import { formatCurrency } from "@/lib/format";
import { COUNTRIES } from "@/lib/constants";

// Generic data shape that works for both live results and history records
export interface CertificateData {
  totalAssets: number;
  totalDeductions: number;
  netZakatableWealth: number;
  nisabThresholdGold: number;
  nisabThresholdSilver: number;
  activeNisab: number;
  isAboveNisab: boolean;
  zakatAmount: number;
  zakatAlFitr?: number;
  agriculturalZakat?: number;
  totalZakatDue?: number;
  breakdown: Array<{ category: string; amount: number; percentage: number; color: string }>;
}

interface ZakatCertificateProps {
  result: CertificateData;
  currency: string;
  nisabBasis: "gold" | "silver";
  countryCode: string;
  /** Override the date shown on the certificate */
  calculatedDate?: string;
  /** Year label to show (e.g. "2025") */
  year?: number;
  /** Unique element id for targeting with html2canvas */
  elementId?: string;
}

const ZAKAT_RECIPIENTS = [
  { name: "The Poor", arabic: "الفقراء" },
  { name: "The Needy", arabic: "المساكين" },
  { name: "Zakat Collectors", arabic: "العاملين عليها" },
  { name: "New Muslims", arabic: "المؤلفة قلوبهم" },
  { name: "Freeing Captives", arabic: "في الرقاب" },
  { name: "Debtors", arabic: "الغارمين" },
  { name: "In Allah's Cause", arabic: "في سبيل الله" },
  { name: "Travelers", arabic: "ابن السبيل" },
];

export function ZakatCertificate({ result, currency, nisabBasis, countryCode, calculatedDate, year, elementId }: ZakatCertificateProps) {
  const country = COUNTRIES.find((c) => c.code === countryCode);
  const currencySymbol = country?.currencySymbol || "$";
  const dateObj = calculatedDate ? new Date(calculatedDate) : new Date();
  const hijriFormatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const gregorianDate = dateObj.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  let hijriDate = "";
  try {
    hijriDate = hijriFormatter.format(dateObj);
  } catch {
    hijriDate = "";
  }

  return (
    <div
      id={elementId || "zakat-certificate"}
      className="zakat-certificate-root"
      style={{
        width: "210mm",
        minHeight: "297mm",
        margin: "0 auto",
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
          inset: "8mm",
          border: "2px solid #059669",
          borderRadius: "12px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "10mm",
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
            width: "40px",
            height: "40px",
            ...(pos.includes("top") ? { top: "12mm" } : { bottom: "12mm" }),
            ...(pos.includes("left") ? { left: "12mm" } : { right: "12mm" }),
          }}
        >
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="#059669" strokeWidth="1" opacity="0.4" />
            <circle cx="20" cy="20" r="8" fill="none" stroke="#d4a017" strokeWidth="0.8" opacity="0.5" />
          </svg>
        </div>
      ))}

      <div style={{ padding: "18mm 16mm 14mm" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "6mm" }}>
          <p
            style={{
              fontFamily: "'Amiri', 'Traditional Arabic', serif",
              fontSize: "22px",
              color: "#d4a017",
              margin: "0 0 4px",
              lineHeight: 1.4,
            }}
            dir="rtl"
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p style={{ fontSize: "10px", color: "#6b7280", margin: "0 0 8px", fontStyle: "italic" }}>
            In the name of Allah, the Most Gracious, the Most Merciful
          </p>

          {/* Logo / Title */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #059669, #047857)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              IW
            </div>
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#065f46",
                  letterSpacing: "-0.5px",
                }}
              >
                <span style={{ color: "#d4a017" }}>Ihsan</span>Wealth
              </h1>
            </div>
          </div>
          <h2
            style={{
              margin: "6px 0 2px",
              fontSize: "18px",
              fontWeight: 600,
              color: "#1f2937",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            Zakat Calculation Report{year ? ` — ${year}` : ""}
          </h2>
          <p
            style={{
              fontFamily: "'Amiri', 'Traditional Arabic', serif",
              fontSize: "16px",
              color: "#059669",
              margin: "2px 0 0",
            }}
            dir="rtl"
          >
            تقرير حساب الزكاة
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            margin: "4mm 0",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, #059669, transparent)" }} />
          <span style={{ fontFamily: "'Amiri', serif", color: "#d4a017", fontSize: "14px" }}>&#10022;</span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, #059669, transparent)" }} />
        </div>

        {/* Date & Info */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "11px",
            color: "#4b5563",
            marginBottom: "5mm",
            padding: "3mm 4mm",
            background: "#f0fdf4",
            borderRadius: "8px",
            border: "1px solid #d1fae5",
          }}
        >
          <div>
            <strong>Date:</strong> {gregorianDate}
            {hijriDate && <span style={{ marginLeft: "8px", color: "#059669" }}>({hijriDate})</span>}
          </div>
          <div>
            <strong>Currency:</strong> {country?.flag} {currency} ({currencySymbol})
          </div>
          <div>
            <strong>Nisab Basis:</strong> {nisabBasis === "gold" ? "Gold (87.48g)" : "Silver (612.36g)"}
          </div>
        </div>

        {/* Main Result Box */}
        <div
          style={{
            textAlign: "center",
            padding: "6mm 4mm",
            marginBottom: "5mm",
            borderRadius: "12px",
            background: result.isAboveNisab
              ? "linear-gradient(135deg, #ecfdf5, #d1fae5)"
              : "linear-gradient(135deg, #f9fafb, #f3f4f6)",
            border: result.isAboveNisab ? "2px solid #059669" : "2px solid #d1d5db",
          }}
        >
          <p
            style={{
              fontFamily: "'Amiri', serif",
              fontSize: "18px",
              color: result.isAboveNisab ? "#059669" : "#6b7280",
              margin: "0 0 4px",
            }}
            dir="rtl"
          >
            {result.isAboveNisab ? "الزكاة واجبة عليك" : "الحمد لله"}
          </p>
          <p
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: result.isAboveNisab ? "#065f46" : "#4b5563",
              margin: "0 0 6px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {result.isAboveNisab ? "Zakat is Obligatory Upon You" : "Below Nisab Threshold — Zakat Not Obligatory"}
          </p>

          {result.isAboveNisab && (
            <>
              <p style={{ fontSize: "11px", color: "#6b7280", margin: "0 0 2px" }}>Your Zakat on Wealth (2.5%)</p>
              <p
                style={{
                  fontSize: "36px",
                  fontWeight: 800,
                  color: "#047857",
                  margin: "0",
                  letterSpacing: "-1px",
                }}
              >
                {formatCurrency(result.zakatAmount, currency)}
              </p>

              {((result.agriculturalZakat || 0) > 0 || (result.zakatAlFitr || 0) > 0) && (
                <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "6px" }}>
                  {(result.agriculturalZakat || 0) > 0 && (
                    <span
                      style={{
                        fontSize: "11px",
                        background: "#ecfccb",
                        color: "#4d7c0f",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontWeight: 600,
                      }}
                    >
                      Ushr: {formatCurrency(result.agriculturalZakat!, currency)}
                    </span>
                  )}
                  {(result.zakatAlFitr || 0) > 0 && (
                    <span
                      style={{
                        fontSize: "11px",
                        background: "#ffe4e6",
                        color: "#be123c",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontWeight: 600,
                      }}
                    >
                      Fitr: {formatCurrency(result.zakatAlFitr!, currency)}
                    </span>
                  )}
                </div>
              )}

              {result.totalZakatDue && result.totalZakatDue !== result.zakatAmount && (
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#065f46",
                    margin: "8px 0 0",
                    background: "#a7f3d0",
                    display: "inline-block",
                    padding: "4px 16px",
                    borderRadius: "20px",
                  }}
                >
                  Total Zakat Due: {formatCurrency(result.totalZakatDue!, currency)}
                </p>
              )}
            </>
          )}
        </div>

        {/* Asset Breakdown Table */}
        <div style={{ marginBottom: "5mm" }}>
          <h3
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#1f2937",
              marginBottom: "3mm",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span style={{ display: "inline-block", width: "4px", height: "16px", background: "#059669", borderRadius: "2px" }} />
            Asset Breakdown
            <span style={{ fontFamily: "'Amiri', serif", fontSize: "12px", color: "#059669", marginLeft: "4px" }}>تفصيل الأصول</span>
          </h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "11px",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid #d1fae5" }}>
                <th style={{ textAlign: "left", padding: "6px 8px", color: "#065f46", fontWeight: 600 }}>Category</th>
                <th style={{ textAlign: "right", padding: "6px 8px", color: "#065f46", fontWeight: 600 }}>Amount</th>
                <th style={{ textAlign: "right", padding: "6px 8px", color: "#065f46", fontWeight: 600 }}>Share</th>
              </tr>
            </thead>
            <tbody>
              {result.breakdown.map((item, i) => (
                <tr
                  key={item.category}
                  style={{
                    borderBottom: "1px solid #f3f4f6",
                    background: i % 2 === 0 ? "#fafafa" : "transparent",
                  }}
                >
                  <td style={{ padding: "5px 8px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: item.color,
                        marginRight: "6px",
                        verticalAlign: "middle",
                      }}
                    />
                    {item.category}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "5px 8px",
                      fontWeight: 500,
                      color: item.amount < 0 ? "#dc2626" : "#1f2937",
                    }}
                  >
                    {item.amount < 0 ? "- " : ""}
                    {formatCurrency(Math.abs(item.amount), currency)}
                  </td>
                  <td style={{ textAlign: "right", padding: "5px 8px", color: "#6b7280" }}>
                    {item.percentage > 0 ? `${item.percentage.toFixed(1)}%` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: "2px solid #d1fae5" }}>
                <td style={{ padding: "6px 8px", fontWeight: 700 }}>Total Assets</td>
                <td style={{ textAlign: "right", padding: "6px 8px", fontWeight: 700 }}>
                  {formatCurrency(result.totalAssets, currency)}
                </td>
                <td />
              </tr>
              <tr>
                <td style={{ padding: "4px 8px", fontWeight: 600, color: "#dc2626" }}>Total Deductions</td>
                <td style={{ textAlign: "right", padding: "4px 8px", fontWeight: 600, color: "#dc2626" }}>
                  - {formatCurrency(result.totalDeductions, currency)}
                </td>
                <td />
              </tr>
              <tr style={{ borderTop: "2px solid #059669", background: "#ecfdf5" }}>
                <td style={{ padding: "8px", fontWeight: 700, fontSize: "12px" }}>Net Zakatable Wealth</td>
                <td style={{ textAlign: "right", padding: "8px", fontWeight: 700, fontSize: "12px" }}>
                  {formatCurrency(result.netZakatableWealth, currency)}
                </td>
                <td />
              </tr>
              {result.isAboveNisab && (
                <tr style={{ background: "#d1fae5" }}>
                  <td style={{ padding: "8px", fontWeight: 800, fontSize: "13px", color: "#047857" }}>
                    Zakat on Wealth (2.5%)
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "8px",
                      fontWeight: 800,
                      fontSize: "13px",
                      color: "#047857",
                    }}
                  >
                    {formatCurrency(result.zakatAmount, currency)}
                  </td>
                  <td />
                </tr>
              )}
            </tfoot>
          </table>
        </div>

        {/* Nisab Info */}
        <div
          style={{
            display: "flex",
            gap: "4mm",
            marginBottom: "5mm",
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "3mm",
              borderRadius: "8px",
              background: "#fffbeb",
              border: "1px solid #fde68a",
              fontSize: "10px",
            }}
          >
            <strong style={{ color: "#92400e" }}>Gold Nisab (87.48g)</strong>
            <p style={{ margin: "2px 0 0", color: "#78350f" }}>{formatCurrency(result.nisabThresholdGold, currency)}</p>
          </div>
          <div
            style={{
              flex: 1,
              padding: "3mm",
              borderRadius: "8px",
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              fontSize: "10px",
            }}
          >
            <strong style={{ color: "#374151" }}>Silver Nisab (612.36g)</strong>
            <p style={{ margin: "2px 0 0", color: "#1f2937" }}>{formatCurrency(result.nisabThresholdSilver, currency)}</p>
          </div>
          <div
            style={{
              flex: 1,
              padding: "3mm",
              borderRadius: "8px",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              fontSize: "10px",
            }}
          >
            <strong style={{ color: "#065f46" }}>Active Nisab ({nisabBasis})</strong>
            <p style={{ margin: "2px 0 0", color: "#047857", fontWeight: 700 }}>{formatCurrency(result.activeNisab, currency)}</p>
          </div>
        </div>

        {/* 8 Categories of Recipients */}
        {result.isAboveNisab && (
          <div style={{ marginBottom: "5mm" }}>
            <h3
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#1f2937",
                marginBottom: "3mm",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span style={{ display: "inline-block", width: "4px", height: "16px", background: "#d4a017", borderRadius: "2px" }} />
              8 Categories of Zakat Recipients (Surah At-Tawbah 9:60)
              <span style={{ fontFamily: "'Amiri', serif", fontSize: "11px", color: "#059669" }}>مصارف الزكاة</span>
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "2mm",
              }}
            >
              {ZAKAT_RECIPIENTS.map((r) => (
                <div
                  key={r.name}
                  style={{
                    textAlign: "center",
                    padding: "3mm 2mm",
                    borderRadius: "6px",
                    border: "1px solid #e5e7eb",
                    background: "#fafafa",
                  }}
                >
                  <p style={{ fontFamily: "'Amiri', serif", fontSize: "12px", color: "#059669", margin: "0 0 2px" }} dir="rtl">
                    {r.arabic}
                  </p>
                  <p style={{ fontSize: "9px", fontWeight: 600, color: "#374151", margin: 0, lineHeight: 1.3 }}>{r.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quranic Verse */}
        <div
          style={{
            textAlign: "center",
            padding: "4mm",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)",
            border: "1px solid #a7f3d0",
            marginBottom: "5mm",
          }}
        >
          <p
            style={{
              fontFamily: "'Amiri', 'Traditional Arabic', serif",
              fontSize: "16px",
              color: "#d4a017",
              margin: "0 0 4px",
              lineHeight: 1.6,
            }}
            dir="rtl"
          >
            خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا
          </p>
          <p style={{ fontSize: "10px", color: "#4b5563", margin: "0 0 2px", fontStyle: "italic" }}>
            &ldquo;Take from their wealth a charity by which you purify them and cause them increase.&rdquo;
          </p>
          <p style={{ fontSize: "9px", color: "#9ca3af", margin: 0 }}>— Surah At-Tawbah 9:103</p>
        </div>

        {/* Closing Dua */}
        <div style={{ textAlign: "center", marginBottom: "4mm" }}>
          <p
            style={{
              fontFamily: "'Amiri', serif",
              fontSize: "14px",
              color: "#059669",
              margin: "0 0 4px",
            }}
            dir="rtl"
          >
            تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ
          </p>
          <p style={{ fontSize: "10px", color: "#6b7280", margin: 0, fontStyle: "italic" }}>
            May Allah accept from us and from you
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "4mm",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, #d1d5db, transparent)" }} />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "3mm",
            fontSize: "9px",
            color: "#9ca3af",
          }}
        >
          <span>Generated by IhsanWealth — ihsanwealth.onrender.com</span>
          <span>
            This is a self-calculation tool. Please consult a scholar for specific rulings.
          </span>
        </div>
      </div>
    </div>
  );
}

export function recordToCertificateData(record: {
  total_assets: number;
  total_deductions: number;
  net_zakatable_wealth: number;
  nisab_threshold: number;
  is_above_nisab: boolean;
  zakat_amount: number;
  breakdown: Array<{ category: string; amount: number; percentage: number; color: string }>;
}): CertificateData {
  return {
    totalAssets: record.total_assets,
    totalDeductions: record.total_deductions,
    netZakatableWealth: record.net_zakatable_wealth,
    nisabThresholdGold: record.nisab_threshold, // approximate — only active nisab stored
    nisabThresholdSilver: record.nisab_threshold,
    activeNisab: record.nisab_threshold,
    isAboveNisab: record.is_above_nisab,
    zakatAmount: record.zakat_amount,
    breakdown: record.breakdown,
  };
}

export async function exportCertificateAsImage(elementId: string, filename: string) {
  const el = document.getElementById(elementId);
  if (!el) return;

  try {
    const html2canvasModule = await import("html2canvas");
    const html2canvas = html2canvasModule.default;

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      width: el.scrollWidth,
      height: el.scrollHeight,
    });

    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  } catch {
    // Fallback to print
    window.print();
  }
}

export function printCertificate() {
  window.print();
}
