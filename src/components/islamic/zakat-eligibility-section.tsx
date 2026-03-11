"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getLangFromCountry } from "@/lib/islamic-content";
import { staggerContainer, staggerItem } from "@/lib/animations";
import {
  Users,
  HandHeart,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  BookOpen,
  Scale,
} from "lucide-react";

/* ─── Who Can RECEIVE Zakat (8 categories from Quran 9:60) ─── */
const ZAKAT_RECIPIENTS = [
  {
    arabic: "الفقراء",
    name: "Al-Fuqara (The Poor)",
    color: "#10b981",
    icon: "🤲",
    description:
      "Those who do not have enough to meet their basic needs — food, clothing, and shelter. They have little or no income and live below the poverty line.",
    canReceive: [
      "Cannot afford basic necessities (food, shelter, clothing)",
      "Income is far below the nisab threshold",
      "Unable to earn due to disability, old age, or illness",
    ],
    cannotReceive: [
      "Owns wealth above the nisab threshold",
      "Has sufficient income to cover basic needs",
    ],
  },
  {
    arabic: "المساكين",
    name: "Al-Masakin (The Needy)",
    color: "#3b82f6",
    icon: "🏚️",
    description:
      "Those who have some income but it is not sufficient to meet all their basic needs. They may have a job but still struggle to make ends meet.",
    canReceive: [
      "Has some income but not enough for basic needs",
      "Struggles to pay rent, food, or medical bills",
      "Earning is insufficient to maintain a dignified life",
    ],
    cannotReceive: [
      "Owns wealth above nisab",
      "Can comfortably meet all basic needs",
    ],
  },
  {
    arabic: "العاملين عليها",
    name: "Amil Zakat (Zakat Collectors)",
    color: "#8b5cf6",
    icon: "📋",
    description:
      "Those employed to collect, manage, and distribute Zakat. This includes administrators, accountants, and field workers involved in Zakat operations.",
    canReceive: [
      "Appointed by an Islamic authority to collect Zakat",
      "Works in Zakat distribution and management",
      "Compensation for their service in Zakat administration",
    ],
    cannotReceive: [
      "Self-appointed without authority",
      "Already receiving adequate salary from other sources for this work",
    ],
  },
  {
    arabic: "المؤلفة قلوبهم",
    name: "Al-Mu'allafatu Qulubuhum (New Muslims / Hearts to be Reconciled)",
    color: "#f59e0b",
    icon: "💛",
    description:
      "New converts to Islam who may need financial support, or those whose hearts are inclined towards Islam and need encouragement.",
    canReceive: [
      "Recently accepted Islam and needs financial support",
      "Facing hardship due to converting (lost family support, job, etc.)",
      "Someone whose heart is inclined towards Islam",
    ],
    cannotReceive: [
      "Wealthy new Muslims who don't need support",
      "Those using it for insincere purposes",
    ],
  },
  {
    arabic: "في الرقاب",
    name: "Ar-Riqab (Freeing Captives / Slaves)",
    color: "#ef4444",
    icon: "⛓️",
    description:
      "Historically for freeing slaves. In modern context, scholars extend this to helping those in bondage-like situations — human trafficking victims, bonded laborers, or those imprisoned unjustly.",
    canReceive: [
      "Victims of human trafficking",
      "Bonded laborers seeking freedom",
      "Those unjustly imprisoned who need bail/legal help",
    ],
    cannotReceive: [
      "Criminals justly imprisoned",
      "Those not in any form of bondage",
    ],
  },
  {
    arabic: "الغارمين",
    name: "Al-Gharimin (Those in Debt)",
    color: "#06b6d4",
    icon: "📊",
    description:
      "Those who are in debt and cannot repay it. The debt must have been incurred for a permissible (halal) purpose, and they genuinely cannot pay it off.",
    canReceive: [
      "In debt for basic needs (medical, housing, education)",
      "Debt incurred for halal purposes",
      "Unable to repay despite trying",
      "Debt taken to reconcile between people or communities",
    ],
    cannotReceive: [
      "Debt incurred for haram purposes (gambling, alcohol, etc.)",
      "Wealthy person who can pay off their debt",
      "Deliberately avoiding debt repayment",
    ],
  },
  {
    arabic: "في سبيل الله",
    name: "Fi Sabilillah (In the Cause of Allah)",
    color: "#ec4899",
    icon: "🕌",
    description:
      "Those striving in the path of Allah. This includes supporting Islamic education, building mosques, funding da'wah activities, and supporting those who serve the Muslim community.",
    canReceive: [
      "Students of Islamic knowledge who cannot afford education",
      "Da'wah workers and Islamic missionaries",
      "Projects serving the Muslim community",
      "Those defending Muslim rights and interests",
    ],
    cannotReceive: [
      "Wealthy individuals doing voluntary work",
      "Projects with sufficient funding",
    ],
  },
  {
    arabic: "ابن السبيل",
    name: "Ibn As-Sabil (The Stranded Traveler)",
    color: "#84cc16",
    icon: "🧳",
    description:
      "A traveler who is stranded and away from home with no access to their funds, even if they are wealthy back home. The key is they need help to complete their journey.",
    canReceive: [
      "Stranded away from home with no access to funds",
      "Lost money/documents while traveling",
      "Refugee or displaced person in transit",
      "Cannot afford to return home",
    ],
    cannotReceive: [
      "Traveling for haram purposes",
      "Has access to their funds but chooses not to use them",
      "Wealthy traveler with available resources",
    ],
  },
];

