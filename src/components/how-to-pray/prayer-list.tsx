"use client";

import { motion } from "framer-motion";
import type { TransLang } from "@/lib/islamic-content";
import type { PrayerInfo } from "@/lib/how-to-pray-data";
import { staggerContainer } from "@/lib/animations";
import { PrayerCard } from "./prayer-card";

interface PrayerListProps {
  title: string;
  prayers: PrayerInfo[];
  lang: TransLang;
  isRtl: boolean;
}

export function PrayerList({ title, prayers, lang, isRtl }: PrayerListProps) {
  if (prayers.length === 0) return null;

  return (
    <section className="mx-auto max-w-4xl px-4 pt-8 sm:pt-10">
      <h2
        className="text-xl font-bold text-emerald-900 mb-4"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {title}
      </h2>
      <motion.div
        className="space-y-4"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-50px" }}
      >
        {prayers.map((prayer) => (
          <PrayerCard key={prayer.id} prayer={prayer} lang={lang} isRtl={isRtl} />
        ))}
      </motion.div>
    </section>
  );
}
