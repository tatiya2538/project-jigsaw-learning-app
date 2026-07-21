"use client";

import { motion } from "framer-motion";

import { KEYBOARD_HINTS } from "../../data/gameData";

export default function GameHeader({ title, totalScore }) {
  return (
    <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-text sm:text-3xl lg:text-4xl"
        >
          {title}
        </motion.h1>
        <p className="mt-1 text-sm text-text/65">
          Classroom Game Show · โหมดครูพาเล่น
        </p>
      </div>

      <motion.div
        key={totalScore}
        initial={{ scale: 1.08, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-2xl bg-amber-100 px-5 py-3 text-center shadow-soft"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
          คะแนนรวมทุกทีม
        </p>
        <p className="text-2xl font-bold text-text sm:text-3xl">⭐ {totalScore}</p>
      </motion.div>

      <div className="hidden flex-wrap gap-2 xl:flex">
        {KEYBOARD_HINTS.map((item) => (
          <span
            key={item.key}
            className="rounded-full bg-white px-3 py-1 text-xs text-text/70 shadow-soft"
          >
            <kbd className="font-bold text-amber-700">{item.key}</kbd> {item.label}
          </span>
        ))}
      </div>
    </header>
  );
}
