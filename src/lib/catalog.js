import { put } from "@vercel/blob";

import {
  buildLocalCatalogEntries,
  defaultCharacterImage,
  getLocalCharacter,
  toCatalogEntry,
} from "../data/characters";
import { buildDefaultGameEntries } from "../data/games";

import { BLOB_BASE } from "./config";
import {
  createCharacterTemplate,
  isValidCharacterSlug,
} from "./character-template";
import { withNormalizedContent } from "./sections";

export const CATALOG_BLOB_PATH = "catalog.json";

export function getCatalogBlobUrl() {
  return `${BLOB_BASE}/${CATALOG_BLOB_PATH}`;
}

function sortEntries(entries = []) {
  return [...entries].sort((a, b) => {
    const orderA = Number.isFinite(a.order) ? a.order : 999;
    const orderB = Number.isFinite(b.order) ? b.order : 999;
    if (orderA !== orderB) return orderA - orderB;
    return String(a.slug).localeCompare(String(b.slug));
  });
}

function sortGames(entries = []) {
  return [...entries].sort((a, b) => {
    const orderA = Number.isFinite(a.order) ? a.order : 999;
    const orderB = Number.isFinite(b.order) ? b.order : 999;
    if (orderA !== orderB) return orderA - orderB;
    return String(a.id).localeCompare(String(b.id));
  });
}

function normalizeEntry(entry, index = 0) {
  if (!entry?.slug) return null;

  return {
    slug: entry.slug,
    label: entry.label || entry.slug,
    image: entry.image || defaultCharacterImage(entry.slug),
    audio: entry.audio ?? null,
    active: entry.active !== false,
    order: Number.isFinite(entry.order) ? entry.order : index + 1,
  };
}

function normalizeGame(entry, index = 0) {
  if (!entry?.id) return null;

  const defaults = buildDefaultGameEntries().find((item) => item.id === entry.id);
  const href = entry.href || defaults?.href;
  if (!href) return null;

  return {
    id: entry.id,
    label: entry.label || defaults?.label || entry.id,
    href,
    emoji: entry.emoji || defaults?.emoji || "🎮",
    tone: entry.tone || defaults?.tone || "from-primary to-amber-500",
    active: entry.active !== false,
    order: Number.isFinite(entry.order)
      ? entry.order
      : defaults?.order || index + 1,
  };
}

function mergeGamesWithDefaults(gamesEntries = []) {
  const byId = new Map();

  gamesEntries.forEach((entry, index) => {
    const normalized = normalizeGame(entry, index);
    if (normalized) byId.set(normalized.id, normalized);
  });

  for (const seed of buildDefaultGameEntries()) {
    const current = byId.get(seed.id);
    if (!current) {
      byId.set(seed.id, normalizeGame(seed));
      continue;
    }

    byId.set(
      seed.id,
      normalizeGame({
        ...seed,
        ...current,
        id: seed.id,
        href: current.href || seed.href,
        // คงค่า active จาก catalog เสมอ (รวม false)
        active: current.active,
      }),
    );
  }

  return sortGames([...byId.values()].filter(Boolean));
}

