import { DEFAULT_SECTIONS } from "./sections";

/** Blank learning-card content used when creating a new character. */
export function createCharacterTemplate({
  name = "ชื่อบุคคล",
  shortTitle = "คำโปรยสั้น",
  heroIntro = "แนะนำตัวละครสั้น ๆ สำหรับนักเรียน",
} = {}) {
  return {
    name,
    shortTitle,
    heroIntro,
    sections: { ...DEFAULT_SECTIONS },
    biography: {
      title: "ฉันคือใคร",
      paragraphs: [
        `ข้าพเจ้าคือ ${name} — แก้ไขประวัติย่อหน้านี้ในหน้า Admin`,
        "เพิ่มรายละเอียดชีวิตและการเปลี่ยนแปลงสำคัญในย่อหน้านี้",
        "สรุปสิ่งที่ได้เรียนรู้หรือคุณค่าที่อยากให้นักเรียนนำไปใช้",
      ],
    },
    timeline: [
      {
        id: 1,
        title: "เหตุการณ์ที่ 1",
        description: "รายละเอียดเหตุการณ์สำคัญ",
      },
      {
        id: 2,
        title: "เหตุการณ์ที่ 2",
        description: "รายละเอียดเหตุการณ์สำคัญ",
      },
      {
        id: 3,
        title: "เหตุการณ์ที่ 3",
        description: "รายละเอียดเหตุการณ์สำคัญ",
      },
    ],
    virtues: [
      {
        id: 1,
        emoji: "🌱",
        title: "คุณธรรม 1",
        description: "คำอธิบายคุณธรรม",
        color: "from-emerald-400 to-teal-400",
        bg: "bg-emerald-50",
      },
      {
        id: 2,
        emoji: "💡",
        title: "คุณธรรม 2",
        description: "คำอธิบายคุณธรรม",
        color: "from-amber-400 to-orange-400",
        bg: "bg-amber-50",
      },
      {
        id: 3,
        emoji: "🤝",
        title: "คุณธรรม 3",
        description: "คำอธิบายคุณธรรม",
        color: "from-sky-400 to-blue-400",
        bg: "bg-sky-50",
      },
    ],
    lifeLesson: {
      quote: "ใส่ข้อคิดสั้น ๆ ที่นักเรียนจำง่าย",
      note: "อธิบายเพิ่มเติมให้เชื่อมกับชีวิตประจำวัน",
    },
    discussions: [
      {
        id: 1,
        question: "คำถามชวนคิดข้อที่ 1",
      },
      {
        id: 2,
        question: "คำถามชวนคิดข้อที่ 2",
      },
      {
        id: 3,
        question: "คำถามชวนคิดข้อที่ 3",
      },
    ],
    audio: {
      title: `เรื่องราวของ${name}`,
      subtitle: "เสียงบรรยายสำหรับกิจกรรมการเรียนรู้",
      duration: "00:00",
      durationSeconds: 0,
      tts: null,
    },
    quiz: [
      {
        id: 1,
        question: "คำถามทดสอบข้อที่ 1",
        options: ["ตัวเลือก 1", "ตัวเลือก 2", "ตัวเลือก 3", "ตัวเลือก 4"],
        correctIndex: 0,
      },
      {
        id: 2,
        question: "คำถามทดสอบข้อที่ 2",
        options: ["ตัวเลือก 1", "ตัวเลือก 2", "ตัวเลือก 3", "ตัวเลือก 4"],
        correctIndex: 0,
      },
      {
        id: 3,
        question: "คำถามทดสอบข้อที่ 3",
        options: ["ตัวเลือก 1", "ตัวเลือก 2", "ตัวเลือก 3", "ตัวเลือก 4"],
        correctIndex: 0,
      },
    ],
  };
}

export function isValidCharacterSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(slug || ""));
}
