import { put } from "@vercel/blob";

import { getCharacter } from "../data/characters";

import { getContentBlobUrl } from "./config";
import { withNormalizedContent } from "./sections";

export async function getCharacterContent(slug) {
  const character = getCharacter(slug);
  if (!character) return null;

  try {
    // Bust CDN/Next cache so admin toggles show up immediately
    const response = await fetch(`${getContentBlobUrl(slug)}?t=${Date.now()}`, {
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.name) {
        return withNormalizedContent(data);
      }
    }
  } catch {
    // fall back to local seed data
  }

  return withNormalizedContent(structuredClone(character.data));
}

export async function saveCharacterContent(slug, data) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "ยังไม่มี BLOB_READ_WRITE_TOKEN ใน environment — เชื่อม Blob Store แล้วดึง env ใหม่",
    );
  }

  const character = getCharacter(slug);
  if (!character) {
    throw new Error("ไม่พบตัวละคร");
  }

  const payload = {
    ...withNormalizedContent(data),
    updatedAt: new Date().toISOString(),
  };

  const blob = await put(
    `content/${slug}.json`,
    JSON.stringify(payload, null, 2),
    {
      access: "public",
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType: "application/json",
      cacheControlMaxAge: 0,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    },
  );

  return blob;
}

export async function seedAllCharacterContent() {
  const { characterSlugs, getCharacter: getChar } = await import(
    "../data/characters"
  );

  const results = [];

  for (const slug of characterSlugs) {
    const character = getChar(slug);
    const blob = await saveCharacterContent(slug, character.data);
    results.push({ slug, url: blob.url });
  }

  return results;
}
