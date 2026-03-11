"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LucideIcon } from "lucide-react";

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
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-sm font-medium">
        {Icon && <Icon className="h-4 w-4 text-emerald-600" />}
        {label}
        {labelLocal && (
          <span className="text-xs font-normal text-emerald-600/60">{labelLocal}</span>
        )}
      </Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
          {currencySymbol}
        </span>
        <Input
          type="number"
          min="0"
          step="0.01"
          value={value || ""}
          onChange={(e) => onValueChange(parseFloat(e.target.value) || 0)}
          placeholder={placeholder}
          className="pl-8 h-11 text-base"
        />
      </div>
      {(descriptionLocal || description) && (
        <p className="text-xs text-muted-foreground">{descriptionLocal || description}</p>
      )}
    </div>
  );
}
