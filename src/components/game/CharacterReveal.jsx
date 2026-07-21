"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";

export default function CharacterReveal({
  open,
  character,
  award,
  teams,
  isLastQuestion,
  onNext,
}) {
  if (!open || !character) return null;

  const winner = teams.find((team) => team.id === award?.teamId);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 py-6 backdrop-blur-sm sm:items-center">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-emerald-200 bg-white p-6 text-text shadow-card sm:p-8"
      >
        {award?.points > 0 ? (
          <motion.p
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center text-3xl font-bold text-emerald-600"
          >
            +{award.points} คะแนน
          </motion.p>
        ) : (
          <p className="text-center text-lg font-semibold text-amber-700">
            เปิดเฉลยแล้ว
          </p>
        )}

        {winner ? (
          <p className="mt-1 text-center text-sm text-text/65">
            ทีมที่ตอบถูก:{" "}
            <span className="font-bold" style={{ color: winner.color }}>
              {winner.name}
            </span>
          </p>
        ) : null}

        <div className="relative mx-auto mt-5 h-44 w-44 overflow-hidden rounded-full bg-gradient-to-br from-amber-100 to-sky-100 ring-4 ring-emerald-200">
          <Image
            src={character.image}
            alt={character.name}
            fill
            sizes="176px"
            className="object-contain p-2"
          />
        </div>

        <h2 className="mt-4 text-center text-2xl font-bold text-text sm:text-3xl">
          {character.name}
        </h2>
        <p className="mt-3 text-center text-sm leading-relaxed text-text/75 sm:text-base">
          {character.summary}
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {character.virtues.map((virtue) => (
            <span
              key={virtue}
              className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800"
            >
              {virtue}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={character.personPage || `/${character.slug}`}
            className="inline-flex flex-1 items-center justify-center rounded-2xl border border-secondary bg-background px-4 py-3 text-sm font-bold text-text"
          >
            เรียนรู้เพิ่มเติม
          </Link>
          <button
            type="button"
            onClick={onNext}
            className="flex-1 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 px-4 py-3 text-sm font-bold text-slate-950"
          >
            {isLastQuestion ? "ดูอันดับสุดท้าย" : "ข้อต่อไป"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
