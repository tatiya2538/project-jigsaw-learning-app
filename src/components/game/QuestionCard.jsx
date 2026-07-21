"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function QuestionCard({
  clueNumber,
  totalClues,
  clueText,
  potentialPoints,
  questionStarted,
  clueRevealed,
}) {
  let body = null;

  if (!questionStarted) {
    body = (
      <div className="relative py-16 text-center">
        <p className="text-lg text-text/70 sm:text-xl">
          พร้อมแล้วกด{" "}
          <span className="font-bold text-amber-700">เริ่มคำถาม</span>
        </p>
        <p className="mt-2 text-sm text-text/55">
          ยังไม่เปิดคำใบ้ จนกว่าจะกดเริ่มจับเวลา
        </p>
      </div>
    );
  } else if (!clueRevealed) {
    body = (
      <div className="relative py-16 text-center">
        <p className="text-lg font-semibold text-text sm:text-xl">
          คำใบ้ถูกซ่อนไว้
        </p>
        <p className="mt-3 text-base text-text/70 sm:text-lg">
          กด{" "}
          <span className="font-bold text-amber-700">เริ่มจับเวลา</span>{" "}
          เพื่อเปิดคำใบ้และเริ่มนับถอยหลังพร้อมกัน
        </p>
        <p className="mt-2 text-sm text-text/55">
          กด Space เพื่อเริ่ม · กด Space อีกครั้งเพื่อหยุด
        </p>
        <p className="mt-6 text-sm font-medium text-sky-700">
          พร้อมเปิดคำใบ้ที่ {clueNumber} จาก {totalClues} · มูลค่า{" "}
          {potentialPoints} คะแนน
        </p>
      </div>
    );
  } else {
    body = (
      <AnimatePresence mode="wait">
        <motion.div
          key={`${clueNumber}-${clueText}`}
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className="relative"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-sky-700 sm:text-base">
              คำใบ้ที่ {clueNumber} จาก {totalClues}
            </p>
            <p className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">
              มูลค่า {potentialPoints} คะแนน
            </p>
          </div>
          <p className="mt-6 text-center text-2xl font-bold leading-relaxed text-text sm:text-3xl md:text-4xl lg:text-5xl">
            &ldquo;{clueText}&rdquo;
          </p>
          <div className="mx-auto mt-8 h-2.5 max-w-md overflow-hidden rounded-full bg-secondary/50">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 via-amber-400 to-yellow-300"
              animate={{ width: `${(clueNumber / totalClues) * 100}%` }}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-secondary/40 bg-white p-6 shadow-card sm:p-10">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl" />
      {body}
    </section>
  );
}
