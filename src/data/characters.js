import { characterData as gotami } from "./gotami";
import { characterData as khema } from "./khema";
import { characterData as kondanna } from "./kondanna";
import { characterData as pasenadi } from "./pasenadi";
import { characterData as poonpismai } from "./poonpismai";
import { characterData as sanya } from "./sanya";

export const characters = {
  kondanna: {
    slug: "kondanna",
    label: "พระอัญญาโกณฑัญญะ",
    image: "/characters/kondanna.png",
    audio: "/audio/kondanna.wav",
    data: kondanna,
  },
  gotami: {
    slug: "gotami",
    label: "พระนางมหาประชาบดีโคตมีเถรี",
    image: "/characters/gotami.png",
    audio: null,
    data: gotami,
  },
  khema: {
    slug: "khema",
    label: "พระนางเขมาเถรี",
    image: "/characters/khema.png",
    audio: null,
    data: khema,
  },
  pasenadi: {
    slug: "pasenadi",
    label: "พระเจ้าปเสนทิโกศล",
    image: "/characters/pasenadi.png",
    audio: null,
    data: pasenadi,
  },
  poonpismai: {
    slug: "poonpismai",
    label: "หม่อมเจ้าหญิงพูนพิศมัย ดิศกุล",
    image: "/characters/poonpismai.png",
    audio: null,
    data: poonpismai,
  },
  sanya: {
    slug: "sanya",
    label: "ศาสตราจารย์สัญญา ธรรมศักดิ์",
    image: "/characters/sanya.png",
    audio: null,
    data: sanya,
  },
};

export const characterSlugs = Object.keys(characters);

export function getCharacter(slug) {
  return characters[slug] ?? null;
}
