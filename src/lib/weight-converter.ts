import type { WeightUnit, GoldKarat } from "@/types/zakat";
import { GRAMS_PER_OUNCE, GRAMS_PER_TOLA } from "@/lib/constants";

export function toGrams(weight: number, unit: WeightUnit): number {
  switch (unit) {
    case "gram":
      return weight;
    case "tola":
      return weight * GRAMS_PER_TOLA;
    case "ounce":
      return weight * GRAMS_PER_OUNCE;
  }
}

export function fromGrams(grams: number, unit: WeightUnit): number {
  switch (unit) {
    case "gram":
      return grams;
    case "tola":
      return grams / GRAMS_PER_TOLA;
    case "ounce":
      return grams / GRAMS_PER_OUNCE;
  }
}

export function karatPurity(karat: GoldKarat): number {
  return karat / 24;
}
