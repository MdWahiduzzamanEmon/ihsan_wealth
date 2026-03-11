"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calculator,
  Clock,
  Compass,
  BookOpen,
  CalendarDays,
  Heart,
  History,
} from "lucide-react";

const FEATURES = [
  {
    href: "/",
    icon: Calculator,
    title: "Zakat Calculator",
    arabic: "حاسبة الزكاة",
    description: "Calculate your Zakat with live gold & silver prices, multiple asset types, and Madhab support",
    color: "from-emerald-500 to-emerald-700",
    iconBg: "bg-emerald-100 text-emerald-700",
  },
  {
    href: "/prayer-times",
    icon: Clock,
    title: "Prayer Times",
    arabic: "مواقيت الصلاة",
    description: "Accurate prayer times based on your location with live countdown to next prayer",
    color: "from-blue-500 to-blue-700",
    iconBg: "bg-blue-100 text-blue-700",
  },
  {
    href: "/qibla",
    icon: Compass,
    title: "Qibla Finder",
    arabic: "اتجاه القبلة",
    description: "Find the direction of the Kaaba with an interactive compass and GPS",
    color: "from-amber-500 to-amber-700",
    iconBg: "bg-amber-100 text-amber-700",
  },
  {
    href: "/duas",
    icon: BookOpen,
    title: "Duas Collection",
    arabic: "مجموعة الأدعية",
    description: "30+ essential daily duas with Arabic, transliteration, and translation",
    color: "from-purple-500 to-purple-700",
    iconBg: "bg-purple-100 text-purple-700",
  },
  {
    href: "/calendar",
    icon: CalendarDays,
    title: "Hijri Calendar",
    arabic: "التقويم الهجري",
    description: "Islamic calendar with events, date converter, and important dates highlighted",
    color: "from-teal-500 to-teal-700",
    iconBg: "bg-teal-100 text-teal-700",
  },
  {
    href: "/sadaqah",
    icon: Heart,
    title: "Sadaqah Tracker",
    arabic: "متتبع الصدقة",
    description: "Track your voluntary charity donations with categories and monthly analytics",
    color: "from-rose-500 to-rose-700",
    iconBg: "bg-rose-100 text-rose-700",
  },
  {
    href: "/history",
    icon: History,
    title: "Zakat History",
    arabic: "سجل الزكاة",
    description: "View your past Zakat calculations, compare years, and track payments",
    color: "from-slate-500 to-slate-700",
    iconBg: "bg-slate-100 text-slate-700",
  },
];

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
  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      {/* Section Header */}
      <div className="text-center mb-6 sm:mb-8">
        <p className="font-arabic text-amber-600/60 text-base sm:text-lg mb-1">بِسْمِ اللَّهِ توكلنا</p>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Your Complete <span className="text-emerald-700">Islamic</span> Companion
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1.5 max-w-md mx-auto px-2">
          All the tools a Muslim needs — Zakat, Prayer, Qibla, Duas, Calendar, and more. No login required.
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
        {FEATURES.map(({ href, icon: Icon, title, arabic, description, color, iconBg }) => (
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
                        {title}
                      </h3>
                      <span className="font-arabic text-xs text-gray-400">{arabic}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {description}
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
