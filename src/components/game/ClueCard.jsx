"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function ClueCard({ clueNumber, totalClues, clueText }) {
  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={`${clueNumber}-${clueText}`}
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.98 }}
        transition={{ duration: 0.35 }}
        className="rounded-[2rem] bg-white p-6 shadow-card sm:p-8"
      >
        <p className="text-center text-sm font-semibold text-primary sm:text-base">
          คำใบ้ที่ {clueNumber} จาก {totalClues}
        </p>
        <p className="mt-4 text-center text-xl font-bold leading-relaxed text-text sm:text-2xl md:text-3xl">
          &ldquo;{clueText}&rdquo;
        </p>
        <div className="mx-auto mt-6 h-2 max-w-xs overflow-hidden rounded-full bg-secondary/60">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-amber-400"
            initial={{ width: 0 }}
            animate={{ width: `${(clueNumber / totalClues) * 100}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
