import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { OPENROUTER_MODEL } from "@/lib/chat/constants";

const SYSTEM_PROMPT = `Generate a short Eid Mubarak greeting. Rules:
- ONLY Eid greetings, nothing else.
- EXACTLY 2 sentences. No more.
- Warm and sincere. Appropriate for all ages.
- You may use phrases like "Eid Mubarak", "Taqabbalallahu minna wa minkum".
- Output ONLY the greeting text. No quotes, labels, or extra text.
- MUST end with a complete sentence and punctuation mark.
- Keep it SHORT. Do not exceed 50 words.`;

const FALLBACK_MESSAGES: Record<string, string[]> = {
  en: [
    "Eid Mubarak! May this blessed day bring endless joy, peace, and blessings to you and your family. Taqabbalallahu minna wa minkum!",
    "On this beautiful Eid, may Allah shower His infinite mercy upon you and fill your life with happiness and prosperity. Eid Mubarak!",
    "Wishing you a joyous Eid filled with love, laughter, and the warmth of family. May Allah accept all your prayers and good deeds!",
  ],
  bn: [
    "ঈদ মোবারক! এই মুবারক দিনটি আপনার ও আপনার পরিবারের জন্য অফুরন্ত আনন্দ, শান্তি ও বরকত নিয়ে আসুক। তাকাব্বালাল্লাহু মিন্না ওয়া মিনকুম!",
    "এই সুন্দর ঈদে আল্লাহ আপনার উপর তাঁর অসীম রহমত বর্ষণ করুন এবং আপনার জীবন সুখ ও সমৃদ্ধিতে পূর্ণ করুন। ঈদ মোবারক!",
    "ভালোবাসা, হাসি ও পরিবারের উষ্ণতায় ভরা আনন্দময় ঈদের শুভেচ্ছা। আল্লাহ আপনার সকল দু'আ ও নেক আমল কবুল করুন!",
  ],
  ur: [
    "عید مبارک! یہ مبارک دن آپ اور آپ کے خاندان کے لیے بے حد خوشی، سکون اور برکتیں لائے۔ تقبل اللہ منا ومنکم!",
    "اس خوبصورت عید پر اللہ آپ پر اپنی بے انتہا رحمتیں نازل فرمائے اور آپ کی زندگی خوشیوں سے بھر دے۔ عید مبارک!",
  ],
  ar: [
    "عيد مبارك! عسى أن يجلب هذا اليوم المبارك السعادة والسلام والبركات لك ولعائلتك. تقبل الله منا ومنكم!",
    "في هذا العيد الجميل، أسأل الله أن يغمركم برحمته الواسعة ويملأ حياتكم بالسعادة والخير. عيد مبارك!",
  ],
  tr: [
    "Bayramınız mübarek olsun! Bu mübarek gün size ve ailenize sonsuz mutluluk, huzur ve bereket getirsin!",
  ],
  ms: [
    "Selamat Hari Raya! Semoga hari yang mulia ini membawa kegembiraan, kedamaian dan keberkatan buat anda dan keluarga!",
  ],
  id: [
    "Selamat Hari Raya! Semoga hari yang mulia ini membawa kebahagiaan, kedamaian dan keberkatan buat Anda dan keluarga!",
  ],
};

function getRandomFallback(lang: string): string {
  const msgs = FALLBACK_MESSAGES[lang] || FALLBACK_MESSAGES.en;
  return msgs[Math.floor(Math.random() * msgs.length)];
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  let body: { language?: string };
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const lang = body.language || "en";

  // If no API key, return a fallback message directly
  if (!apiKey) {
    return NextResponse.json({ message: getRandomFallback(lang) });
  }

  const langNames: Record<string, string> = {
    en: "English", bn: "Bengali", ur: "Urdu", ar: "Arabic",
    tr: "Turkish", ms: "Malay", id: "Indonesian",
  };

  const model = new ChatOpenAI({
    modelName: OPENROUTER_MODEL,
    apiKey,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://ihsanwealth.onrender.com",
        "X-Title": "IhsanWealth Eid Cards",
      },
    },
    temperature: 0.9,
    maxTokens: 150,
    streaming: false,
  });

  try {
    const response = await model.invoke([
      new SystemMessage(SYSTEM_PROMPT),
      new HumanMessage(
        `Write a short (2 sentences, under 40 words) Eid Mubarak greeting in ${langNames[lang] || "English"}. Be creative and warm. End with a complete sentence.`
      ),
    ]);

    const text = typeof response.content === "string"
      ? response.content
      : Array.isArray(response.content)
        ? response.content.map((c) => (typeof c === "string" ? c : (c as { text?: string }).text || "")).join("")
        : "";

    let trimmed = text.trim();
    if (!trimmed) {
      return NextResponse.json({ message: getRandomFallback(lang) });
    }

    // Strip wrapping quotes if the model added them
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      trimmed = trimmed.slice(1, -1).trim();
    }

    // Detect truncated output — if it doesn't end with sentence-ending punctuation,
    // the free model likely hit its token limit mid-sentence. Use fallback instead.
    const endsWithPunctuation = /[.!?।।؟!\u06D4\u0964]$/.test(trimmed);
    if (!endsWithPunctuation && trimmed.length > 10) {
      // Try to salvage by cutting at last complete sentence
      const lastSentenceEnd = Math.max(
        trimmed.lastIndexOf(". "),
        trimmed.lastIndexOf("! "),
        trimmed.lastIndexOf("? "),
        trimmed.lastIndexOf("।"),
        trimmed.lastIndexOf("؟"),
      );
      if (lastSentenceEnd > trimmed.length * 0.4) {
        trimmed = trimmed.slice(0, lastSentenceEnd + 1).trim();
      } else {
        return NextResponse.json({ message: getRandomFallback(lang) });
      }
    }

    return NextResponse.json({ message: trimmed });
  } catch (err) {
    console.error("Eid message generation error:", err);
    // Return fallback instead of error so UI always gets a message
    return NextResponse.json({ message: getRandomFallback(lang) });
  }
}
