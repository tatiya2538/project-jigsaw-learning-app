import { readFileSync, writeFileSync } from "fs";
import { mkdir } from "fs/promises";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const PptxGenJS = require("pptxgenjs");
const JSZip = require("jszip");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gameCharacters = JSON.parse(
  readFileSync(
    path.join(__dirname, "../src/data/gameCharacters.json"),
    "utf8",
  ),
);

function getPointsForClue(clueNumber) {
  return Math.max(1, 11 - clueNumber);
}

const outputDir = path.join(__dirname, "../public/game");
const outputFile = path.join(outputDir, "who-am-i-classroom.pptx");

/** Match web theme tokens from globals.css */
const C = {
  bg: "FFFDF7",
  white: "FFFFFF",
  text: "374151",
  muted: "6B7280",
  primary: "F59E0B",
  secondary: "FDE68A",
  accent: "10B981",
  sky: "0EA5E9",
  skySoft: "E0F2FE",
  amberSoft: "FEF3C7",
  navy: "0F172A",
  cardBorder: "FDE68A",
  danger: "F97316",
  violet: "8B5CF6",
  slate: "64748B",
};

const FONT = "Sarabun";
const W = 13.333;
const H = 7.5;

function softShadow() {
  return {
    type: "outer",
    color: "F59E0B",
    blur: 10,
    opacity: 0.14,
    offset: 3,
  };
}

function cardShadow() {
  return {
    type: "outer",
    color: "374151",
    blur: 12,
    opacity: 0.1,
    offset: 3,
  };
}

/** Rounded button with optional slide hyperlink */
function addButton(slide, pptx, { x, y, w, h, label, fill, slideTo, tooltip }) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    fill: { color: fill },
    shadow: softShadow(),
    rectRadius: 0.12,
    ...(slideTo
      ? { hyperlink: { slide: slideTo, tooltip: tooltip || label } }
      : {}),
  });
  slide.addText(label, {
    x,
    y,
    w,
    h,
    fontSize: 12,
    bold: true,
    color: C.navy,
    align: "center",
    valign: "middle",
    fontFace: FONT,
    ...(slideTo
      ? { hyperlink: { slide: slideTo, tooltip: tooltip || label } }
      : {}),
  });
}

function addBgWash(slide, pptx) {
  slide.background = { color: C.bg };
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 9.5,
    y: -1.2,
    w: 5,
    h: 4,
    fill: { color: C.secondary, transparency: 55 },
  });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: -1.5,
    y: 5,
    w: 4.5,
    h: 3.5,
    fill: { color: "A7F3D0", transparency: 70 },
  });
}

function addHeader(slide, title, subtitle) {
  slide.addText(title, {
    x: 0.45,
    y: 0.25,
    w: 9.2,
    h: 0.45,
    fontSize: 22,
    bold: true,
    color: C.text,
    fontFace: FONT,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.45,
      y: 0.68,
      w: 9.2,
      h: 0.3,
      fontSize: 12,
      color: C.muted,
      fontFace: FONT,
    });
  }
}

