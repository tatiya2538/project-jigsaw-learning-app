import { notFound } from "next/navigation";

import { characterSlugs, getCharacter } from "../../data/characters";

import CharacterPage from "../../components/CharacterPage";

export function generateStaticParams() {
  return characterSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const character = getCharacter(slug);

  if (!character) {
    return {
      title: "ไม่พบหน้า | Buddhist Learning Card",
    };
  }

  return {
    title: `${character.data.name} | Buddhist Learning Card`,
    description: character.data.heroIntro,
  };
}

export default async function CharacterRoutePage({ params }) {
  const { slug } = await params;
  const character = getCharacter(slug);

  if (!character) {
    notFound();
  }

  return (
    <CharacterPage
      characterData={character.data}
      imageSrc={character.image}
    />
  );
}
