import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

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

const EDGE_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
const EDGE_WS_URL = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${EDGE_TOKEN}`;
const EDGE_ORIGIN = "chrome-extension://jdiccldimpdaibmpdmdrat0m";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildSSML(text: string, voice: string, rate: string): string {
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">` +
    `<voice name="${voice}">` +
    `<prosody rate="${rate}" pitch="+0Hz">` +
    escapeXml(text) +
    `</prosody></voice></speak>`;
}

async function synthesizeEdgeTTS(text: string, voice: string, rate: string): Promise<Uint8Array> {
  const connId = randomUUID().replace(/-/g, "");

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`${EDGE_WS_URL}&ConnectionId=${connId}`, {
      headers: {
        Origin: EDGE_ORIGIN,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0",
      },
    } as unknown as string[]);

    const audioChunks: Uint8Array[] = [];
    let timedOut = false;

    const timeout = setTimeout(() => {
      timedOut = true;
      ws.close();
      reject(new Error("Edge TTS timeout"));
    }, 30000);

    ws.onopen = () => {
      // Send config
      ws.send(
        `Content-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n` +
        JSON.stringify({
          context: {
            synthesis: {
              audio: {
                metadataoptions: { sentenceBoundaryEnabled: "false", wordBoundaryEnabled: "false" },
                outputFormat: "audio-24khz-48kbitrate-mono-mp3",
              },
            },
          },
        })
      );

      // Send SSML
      const requestId = randomUUID().replace(/-/g, "");
      const ssml = buildSSML(text, voice, rate);
      ws.send(
        `X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nPath:ssml\r\n\r\n${ssml}`
      );
    };

    ws.onmessage = (event) => {
      if (typeof event.data === "string") {
        // Text message — check for turn.end
        if (event.data.includes("Path:turn.end")) {
          clearTimeout(timeout);
          ws.close();

          // Concatenate audio chunks
          const totalLen = audioChunks.reduce((s, c) => s + c.length, 0);
          const result = new Uint8Array(totalLen);
          let offset = 0;
          for (const chunk of audioChunks) {
            result.set(chunk, offset);
            offset += chunk.length;
          }
          resolve(result);
        }
      } else {
        // Binary message — extract audio data after the header separator
        const processBuffer = async (data: Blob | ArrayBuffer) => {
          let buffer: ArrayBuffer;
          if (data instanceof Blob) {
            buffer = await data.arrayBuffer();
          } else {
            buffer = data;
          }

          const bytes = new Uint8Array(buffer);
          // Find the header separator "Path:audio\r\n"
          const separator = new TextEncoder().encode("Path:audio\r\n");
          let headerEnd = -1;
          for (let i = 0; i < bytes.length - separator.length; i++) {
            let match = true;
            for (let j = 0; j < separator.length; j++) {
              if (bytes[i + j] !== separator[j]) {
                match = false;
                break;
              }
            }
            if (match) {
              headerEnd = i + separator.length;
              break;
            }
          }

          if (headerEnd !== -1) {
            audioChunks.push(bytes.slice(headerEnd));
          }
        };

        processBuffer(event.data as Blob | ArrayBuffer);
      }
    };

    ws.onerror = () => {
      if (!timedOut) {
        clearTimeout(timeout);
        reject(new Error("Edge TTS WebSocket error"));
      }
    };

    ws.onclose = () => {
      if (!timedOut && audioChunks.length === 0) {
        clearTimeout(timeout);
        reject(new Error("Edge TTS closed without audio"));
      }
    };
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const text = searchParams.get("text");
  const lang = searchParams.get("lang") || "en";
  const rate = searchParams.get("rate") || "-10%";

  if (!text) {
    return NextResponse.json({ error: "Missing text parameter" }, { status: 400 });
  }

  const voice = MALE_VOICES[lang] || MALE_VOICES.en;

  try {
    const audioData = await synthesizeEdgeTTS(text, voice, rate);

    return new NextResponse(audioData.buffer as ArrayBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "TTS generation failed" }, { status: 500 });
  }
}
