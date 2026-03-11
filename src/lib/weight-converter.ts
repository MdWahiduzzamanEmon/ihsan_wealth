import type { WeightUnit, GoldKarat } from "@/types/zakat";

const GRAMS_PER_OUNCE = 31.1035;
const GRAMS_PER_TOLA = 11.6638;

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
