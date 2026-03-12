"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useMetalPrices } from "@/hooks/use-metal-prices";
import { useGeolocation } from "@/hooks/use-geolocation";
import { calculateZakat } from "@/lib/zakat-calculator";
import { COUNTRIES, STEP_LABELS } from "@/lib/constants";
import { DEFAULT_FORM_DATA, type ZakatFormData, type ZakatResult } from "@/types/zakat";
import { getLangFromCountry } from "@/lib/islamic-content";
import { t } from "@/lib/form-translations";
import { PageTransition } from "@/components/ui/custom/page-transition";
import { StepIndicator } from "./step-indicator";
import { CountryStep } from "./steps/country-step";
import { CashStep } from "./steps/cash-step";
import { GoldSilverStep } from "./steps/gold-silver-step";
import { InvestmentsStep } from "./steps/investments-step";
import { BusinessStep } from "./steps/business-step";
import { PropertyStep } from "./steps/property-step";
import { LoansDebtsStep } from "./steps/loans-debts-step";
import { AgricultureStep } from "./steps/agriculture-step";
import { FitrSettingsStep } from "./steps/fitr-settings-step";
import { SummaryDashboard } from "@/components/dashboard/summary-dashboard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calculator } from "lucide-react";
import { fadeIn } from "@/lib/animations";

export function CalculatorWizard() {
  const [formData, setFormData, isLoaded] = useLocalStorage<ZakatFormData>(
    "zakat-calculator-data",
    DEFAULT_FORM_DATA
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const hasAutoSelected = useRef(false);

  const { prices, loading: pricesLoading, error: pricesError, refetch } = useMetalPrices(formData.currency);
  const { detectedCountry, detectedCurrency, loading: geoLoading } = useGeolocation();

  useEffect(() => {
    if (
      !geoLoading &&
      detectedCountry &&
      detectedCurrency &&
      isLoaded &&
      !hasAutoSelected.current
    ) {
      hasAutoSelected.current = true;
      if (formData.country === "US" && formData.currency === "USD") {
        const supported = COUNTRIES.find((c) => c.code === detectedCountry);
        if (supported) {
          setFormData((prev) => ({
            ...prev,
            country: detectedCountry,
            currency: detectedCurrency,
          }));
        }
      }
    }
  }, [geoLoading, detectedCountry, detectedCurrency, isLoaded, formData.country, formData.currency, setFormData]);

  const country = COUNTRIES.find((c) => c.code === formData.country);
  const currencySymbol = country?.currencySymbol || "$";
  const lang = getLangFromCountry(formData.country);

  const handleChange = useCallback(
    (updates: Partial<ZakatFormData>) => {
      setFormData((prev) => ({ ...prev, ...updates }));
    },
    [setFormData]
  );

  const result: ZakatResult | null = useMemo(() => {
    if (!showResults || !prices) return null;
    return calculateZakat(formData, prices.goldPricePerGram, prices.silverPricePerGram);
  }, [showResults, formData, prices]);

  const totalSteps = STEP_LABELS.length;
  const isLastStep = currentStep === totalSteps - 2;
  const isSummary = currentStep === totalSteps - 1;

  const scrollToTop = () => {
    const wizardEl = document.getElementById("calculator-wizard-top");
    if (wizardEl) {
      wizardEl.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    setDirection("right");
    if (isLastStep) {
      setShowResults(true);
      setCurrentStep(totalSteps - 1);
    } else {
      setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));
    }
    scrollToTop();
  };

  const handlePrev = () => {
    setDirection("left");
    if (isSummary) {
      setShowResults(false);
      setCurrentStep(totalSteps - 2);
    } else {
      setCurrentStep((s) => Math.max(s - 1, 0));
    }
    scrollToTop();
  };

  const handleReset = () => {
    setFormData({ ...DEFAULT_FORM_DATA, country: formData.country, currency: formData.currency });
    setShowResults(false);
    setCurrentStep(0);
    scrollToTop();
  };

  const handleRecalculate = () => {
    setShowResults(false);
    setCurrentStep(0);
    scrollToTop();
  };

  if (!isLoaded) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-20 gap-3"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        <p className="font-arabic text-lg text-emerald-600/50">جاري التحميل...</p>
        <p className="text-xs text-muted-foreground">Loading your data...</p>
      </motion.div>
    );
  }

  const stepContent = showResults && result ? (
    <SummaryDashboard
      result={result}
      currency={formData.currency}
      nisabBasis={formData.nisabBasis}
      countryCode={formData.country}
      onReset={handleReset}
      onRecalculate={handleRecalculate}
      formData={formData}
      prices={prices}
    />
  ) : (
    <>
      {currentStep === 0 && (
        <CountryStep
          formData={formData}
          onChange={handleChange}
          prices={prices}
          pricesLoading={pricesLoading}
          detectedCountry={detectedCountry}
          lang={lang}
        />
      )}
      {currentStep === 1 && (
        <CashStep formData={formData} onChange={handleChange} currencySymbol={currencySymbol} lang={lang} />
      )}
      {currentStep === 2 && (
        <GoldSilverStep formData={formData} onChange={handleChange} prices={prices} lang={lang} />
      )}
      {currentStep === 3 && (
        <InvestmentsStep formData={formData} onChange={handleChange} currencySymbol={currencySymbol} lang={lang} />
      )}
      {currentStep === 4 && (
        <BusinessStep formData={formData} onChange={handleChange} currencySymbol={currencySymbol} lang={lang} />
      )}
      {currentStep === 5 && (
        <PropertyStep formData={formData} onChange={handleChange} currencySymbol={currencySymbol} lang={lang} />
      )}
      {currentStep === 6 && (
        <AgricultureStep formData={formData} onChange={handleChange} currencySymbol={currencySymbol} lang={lang} />
      )}
      {currentStep === 7 && (
        <LoansDebtsStep formData={formData} onChange={handleChange} currencySymbol={currencySymbol} lang={lang} />
      )}
      {currentStep === 8 && (
        <FitrSettingsStep formData={formData} onChange={handleChange} currencySymbol={currencySymbol} lang={lang} />
      )}
    </>
  );

  return (
    <div id="calculator-wizard-top" className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <StepIndicator currentStep={currentStep} />
      </div>

      {pricesError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <span>{pricesError}</span>
          <button
            onClick={refetch}
            className="ml-3 rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </motion.div>
      )}

      <div className="mb-8">
        <PageTransition
          id={showResults ? "results" : `step-${currentStep}`}
          direction={direction}
        >
          {stepContent}
        </PageTransition>
      </div>

      {!showResults && (
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            {lang !== "en" ? t(lang, "previous") : "Previous"}
          </Button>

          <span className="text-sm text-muted-foreground">
            {lang !== "en" ? `${t(lang, "step")} ${currentStep + 1} ${t(lang, "of")} ${totalSteps}` : `Step ${currentStep + 1} of ${totalSteps}`}
          </span>

          {isLastStep ? (
            <Button
              onClick={handleNext}
              disabled={!prices}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <Calculator className="h-4 w-4" />
              {lang !== "en" ? t(lang, "calculateZakat") : "Calculate Zakat"}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              {lang !== "en" ? t(lang, "next") : "Next"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
}