function addScorePanel(slide, pptx) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 9.85,
    y: 0.25,
    w: 3.15,
    h: 5.35,
    fill: { color: C.white },
    shadow: cardShadow(),
    rectRadius: 0.18,
    line: { color: C.cardBorder, pt: 1 },
  });
  slide.addText("กระดานคะแนน", {
    x: 10,
    y: 0.4,
    w: 2.85,
    h: 0.35,
    fontSize: 14,
    bold: true,
    color: C.text,
    fontFace: FONT,
    align: "center",
  });
  slide.addText("เขียนคะแนนระหว่างเกม", {
    x: 10,
    y: 0.72,
    w: 2.85,
    h: 0.25,
    fontSize: 10,
    color: C.muted,
    fontFace: FONT,
    align: "center",
  });

  const teams = [
    ["🔵 ทีมพุทธ", "38BDF8"],
    ["🟢 ทีมธรรม", "34D399"],
    ["🟡 ทีมปัญญา", "FBBF24"],
    ["🔴 ทีมเมตตา", "F87171"],
    ["🟣 ทีมสมาธิ", "C084FC"],
  ];

  teams.forEach(([name, color], index) => {
    const y = 1.15 + index * 0.8;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 10.05,
      y,
      w: 2.75,
      h: 0.68,
      fill: { color: "FFFBEB" },
      rectRadius: 0.1,
      line: { color, pt: 2 },
    });
    slide.addText(name, {
      x: 10.15,
      y: y + 0.05,
      w: 2.55,
      h: 0.28,
      fontSize: 11,
      bold: true,
      color: C.text,
      fontFace: FONT,
    });
    slide.addText("_____ คะแนน", {
      x: 10.15,
      y: y + 0.32,
      w: 2.55,
      h: 0.28,
      fontSize: 11,
      color: C.muted,
      fontFace: FONT,
    });
  });
}

function addTeacherBar(slide, pptx, buttons) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.45,
    y: 6.35,
    w: 12.4,
    h: 0.9,
    fill: { color: C.white },
    shadow: cardShadow(),
    rectRadius: 0.15,
    line: { color: C.cardBorder, pt: 1 },
  });
  slide.addText("แผงควบคุมครู", {
    x: 0.6,
    y: 6.42,
    w: 2,
    h: 0.25,
    fontSize: 10,
    bold: true,
    color: C.muted,
    fontFace: FONT,
  });

  const startX = 0.6;
  const btnW = 2.35;
  const gap = 0.12;
  buttons.forEach((btn, index) => {
    addButton(slide, pptx, {
      x: startX + index * (btnW + gap),
      y: 6.7,
      w: btnW,
      h: 0.42,
      label: btn.label,
      fill: btn.fill,
      slideTo: btn.slideTo,
      tooltip: btn.tooltip,
    });
  });
}

async function injectFadeTransitions(filePath) {
  const zip = await JSZip.loadAsync(readFileSync(filePath));
  const names = Object.keys(zip.files).filter((name) =>
    /^ppt\/slides\/slide\d+\.xml$/.test(name),
  );

  for (const name of names) {
    let xml = await zip.file(name).async("string");
    if (xml.includes("<p:transition")) continue;
    xml = xml.replace(
      "</p:cSld>",
      '</p:cSld><p:transition spd="med"><p:fade/></p:transition>',
    );
    zip.file(name, xml);
  }

  const out = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
  });
  writeFileSync(filePath, out);
}

