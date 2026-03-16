"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChatPanel } from "@/components/chat/chat-panel";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { getLangFromCountry, type TransLang } from "@/lib/islamic-content";
import { buildZakatSummary } from "@/lib/chat/build-zakat-summary";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";
import type { ChatFeature } from "@/types/chat";
import { useMetalPrices } from "@/hooks/use-metal-prices";
import { LANG_TO_CURRENCY } from "@/lib/chat/constants";

export default function AssistantPage() {
  const [formData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);
  const lang = getLangFromCountry(formData.country) as TransLang;
  const zakatSummary = buildZakatSummary(formData);
  const [feature, setFeature] = useState<ChatFeature>("islamic-qa");
  const currency = LANG_TO_CURRENCY[lang] || "BDT";
  const { prices: metalPrices } = useMetalPrices(currency);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20">
      <Header countryCode={formData.country} />
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-6">
        <div className="rounded-2xl border border-gray-200 shadow-lg overflow-hidden flex">
          {/* Desktop sidebar — hidden on mobile */}
          <ChatSidebar
            lang={lang}
            activeFeature={feature}
            onFeatureChange={setFeature}
          />
          {/* Chat panel — flex-1 */}
          <div className="flex-1 min-w-0">
            <ChatPanel
              lang={lang}
              zakatSummary={zakatSummary}
              metalPrices={metalPrices}
              fullPage
              externalFeature={feature}
              onFeatureChange={setFeature}
            />
          </div>
        </div>
      </main>
      <Footer countryCode={formData.country} />
    </div>
  );
}
