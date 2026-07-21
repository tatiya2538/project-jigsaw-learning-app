import { NextResponse } from "next/server";

import { setGameActive } from "../../../../../lib/catalog";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);

  if (typeof body?.active !== "boolean") {
    return NextResponse.json(
      { error: "ต้องส่ง active เป็น true หรือ false" },
      { status: 400 },
    );
  }

  try {
    const catalog = await setGameActive(id, body.active);
    const entry = catalog.games.find((item) => item.id === id);

    return NextResponse.json({
      ok: true,
      entry,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "อัปเดตสถานะเกมไม่สำเร็จ" },
      { status: 400 },
    );
  }
}
