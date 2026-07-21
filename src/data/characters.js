import { characterData as gotami } from "./gotami";
import { characterData as khema } from "./khema";
import { characterData as kondanna } from "./kondanna";
import { characterData as pasenadi } from "./pasenadi";
import { characterData as poonpismai } from "./poonpismai";
import { characterData as sanya } from "./sanya";

import { BLOB_BASE } from "../lib/config";

/** Built-in seed characters shipped with the repo (fallback + reset source). */
export const localCharacterSeeds = {
  kondanna: {
    slug: "kondanna",
    label: "พระอัญญาโกณฑัญญะ",
    image: `${BLOB_BASE}/charactor/kondanna.webp`,
    audio: `${BLOB_BASE}/kondanna.wav`,
    data: kondanna,
  },
  gotami: {
    slug: "gotami",
    label: "พระนางมหาประชาบดีโคตมีเถรี",
    image: `${BLOB_BASE}/charactor/gotami.webp`,
    audio: `${BLOB_BASE}/gotami.wav`,
    data: gotami,
  },
  khema: {
    slug: "khema",
    label: "พระนางเขมาเถรี",
    image: `${BLOB_BASE}/charactor/khema.webp`,
    audio: null,
    data: khema,
  },
  pasenadi: {
    slug: "pasenadi",
    label: "พระเจ้าปเสนทิโกศล",
    image: `${BLOB_BASE}/charactor/pasenadi.webp`,
    audio: null,
    data: pasenadi,
  },
  poonpismai: {
    slug: "poonpismai",
    label: "หม่อมเจ้าหญิงพูนพิศมัย ดิศกุล",
    image: `${BLOB_BASE}/charactor/poonpismai.webp`,
    audio: null,
    data: poonpismai,
  },
  sanya: {
    slug: "sanya",
    label: "ศาสตราจารย์สัญญา ธรรมศักดิ์",
    image: `${BLOB_BASE}/charactor/sanya.webp`,
    audio: null,
    data: sanya,
  },
};

/** @deprecated Prefer listCharacterEntries() from lib/catalog — kept for seed fallback */
export const characters = localCharacterSeeds;

export const characterSlugs = Object.keys(localCharacterSeeds);

export function getLocalCharacter(slug) {
  return localCharacterSeeds[slug] ?? null;
}

/** Sync lookup of local seeds only. Use getCharacterEntry() for catalog-aware lookup. */
export function getCharacter(slug) {
  return getLocalCharacter(slug);
}

export function defaultCharacterImage(slug) {
  return `${BLOB_BASE}/charactor/${slug}.webp`;
}

export function toCatalogEntry(character, order = 0) {
  return {
    slug: character.slug,
    label: character.label || character.data?.name || character.slug,
    image: character.image || defaultCharacterImage(character.slug),
    audio: character.audio ?? null,
    active: character.active !== false,
    order,
  };
}

export function buildLocalCatalogEntries() {
  return Object.values(localCharacterSeeds).map((character, index) =>
    toCatalogEntry(character, index + 1),
  );
}
