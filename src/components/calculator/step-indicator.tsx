"use client";

import { motion } from "framer-motion";
import { STEP_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Mobile: simple text + progress bar */}
      <div className="flex items-center justify-between md:hidden px-1">
        <span className="text-sm font-medium text-emerald-700">
          Step {currentStep + 1} of {STEP_LABELS.length}
        </span>
        <span className="text-sm font-semibold text-foreground">
          {STEP_LABELS[currentStep]}
        </span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-muted md:hidden overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500"
          initial={false}
          animate={{ width: `${((currentStep + 1) / STEP_LABELS.length) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Desktop: full step indicator */}
      <div className="hidden md:flex items-center justify-between">
        {STEP_LABELS.map((label, index) => (
          <div key={label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold",
                  index < currentStep &&
                    "border-emerald-600 bg-emerald-600 text-white",
                  index === currentStep &&
                    "border-emerald-600 bg-emerald-50 text-emerald-700",
                  index > currentStep &&
                    "border-muted-foreground/30 text-muted-foreground/50"
                )}
                animate={index === currentStep ? {
                  boxShadow: [
                    "0 0 0 0px rgba(16,185,129,0.2)",
                    "0 0 0 6px rgba(16,185,129,0.15)",
                    "0 0 0 0px rgba(16,185,129,0.2)",
                  ],
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {index < currentStep ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Check className="h-4 w-4" />
                  </motion.div>
                ) : (
                  index + 1
                )}
              </motion.div>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  index <= currentStep
                    ? "text-emerald-700"
                    : "text-muted-foreground/50"
                )}
              >
                {label}
              </span>
            </div>
            {index < STEP_LABELS.length - 1 && (
              <div className="mx-2 h-0.5 flex-1 bg-muted overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500"
                  initial={false}
                  animate={{ width: index < currentStep ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
