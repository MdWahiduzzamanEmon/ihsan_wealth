"use client";

import { motion } from "framer-motion";
import { Check, Users, Landmark } from "lucide-react";
import { staggerItem } from "@/lib/animations";
import type { SalatRecord, PrayerStatus, PrayerName } from "@/hooks/use-salat-tracker";
import type { SalatTrackerTexts } from "@/lib/salat-tracker-texts";

interface JummahCardProps {
  record?: SalatRecord;
  t: SalatTrackerTexts;
  onToggleStatus: (prayerName: PrayerName, status: PrayerStatus) => void;
  onToggleJamaah: (prayerName: PrayerName, inJamaah: boolean) => void;
  onRemove: (prayerName: PrayerName) => void;
}

export function JummahCard({ record, t, onToggleStatus, onToggleJamaah, onRemove }: JummahCardProps) {
  const status = record?.status;
  const inJamaah = record?.in_jamaah ?? false;

  const handleToggle = () => {
    if (!status) {
      onToggleStatus("jummah", "prayed");
    } else {
      onRemove("jummah");
    }
  };

  return (
    <motion.div
      variants={staggerItem}
      className={`relative overflow-hidden rounded-xl border-2 p-4 shadow-md transition-all ${
        status === "prayed"
          ? "border-emerald-400 bg-gradient-to-r from-emerald-50 to-emerald-100/50"
          : "border-amber-200 bg-gradient-to-r from-amber-50/50 to-white"
      }`}
    >
      {/* Jummah Mubarak banner */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 shadow-sm">
          <Landmark className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-amber-800 text-sm">{t.jummahMubarak}</h3>
          <p className="text-[10px] text-amber-600/70">{t.fridayBlessing}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggle}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all active:scale-90 ${
              status === "prayed"
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-amber-300 bg-white text-amber-400 hover:border-emerald-400"
            }`}
          >
            {status === "prayed" ? <Check className="h-5 w-5" /> : <Landmark className="h-4 w-4" />}
          </button>
          <div>
            <span className="font-semibold text-gray-900">{t.jummah}</span>
            <span className="font-arabic text-sm text-gray-400 ml-2" dir="rtl">{t.jummahAr}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {status === "prayed" && (
            <>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                {t.prayed}
              </span>
              <button
                onClick={() => onToggleJamaah("jummah", !inJamaah)}
                className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-all active:scale-95 ${
                  inJamaah
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                <Users className="h-3 w-3" />
                {inJamaah && <span>{t.jamaah}</span>}
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
