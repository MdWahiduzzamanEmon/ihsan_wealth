/**
 * Shared voice selection utility for consistent, high-quality TTS across the app.
 * Prefers male, premium, Google voices to sound more like a proper qari/reciter.
 */

// Map app language codes to BCP-47 speech tags
export const LANG_TO_SPEECH: Record<string, string> = {
  en: "en-US",
  bn: "bn-BD",
  ur: "ur-PK",
  ar: "ar-SA",
  tr: "tr-TR",
  ms: "ms-MY",
  id: "id-ID",
};

// Cache resolved voices per language to avoid repeated lookups
const voiceCache = new Map<string, SpeechSynthesisVoice | null>();
let lastVoiceListLength = 0;

/**
 * Score a voice for quality — higher is better.
 * Prefers: Google voices, non-compact, male-sounding names, local voices.
 */
function scoreVoice(voice: SpeechSynthesisVoice): number {
  let score = 0;
  const nameLower = voice.name.toLowerCase();

  // Google voices are consistently high quality across platforms
  if (nameLower.includes("google")) score += 50;

  // Microsoft Online voices are also good quality
  if (nameLower.includes("microsoft") && nameLower.includes("online")) score += 40;

  // Premium / enhanced / natural voices
  if (nameLower.includes("premium")) score += 30;
  if (nameLower.includes("enhanced")) score += 30;
  if (nameLower.includes("natural")) score += 25;

  // Penalise compact / low quality voices
  if (nameLower.includes("compact")) score -= 40;

  // Prefer local/default voices over remote when quality is similar
  if (!voice.localService) score += 5;

  // Prefer male voices (more like a qari/reciter)
  // Common male voice name indicators
  const maleIndicators = [
    "male", "david", "mark", "james", "daniel", "rishi", "google",
    "zira" /* not male but keeping as fallback */, "hemant", "naayf",
    "maged", "majed",
  ];
  const femaleIndicators = [
    "female", "zira", "susan", "hazel", "linda", "karen",
    "samantha", "fiona", "kate", "tessa", "moira", "victoria",
  ];

  if (femaleIndicators.some((f) => nameLower.includes(f))) score -= 15;
  if (maleIndicators.some((m) => nameLower.includes(m))) score += 10;

  return score;
}

/**
 * Get the best available voice for a given language.
 * Returns null if no matching voice is found (browser will use default).
 */
export function getBestVoice(lang: string): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }

  const speechLang = LANG_TO_SPEECH[lang] || lang;
  const langPrefix = speechLang.split("-")[0];

  const voices = window.speechSynthesis.getVoices();

  // Invalidate cache if voice list changed (e.g. voices loaded async)
  if (voices.length !== lastVoiceListLength) {
    voiceCache.clear();
    lastVoiceListLength = voices.length;
  }

  const cacheKey = langPrefix;
  if (voiceCache.has(cacheKey)) {
    return voiceCache.get(cacheKey) ?? null;
  }

  // Find all voices matching this language
  const matching = voices.filter(
    (v) => v.lang.startsWith(langPrefix) || v.lang === speechLang
  );

  if (matching.length === 0) {
    voiceCache.set(cacheKey, null);
    return null;
  }

  // Sort by quality score (descending) and pick the best
  matching.sort((a, b) => scoreVoice(b) - scoreVoice(a));
  const best = matching[0];

  voiceCache.set(cacheKey, best);
  return best;
}

/**
 * Preload voices — call this early so getVoices() is populated.
 * Some browsers load voices asynchronously.
 */
export function preloadVoices(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  // Trigger voice list loading
  window.speechSynthesis.getVoices();

  // Listen for async voice loading
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      voiceCache.clear();
      lastVoiceListLength = 0;
    };
  }
}
