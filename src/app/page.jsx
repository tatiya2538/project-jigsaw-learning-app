import Image from "next/image";
import Link from "next/link";

import { characters } from "../data/characters";

const characterList = Object.values(characters);

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium text-primary shadow-soft">
          <span className="h-2 w-2 rounded-full bg-accent" />
          Buddhist Learning Card
        </span>

        <h1 className="text-3xl font-bold text-text sm:text-4xl">
          Jigsaw Learning
        </h1>
        <p className="mt-3 text-base leading-relaxed text-text/75 sm:text-lg">
          เลือกบุคคลสำคัญเพื่อเรียนรู้ภายใน 2–3 นาที ก่อนไปอธิบายให้เพื่อนฟัง
        </p>
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
                alt={character.data.name}
                fill
                sizes="(max-width: 640px) 100vw, 320px"
                className="object-contain p-2 transition duration-300 group-hover:scale-105"
              />
            </div>
            <p className="text-sm font-medium text-primary">
              บัตรที่ {index + 1}
            </p>
            <h2 className="mt-2 text-lg font-bold text-text group-hover:text-primary sm:text-xl">
              {character.data.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-text/70 sm:text-base">
              {character.data.shortTitle}
            </p>
            <span className="mt-4 inline-flex text-sm font-semibold text-accent">
              เริ่มเรียนรู้ →
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
