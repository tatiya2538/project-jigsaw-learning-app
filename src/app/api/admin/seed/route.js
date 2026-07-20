import { NextResponse } from "next/server";

import { seedAllCharacterContent } from "../../../../lib/content";

export async function POST() {
  try {
    const results = await seedAllCharacterContent();
    return NextResponse.json({ ok: true, results });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "ซิงค์ไม่สำเร็จ" },
      { status: 500 },
    );
  }
}
