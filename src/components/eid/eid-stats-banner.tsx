"use client";

import { motion } from "framer-motion";
import { Download, Share2, MessageCircle, Users, Sticker, ImagePlus, BarChart3 } from "lucide-react";
import type { EidGlobalStats } from "@/hooks/use-eid-stats";
import type { EidAction } from "@/hooks/use-eid-stats";
import { EID_PAGE_TEXTS } from "@/lib/eid-content";
import type { TransLang } from "@/lib/islamic-content";

interface EidStatsBannerProps {
  lang: TransLang;
  globalStats: EidGlobalStats;
  myStats: Record<EidAction, number>;
  isAuthenticated: boolean;
}

const STATS_TEXTS: Record<TransLang, {
  communityStats: string;
  yourStats: string;
  downloads: string;
  shares: string;
  whatsapp: string;
  stickers: string;
  frames: string;
  users: string;
}> = {
  en: { communityStats: "Community Stats", yourStats: "Your Activity", downloads: "Downloads", shares: "Shares", whatsapp: "WhatsApp", stickers: "Stickers", frames: "Frames", users: "Users" },
  bn: { communityStats: "কমিউনিটি পরিসংখ্যান", yourStats: "আপনার কার্যকলাপ", downloads: "ডাউনলোড", shares: "শেয়ার", whatsapp: "হোয়াটসঅ্যাপ", stickers: "স্টিকার", frames: "ফ্রেম", users: "ব্যবহারকারী" },
  ur: { communityStats: "کمیونٹی اعداد", yourStats: "آپ کی سرگرمی", downloads: "ڈاؤنلوڈ", shares: "شیئرز", whatsapp: "واٹس ایپ", stickers: "سٹیکرز", frames: "فریمز", users: "صارفین" },
  ar: { communityStats: "إحصائيات المجتمع", yourStats: "نشاطك", downloads: "تحميلات", shares: "مشاركات", whatsapp: "واتساب", stickers: "ملصقات", frames: "إطارات", users: "مستخدمين" },
  tr: { communityStats: "Topluluk İstatistikleri", yourStats: "Aktiviteniz", downloads: "İndirmeler", shares: "Paylaşımlar", whatsapp: "WhatsApp", stickers: "Çıkartmalar", frames: "Çerçeveler", users: "Kullanıcılar" },
  ms: { communityStats: "Statistik Komuniti", yourStats: "Aktiviti Anda", downloads: "Muat Turun", shares: "Perkongsian", whatsapp: "WhatsApp", stickers: "Pelekat", frames: "Bingkai", users: "Pengguna" },
  id: { communityStats: "Statistik Komunitas", yourStats: "Aktivitas Anda", downloads: "Unduhan", shares: "Bagikan", whatsapp: "WhatsApp", stickers: "Stiker", frames: "Bingkai", users: "Pengguna" },
};

function StatBox({ icon: Icon, value, label, color }: { icon: React.ElementType; value: number; label: string; color: string }) {
  return (
    <div className="text-center">
      <div className={`mx-auto h-9 w-9 rounded-lg ${color} flex items-center justify-center mb-1`}>
        <Icon className="h-4 w-4" />
      </div>
      <motion.p
        key={value}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="text-lg font-bold text-gray-800"
      >
        {value.toLocaleString()}
      </motion.p>
      <p className="text-[10px] text-gray-500">{label}</p>
    </div>
  );
}

export function EidStatsBanner({ lang, globalStats, myStats, isAuthenticated }: EidStatsBannerProps) {
  const st = STATS_TEXTS[lang];
  const isRTL = lang === "ar" || lang === "ur";

  const hasGlobalActivity = globalStats.total_actions > 0;
  const myTotal = Object.values(myStats).reduce((s, v) => s + v, 0);

  if (!hasGlobalActivity && myTotal === 0) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 mt-4" dir={isRTL ? "rtl" : undefined}>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Global Stats */}
        {hasGlobalActivity && (
          <div className="p-4 pb-3">
            <h3 className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" />
              {st.communityStats}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              <StatBox icon={Download} value={globalStats.total_downloads} label={st.downloads} color="bg-emerald-100 text-emerald-600" />
              <StatBox icon={Share2} value={globalStats.total_shares} label={st.shares} color="bg-blue-100 text-blue-600" />
              <StatBox icon={MessageCircle} value={globalStats.total_whatsapp} label={st.whatsapp} color="bg-green-100 text-green-600" />
              <StatBox icon={Sticker} value={globalStats.total_stickers} label={st.stickers} color="bg-violet-100 text-violet-600" />
              <StatBox icon={ImagePlus} value={globalStats.total_frames} label={st.frames} color="bg-rose-100 text-rose-600" />
              <StatBox icon={Users} value={globalStats.unique_users} label={st.users} color="bg-amber-100 text-amber-600" />
            </div>
          </div>
        )}

        {/* My Stats — only if logged in and has activity */}
        {isAuthenticated && myTotal > 0 && (
          <>
            <div className="h-px bg-gray-100" />
            <div className="p-4 pt-3 bg-emerald-50/30">
              <h3 className="text-xs font-semibold text-emerald-700 mb-3 flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5" />
                {st.yourStats}
              </h3>
              <div className="flex flex-wrap gap-4 justify-center">
                {myStats.download > 0 && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Download className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="font-bold text-gray-800">{myStats.download}</span>
                    <span className="text-gray-500 text-xs">{st.downloads}</span>
                  </div>
                )}
                {myStats.share > 0 && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Share2 className="h-3.5 w-3.5 text-blue-600" />
                    <span className="font-bold text-gray-800">{myStats.share}</span>
                    <span className="text-gray-500 text-xs">{st.shares}</span>
                  </div>
                )}
                {myStats.whatsapp > 0 && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <MessageCircle className="h-3.5 w-3.5 text-green-600" />
                    <span className="font-bold text-gray-800">{myStats.whatsapp}</span>
                    <span className="text-gray-500 text-xs">{st.whatsapp}</span>
                  </div>
                )}
                {myStats.sticker_download > 0 && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Sticker className="h-3.5 w-3.5 text-violet-600" />
                    <span className="font-bold text-gray-800">{myStats.sticker_download}</span>
                    <span className="text-gray-500 text-xs">{st.stickers}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
