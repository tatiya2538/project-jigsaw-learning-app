import { NextResponse } from "next/server";

import { createCharacter, listCharacterEntries } from "../../../../lib/catalog";

export async function GET() {
  const characters = await listCharacterEntries();
  return NextResponse.json({ characters });
}

export async function POST(request) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
  }

  try {
    const result = await createCharacter({
      slug: body.slug,
      name: body.name,
      shortTitle: body.shortTitle,
      image: body.image,
      audio: body.audio ?? null,
    });

    return NextResponse.json({
      ok: true,
      entry: result.entry,
      catalogUrl: result.catalog.url,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "สร้างบุคคลไม่สำเร็จ" },
      { status: 400 },
    );
  }
}
