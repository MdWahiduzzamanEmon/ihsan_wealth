import { NextRequest, NextResponse } from "next/server";

const MAX_CHUNK_LENGTH = 200;

// Split text into chunks at sentence/phrase boundaries (Google TTS limit ~200 chars)
function chunkText(text: string, maxLen: number = MAX_CHUNK_LENGTH): string[] {
  if (text.length <= maxLen) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      chunks.push(remaining);
      break;
    }

    // Find best split point: sentence end > comma > space
    let splitAt = -1;
    const searchRange = remaining.slice(0, maxLen);

    // Try sentence boundaries first
    for (const sep of ["।", "।", "。", ".", "!", "?", "؟"]) {
      const idx = searchRange.lastIndexOf(sep);
      if (idx > maxLen * 0.3) {
        splitAt = idx + 1;
        break;
      }
    }

    // Then comma/semicolon
    if (splitAt === -1) {
      for (const sep of [",", ";", "،", "؛"]) {
        const idx = searchRange.lastIndexOf(sep);
        if (idx > maxLen * 0.3) {
          splitAt = idx + 1;
          break;
        }
      }
    }

    // Then any space
    if (splitAt === -1) {
      const idx = searchRange.lastIndexOf(" ");
      if (idx > maxLen * 0.3) {
        splitAt = idx + 1;
      }
    }

    // Hard split as last resort
    if (splitAt === -1) {
      splitAt = maxLen;
    }

    chunks.push(remaining.slice(0, splitAt).trim());
    remaining = remaining.slice(splitAt).trim();
  }

  return chunks.filter((c) => c.length > 0);
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const text = searchParams.get("text");
  const lang = searchParams.get("lang") || "en";
  const speed = searchParams.get("speed") || "0.9";

  if (!text) {
    return NextResponse.json({ error: "Missing text parameter" }, { status: 400 });
  }

  try {
    const chunks = chunkText(text);
    const audioBuffers: ArrayBuffer[] = [];

    for (const chunk of chunks) {
      const encodedText = encodeURIComponent(chunk);
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodedText}&ttsspeed=${speed}`;

      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Referer: "https://translate.google.com/",
        },
      });

      if (!res.ok) {
        throw new Error(`TTS fetch failed: ${res.status}`);
      }

      audioBuffers.push(await res.arrayBuffer());
    }

    // Concatenate all audio buffers
    const totalLength = audioBuffers.reduce((sum, buf) => sum + buf.byteLength, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const buf of audioBuffers) {
      combined.set(new Uint8Array(buf), offset);
      offset += buf.byteLength;
    }

    return new NextResponse(combined, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "TTS generation failed" }, { status: 500 });
  }
}