/* ─── Who is OBLIGATED to give Zakat ─── */
const ZAKAT_GIVERS_CONDITIONS = [
  {
    icon: "☪️",
    title: "Muslim",
    description: "Zakat is obligatory only upon Muslims. Non-Muslims are not required to pay Zakat.",
  },
  {
    icon: "🧠",
    title: "Sane (Aaqil)",
    description: "The person must be mentally sound. Most scholars agree insane persons are exempt (though some Hanafi scholars differ).",
  },
  {
    icon: "🧑",
    title: "Adult (Baligh)",
    description: "Must have reached the age of puberty. However, Shafi'i and Hanbali scholars say Zakat is due on a minor's wealth too.",
  },
  {
    icon: "💰",
    title: "Possesses Nisab",
    description: "Must own wealth equal to or above the nisab threshold (87.48g of gold or 612.36g of silver equivalent).",
  },
  {
    icon: "📅",
    title: "One Lunar Year (Hawl)",
    description: "The wealth must have been held for one complete lunar year (354 days). Agricultural produce is exempt from this condition.",
  },
  {
    icon: "✅",
    title: "Full Ownership",
    description: "Must have full and complete ownership of the wealth. Shared or disputed assets may have different rulings.",
  },
];

/* ─── Who CANNOT receive Zakat ─── */
const CANNOT_RECEIVE = [
  { text: "The wealthy (those above nisab)", icon: XCircle },
  { text: "Non-Muslims (for Zakat specifically; Sadaqah can be given to anyone)", icon: XCircle },
  { text: "Direct family: parents, grandparents, children, grandchildren", icon: XCircle },
  { text: "Spouse (husband or wife)", icon: XCircle },
  { text: "Descendants of Prophet Muhammad ﷺ (Banu Hashim)", icon: XCircle },
];

interface ZakatEligibilitySectionProps {
  countryCode?: string;
}

