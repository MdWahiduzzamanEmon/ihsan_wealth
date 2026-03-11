"use client";

import { motion } from "framer-motion";
import { SectionCard } from "@/components/ui/custom/section-card";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { ZakatFormData } from "@/types/zakat";
import type { TransLang } from "@/lib/islamic-content";
import { t, biDesc } from "@/lib/form-translations";
import { Heart, Users, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FitrSettingsStepProps {
  formData: ZakatFormData;
  onChange: (updates: Partial<ZakatFormData>) => void;
  currencySymbol: string;
  lang: TransLang;
}

export function FitrSettingsStep({ formData, onChange, currencySymbol, lang }: FitrSettingsStepProps) {
  const isLocal = lang !== "en";

  const MADHABS = [
    { value: "hanafi" as const, label: "Hanafi", arabic: "حنفي", desc: "Most common in South Asia, Turkey", descLocal: isLocal ? t(lang, "hanafiDesc") : undefined },
    { value: "shafii" as const, label: "Shafi'i", arabic: "شافعي", desc: "Southeast Asia, East Africa", descLocal: isLocal ? t(lang, "shafiiDesc") : undefined },
    { value: "maliki" as const, label: "Maliki", arabic: "مالكي", desc: "North/West Africa", descLocal: isLocal ? t(lang, "malikiDesc") : undefined },
    { value: "hanbali" as const, label: "Hanbali", arabic: "حنبلي", desc: "Saudi Arabia, Gulf states", descLocal: isLocal ? t(lang, "hanbaliDesc") : undefined },
  ];

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Zakat al-Fitr */}
      <motion.div variants={staggerItem}>
        <SectionCard
          title="Zakat al-Fitr (Fitrana)"
          titleAr={isLocal ? t(lang, "zakatFitr") : "زكاة الفطر"}
          description={isLocal ? biDesc(lang, "zakatFitr_desc") : "Obligatory charity given at the end of Ramadan before Eid prayer. It purifies the fasting person and feeds the poor."}
          icon={Heart}
          iconColor="text-rose-600"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-rose-50 border border-rose-200">
              <input
                type="checkbox"
                id="fitrIncluded"
                checked={formData.fitrIncluded}
                onChange={(e) => onChange({ fitrIncluded: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
              />
              <Label htmlFor="fitrIncluded" className="text-sm text-rose-800 cursor-pointer">
                <strong>{isLocal ? t(lang, "includeFitr") : "Include Zakat al-Fitr in my calculation"}</strong>
                <br />
                <span className="text-xs text-rose-600">
                  {isLocal ? biDesc(lang, "includeFitr_desc") : "Approximately $12 USD per person (1 Sa' ≈ 2.5-3kg of staple food)"}
                </span>
              </Label>
            </div>

            {formData.fitrIncluded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3"
              >
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-rose-500" />
                    Number of Family Members
                    {isLocal && <span className="text-xs font-normal text-emerald-600/60">{t(lang, "familyMembers")}</span>}
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.fitrMembers || ""}
                    onChange={(e) => onChange({ fitrMembers: parseInt(e.target.value) || 1 })}
                    placeholder={isLocal ? t(lang, "includingYourself") : "Including yourself"}
                    className="max-w-[200px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    {isLocal ? biDesc(lang, "familyMembers_desc") : "You pay Fitr for yourself and all dependents (spouse, children, parents you support)"}
                  </p>
                </div>

                <div className="rounded-lg bg-rose-50 border border-rose-200 p-3">
                  <p className="text-sm text-rose-800">
                    Fitr for <strong>{formData.fitrMembers}</strong> {formData.fitrMembers === 1 ? "person" : "people"}:
                    {" "}<strong>≈ ${(formData.fitrMembers * 12).toLocaleString()}</strong> USD equivalent
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </SectionCard>
      </motion.div>

      {/* Madhab Selection */}
      <motion.div variants={staggerItem}>
        <SectionCard
          title="School of Thought (Madhab)"
          titleAr={isLocal ? t(lang, "madhab") : "المذهب الفقهي"}
          description={isLocal ? biDesc(lang, "madhab_desc") : "Different schools have slight variations in Zakat rules. Select yours for the most accurate calculation."}
          icon={BookOpen}
          iconColor="text-indigo-600"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MADHABS.map((m) => (
              <button
                key={m.value}
                onClick={() => onChange({ madhab: m.value })}
                className={cn(
                  "rounded-xl border-2 p-4 text-left transition-all",
                  formData.madhab === m.value
                    ? "border-indigo-500 bg-indigo-50 shadow-sm"
                    : "border-muted hover:border-indigo-300"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">{m.label}</span>
                  <span className="font-arabic text-sm text-indigo-400">{m.arabic}</span>
                </div>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
                {m.descLocal && <p className="text-[10px] text-emerald-600/60">{m.descLocal}</p>}
                {formData.madhab === m.value && (
                  <span className="mt-2 inline-block text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                    {isLocal ? t(lang, "selected") : "Selected"}
                  </span>
                )}
              </button>
            ))}
          </div>
        </SectionCard>
      </motion.div>

      {/* Quranic reference */}
      <motion.div variants={staggerItem}>
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
          <p className="text-xs text-emerald-800">
            <strong>Hadith:</strong> Ibn Umar (RA) reported: &quot;The Messenger of Allah (PBUH) made Zakat al-Fitr obligatory - one Sa&apos; of dates or one Sa&apos; of barley - on every Muslim, free or slave, male or female, young or old, and he commanded that it be given before people go out to the [Eid] prayer.&quot; (Sahih al-Bukhari 1503)
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
