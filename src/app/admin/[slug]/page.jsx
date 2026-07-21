import { notFound } from "next/navigation";

import AdminEditor from "../../../components/admin/AdminEditor";

import { getCharacterEntry } from "../../../lib/catalog";
import { getCharacterContent } from "../../../lib/content";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default async function AdminEditPage({ params }) {
  const { slug } = await params;
  const character = await getCharacterEntry(slug);

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