export async function readCatalogFromBlob() {
  try {
    const response = await fetch(`${getCatalogBlobUrl()}?t=${Date.now()}`, {
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = await response.json();
    const entries = Array.isArray(data?.characters)
      ? data.characters.map(normalizeEntry).filter(Boolean)
      : [];

    if (!entries.length) return null;

    return {
      characters: sortEntries(entries),
      games: mergeGamesWithDefaults(
        Array.isArray(data?.games) ? data.games : [],
      ),
      updatedAt: data.updatedAt || null,
    };
  } catch {
    return null;
  }
}

async function writeCatalogDocument({ characters, games }) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "ยังไม่มี BLOB_READ_WRITE_TOKEN ใน environment — เชื่อม Blob Store แล้วดึง env ใหม่",
    );
  }

  const existing = await readCatalogFromBlob();
  const nextCharacters = sortEntries(
    characters.map((entry, index) => normalizeEntry(entry, index)).filter(Boolean),
  );
  const nextGames = mergeGamesWithDefaults(
    games ?? existing?.games ?? buildDefaultGameEntries(),
  );

  const payload = {
    characters: nextCharacters,
    games: nextGames,
    updatedAt: new Date().toISOString(),
  };

  const blob = await put(CATALOG_BLOB_PATH, JSON.stringify(payload, null, 2), {
    access: "public",
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: "application/json",
    cacheControlMaxAge: 0,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return { ...payload, url: blob.url };
}

/** Save character list; preserves games already in catalog. */
export async function saveCatalog(entries) {
  return writeCatalogDocument({ characters: entries });
}

/** Catalog from Blob, or local seeds if catalog is missing. */
export async function getCatalog() {
  const fromBlob = await readCatalogFromBlob();
  if (fromBlob) return fromBlob;

  return {
    characters: buildLocalCatalogEntries(),
    games: buildDefaultGameEntries(),
    updatedAt: null,
  };
}

export async function listCharacterEntries({ activeOnly = false } = {}) {
  const catalog = await getCatalog();
  if (!activeOnly) return catalog.characters;
  return catalog.characters.filter((entry) => entry.active !== false);
}

export async function listGameEntries({ activeOnly = false } = {}) {
  const catalog = await getCatalog();
  const games = catalog.games || buildDefaultGameEntries();
  if (!activeOnly) return games;
  return games.filter((entry) => entry.active !== false);
}

export async function getGameEntry(id, { activeOnly = false } = {}) {
  const games = await listGameEntries({ activeOnly: false });
  const entry = games.find((item) => item.id === id);
  if (!entry) return null;
  if (activeOnly && entry.active === false) return null;
  return entry;
}

export async function getCharacterEntry(slug, { activeOnly = false } = {}) {
  const catalog = await getCatalog();
  const entry = catalog.characters.find((item) => item.slug === slug);
  if (!entry) return null;
  if (activeOnly && entry.active === false) return null;

  const local = getLocalCharacter(slug);

  return {
    ...entry,
    data: local?.data || null,
    isLocalSeed: Boolean(local),
  };
}

export async function setCharacterActive(slug, active) {
  return updateCatalogEntry(slug, { active: Boolean(active) });
}

export async function setGameActive(id, active) {
  const catalog = await getCatalog();
  const games = [...(catalog.games || buildDefaultGameEntries())];
  const index = games.findIndex((item) => item.id === id);

  if (index < 0) {
    throw new Error("ไม่พบเกมใน catalog");
  }

  games[index] = normalizeGame(
    {
      ...games[index],
      active: Boolean(active),
      id,
    },
    index,
  );

  return writeCatalogDocument({
    characters: catalog.characters,
    games,
  });
}

export async function ensureCatalogSyncedWithSeeds() {
  const existing = await readCatalogFromBlob();
  const localEntries = buildLocalCatalogEntries();

  if (!existing?.characters?.length) {
    return writeCatalogDocument({
      characters: localEntries,
      games: buildDefaultGameEntries(),
    });
  }

  const bySlug = new Map(
    existing.characters.map((entry) => [entry.slug, entry]),
  );

  for (const local of localEntries) {
    if (!bySlug.has(local.slug)) {
      bySlug.set(local.slug, local);
    } else {
      const current = bySlug.get(local.slug);
      bySlug.set(local.slug, {
        ...local,
        ...current,
        slug: local.slug,
      });
    }
  }

  return writeCatalogDocument({
    characters: [...bySlug.values()],
    games: mergeGamesWithDefaults(existing.games || []),
  });
}

export async function createCharacter({
  slug,
  name,
  shortTitle = "บุคคลสำคัญทางพระพุทธศาสนา",
  image,
  audio = null,
}) {
  const normalizedSlug = String(slug || "")
    .trim()
    .toLowerCase();

  if (!isValidCharacterSlug(normalizedSlug)) {
    throw new Error(
      "slug ต้องเป็นภาษาอังกฤษตัวเล็ก ตัวเลข และขีดกลางเท่านั้น เช่น ananda",
    );
  }

  if (!name?.trim()) {
    throw new Error("กรุณาระบุชื่อบุคคล");
  }

  const catalog = await getCatalog();
  if (catalog.characters.some((item) => item.slug === normalizedSlug)) {
    throw new Error("มี slug นี้ในระบบแล้ว");
  }

  const content = withNormalizedContent(
    createCharacterTemplate({
      name: name.trim(),
      shortTitle: shortTitle.trim() || "บุคคลสำคัญทางพระพุทธศาสนา",
      heroIntro: `${name.trim()} — แก้ไขบทนำและเนื้อหาในหน้า Admin`,
    }),
  );

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "ยังไม่มี BLOB_READ_WRITE_TOKEN ใน environment — เชื่อม Blob Store แล้วดึง env ใหม่",
    );
  }

  await put(`content/${normalizedSlug}.json`, JSON.stringify(content, null, 2), {
    access: "public",
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: "application/json",
    cacheControlMaxAge: 0,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  const nextOrder =
    Math.max(0, ...catalog.characters.map((item) => item.order || 0)) + 1;

  const entry = toCatalogEntry(
    {
      slug: normalizedSlug,
      label: name.trim(),
      image: image?.trim() || defaultCharacterImage(normalizedSlug),
      audio,
      active: true,
    },
    nextOrder,
  );

  const savedCatalog = await writeCatalogDocument({
    characters: [...catalog.characters, entry],
    games: catalog.games,
  });

  return {
    entry,
    content,
    catalog: savedCatalog,
  };
}

export async function updateCatalogEntry(slug, patch = {}) {
  const catalog = await getCatalog();
  const index = catalog.characters.findIndex((item) => item.slug === slug);

  if (index < 0) {
    throw new Error("ไม่พบบุคคลใน catalog");
  }

  const next = [...catalog.characters];
  next[index] = normalizeEntry(
    {
      ...next[index],
      ...patch,
      slug,
    },
    index,
  );

  return writeCatalogDocument({
    characters: next,
    games: catalog.games,
  });
}
