import {
  CLUES_PER_QUESTION,
  POINTS_PER_CORRECT,
  guessBoardQuestions,
} from "../data/guessBoardData";

const COLORS = {
  navy: "0B1220",
  card: "1E3A5F",
  cardOpen: "0F766E",
  sky: "38BDF8",
  white: "FFFFFF",
  muted: "94A3B8",
  gold: "FBBF24",
  text: "E2E8F0",
  green: "34D399",
  rose: "FB7185",
  violet: "A78BFA",
  slate: "64748B",
};

/** hub + 5 single-card + all-open + reveal */
const SLIDES_PER_QUESTION = 1 + CLUES_PER_QUESTION + 1 + 1;
const TITLE_SLIDE = 1;

function hubSlide(questionIndex) {
  return TITLE_SLIDE + 1 + questionIndex * SLIDES_PER_QUESTION;
}

function singleCardSlide(questionIndex, cardIndex) {
  return hubSlide(questionIndex) + 1 + cardIndex;
}

function allOpenSlide(questionIndex) {
  return hubSlide(questionIndex) + 1 + CLUES_PER_QUESTION;
}

function revealSlide(questionIndex) {
  return allOpenSlide(questionIndex) + 1;
}

function addButton(slide, pptx, { x, y, w, h, label, fill, slideTo, tooltip }) {
  const link = slideTo
    ? { hyperlink: { slide: slideTo, tooltip: tooltip || label } }
    : {};
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    fill: { color: fill },
    rectRadius: 0.1,
    ...link,
  });
  slide.addText(label, {
    x,
    y,
    w,
    h,
    fontSize: 12,
    bold: true,
    color: COLORS.navy,
    align: "center",
    valign: "middle",
    fontFace: "Sarabun",
    ...link,
  });
}

function renderClueCards(slide, pptx, question, openSet) {
  const cardW = 2.2;
  const gap = 0.25;
  const totalW = CLUES_PER_QUESTION * cardW + (CLUES_PER_QUESTION - 1) * gap;
  const startX = (13.333 - totalW) / 2;
  const y = 1.2;

  question.clues.forEach((clue, clueIndex) => {
    const x = startX + clueIndex * (cardW + gap);
    const isOpen = openSet.has(clueIndex);
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: cardW,
      h: 2.9,
      fill: { color: isOpen ? COLORS.cardOpen : COLORS.card },
      rectRadius: 0.16,
    });

    if (isOpen) {
      slide.addText("💡", {
        x,
        y: y + 0.25,
        w: cardW,
        h: 0.35,
        fontSize: 18,
        align: "center",
      });
      slide.addText(clue, {
        x: x + 0.1,
        y: y + 0.7,
        w: cardW - 0.2,
        h: 1.9,
        fontSize: clue.length > 28 ? 12 : 14,
        bold: true,
        color: COLORS.white,
        align: "center",
        valign: "middle",
        fontFace: "Sarabun",
      });
    } else {
      slide.addText(`คุณสมบัติ ${clueIndex + 1}`, {
        x,
        y: y + 1.15,
        w: cardW,
        h: 0.55,
        fontSize: 15,
        bold: true,
        color: COLORS.white,
        align: "center",
        fontFace: "Sarabun",
      });
    }
  });
}

function addOpenNumberButtons(slide, pptx, questionIndex, openSet) {
  const btnW = 1.7;
  const btnGap = 0.15;
  const rowW = CLUES_PER_QUESTION * btnW + (CLUES_PER_QUESTION - 1) * btnGap;
  const rowX = (13.333 - rowW) / 2;

  for (let i = 0; i < CLUES_PER_QUESTION; i += 1) {
    const isOpen = openSet.has(i);
    addButton(slide, pptx, {
      x: rowX + i * (btnW + btnGap),
      y: 4.4,
      w: btnW,
      h: 0.45,
      label: isOpen ? `ใบ ${i + 1} ✓` : `เปิดใบ ${i + 1}`,
      fill: isOpen ? COLORS.slate : COLORS.sky,
      slideTo: isOpen
        ? singleCardSlide(questionIndex, i)
        : singleCardSlide(questionIndex, i),
      tooltip: `เปิดแผ่นคุณสมบัติ ${i + 1}`,
    });
  }
}

function addJudgeButtons(slide, pptx, questionIndex, wrongTargetSlide) {
  addButton(slide, pptx, {
    x: 2.4,
    y: 5.15,
    w: 2.7,
    h: 0.5,
    label: "✅ ตอบถูก / ไปเฉลย",
    fill: COLORS.green,
    slideTo: revealSlide(questionIndex),
  });
  addButton(slide, pptx, {
    x: 5.3,
    y: 5.15,
    w: 2.7,
    h: 0.5,
    label: "❌ ยังไม่ถูก",
    fill: COLORS.rose,
    slideTo: wrongTargetSlide,
  });
  addButton(slide, pptx, {
    x: 8.2,
    y: 5.15,
    w: 2.7,
    h: 0.5,
    label: "เปิดครบทุกใบ",
    fill: COLORS.violet,
    slideTo: allOpenSlide(questionIndex),
  });
}

