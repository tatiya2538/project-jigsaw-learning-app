import { NextResponse } from "next/server";

import { getCharacterContent, saveCharacterContent } from "../../../../../lib/content";

export async function GET(_request, { params }) {
  const { slug } = await params;
  const data = await getCharacterContent(slug);

  if (!data) {
    return NextResponse.json({ error: "ไม่พบข้อมูล" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(request, { params }) {
  const { slug } = await params;
  const body = await request.json().catch(() => null);

  if (!body || !body.name) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
  }

  try {
    const blob = await saveCharacterContent(slug, body);
    return NextResponse.json({ ok: true, url: blob.url });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "บันทึกไม่สำเร็จ" },
      { status: 500 },
    );
  }
}
