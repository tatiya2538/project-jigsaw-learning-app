import { notFound } from "next/navigation";

import CharacterPage from "../../components/CharacterPage";

import { characterSlugs, getCharacter } from "../../data/characters";

import { getCharacterContent } from "../../lib/content";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return characterSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const content = await getCharacterContent(slug);

  if (!content) {
    return {
      title: "ไม่พบหน้า | Buddhist Learning Card",
    };
  }

  return {
    title: `${content.name} | Buddhist Learning Card`,
    description: content.heroIntro,
  };
}

export default async function CharacterRoutePage({ params }) {
  const { slug } = await params;
  const character = getCharacter(slug);
  const content = await getCharacterContent(slug);

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
