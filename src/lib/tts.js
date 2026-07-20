import { createHash } from "crypto";

import { put } from "@vercel/blob";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

import { BLOB_BASE } from "./config";

export const TTS_VOICE = "th-TH-PremwadeeNeural";
export const TTS_VOICE_LABEL = "Premwadee (Edge Neural)";

const OUTPUT = OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3;
const MAX_CHUNK_CHARS = 220;
const MAX_ATTEMPTS = 3;

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function normalizeTtsParagraphs(paragraphs = []) {
  return paragraphs
    .map((item) => String(item || "").trim())
    .filter(Boolean);
}

export function buildTtsText(paragraphs = []) {
  return normalizeTtsParagraphs(paragraphs).join("\n\n");
}

export function hashTtsText(text, voice = TTS_VOICE) {
  return createHash("sha256")
    .update(`v2\n${voice}\n${text}`)
    .digest("hex")
    .slice(0, 20);
}

export function getTtsBlobPath(hash) {
  return `tts/${hash}.mp3`;
}

export function getTtsBlobUrl(hash) {
  return `${BLOB_BASE}/${getTtsBlobPath(hash)}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Split long paragraphs so each Edge request stays short and reliable. */
export function chunkTtsText(paragraphs = []) {
  const chunks = [];

  for (const paragraph of normalizeTtsParagraphs(paragraphs)) {
    if (paragraph.length <= MAX_CHUNK_CHARS) {
      chunks.push(paragraph);
      continue;
    }

    const sentences = paragraph.split(/(?<=[។．.!?！？])\s*|\s+/);
    let current = "";

    for (const part of sentences) {
      if (!part) continue;

      const next = current ? `${current} ${part}` : part;

      if (next.length > MAX_CHUNK_CHARS && current) {
        chunks.push(current);
        current = part;
      } else if (part.length > MAX_CHUNK_CHARS) {
        if (current) chunks.push(current);
        for (let i = 0; i < part.length; i += MAX_CHUNK_CHARS) {
          chunks.push(part.slice(i, i + MAX_CHUNK_CHARS));
        }
        current = "";
      } else {
        current = next;
      }
    }

    if (current) chunks.push(current);
  }

  return chunks;
}

async function streamToBuffer(stream) {
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

async function synthesizeAllChunks(chunks) {
  const tts = new MsEdgeTTS();
  const audioParts = [];

  try {
    await tts.setMetadata(TTS_VOICE, OUTPUT);

    for (let index = 0; index < chunks.length; index += 1) {
      let lastError;

      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
        try {
          const { audioStream } = tts.toStream(escapeXml(chunks[index]), {
            rate: "-5%",
          });
          const buffer = await streamToBuffer(audioStream);

          if (!buffer.length) {
            throw new Error("ไม่ได้รับข้อมูลเสียง");
          }

          audioParts.push(buffer);
          lastError = null;
          break;
        } catch (error) {
          lastError = error;

          // Reconnect before retry — Edge often drops mid-stream
          try {
            tts.close();
          } catch {
            // ignore
          }

          await tts.setMetadata(TTS_VOICE, OUTPUT);
          await sleep(300 * attempt);
        }
      }

      if (lastError) {
        throw lastError;
      }

      if (index < chunks.length - 1) {
        await sleep(120);
      }
    }
  } finally {
    try {
      tts.close();
    } catch {
      // ignore
    }
  }

  return Buffer.concat(audioParts);
}

export async function findCachedTtsUrl(hash) {
  const url = getTtsBlobUrl(hash);

  try {
    const response = await fetch(url, {
      method: "HEAD",
      cache: "no-store",
    });

    if (response.ok) {
      return url;
    }
  } catch {
    // miss
  }

  return null;
}

export async function synthesizeEdgeTts(paragraphs = []) {
  const chunks = chunkTtsText(paragraphs);

  if (!chunks.length) {
    throw new Error("ยังไม่มีข้อความให้อ่าน");
  }

  return synthesizeAllChunks(chunks);
}

export async function getOrCreateTtsAudio(paragraphs = []) {
  const text = buildTtsText(paragraphs);
  const hash = hashTtsText(text);
  const cachedUrl = await findCachedTtsUrl(hash);

  if (cachedUrl) {
    return {
      url: cachedUrl,
      cached: true,
      hash,
      voice: TTS_VOICE,
      voiceLabel: TTS_VOICE_LABEL,
    };
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "ยังไม่มี BLOB_READ_WRITE_TOKEN — ต้องมีเพื่อบันทึก cache เสียง",
    );
  }

  const audioBuffer = await synthesizeEdgeTts(paragraphs);
  const pathname = getTtsBlobPath(hash);

  const blob = await put(pathname, audioBuffer, {
    access: "public",
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: "audio/mpeg",
    cacheControlMaxAge: 60 * 60 * 24 * 365,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return {
    url: blob.url,
    cached: false,
    hash,
    voice: TTS_VOICE,
    voiceLabel: TTS_VOICE_LABEL,
  };
}
