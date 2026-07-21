import Image from "next/image";
import Link from "next/link";

import Footer from "../components/Footer";

import { listGameEntries } from "../lib/catalog";
import { SITE_NAME } from "../lib/config";
import { listCharactersForUi } from "../lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [characterList, games] = await Promise.all([
    listCharactersForUi(),
    listGameEntries({ activeOnly: true }),
  ]);

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-2xl font-bold leading-snug text-text sm:text-3xl md:text-4xl">
          {SITE_NAME}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-text/75 sm:text-lg">
          เลือกบุคคลสำคัญเพื่อเรียนรู้ภายใน 2–3 นาที ก่อนไปอธิบายให้เพื่อนฟัง
        </p>
        {games.length ? (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {games.map((game) => (
              <Link
                key={game.id}
                href={game.href}
                className={`inline-flex rounded-2xl bg-gradient-to-r ${game.tone} px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:scale-[1.02]`}
              >
                {game.emoji} {game.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        {characterList.map((character, index) => (
          <Link
            key={character.slug}
            href={`/${character.slug}`}
            className="group rounded-3xl bg-white p-5 text-left shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-6 animate-fade-in-up"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="relative mb-4 h-36 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-secondary via-amber-50 to-orange-50">
              <Image
                src={character.image}
                alt={character.data?.name || character.label}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-contain p-2 transition duration-300 group-hover:scale-105"
              />
            </div>
            <h2 className="text-lg font-bold text-text">
              {character.data?.name || character.label}
            </h2>
            <p className="mt-1 text-sm text-primary">
              {character.data?.shortTitle}
            </p>
          </Link>
        ))}
      </div>

      <Footer />
    </main>
  );
}
