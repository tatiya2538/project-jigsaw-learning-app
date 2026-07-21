"use client";

import Image from "next/image";
import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";

export default function RevealModal({
  open,
  question,
  feedback,
  lastAward,
  isLastQuestion,
  onNext,
  onRestart,
}) {
  return (
    <AnimatePresence>
      {open && question ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.35 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-sky-400/25 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-6 shadow-2xl sm:p-8"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-emerald-400/15 blur-3xl" />

            <p className="text-sm font-semibold text-amber-300">
              {feedback === "correct"
                ? "✅ ตอบถูก"
                : "✨ เฉลยคำตอบ"}
            </p>

            {lastAward ? (
              <p className="mt-2 text-base font-bold text-emerald-300">
                {lastAward.teamName} ได้ +{lastAward.points} คะแนน
              </p>
            ) : null}

            <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
              <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-slate-800 shadow-xl sm:h-48 sm:w-48">
                <Image
                  src={question.image}
                  alt={question.answer}
                  fill
                  sizes="192px"
                  className="object-contain p-2"
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  {question.answer}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                  {question.summary}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {question.virtues.map((virtue) => (
                    <span
                      key={virtue}
                      className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-200"
                    >
                      {virtue}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/${question.slug}`}
                className="inline-flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg sm:flex-none"
              >
                เรียนรู้เพิ่มเติม
              </Link>
              <button
                type="button"
                onClick={onNext}
                className="inline-flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-400 to-fuchsia-500 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg sm:flex-none"
              >
                {isLastQuestion ? "ดูสรุปคะแนน" : "ข้อถัดไป"}
              </button>
              <button
                type="button"
                onClick={onRestart}
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-slate-200"
              >
                เริ่มใหม่
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
