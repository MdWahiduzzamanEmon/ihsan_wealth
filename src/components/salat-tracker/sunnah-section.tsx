"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { PrayerName, PrayerStatus, SalatRecord, SunnahPrayer, NaflPrayer } from "@/hooks/use-salat-tracker";
import { getPrayerDisplayName, type SalatTrackerTexts } from "@/lib/salat-tracker-texts";

interface SunnahSectionProps {
  records: SalatRecord[];
  t: SalatTrackerTexts;
  onToggleStatus: (prayerName: PrayerName, status: PrayerStatus) => void;
  onRemove: (prayerName: PrayerName) => void;
  isRamadan?: boolean;
}

const SUNNAH_PRAYERS: SunnahPrayer[] = [
  "sunnah_fajr",
  "sunnah_dhuhr_before",
  "sunnah_dhuhr_after",
  "sunnah_maghrib",
  "sunnah_isha",
];

const NAFL_PRAYERS: NaflPrayer[] = ["tahajjud", "duha", "ishraq", "awwabin"];

export function SunnahSection({ records, t, onToggleStatus, onRemove, isRamadan }: SunnahSectionProps) {
  const [sunnahOpen, setSunnahOpen] = useState(false);
  const [naflOpen, setNaflOpen] = useState(false);

  const getRecord = (name: string) => records.find((r) => r.prayer_name === name);

  const sunnahCompleted = SUNNAH_PRAYERS.filter((p) => getRecord(p)?.status === "prayed").length;
  const naflCompleted = NAFL_PRAYERS.filter((p) => getRecord(p)?.status === "prayed").length;

  return (
    <div className="space-y-3">
      {/* Sunnah */}
      <div className="rounded-xl border border-emerald-100 bg-white overflow-hidden">
        <button
          onClick={() => setSunnahOpen(!sunnahOpen)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-emerald-800 hover:bg-emerald-50/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span>{t.sunnahPrayers}</span>
            <span className="text-xs text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-full">
              {sunnahCompleted}/{SUNNAH_PRAYERS.length}
            </span>
          </div>
          {sunnahOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        <AnimatePresence>
          {sunnahOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-3 space-y-2">
                {SUNNAH_PRAYERS.map((prayer) => (
                  <PrayerCheckRow
                    key={prayer}
                    prayerName={prayer}
                    displayName={getPrayerDisplayName(prayer, t)}
                    record={getRecord(prayer)}
                    onToggle={() => {
                      if (getRecord(prayer)) onRemove(prayer);
                      else onToggleStatus(prayer, "prayed");
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nafl */}
      <div className="rounded-xl border border-emerald-100 bg-white overflow-hidden">
        <button
          onClick={() => setNaflOpen(!naflOpen)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-emerald-800 hover:bg-emerald-50/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span>{t.naflPrayers}</span>
            <span className="text-xs text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-full">
              {naflCompleted}/{NAFL_PRAYERS.length}
            </span>
          </div>
          {naflOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        <AnimatePresence>
          {naflOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-3 space-y-2">
                {NAFL_PRAYERS.map((prayer) => (
                  <PrayerCheckRow
                    key={prayer}
                    prayerName={prayer}
                    displayName={getPrayerDisplayName(prayer, t)}
                    record={getRecord(prayer)}
                    onToggle={() => {
                      if (getRecord(prayer)) onRemove(prayer);
                      else onToggleStatus(prayer, "prayed");
                    }}
                  />
                ))}
                {isRamadan && (
                  <>
                    <PrayerCheckRow
                      prayerName="taraweeh"
                      displayName={t.taraweeh}
                      record={getRecord("taraweeh")}
                      onToggle={() => {
                        if (getRecord("taraweeh")) onRemove("taraweeh" as PrayerName);
                        else onToggleStatus("taraweeh" as PrayerName, "prayed");
                      }}
                    />
                    <PrayerCheckRow
                      prayerName="witr_ramadan"
                      displayName={t.witr}
                      record={getRecord("witr_ramadan")}
                      onToggle={() => {
                        if (getRecord("witr_ramadan")) onRemove("witr_ramadan" as PrayerName);
                        else onToggleStatus("witr_ramadan" as PrayerName, "prayed");
                      }}
                    />
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PrayerCheckRow({
  prayerName,
  displayName,
  record,
  onToggle,
}: {
  prayerName: string;
  displayName: string;
  record?: SalatRecord;
  onToggle: () => void;
}) {
  const isCompleted = record?.status === "prayed";

  return (
    <button
      onClick={onToggle}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
        isCompleted ? "bg-emerald-50" : "hover:bg-gray-50"
      }`}
    >
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-all ${
          isCompleted
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-gray-300 bg-white"
        }`}
      >
        {isCompleted && <Check className="h-3.5 w-3.5" />}
      </div>
      <span className={isCompleted ? "text-emerald-700 font-medium" : "text-gray-600"}>
        {displayName}
      </span>
    </button>
  );
}