export function ZakatEligibilitySection({ countryCode = "US" }: ZakatEligibilitySectionProps) {
  const [activeTab, setActiveTab] = useState<"recipients" | "givers">("recipients");
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const lang = getLangFromCountry(countryCode);

  return (
    <section className="mx-auto max-w-4xl px-3 sm:px-4 py-8 sm:py-10">
      {/* Section Header */}
      <div className="text-center mb-6 sm:mb-8 px-2">
        <p className="font-arabic text-xl sm:text-2xl text-amber-600/80 mb-1">
          أحكام الزكاة
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-emerald-900">
          Zakat Eligibility Guide
        </h2>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          Learn who is obligated to give Zakat and who is eligible to receive it according to the Quran and Sunnah
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-6 px-1">
        <button
          onClick={() => setActiveTab("recipients")}
          className={cn(
            "flex items-center gap-1.5 sm:gap-2 rounded-full px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-medium transition-all",
            activeTab === "recipients"
              ? "bg-emerald-700 text-white shadow-md shadow-emerald-200"
              : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
          )}
        >
          <HandHeart className="h-4 w-4" />
          <span>Who Can Receive</span>
          <span className="font-arabic text-[10px] sm:text-xs opacity-70 hidden sm:inline">مستحقون</span>
        </button>
        <button
          onClick={() => setActiveTab("givers")}
          className={cn(
            "flex items-center gap-1.5 sm:gap-2 rounded-full px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-medium transition-all",
            activeTab === "givers"
              ? "bg-emerald-700 text-white shadow-md shadow-emerald-200"
              : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
          )}
        >
          <Scale className="h-4 w-4" />
          <span>Who Must Give</span>
          <span className="font-arabic text-[10px] sm:text-xs opacity-70 hidden sm:inline">واجب</span>
        </button>
      </div>

      {activeTab === "recipients" ? (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          key="recipients"
        >
          {/* Quran verse reference */}
          <motion.div variants={staggerItem} className="mb-5">
            <div className="rounded-xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 p-4 sm:p-5 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="elig-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#elig-pattern)" />
                </svg>
              </div>
              <div className="relative">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-amber-300" />
                  <span className="text-xs text-emerald-200 font-medium">Surah At-Tawbah 9:60</span>
                </div>
                <p className="font-arabic text-base sm:text-lg leading-[2] text-amber-300/90 mb-2" dir="rtl">
                  إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ وَالْعَامِلِينَ عَلَيْهَا وَالْمُؤَلَّفَةِ قُلُوبُهُمْ وَفِي الرِّقَابِ وَالْغَارِمِينَ وَفِي سَبِيلِ اللَّهِ وَابْنِ السَّبِيلِ
                </p>
                <p className="text-xs text-emerald-100/80 italic max-w-2xl mx-auto">
                  &ldquo;Zakah expenditures are only for the poor and for the needy and for those employed for it and for bringing hearts together and for freeing captives and for those in debt and for the cause of Allah and for the [stranded] traveler — an obligation by Allah. And Allah is Knowing and Wise.&rdquo;
                </p>
              </div>
            </div>
          </motion.div>

          {/* 8 Recipients Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ZAKAT_RECIPIENTS.map((recipient, i) => (
              <motion.div key={i} variants={staggerItem}>
                <Card
                  className={cn(
                    "border-l-4 overflow-hidden cursor-pointer transition-shadow hover:shadow-md",
                    expandedCard === i ? "shadow-md" : ""
                  )}
                  style={{ borderLeftColor: recipient.color }}
                >
                  <CardContent className="p-0">
                    <button
                      onClick={() => setExpandedCard(expandedCard === i ? null : i)}
                      className="w-full text-left p-3 sm:p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{recipient.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-arabic text-sm text-muted-foreground">{recipient.arabic}</span>
                            <span
                              className="inline-block h-2 w-2 rounded-full"
                              style={{ backgroundColor: recipient.color }}
                            />
                          </div>
                          <h3 className="text-sm font-semibold text-emerald-900 leading-tight mt-0.5">
                            {recipient.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {recipient.description}
                          </p>
                        </div>
                        <div className="shrink-0 mt-1">
                          {expandedCard === i ? (
                            <ChevronUp className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </button>

                    {expandedCard === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="border-t border-gray-100 px-3 sm:px-4 pb-3 sm:pb-4 pt-3"
                      >
                        {/* Can receive */}
                        <div className="mb-3">
                          <h4 className="text-xs font-semibold text-emerald-700 mb-1.5 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> Can Receive Zakat If:
                          </h4>
                          <ul className="space-y-1">
                            {recipient.canReceive.map((item, j) => (
                              <li key={j} className="flex items-start gap-2 text-xs text-gray-600">
                                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {/* Cannot receive */}
                        <div>
                          <h4 className="text-xs font-semibold text-red-600 mb-1.5 flex items-center gap-1">
                            <XCircle className="h-3 w-3" /> Cannot Receive If:
                          </h4>
                          <ul className="space-y-1">
                            {recipient.cannotReceive.map((item, j) => (
                              <li key={j} className="flex items-start gap-2 text-xs text-gray-600">
                                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* General exclusions */}
          <motion.div variants={staggerItem} className="mt-5">
            <Card className="border-red-200 bg-red-50/50">
              <CardContent className="p-4 sm:p-5">
                <h3 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Who Cannot Receive Zakat
                </h3>
                <ul className="space-y-2">
                  {CANNOT_RECEIVE.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-red-700/80">
                      <item.icon className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          key="givers"
        >
          {/* Hadith reference */}
          <motion.div variants={staggerItem} className="mb-5">
            <div className="rounded-xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 p-4 sm:p-5 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="giver-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#giver-pattern)" />
                </svg>
              </div>
              <div className="relative">
                <p className="font-arabic text-base sm:text-lg leading-[2] text-amber-300/90 mb-2" dir="rtl">
                  بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ ... وَإِيتَاءِ الزَّكَاةِ
                </p>
                <p className="text-xs text-emerald-100/80 italic">
                  &ldquo;Islam is built upon five pillars... and giving Zakat&rdquo; — Sahih al-Bukhari 8
                </p>
              </div>
            </div>
          </motion.div>

          {/* Conditions grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ZAKAT_GIVERS_CONDITIONS.map((condition, i) => (
              <motion.div key={i} variants={staggerItem}>
                <Card className="border-emerald-100 hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{condition.icon}</span>
                      <div>
                        <h3 className="text-sm font-bold text-emerald-900">{condition.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {condition.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick checklist */}
          <motion.div variants={staggerItem} className="mt-5">
            <Card className="border-emerald-200 bg-emerald-50/50">
              <CardContent className="p-4 sm:p-5">
                <h3 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Quick Self-Check: Is Zakat Obligatory on You?
                </h3>
                <div className="space-y-2">
                  {[
                    "I am a Muslim",
                    "I am sane and have reached puberty",
                    "I own wealth equal to or above the nisab threshold",
                    "I have held this wealth for one lunar year (hawl)",
                    "I have full ownership of this wealth (not shared/disputed)",
                    "My wealth is beyond my basic needs and debts",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-emerald-700">
                      <div className="h-5 w-5 shrink-0 rounded border-2 border-emerald-300 bg-white flex items-center justify-center">
                        <span className="text-[10px] text-emerald-500 font-bold">{i + 1}</span>
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-emerald-600/80 italic">
                  If all conditions above apply to you, then Zakat is obligatory (fard) upon you. Use our calculator to determine your exact amount.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
