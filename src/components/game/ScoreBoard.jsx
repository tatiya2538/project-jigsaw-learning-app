"use client";

import { motion } from "framer-motion";

export default function ScoreBoard({ score, potentialPoints }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <motion.div
        key={score}
        initial={{ scale: 1.15, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-2xl bg-gradient-to-r from-primary to-amber-400 px-5 py-3 text-base font-bold text-white shadow-soft sm:text-lg"
      >
        ⭐ {score} คะแนน
      </motion.div>
      <div className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-text/70 shadow-soft">
        ทายถูกตอนนี้ได้ +{potentialPoints}
      </div>
    </div>
  );
}
