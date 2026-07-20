import { notFound } from "next/navigation";

import AdminEditor from "../../../components/admin/AdminEditor";

import { getCharacter } from "../../../data/characters";

import { getCharacterContent } from "../../../lib/content";

export default async function AdminEditPage({ params }) {
  const { slug } = await params;
  const character = getCharacter(slug);

  if (!character) {
    notFound();
  }

  const content = await getCharacterContent(slug);

  return (
    <main className="min-h-screen pb-16">
      <AdminEditor slug={slug} initialData={content} />
    </main>
  );
}