async function buildPresentation() {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "WIDE", width: W, height: H });
  pptx.layout = "WIDE";
  pptx.author = "ศูนย์สื่อการเรียนรู้ดิจิทัลพระพุทธศาสนา";
  pptx.title = 'เกมทาย "ฉันคือใคร?" Classroom Edition';

  /** Precompute slide numbers (1-based for hyperlinks) */
  const SCOREBOARD_SLIDE = 4;
  let cursor = 5;
  const characterPlans = gameCharacters.map((character) => {
    const ready = cursor;
    cursor += 1;
    const clues = character.clues.map(() => {
      const n = cursor;
      cursor += 1;
      return n;
    });
    const reveal = cursor;
    cursor += 1;
    return { character, ready, clues, reveal };
  });
  const ENDING_SLIDE = cursor;

  // —— 1 Title ——
  {
    const slide = pptx.addSlide();
    slide.background = { color: C.navy };
    slide.addText('🎮 เกมทาย "ฉันคือใคร?"', {
      x: 0.8,
      y: 2.0,
      w: 11.7,
      h: 0.9,
      fontSize: 40,
      bold: true,
      color: C.white,
      align: "center",
      fontFace: FONT,
    });
    slide.addText("Classroom PowerPoint · โหมดครูพาเล่น (คล้ายหน้าเว็บ)", {
      x: 0.8,
      y: 3.0,
      w: 11.7,
      h: 0.4,
      fontSize: 18,
      color: C.primary,
      align: "center",
      fontFace: FONT,
    });
    slide.addText(
      "ใช้ปุ่มด้านล่างของแต่ละสไลด์ · หรือกดลูกศร · คำใบ้เปิดทีละข้อพร้อม fade",
      {
        x: 0.8,
        y: 5.6,
        w: 11.7,
        h: 0.4,
        fontSize: 14,
        color: "94A3B8",
        align: "center",
        fontFace: FONT,
      },
    );
    addButton(slide, pptx, {
      x: 5.15,
      y: 4.0,
      w: 3,
      h: 0.55,
      label: "เริ่มดูวิธีเล่น →",
      fill: C.primary,
      slideTo: 2,
    });
  }

  // —— 2 Rules ——
  {
    const slide = pptx.addSlide();
    addBgWash(slide, pptx);
    addHeader(slide, "วิธีเล่นสำหรับครู", "เหมือนโหมด Classroom บนเว็บ");
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.45,
      y: 1.15,
      w: 12.4,
      h: 4.7,
      fill: { color: C.white },
      shadow: cardShadow(),
      rectRadius: 0.2,
    });
    slide.addText(
      [
        "1) แบ่งนักเรียนเป็น 2–5 ทีม แล้วตั้งชื่อทีมบนกระดานคะแนนด้านขวา",
        "2) แต่ละข้อมีคำใบ้ 10 ข้อ จากยาก → ง่าย",
        "3) กดปุ่ม “เปิดคำใบ้ถัดไป” (หรือลูกศร) เพื่อเปิดทีละข้อ",
        "4) ทีมตอบถูกที่คำใบ้ข้อ N ได้คะแนน (11 − N)",
        "5) ตอบผิดไม่หักคะแนน — ให้ทีมถัดไปตอบต่อ",
        "6) กด “เฉลยถูก / ให้คะแนน” เมื่อมีทีมตอบถูก",
        "7) หลังเฉลย อ่านสรุปสั้น ๆ แล้วกด “ข้อต่อไป”",
      ].join("\n"),
      {
        x: 0.8,
        y: 1.4,
        w: 11.7,
        h: 4.2,
        fontSize: 18,
        color: C.text,
        fontFace: FONT,
        valign: "top",
      },
    );
    addButton(slide, pptx, {
      x: 10.3,
      y: 6.7,
      w: 2.5,
      h: 0.45,
      label: "ตารางคะแนน →",
      fill: C.sky,
      slideTo: 3,
    });
  }

  // —— 3 Scoring ——
  {
    const slide = pptx.addSlide();
    addBgWash(slide, pptx);
    addHeader(slide, "ตารางคะแนน", "ตอบเร็วได้คะแนนมาก");
    const rows = [
      [
        {
          text: "คำใบ้ที่",
          options: { bold: true, fill: { color: C.navy }, color: "FFFFFF" },
        },
        {
          text: "คะแนน",
          options: { bold: true, fill: { color: C.navy }, color: "FFFFFF" },
        },
        {
          text: "ความยาก",
          options: { bold: true, fill: { color: C.navy }, color: "FFFFFF" },
        },
      ],
    ];
    for (let i = 1; i <= 10; i += 1) {
      rows.push([
        String(i),
        String(getPointsForClue(i)),
        i <= 3 ? "ยากมาก" : i <= 7 ? "ปานกลาง" : "ง่าย",
      ]);
    }
    slide.addTable(rows, {
      x: 2.8,
      y: 1.3,
      w: 7.7,
      colW: [2.2, 2.2, 3.3],
      border: [
        { pt: 0.5, color: "E5E7EB" },
        { pt: 0.5, color: "E5E7EB" },
        { pt: 0.5, color: "E5E7EB" },
        { pt: 0.5, color: "E5E7EB" },
      ],
      fontFace: FONT,
      fontSize: 15,
      color: C.text,
      align: "center",
    });
    addButton(slide, pptx, {
      x: 10.3,
      y: 6.7,
      w: 2.5,
      h: 0.45,
      label: "กระดานคะแนน →",
      fill: C.primary,
      slideTo: SCOREBOARD_SLIDE,
    });
  }

  // —— 4 Full scoreboard ——
  {
    const slide = pptx.addSlide();
    addBgWash(slide, pptx);
    addHeader(
      slide,
      "กระดานคะแนนเต็มจอ",
      "ใช้ตอนสรุป หรือเปิดดูระหว่างเกมด้วยปุ่มด้านล่าง",
    );
    const teamRows = [
      [
        {
          text: "ทีม",
          options: { bold: true, fill: { color: C.sky }, color: "FFFFFF" },
        },
        {
          text: "คะแนน",
          options: { bold: true, fill: { color: C.sky }, color: "FFFFFF" },
        },
      ],
      ["🔵 ทีมพุทธ", ""],
      ["🟢 ทีมธรรม", ""],
      ["🟡 ทีมปัญญา", ""],
      ["🔴 ทีมเมตตา", ""],
      ["🟣 ทีมสมาธิ", ""],
    ];
    slide.addTable(teamRows, {
      x: 2.4,
      y: 1.4,
      w: 8.5,
      colW: [5.2, 3.3],
      border: [
        { pt: 1, color: "CBD5E1" },
        { pt: 1, color: "CBD5E1" },
        { pt: 1, color: "CBD5E1" },
        { pt: 1, color: "CBD5E1" },
      ],
      fontFace: FONT,
      fontSize: 20,
      color: C.text,
      align: "center",
      valign: "middle",
      rowH: 0.7,
    });
    addButton(slide, pptx, {
      x: 10.0,
      y: 6.7,
      w: 2.8,
      h: 0.45,
      label: "เริ่มข้อที่ 1 →",
      fill: C.accent,
      slideTo: characterPlans[0].ready,
    });
  }

  // —— Characters ——
  characterPlans.forEach((plan, characterIndex) => {
    const { character, ready, clues, reveal } = plan;
    const questionNo = characterIndex + 1;
    const nextReady =
      characterIndex < characterPlans.length - 1
        ? characterPlans[characterIndex + 1].ready
        : ENDING_SLIDE;

    // Ready (เหมือนก่อนเริ่มคำถามบนเว็บ)
    {
      const slide = pptx.addSlide();
      addBgWash(slide, pptx);
      addHeader(
        slide,
        `🎮 ข้อที่ ${questionNo} / ${gameCharacters.length}`,
        "ยังไม่เปิดคำใบ้ — กดเริ่มคำถามเมื่อพร้อม",
      );
      addScorePanel(slide, pptx);

      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.45,
        y: 1.2,
        w: 9.15,
        h: 4.85,
        fill: { color: C.white },
        shadow: cardShadow(),
        rectRadius: 0.22,
        line: { color: C.cardBorder, pt: 1 },
      });
      slide.addText("พร้อมแล้วกด เริ่มคำถาม", {
        x: 0.8,
        y: 2.7,
        w: 8.4,
        h: 0.55,
        fontSize: 28,
        bold: true,
        color: C.text,
        align: "center",
        fontFace: FONT,
      });
      slide.addText("ยังไม่เปิดคำใบ้ จนกว่าจะกดเริ่ม — เหมือนหน้าเว็บ", {
        x: 0.8,
        y: 3.4,
        w: 8.4,
        h: 0.4,
        fontSize: 14,
        color: C.muted,
        align: "center",
        fontFace: FONT,
      });

      addTeacherBar(slide, pptx, [
        {
          label: "▶ เริ่มคำถาม",
          fill: "38BDF8",
          slideTo: clues[0],
          tooltip: "เปิดคำใบ้ข้อ 1",
        },
        {
          label: "กระดานคะแนน",
          fill: C.secondary,
          slideTo: SCOREBOARD_SLIDE,
        },
        {
          label: "ข้ามไปเฉลย",
          fill: "FCA5A5",
          slideTo: reveal,
        },
      ]);
    }

    // Clue slides
    character.clues.forEach((clue, clueIndex) => {
      const clueNo = clueIndex + 1;
      const points = getPointsForClue(clueNo);
      const nextClue = clueIndex < 9 ? clues[clueIndex + 1] : null;
      const slide = pptx.addSlide();
      addBgWash(slide, pptx);
      addHeader(
        slide,
        `🎮 ข้อที่ ${questionNo} / ${gameCharacters.length}`,
        `Classroom Mode · คำใบ้ทีละข้อ`,
      );
      addScorePanel(slide, pptx);

      // Question card
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.45,
        y: 1.15,
        w: 9.15,
        h: 4.9,
        fill: { color: C.white },
        shadow: cardShadow(),
        rectRadius: 0.22,
        line: { color: C.cardBorder, pt: 1 },
      });

      slide.addText(`คำใบ้ที่ ${clueNo} จาก 10`, {
        x: 0.75,
        y: 1.4,
        w: 4.5,
        h: 0.35,
        fontSize: 14,
        bold: true,
        color: C.sky,
        fontFace: FONT,
      });
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 7.0,
        y: 1.35,
        w: 2.3,
        h: 0.4,
        fill: { color: C.amberSoft },
        rectRadius: 0.2,
      });
      slide.addText(`มูลค่า ${points} คะแนน`, {
        x: 7.0,
        y: 1.35,
        w: 2.3,
        h: 0.4,
        fontSize: 12,
        bold: true,
        color: "92400E",
        align: "center",
        valign: "middle",
        fontFace: FONT,
      });

      slide.addText(`“${clue}”`, {
        x: 0.85,
        y: 2.2,
        w: 8.35,
        h: 2.6,
        fontSize: clue.length > 55 ? 24 : 30,
        bold: true,
        color: C.text,
        align: "center",
        valign: "middle",
        fontFace: FONT,
      });

      // Progress bar
      const progressW = 7.5;
      const filled = (clueNo / 10) * progressW;
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 1.25,
        y: 5.3,
        w: progressW,
        h: 0.18,
        fill: { color: "E5E7EB" },
        rectRadius: 0.1,
      });
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 1.25,
        y: 5.3,
        w: Math.max(0.3, filled),
        h: 0.18,
        fill: { color: C.primary },
        rectRadius: 0.1,
      });
      slide.addText(`${clueNo}/10`, {
        x: 8.85,
        y: 5.2,
        w: 0.6,
        h: 0.35,
        fontSize: 11,
        color: C.muted,
        fontFace: FONT,
      });

      const controlButtons = [];
      if (nextClue) {
        controlButtons.push({
          label: "เปิดคำใบ้ถัดไป",
          fill: "A78BFA",
          slideTo: nextClue,
        });
      }
      controlButtons.push({
        label: "เฉลยถูก / ให้คะแนน",
        fill: "34D399",
        slideTo: reveal,
      });
      controlButtons.push({
        label: "กระดานคะแนน",
        fill: C.secondary,
        slideTo: SCOREBOARD_SLIDE,
      });
      if (nextClue) {
        // เหมือนเว็บ: ตอบผิดไม่เปลี่ยนสไลด์ แค่ให้ทีมถัดไปตอบ
        controlButtons.push({
          label: "ตอบผิด → ทีมถัดไป",
          fill: "FB923C",
          tooltip: "ไม่เปลี่ยนสไลด์ — ให้ทีมถัดไปตอบคำใบ้ข้อนี้",
        });
      } else {
        controlButtons.push({
          label: "ไปหน้าเฉลย",
          fill: "FB923C",
          slideTo: reveal,
        });
      }

      addTeacherBar(slide, pptx, controlButtons.slice(0, 5));
    });

    // Reveal
    {
      const slide = pptx.addSlide();
      addBgWash(slide, pptx);
      addHeader(slide, "เฉลย", `ข้อที่ ${questionNo}`);
      addScorePanel(slide, pptx);

      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.45,
        y: 1.15,
        w: 9.15,
        h: 4.9,
        fill: { color: C.white },
        shadow: cardShadow(),
        rectRadius: 0.22,
        line: { color: "A7F3D0", pt: 1.5 },
      });
      slide.addText(character.name, {
        x: 0.75,
        y: 1.5,
        w: 8.55,
        h: 0.7,
        fontSize: 28,
        bold: true,
        color: C.navy,
        align: "center",
        fontFace: FONT,
      });
      slide.addText(character.summary, {
        x: 0.9,
        y: 2.4,
        w: 8.25,
        h: 2.0,
        fontSize: 16,
        color: C.text,
        align: "center",
        fontFace: FONT,
      });
      slide.addText(`คุณธรรม: ${character.virtues.join(" · ")}`, {
        x: 0.9,
        y: 4.5,
        w: 8.25,
        h: 0.45,
        fontSize: 15,
        bold: true,
        color: "B45309",
        align: "center",
        fontFace: FONT,
      });
      slide.addText(`เรียนรู้เพิ่มเติม: ${character.personPage}`, {
        x: 0.9,
        y: 5.15,
        w: 8.25,
        h: 0.35,
        fontSize: 12,
        color: C.muted,
        align: "center",
        fontFace: FONT,
      });

      addTeacherBar(slide, pptx, [
        {
          label:
            characterIndex < characterPlans.length - 1
              ? "ข้อต่อไป →"
              : "จบเกม →",
          fill: "E879F9",
          slideTo: nextReady,
        },
        {
          label: "กระดานคะแนน",
          fill: C.secondary,
          slideTo: SCOREBOARD_SLIDE,
        },
        {
          label: "ดูคำใบ้ข้อ 1",
          fill: "38BDF8",
          slideTo: clues[0],
        },
      ]);
    }
  });

  // Ending
  {
    const slide = pptx.addSlide();
    slide.background = { color: C.navy };
    slide.addText("🏆 จบเกมแล้ว", {
      x: 0.8,
      y: 2.2,
      w: 11.7,
      h: 0.8,
      fontSize: 42,
      bold: true,
      color: C.white,
      align: "center",
      fontFace: FONT,
    });
    slide.addText("สรุปคะแนน · ชื่นชมผู้ชนะ · ทบทวนสิ่งที่ได้เรียนรู้", {
      x: 0.8,
      y: 3.2,
      w: 11.7,
      h: 0.45,
      fontSize: 18,
      color: C.primary,
      align: "center",
      fontFace: FONT,
    });
    addButton(slide, pptx, {
      x: 4.4,
      y: 4.3,
      w: 2.2,
      h: 0.5,
      label: "กระดานคะแนน",
      fill: C.secondary,
      slideTo: SCOREBOARD_SLIDE,
    });
    addButton(slide, pptx, {
      x: 6.8,
      y: 4.3,
      w: 2.2,
      h: 0.5,
      label: "เล่นใหม่",
      fill: C.primary,
      slideTo: characterPlans[0].ready,
    });
  }

  await mkdir(outputDir, { recursive: true });
  await pptx.writeFile({ fileName: outputFile });
  await injectFadeTransitions(outputFile);
  return { file: outputFile, slides: ENDING_SLIDE };
}

try {
  const result = await buildPresentation();
  console.log(`Created: ${result.file} (${result.slides} slides)`);
  console.log("Features: web-like layout, teacher buttons, fade transitions");
} catch (error) {
  console.error(error);
  process.exit(1);
}
