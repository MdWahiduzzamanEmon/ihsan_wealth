"use client";

import { useState, useRef, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { X, type LucideIcon } from "lucide-react";

interface CurrencyInputProps {
  label: string;
  labelLocal?: string;
  value: number;
  onValueChange: (value: number) => void;
  icon?: LucideIcon;
  description?: string;
  descriptionLocal?: string;
  currencySymbol: string;
  placeholder?: string;
}

function formatNumber(num: number, currencySymbol: string): string {
  if (!num) return "";
  // Use locale formatting with commas
  const formatted = num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return formatted;
}

export function CurrencyInput({
  label,
  labelLocal,
  value,
  onValueChange,
  icon: Icon,
  description,
  descriptionLocal,
  currencySymbol,
  placeholder = "0.00",
}: CurrencyInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [rawInput, setRawInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const hasValue = value > 0;

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    // Show raw number for editing
    setRawInput(value ? String(value) : "");
  }, [value]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    const parsed = parseFloat(rawInput) || 0;
    onValueChange(parsed);
  }, [rawInput, onValueChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow only numbers, dots, and empty string
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      setRawInput(val);
      onValueChange(parseFloat(val) || 0);
    }
  }, [onValueChange]);

  const handleClear = useCallback(() => {
    onValueChange(0);
    setRawInput("");
    inputRef.current?.focus();
  }, [onValueChange]);

  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {Icon && (
          <span className={`flex h-5 w-5 items-center justify-center rounded-md ${hasValue ? "bg-emerald-100" : "bg-gray-100"} transition-colors`}>
            <Icon className={`h-3.5 w-3.5 ${hasValue ? "text-emerald-600" : "text-gray-400"} transition-colors`} />
          </span>
        )}
        <span>{label}</span>
        {labelLocal && (
          <span className="text-xs font-normal text-emerald-600/60">{labelLocal}</span>
        )}
      </Label>

      <div
        className={`
          relative flex items-center rounded-xl border-2 bg-white transition-all duration-200
          ${isFocused
            ? "border-emerald-500 ring-4 ring-emerald-500/10 shadow-sm"
            : hasValue
              ? "border-emerald-200 bg-emerald-50/30"
              : "border-gray-200 hover:border-gray-300"
          }
        `}
      >
        {/* Currency symbol */}
        <span className={`
          flex-shrink-0 pl-4 pr-1 text-sm font-semibold select-none
          ${isFocused ? "text-emerald-600" : hasValue ? "text-emerald-500" : "text-gray-400"}
          transition-colors
        `}>
          {currencySymbol}
        </span>

        {/* Input / Display */}
        {isFocused ? (
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={rawInput}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="
              flex-1 h-12 bg-transparent text-base font-medium text-gray-900
              placeholder:text-gray-300 outline-none
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
            "
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsFocused(true);
              setRawInput(value ? String(value) : "");
              // Focus after state update
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
            className={`
              flex-1 h-12 text-left text-base font-medium outline-none cursor-text
              ${hasValue ? "text-gray-900" : "text-gray-300"}
            `}
          >
            {hasValue ? formatNumber(value, currencySymbol) : placeholder}
          </button>
        )}

        {/* Hidden input for focus management */}
        {!isFocused && (
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            className="absolute inset-0 opacity-0 cursor-text"
            onFocus={handleFocus}
            tabIndex={-1}
            readOnly
          />
        )}

        {/* Clear button */}
        {hasValue && !isFocused && (
          <button
            type="button"
            onClick={handleClear}
            className="flex-shrink-0 mr-2 p-1 rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
            aria-label="Clear"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Value indicator dot */}
        {hasValue && !isFocused && (
          <span className="flex-shrink-0 mr-3 h-2 w-2 rounded-full bg-emerald-400" />
        )}
      </div>

      {(descriptionLocal || description) && (
        <p className="text-xs text-gray-400 pl-1">{descriptionLocal || description}</p>
      )}
    </div>
  );
}
