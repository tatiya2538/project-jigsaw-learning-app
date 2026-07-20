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
    data: kondanna,
  },
  gotami: {
    slug: "gotami",
    label: "พระนางมหาประชาบดีโคตมีเถรี",
    image: "/characters/gotami.png",
    data: gotami,
  },
  khema: {
    slug: "khema",
    label: "พระนางเขมาเถรี",
    image: "/characters/khema.png",
    data: khema,
  },
  pasenadi: {
    slug: "pasenadi",
    label: "พระเจ้าปเสนทิโกศล",
    image: "/characters/pasenadi.png",
    data: pasenadi,
  },
  poonpismai: {
    slug: "poonpismai",
    label: "หม่อมเจ้าหญิงพูนพิศมัย ดิศกุล",
    image: "/characters/poonpismai.png",
    data: poonpismai,
  },
  sanya: {
    slug: "sanya",
    label: "ศาสตราจารย์สัญญา ธรรมศักดิ์",
    image: "/characters/sanya.png",
    data: sanya,
  },
};

export const characterSlugs = Object.keys(characters);

export function getCharacter(slug) {
  return characters[slug] ?? null;
}