export async function exportGuessBoardPptx(
  questions = guessBoardQuestions,
  fileName = "guess-board-classroom.pptx",
) {
  const PptxGenJS = (await import("pptxgenjs")).default;
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "WIDE", width: 13.333, height: 7.5 });
  pptx.layout = "WIDE";
  pptx.author = "ศูนย์สื่อการเรียนรู้ดิจิทัลพระพุทธศาสนา";
  pptx.title = "เกมเปิดแผ่นป้ายคุณสมบัติ";

  const endingSlide =
    TITLE_SLIDE + 1 + questions.length * SLIDES_PER_QUESTION;

  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.navy };
    slide.addText("🧩 เกมเปิดแผ่นป้ายคุณสมบัติ", {
      x: 0.6,
      y: 2.1,
      w: 12.1,
      h: 0.8,
      fontSize: 38,
      bold: true,
      color: COLORS.white,
      align: "center",
      fontFace: "Sarabun",
    });
    slide.addText(
      `กดปุ่มเปิดใบ 1–5 เลือกหมายเลขได้ · ตอบถูกได้ ${POINTS_PER_CORRECT} คะแนน`,
      {
        x: 0.6,
        y: 3.05,
        w: 12.1,
        h: 0.4,
        fontSize: 17,
        color: COLORS.sky,
        align: "center",
        fontFace: "Sarabun",
      },
    );
    addButton(slide, pptx, {
      x: 5.15,
      y: 4.1,
      w: 3,
      h: 0.55,
      label: "เริ่มข้อที่ 1 →",
      fill: COLORS.sky,
      slideTo: hubSlide(0),
    });
  }

  questions.forEach((question, questionIndex) => {
    const qLabel = `ข้อที่ ${questionIndex + 1} / ${questions.length}`;
    const nextFirst =
      questionIndex < questions.length - 1
        ? hubSlide(questionIndex + 1)
        : endingSlide;

    // Hub — all closed
    {
      const slide = pptx.addSlide();
      slide.background = { color: COLORS.navy };
      slide.addText("🧩 เกมเปิดแผ่นป้ายคุณสมบัติ", {
        x: 0.45,
        y: 0.2,
        w: 8,
        h: 0.35,
        fontSize: 15,
        bold: true,
        color: COLORS.sky,
        fontFace: "Sarabun",
      });
      slide.addText(qLabel, {
        x: 9.3,
        y: 0.2,
        w: 3.5,
        h: 0.35,
        fontSize: 15,
        bold: true,
        color: COLORS.gold,
        align: "right",
        fontFace: "Sarabun",
      });
      renderClueCards(slide, pptx, question, new Set());
      slide.addText(
        `เลือกเปิดแผ่นหมายเลขใดก็ได้ · ถูกได้ +${POINTS_PER_CORRECT} คะแนน`,
        {
          x: 0.5,
          y: 4.05,
          w: 12.3,
          h: 0.3,
          fontSize: 13,
          color: COLORS.muted,
          align: "center",
          fontFace: "Sarabun",
        },
      );
      addOpenNumberButtons(slide, pptx, questionIndex, new Set());
      addJudgeButtons(slide, pptx, questionIndex, hubSlide(questionIndex));
    }

    // Single-card open slides
    for (let cardIndex = 0; cardIndex < CLUES_PER_QUESTION; cardIndex += 1) {
      const slide = pptx.addSlide();
      slide.background = { color: COLORS.navy };
      slide.addText("🧩 เกมเปิดแผ่นป้ายคุณสมบัติ", {
        x: 0.45,
        y: 0.2,
        w: 8,
        h: 0.35,
        fontSize: 15,
        bold: true,
        color: COLORS.sky,
        fontFace: "Sarabun",
      });
      slide.addText(qLabel, {
        x: 9.3,
        y: 0.2,
        w: 3.5,
        h: 0.35,
        fontSize: 15,
        bold: true,
        color: COLORS.gold,
        align: "right",
        fontFace: "Sarabun",
      });
      const openSet = new Set([cardIndex]);
      renderClueCards(slide, pptx, question, openSet);
      slide.addText(
        `เปิดใบ ${cardIndex + 1} · กดหมายเลขอื่นเพื่อสลับดู · ถูก +${POINTS_PER_CORRECT}`,
        {
          x: 0.5,
          y: 4.05,
          w: 12.3,
          h: 0.3,
          fontSize: 13,
          color: COLORS.muted,
          align: "center",
          fontFace: "Sarabun",
        },
      );
      addOpenNumberButtons(slide, pptx, questionIndex, openSet);
      addJudgeButtons(
        slide,
        pptx,
        questionIndex,
        singleCardSlide(questionIndex, cardIndex),
      );
    }

    // All open
    {
      const slide = pptx.addSlide();
      slide.background = { color: COLORS.navy };
      slide.addText("🧩 เกมเปิดแผ่นป้ายคุณสมบัติ", {
        x: 0.45,
        y: 0.2,
        w: 8,
        h: 0.35,
        fontSize: 15,
        bold: true,
        color: COLORS.sky,
        fontFace: "Sarabun",
      });
      slide.addText(qLabel, {
        x: 9.3,
        y: 0.2,
        w: 3.5,
        h: 0.35,
        fontSize: 15,
        bold: true,
        color: COLORS.gold,
        align: "right",
        fontFace: "Sarabun",
      });
      const openSet = new Set([0, 1, 2, 3, 4]);
      renderClueCards(slide, pptx, question, openSet);
      slide.addText(
        `เปิดครบทุกใบ · ถูกได้ +${POINTS_PER_CORRECT} คะแนน`,
        {
          x: 0.5,
          y: 4.05,
          w: 12.3,
          h: 0.3,
          fontSize: 13,
          color: COLORS.muted,
          align: "center",
          fontFace: "Sarabun",
        },
      );
      addOpenNumberButtons(slide, pptx, questionIndex, openSet);
      addJudgeButtons(slide, pptx, questionIndex, allOpenSlide(questionIndex));
    }

    // Reveal
    {
      const slide = pptx.addSlide();
      slide.background = { color: COLORS.navy };
      slide.addText("เฉลย", {
        x: 0.5,
        y: 0.3,
        w: 12.3,
        h: 0.35,
        fontSize: 18,
        bold: true,
        color: COLORS.gold,
        fontFace: "Sarabun",
      });
      slide.addText(question.answer, {
        x: 0.5,
        y: 1.0,
        w: 12.3,
        h: 0.7,
        fontSize: 32,
        bold: true,
        color: COLORS.white,
        align: "center",
        fontFace: "Sarabun",
      });
      slide.addText(question.summary, {
        x: 1.2,
        y: 1.9,
        w: 10.9,
        h: 1.9,
        fontSize: 18,
        color: COLORS.text,
        align: "center",
        fontFace: "Sarabun",
      });
      slide.addText(`คุณธรรม: ${question.virtues.join(" · ")}`, {
        x: 1.2,
        y: 4.0,
        w: 10.9,
        h: 0.4,
        fontSize: 16,
        bold: true,
        color: COLORS.sky,
        align: "center",
        fontFace: "Sarabun",
      });
      slide.addText(`+${POINTS_PER_CORRECT} คะแนน ถ้ามีทีมตอบถูก`, {
        x: 1.2,
        y: 4.55,
        w: 10.9,
        h: 0.35,
        fontSize: 14,
        color: COLORS.gold,
        align: "center",
        fontFace: "Sarabun",
      });
      addButton(slide, pptx, {
        x: 3.2,
        y: 5.3,
        w: 3.2,
        h: 0.55,
        label:
          questionIndex < questions.length - 1 ? "ข้อถัดไป →" : "จบเกม →",
        fill: COLORS.violet,
        slideTo: nextFirst,
      });
      addButton(slide, pptx, {
        x: 6.9,
        y: 5.3,
        w: 3.2,
        h: 0.55,
        label: "กลับไปแผ่นป้าย",
        fill: COLORS.sky,
        slideTo: hubSlide(questionIndex),
      });
    }
  });

  {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.navy };
    slide.addText("🏆 จบเกมแล้ว", {
      x: 0.6,
      y: 2.5,
      w: 12.1,
      h: 0.8,
      fontSize: 40,
      bold: true,
      color: COLORS.white,
      align: "center",
      fontFace: "Sarabun",
    });
    slide.addText(`สรุปคะแนน · ข้อละ ${POINTS_PER_CORRECT} คะแนน`, {
      x: 0.6,
      y: 3.5,
      w: 12.1,
      h: 0.4,
      fontSize: 18,
      color: COLORS.gold,
      align: "center",
      fontFace: "Sarabun",
    });
    addButton(slide, pptx, {
      x: 5.15,
      y: 4.4,
      w: 3,
      h: 0.55,
      label: "เล่นใหม่จากข้อ 1",
      fill: COLORS.sky,
      slideTo: hubSlide(0),
    });
  }

  await pptx.writeFile({ fileName });
  return fileName;
}
