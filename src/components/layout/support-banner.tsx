"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

const PHONE = "01703459656";
const PHONE_DISPLAY = "+880 1703-459656";

export function SupportBanner() {
  const [copied, setCopied] = useState<"bkash" | "nagad" | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const handleCopy = async (source: "bkash" | "nagad") => {
    try {
      await navigator.clipboard.writeText(PHONE);
      setCopied(source);
      setTimeout(() => setCopied(null), 2000);
    } catch {}
  };

  return (
    <div id="support-sadaqah" className="rounded-xl bg-gradient-to-r from-emerald-900/40 to-emerald-800/30 border border-emerald-700/25 px-4 sm:px-5 py-5 mb-8 scroll-mt-20">
      {/* Header */}
      <div className="text-center mb-4">
        <p className="font-arabic text-amber-300 text-sm mb-1">صدقة جارية</p>
        <h3 className="text-sm font-semibold text-white">
          সদকায়ে জারিয়া — চলমান সদকা
        </h3>
        <p className="text-xs text-emerald-200/70 mt-1.5 max-w-sm mx-auto leading-relaxed">
          এই অ্যাপটি সম্পূর্ণ বিনামূল্যে। এর উন্নয়নে সদকায়ে জারিয়া হিসেবে সহযোগিতা করুন।
        </p>
      </div>

      {/* Payment methods */}
      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        {/* bKash */}
        <button
          onClick={() => handleCopy("bkash")}
          className="group flex flex-col items-center gap-1.5 rounded-lg bg-[#E2136E]/15 border border-[#E2136E]/30 hover:border-[#E2136E]/50 hover:bg-[#E2136E]/20 px-3 py-3 transition-all"
        >
          <span className="text-xs font-bold text-[#E2136E] tracking-wide">bKash</span>
          <span className="text-[11px] text-white/90 font-mono">{PHONE_DISPLAY}</span>
          <span className="text-[9px] text-emerald-300/60">(পার্সোনাল)</span>
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-200/70 mt-0.5">
            {copied === "bkash" ? (
              <><Check className="h-3 w-3 text-green-400" /> কপি হয়েছে</>
            ) : (
              <><Copy className="h-3 w-3" /> নম্বর কপি করুন</>
            )}
          </span>
        </button>

        {/* Nagad */}
        <button
          onClick={() => handleCopy("nagad")}
          className="group flex flex-col items-center gap-1.5 rounded-lg bg-[#F6921E]/15 border border-[#F6921E]/30 hover:border-[#F6921E]/50 hover:bg-[#F6921E]/20 px-3 py-3 transition-all"
        >
          <span className="text-xs font-bold text-[#F6921E] tracking-wide">Nagad</span>
          <span className="text-[11px] text-white/90 font-mono">{PHONE_DISPLAY}</span>
          <span className="text-[9px] text-emerald-300/60">(পার্সোনাল)</span>
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-200/70 mt-0.5">
            {copied === "nagad" ? (
              <><Check className="h-3 w-3 text-green-400" /> কপি হয়েছে</>
            ) : (
              <><Copy className="h-3 w-3" /> নম্বর কপি করুন</>
            )}
          </span>
        </button>
      </div>

      {/* How to send - toggle */}
      <div className="mt-4 max-w-sm mx-auto">
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center justify-center gap-1.5 mx-auto text-[11px] text-emerald-200/80 hover:text-white transition-colors"
        >
          কিভাবে পাঠাবেন?
          {showGuide ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>

        {showGuide && (
          <div className="mt-3 rounded-lg bg-white/[0.05] border border-emerald-700/20 px-4 py-3 space-y-3">
            {/* bKash guide */}
            <div>
              <p className="text-[11px] font-semibold text-[#E2136E] mb-1.5">bKash দিয়ে পাঠানোর নিয়ম:</p>
              <ol className="text-[10px] text-emerald-100/70 space-y-1 list-decimal list-inside leading-relaxed">
                <li>bKash অ্যাপ খুলুন বা *247# ডায়াল করুন</li>
                <li>&ldquo;Send Money&rdquo; অপশন সিলেক্ট করুন</li>
                <li>নম্বর দিন: <span className="font-mono text-white/90">{PHONE}</span></li>
                <li>পরিমাণ লিখুন এবং পিন দিয়ে কনফার্ম করুন</li>
              </ol>
            </div>

            {/* Nagad guide */}
            <div>
              <p className="text-[11px] font-semibold text-[#F6921E] mb-1.5">Nagad দিয়ে পাঠানোর নিয়ম:</p>
              <ol className="text-[10px] text-emerald-100/70 space-y-1 list-decimal list-inside leading-relaxed">
                <li>Nagad অ্যাপ খুলুন বা *167# ডায়াল করুন</li>
                <li>&ldquo;Send Money&rdquo; অপশন সিলেক্ট করুন</li>
                <li>নম্বর দিন: <span className="font-mono text-white/90">{PHONE}</span></li>
                <li>পরিমাণ লিখুন এবং পিন দিয়ে কনফার্ম করুন</li>
              </ol>
            </div>

            <p className="text-[10px] text-emerald-200/60 text-center pt-1.5 border-t border-emerald-700/20">
              যেকোনো পরিমাণ পাঠাতে পারেন। আল্লাহ আপনার সদকা কবুল করুন।
            </p>
          </div>
        )}
      </div>

      {/* Motivational hadith */}
      <p className="text-center text-[10px] text-emerald-200/50 mt-3 italic">
        &ldquo;দান-সদকা সম্পদ কমায় না।&rdquo; — সহীহ মুসলিম
      </p>
    </div>
  );
}
