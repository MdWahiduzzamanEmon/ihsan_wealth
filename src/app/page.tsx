"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";
import { getLangFromCountry, type TransLang } from "@/lib/islamic-content";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BismillahBanner } from "@/components/islamic/bismillah-banner";
import { HadithDuasSection } from "@/components/islamic/hadith-duas-section";
import { FeaturesGrid } from "@/components/layout/features-grid";
import { HeroSection } from "@/components/home/hero-section";
import { LoggedInDashboard } from "@/components/home/logged-in-dashboard";
import { PWAInstallGuide } from "@/components/home/pwa-install-guide";
import { IhsanAIPromo } from "@/components/home/ihsan-ai-promo";
import { SalatHomeWidget } from "@/components/salat-tracker/salat-home-widget";
import { DonationAppeal } from "@/components/home/donation-appeal";
import { OccasionBanner } from "@/components/home/occasion-banner";
import { AsmaUlHusnaSection } from "@/components/home/asma-ul-husna-section";

export default function Home() {
  const [formData] = useLocalStorage<ZakatFormData>(
    "zakat-calculator-data",
    DEFAULT_FORM_DATA,
  );

  const countryCode = formData.country;
  const lang = getLangFromCountry(countryCode) as TransLang;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20">
      <BismillahBanner countryCode={countryCode} />
      <Header countryCode={countryCode} />
      <main className="flex-1">
        <HeroSection lang={lang} />
        <OccasionBanner lang={lang} countryCode={countryCode} />
        <IhsanAIPromo lang={lang} />
        <SalatHomeWidget />
        <LoggedInDashboard lang={lang} countryCode={countryCode} />

        {/* Decorative separator */}
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex items-center gap-4 my-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
            <div className="font-arabic text-emerald-300/50 text-lg">
              &#10022;
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
          </div>
        </div>

        <FeaturesGrid />
        <AsmaUlHusnaSection lang={lang} />
        <DonationAppeal lang={lang} />
        <HadithDuasSection countryCode={countryCode} />
        <PWAInstallGuide lang={lang} />
      </main>
      <Footer countryCode={countryCode} />
    </div>
  );
}
