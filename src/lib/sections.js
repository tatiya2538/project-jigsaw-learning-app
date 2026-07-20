export const DEFAULT_SECTIONS = {
  hero: true,
  audio: true,
  biography: true,
  timeline: true,
  virtues: true,
  lifeLesson: true,
  discussions: true,
  quiz: true,
};

export const SECTION_LABELS = [
  { key: "hero", label: "Hero (ชื่อ / บทนำ)" },
  { key: "audio", label: "เสียงบรรยาย" },
  { key: "biography", label: "ฉันคือใคร" },
  { key: "timeline", label: "เหตุการณ์สำคัญ" },
  { key: "virtues", label: "คุณธรรมที่ได้รับ" },
  { key: "lifeLesson", label: "ข้อคิดในชีวิตประจำวัน" },
  { key: "discussions", label: "คำถามชวนคิด" },
  { key: "quiz", label: "Mini Quiz" },
];

export function normalizeSections(sections) {
  return {
    ...DEFAULT_SECTIONS,
    ...(sections || {}),
  };
}

export function withNormalizedContent(data) {
  if (!data) return null;

  return {
    ...data,
    sections: normalizeSections(data.sections),
    biography: {
      title: "ฉันคือใคร",
      paragraphs: data.biography?.paragraphs || [],
    },
  };
}
