import { NextResponse } from "next/server";

import {
  getOrCreateTtsAudio,
  normalizeTtsParagraphs,
} from "../../../../lib/tts";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const paragraphs = normalizeTtsParagraphs(body?.paragraphs || []);

  if (!paragraphs.length) {
    return NextResponse.json(
      { error: "ยังไม่มีข้อความชีวประวัติให้อ่าน" },
      { status: 400 },
    );
  }

  const totalLength = paragraphs.join("").length;
  if (totalLength > 4000) {
    return NextResponse.json(
      { error: "ข้อความยาวเกินไปสำหรับสร้างเสียง" },
      { status: 400 },
    );
  }

  try {
    const result = await getOrCreateTtsAudio(paragraphs);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[admin/tts]", error);
    return NextResponse.json(
      { error: error.message || "สร้างเสียงไม่สำเร็จ" },
      { status: 500 },
    );
  }
}
