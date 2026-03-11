"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChatPanel } from "@/components/chat/chat-panel";
import { getLangFromCountry, type TransLang } from "@/lib/islamic-content";
import { buildZakatSummary } from "@/lib/chat/build-zakat-summary";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_FORM_DATA, type ZakatFormData } from "@/types/zakat";

export default function AssistantPage() {
  const [formData] = useLocalStorage<ZakatFormData>("zakat-calculator-data", DEFAULT_FORM_DATA);
  const lang = getLangFromCountry(formData.country) as TransLang;
  const zakatSummary = buildZakatSummary(formData);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/30 via-white to-amber-50/20">
      <Header countryCode={formData.country} />
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-6">
        <div className="rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          <ChatPanel lang={lang} zakatSummary={zakatSummary} fullPage />
        </div>
      </main>
      <Footer countryCode={formData.country} />
    </div>
  );
}
