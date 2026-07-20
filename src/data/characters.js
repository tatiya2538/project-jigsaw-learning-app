import { characterData as gotami } from "./gotami";
import { characterData as khema } from "./khema";
import { characterData as kondanna } from "./kondanna";
import { characterData as pasenadi } from "./pasenadi";
import { characterData as poonpismai } from "./poonpismai";
import { characterData as sanya } from "./sanya";

import { BLOB_BASE } from "../lib/config";

export const characters = {
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

export const characterSlugs = Object.keys(characters);

export function getCharacter(slug) {
  return characters[slug] ?? null;
}
