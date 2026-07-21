"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";

export default function ResultModal({
  open,
  character,
  earnedPoints,
  onNext,
  isLastQuestion,
}) {
  if (!open || !character) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 py-6 sm:items-center">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-white p-6 shadow-card sm:p-8"
      >
        <motion.p
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center text-2xl font-bold text-emerald-600"
        >
          +{earnedPoints} คะแนน
        </motion.p>
        <p className="mt-1 text-center text-sm font-medium text-text/60">
          คำตอบถูกต้อง!
        </p>

        <div className="relative mx-auto mt-5 h-40 w-40 overflow-hidden rounded-full bg-gradient-to-br from-secondary via-amber-100 to-orange-100 shadow-soft">
          <Image
            src={character.image}
            alt={character.name}
            fill
            sizes="160px"
            className="object-contain p-2"
          />
        </div>

        <h2 className="mt-4 text-center text-xl font-bold text-text sm:text-2xl">
          {character.name}
        </h2>
        <p className="mt-3 text-center text-sm leading-relaxed text-text/75 sm:text-base">
          {character.shortBio}
        </p>

        <div className="mt-5">
          <p className="text-center text-sm font-semibold text-primary">
            คุณธรรมที่ได้รับ
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {character.virtues.map((virtue) => (
              <span
                key={virtue}
                className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800"
              >
                {virtue}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/${character.slug}`}
            className="inline-flex flex-1 items-center justify-center rounded-2xl border border-secondary bg-background px-4 py-3 text-sm font-bold text-text"
          >
            เรียนรู้เพิ่มเติม
          </Link>
          <button
            type="button"
            onClick={onNext}
            className="flex-1 rounded-2xl bg-gradient-to-r from-primary to-amber-500 px-4 py-3 text-sm font-bold text-white shadow-soft"
          >
            {isLastQuestion ? "ดูผลสรุป" : "คำถามถัดไป"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
