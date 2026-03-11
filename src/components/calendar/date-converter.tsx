"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRightLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  gregorianToHijri,
  hijriToGregorian,
  getHijriMonthName,
  type HijriDate,
} from "@/lib/hijri-utils";

export function DateConverter() {
  // Gregorian -> Hijri
  const [gregorianInput, setGregorianInput] = useState("");
  const [hijriResult, setHijriResult] = useState<HijriDate | null>(null);

  // Hijri -> Gregorian
  const [hijriDay, setHijriDay] = useState("");
  const [hijriMonth, setHijriMonth] = useState("");
  const [hijriYear, setHijriYear] = useState("");
  const [gregorianResult, setGregorianResult] = useState<Date | null>(null);

  const [activeDirection, setActiveDirection] = useState<"g2h" | "h2g">("g2h");

  const convertGregorianToHijri = useCallback(() => {
    if (!gregorianInput) return;
    try {
      const date = new Date(gregorianInput);
      if (isNaN(date.getTime())) return;
      const hijri = gregorianToHijri(date);
      setHijriResult(hijri);
    } catch {
      // Invalid date
    }
  }, [gregorianInput]);

  const convertHijriToGregorian = useCallback(() => {
    const d = parseInt(hijriDay);
    const m = parseInt(hijriMonth);
    const y = parseInt(hijriYear);
    if (!d || !m || !y || m < 1 || m > 12 || d < 1 || d > 30) return;
    try {
      const gDate = hijriToGregorian({ year: y, month: m, day: d });
      setGregorianResult(gDate);
    } catch {
      // Invalid date
    }
  }, [hijriDay, hijriMonth, hijriYear]);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-5">
        <ArrowRightLeft className="h-5 w-5 text-emerald-700" />
        <h2 className="text-lg font-semibold text-emerald-900">Date Converter</h2>
      </div>

      {/* Direction toggle */}
      <div className="flex gap-2 mb-5">
        <Button
          variant={activeDirection === "g2h" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveDirection("g2h")}
          className={
            activeDirection === "g2h"
              ? "bg-emerald-700 hover:bg-emerald-800 text-white"
              : "text-emerald-700 border-emerald-200 hover:bg-emerald-50"
          }
        >
          Gregorian to Hijri
        </Button>
        <Button
          variant={activeDirection === "h2g" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveDirection("h2g")}
          className={
            activeDirection === "h2g"
              ? "bg-emerald-700 hover:bg-emerald-800 text-white"
              : "text-emerald-700 border-emerald-200 hover:bg-emerald-50"
          }
        >
          Hijri to Gregorian
        </Button>
      </div>

      <motion.div
        key={activeDirection}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeDirection === "g2h" ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-200 bg-white p-4">
              <label className="text-sm font-medium text-emerald-800 block mb-2">
                Select Gregorian Date
              </label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={gregorianInput}
                  onChange={(e) => setGregorianInput(e.target.value)}
                  className="flex-1 border-emerald-200 focus-visible:border-emerald-400 focus-visible:ring-emerald-200"
                />
                <Button
                  onClick={convertGregorianToHijri}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white shrink-0"
                >
                  Convert
                </Button>
              </div>
            </div>

            {hijriResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-emerald-50 p-5 text-center"
              >
                <p className="text-xs text-amber-600 font-medium uppercase tracking-wider mb-2">
                  Hijri Date
                </p>
                <p className="font-arabic text-2xl text-emerald-900 mb-1">
                  {getHijriMonthName(hijriResult.month).arabic}
                </p>
                <p className="text-3xl font-bold text-emerald-800">
                  {hijriResult.day}{" "}
                  <span className="text-lg font-normal text-emerald-600">
                    {getHijriMonthName(hijriResult.month).english}
                  </span>{" "}
                  {hijriResult.year}
                  <span className="text-sm font-normal text-emerald-500 ml-1">AH</span>
                </p>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-200 bg-white p-4">
              <label className="text-sm font-medium text-emerald-800 block mb-2">
                Enter Hijri Date
              </label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Day</label>
                  <Input
                    type="number"
                    placeholder="1-30"
                    min={1}
                    max={30}
                    value={hijriDay}
                    onChange={(e) => setHijriDay(e.target.value)}
                    className="border-emerald-200 focus-visible:border-emerald-400 focus-visible:ring-emerald-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Month</label>
                  <Input
                    type="number"
                    placeholder="1-12"
                    min={1}
                    max={12}
                    value={hijriMonth}
                    onChange={(e) => setHijriMonth(e.target.value)}
                    className="border-emerald-200 focus-visible:border-emerald-400 focus-visible:ring-emerald-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Year</label>
                  <Input
                    type="number"
                    placeholder="1446"
                    value={hijriYear}
                    onChange={(e) => setHijriYear(e.target.value)}
                    className="border-emerald-200 focus-visible:border-emerald-400 focus-visible:ring-emerald-200"
                  />
                </div>
              </div>
              {hijriMonth && parseInt(hijriMonth) >= 1 && parseInt(hijriMonth) <= 12 && (
                <p className="text-xs text-emerald-600 mb-3">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {getHijriMonthName(parseInt(hijriMonth)).english} (
                  {getHijriMonthName(parseInt(hijriMonth)).arabic})
                </p>
              )}
              <Button
                onClick={convertHijriToGregorian}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                Convert
              </Button>
            </div>

            {gregorianResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-emerald-50 p-5 text-center"
              >
                <p className="text-xs text-amber-600 font-medium uppercase tracking-wider mb-2">
                  Gregorian Date
                </p>
                <p className="text-3xl font-bold text-emerald-800">
                  {gregorianResult.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
