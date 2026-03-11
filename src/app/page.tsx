"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CalculatorWizard } from "@/components/calculator/calculator-wizard";
import { BismillahBanner } from "@/components/islamic/bismillah-banner";
import { HadithDuasSection } from "@/components/islamic/hadith-duas-section";
import { FeaturesGrid } from "@/components/layout/features-grid";

export default function Home() {
  const [formData] = useLocalStorage<ZakatFormData>(
    "zakat-calculator-data",
    DEFAULT_FORM_DATA
  );

  const countryCode = formData.country;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20">
      <BismillahBanner countryCode={countryCode} />
      <Header countryCode={countryCode} />
      <main className="flex-1">
        <CalculatorWizard />

        {/* Decorative separator */}
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex items-center gap-4 my-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
            <div className="font-arabic text-emerald-300/50 text-lg">&#10022;</div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
          </div>
        </div>

        {/* Features Grid */}
        <FeaturesGrid />

        <HadithDuasSection countryCode={countryCode} />
      </main>
      <Footer countryCode={countryCode} />
    </div>
  );
}
