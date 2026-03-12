"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Printer, FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ZakatCertificate, exportCertificateAsImage, type CertificateData } from "./zakat-certificate";
import { getLocalDateStr } from "@/lib/date-utils";

interface CertificatePreviewModalProps {
  open: boolean;
  onClose: () => void;
  result: CertificateData;
  currency: string;
  nisabBasis: "gold" | "silver";
  countryCode: string;
  calculatedDate?: string;
  year?: number;
  elementId?: string;
}

export function CertificatePreviewModal({
  open,
  onClose,
  result,
  currency,
  nisabBasis,
  countryCode,
  calculatedDate,
  year,
  elementId = "zakat-certificate",
}: CertificatePreviewModalProps) {
  const [exporting, setExporting] = useState(false);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleDownload = useCallback(async () => {
    setExporting(true);
    try {
      const filename = `Zakat-Report-${year || getLocalDateStr()}.png`;
      await exportCertificateAsImage(elementId, filename);
    } finally {
      setExporting(false);
    }
  }, [elementId, year]);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm no-print"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex flex-col"
          >
            {/* Top toolbar - hidden in print */}
            <div className="no-print shrink-0 flex items-center justify-between bg-emerald-900 px-4 py-3 shadow-lg">
              <div className="flex items-center gap-2">
                <h2 className="text-white text-sm font-semibold">Zakat Certificate Preview</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handlePrint}
                  className="text-white hover:bg-white/10 gap-1.5"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDownload}
                  disabled={exporting}
                  className="text-white hover:bg-white/10 gap-1.5"
                >
                  {exporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileDown className="h-4 w-4" />
                  )}
                  {exporting ? "Exporting..." : "Download PNG"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onClose}
                  className="text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Certificate scroll area */}
            <div className="flex-1 overflow-auto bg-gray-200 flex justify-center py-6 px-4">
              <div className="print-certificate-wrapper" style={{ position: "relative", left: "auto" }}>
                <ZakatCertificate
                  elementId={elementId}
                  result={result}
                  currency={currency}
                  nisabBasis={nisabBasis}
                  countryCode={countryCode}
                  calculatedDate={calculatedDate}
                  year={year}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
