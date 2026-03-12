"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { GRID_FEATURES, FEATURES_GRID_TEXTS } from "@/lib/app-features";
import { getLangFromCountry, type TransLang } from "@/lib/islamic-content";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export function FeaturesGrid() {
  const [formData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);
  const lang = getLangFromCountry(formData.country) as TransLang;
  const t = FEATURES_GRID_TEXTS[lang];

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      {/* Section Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 mb-3">
          <span className="font-arabic text-amber-600/60 text-xs">{t.bismillah}</span>
          <div className="h-3 w-px bg-emerald-200" />
          <span className="text-[10px] font-medium text-emerald-600 tracking-wide uppercase">IhsanWealth</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {t.title}{" "}
          <span className="bg-gradient-to-r from-emerald-700 to-emerald-600 bg-clip-text text-transparent">{t.titleHighlight}</span>{" "}
          Companion
        </h2>
        <p className="text-xs text-gray-500 mt-2 max-w-lg mx-auto px-2 leading-relaxed">
          {t.subtitle}
        </p>
        {/* Decorative line */}
        <div className="flex items-center gap-3 justify-center mt-4">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-300/50" />
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400/40" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-300/50" />
        </div>
      </div>

      {/* Features Grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {GRID_FEATURES.map(({ href, icon: Icon, label, arabic, description, color, iconBg }) => (
          <motion.div key={href} variants={itemVariants}>
            <Link href={href} className="group block h-full">
              <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-3.5 sm:p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                {/* Gradient accent */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Decorative corner pattern */}
                <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative flex flex-col h-full">
                  {/* Icon + Arabic */}
                  <div className="flex items-start justify-between mb-2.5">
                    <div className={`rounded-lg p-2 ${iconBg} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-arabic text-[10px] text-gray-300 group-hover:text-gray-400 transition-colors mt-1">{arabic}</span>
                  </div>

                  {/* Label */}
                  <h3 className="font-semibold text-gray-900 text-[13px] group-hover:text-emerald-700 transition-colors leading-tight">
                    {label[lang]}
                  </h3>

                  {/* Description */}
                  <p className="text-[10px] text-gray-400 leading-relaxed mt-1 flex-1 line-clamp-2">
                    {description[lang]}
                  </p>

                  {/* Arrow indicator */}
                  <div className="flex justify-end mt-2">
                    <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
