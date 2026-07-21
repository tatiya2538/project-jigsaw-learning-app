import { notFound } from "next/navigation";

import CharacterPage from "../../components/CharacterPage";

import { characterSlugs } from "../../data/characters";

import { getCharacterEntry } from "../../lib/catalog";
import { SITE_NAME } from "../../lib/config";
import { getCharacterContent } from "../../lib/content";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return characterSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const character = await getCharacterEntry(slug, { activeOnly: true });
  const content = character ? await getCharacterContent(slug) : null;

  if (!content) {
    return {
      title: `ไม่พบหน้า | ${SITE_NAME}`,
    };
  }

  return {
    title: `${content.name} | ${SITE_NAME}`,
    description: content.heroIntro,
  };
}

export default async function CharacterRoutePage({ params }) {
  const { slug } = await params;
  const character = await getCharacterEntry(slug, { activeOnly: true });
  const content = character ? await getCharacterContent(slug) : null;

  if (!character || !content) {
    notFound();
  }

  return (
    <CharacterPage
      characterData={content}
      imageSrc={character.image}
      audioSrc={character.audio}
    />
  );
}
