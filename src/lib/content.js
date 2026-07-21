import { put } from "@vercel/blob";

import { getLocalCharacter } from "../data/characters";

import {
  ensureCatalogSyncedWithSeeds,
  getCharacterEntry,
  listCharacterEntries,
} from "./catalog";
import { createCharacterTemplate } from "./character-template";
import { getContentBlobUrl } from "./config";
import { withNormalizedContent } from "./sections";

export async function getCharacterContent(slug) {
  const entry = await getCharacterEntry(slug);
  if (!entry) return null;

  try {
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
    // fall back to local seed / template
  }

  if (entry.data) {
    return withNormalizedContent(structuredClone(entry.data));
  }

  return withNormalizedContent(
    createCharacterTemplate({
      name: entry.label,
      shortTitle: "บุคคลสำคัญทางพระพุทธศาสนา",
    }),
  );
}

export async function saveCharacterContent(slug, data) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "ยังไม่มี BLOB_READ_WRITE_TOKEN ใน environment — เชื่อม Blob Store แล้วดึง env ใหม่",
    );
  }

  const entry = await getCharacterEntry(slug);
  if (!entry) {
    throw new Error("ไม่พบบุคคลใน catalog — เพิ่มบุคคลใหม่จากหน้า Admin ก่อน");
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
  const catalog = await ensureCatalogSyncedWithSeeds();
  const results = [];

  for (const entry of catalog.characters) {
    const local = getLocalCharacter(entry.slug);

    // Only overwrite content for built-in seeds — keep admin-created cards
    if (!local?.data) {
      continue;
    }

    const blob = await saveCharacterContent(entry.slug, local.data);
    results.push({ slug: entry.slug, url: blob.url });
  }

  return results;
}

export async function listCharactersForUi() {
  const entries = await listCharacterEntries({ activeOnly: true });

  return Promise.all(
    entries.map(async (entry) => {
      const content = await getCharacterContent(entry.slug);
      return {
        slug: entry.slug,
        label: entry.label,
        image: entry.image,
        audio: entry.audio,
        active: entry.active !== false,
        data: content,
      };
    }),
  );
}
