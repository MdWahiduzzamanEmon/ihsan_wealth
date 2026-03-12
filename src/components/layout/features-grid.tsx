"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GRID_FEATURES, FEATURES_GRID_TEXTS } from "@/lib/app-features";
import { getLangFromCountry, type TransLang } from "@/lib/islamic-content";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function FeaturesGrid() {
  const [formData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);
  const lang = getLangFromCountry(formData.country) as TransLang;
  const t = FEATURES_GRID_TEXTS[lang];

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      {/* Section Header */}
      <div className="text-center mb-6 sm:mb-8">
        <p className="font-arabic text-amber-600/60 text-base sm:text-lg mb-1">{t.bismillah}</p>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {t.title} <span className="text-emerald-700">{t.titleHighlight}</span> Companion
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1.5 max-w-md mx-auto px-2">
          {t.subtitle}
        </p>
      </div>

      {/* Features Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {GRID_FEATURES.map(({ href, icon: Icon, label, arabic, description, color, iconBg }) => (
          <motion.div key={href} variants={itemVariants}>
            <Link href={href} className="group block">
              <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 h-full">
                {/* Gradient accent top */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity`} />

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`shrink-0 rounded-lg p-2 sm:p-2.5 ${iconBg} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-emerald-700 transition-colors">
                        {label[lang]}
                      </h3>
                      <span className="font-arabic text-xs text-gray-400">{arabic}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {description[lang]}
                    </p>
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
