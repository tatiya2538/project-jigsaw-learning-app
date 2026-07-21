import { NextResponse } from "next/server";

import { setCharacterActive } from "../../../../../lib/catalog";

export async function PATCH(request, { params }) {
  const { slug } = await params;
  const body = await request.json().catch(() => null);

  if (typeof body?.active !== "boolean") {
    return NextResponse.json(
      { error: "ต้องส่ง active เป็น true หรือ false" },
      { status: 400 },
    );
  }

  try {
    const catalog = await setCharacterActive(slug, body.active);
    const entry = catalog.characters.find((item) => item.slug === slug);

    return NextResponse.json({
      ok: true,
      entry,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "อัปเดตสถานะไม่สำเร็จ" },
      { status: 400 },
    );
  }
}
