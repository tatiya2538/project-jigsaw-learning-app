"use client";

import { motion } from "framer-motion";

import { getRank } from "../../data/gameData";

export default function GameOverModal({ open, totalScore, maxScore, onRestart }) {
  if (!open) return null;

  const rank = getRank(totalScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-[2rem] bg-white p-6 text-center shadow-card sm:p-8"
      >
        <p className="text-sm font-semibold text-primary">จบเกมแล้ว</p>
        <h2 className="mt-2 text-2xl font-bold text-text sm:text-3xl">
          ยินดีด้วย!
        </h2>
        <p className="mt-2 text-text/70">คุณทายครบทุกบุคคลแล้ว</p>

        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className={`mx-auto mt-6 rounded-3xl bg-gradient-to-br ${rank.tone} px-5 py-6 shadow-soft`}
        >
          <p className="text-sm font-medium text-text/70">คะแนนรวม</p>
          <p className="mt-1 text-4xl font-bold text-text">
            {totalScore}
            <span className="text-lg font-semibold text-text/60">
              {" "}
              / {maxScore}
            </span>
          </p>
          <p className="mt-3 text-lg font-bold text-text">{rank.title}</p>
        </motion.div>

        <button
          type="button"
          onClick={onRestart}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-primary to-amber-500 px-4 py-3 text-base font-bold text-white shadow-soft"
        >
          เล่นใหม่
        </button>
      </motion.div>
    </div>
  );
}
