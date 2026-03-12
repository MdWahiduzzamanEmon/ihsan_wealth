import { NextRequest, NextResponse } from "next/server";
import { EdgeTTS } from "edge-tts-universal";

// Male neural voices for each supported language (Microsoft Edge TTS)
const MALE_VOICES: Record<string, string> = {
  en: "en-US-GuyNeural",
  bn: "bn-BD-PradeepNeural",
  ur: "ur-PK-AsadNeural",
  ar: "ar-SA-HamedNeural",
  tr: "tr-TR-AhmetNeural",
  ms: "ms-MY-OsmanNeural",
  id: "id-ID-ArdiNeural",
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const text = searchParams.get("text");
  const lang = searchParams.get("lang") || "en";
  const rate = searchParams.get("rate") || "-10%";

  if (!text) {
    return NextResponse.json({ error: "Missing text parameter" }, { status: 400 });
  }

  const trimmedText = text.slice(0, 2000);
  const voice = MALE_VOICES[lang] || MALE_VOICES.en;

  try {
    const tts = new EdgeTTS(trimmedText, voice, { rate });

    const result = await tts.synthesize();
    const audioBuffer = Buffer.from(await result.audio.arrayBuffer());

    if (audioBuffer.length === 0) {
      return NextResponse.json({ error: "No audio generated" }, { status: 500 });
    }

    return new NextResponse(new Uint8Array(audioBuffer), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    console.error("TTS generation failed:", err);
    return NextResponse.json({ error: "TTS generation failed" }, { status: 500 });
  }
}
