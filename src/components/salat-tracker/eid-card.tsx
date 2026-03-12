"use client";

import { motion } from "framer-motion";
import { Check, Users, Star } from "lucide-react";
import { staggerItem } from "@/lib/animations";
import type { SalatRecord, PrayerStatus, PrayerName } from "@/hooks/use-salat-tracker";
import type { SalatTrackerTexts } from "@/lib/salat-tracker-texts";

interface EidCardProps {
  eidType: "eid_al_fitr" | "eid_al_adha";
  record?: SalatRecord;
  t: SalatTrackerTexts;
  onToggleStatus: (prayerName: PrayerName, status: PrayerStatus) => void;
  onToggleJamaah: (prayerName: PrayerName, inJamaah: boolean) => void;
  onRemove: (prayerName: PrayerName) => void;
}

export function EidCard({ eidType, record, t, onToggleStatus, onToggleJamaah, onRemove }: EidCardProps) {
  const status = record?.status;
  const inJamaah = record?.in_jamaah ?? false;
  const eidName = eidType === "eid_al_fitr" ? t.eidAlFitr : t.eidAlAdha;

  const handleToggle = () => {
    if (!status) {
      onToggleStatus(eidType, "prayed");
    } else {
      onRemove(eidType);
    }
  };

  return (
    <motion.div
      variants={staggerItem}
      className={`relative overflow-hidden rounded-xl border-2 p-4 shadow-md transition-all ${
        status === "prayed"
          ? "border-emerald-400 bg-gradient-to-r from-emerald-50 to-amber-50/30"
          : "border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50/30"
      }`}
    >
      {/* Eid banner */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 shadow-sm">
          <Star className="h-4 w-4 text-white fill-white" />
        </div>
        <div>
          <h3 className="font-bold text-amber-800 text-sm">{t.eidMubarak}</h3>
          <p className="text-[10px] text-amber-600/70 font-arabic" dir="rtl">{t.takbeer}</p>
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
            {status === "prayed" ? <Check className="h-5 w-5" /> : <Star className="h-4 w-4" />}
          </button>
          <span className="font-semibold text-gray-900">{eidName}</span>
        </div>

        <div className="flex items-center gap-2">
          {status === "prayed" && (
            <>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                {t.prayed}
              </span>
              <button
                onClick={() => onToggleJamaah(eidType, !inJamaah)}
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
