"use client";

import { motion } from "framer-motion";

export default function QuestionIndicator({
  questionNumber,
  totalQuestions,
}) {
  return (
    <motion.div
      key={questionNumber}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-xl rounded-3xl border border-sky-200 bg-sky-50 px-6 py-4 text-center shadow-soft"
    >
      <div className="mx-auto mb-2 h-px w-24 bg-gradient-to-r from-transparent via-sky-400 to-transparent" />
      <p className="text-2xl font-bold tracking-wide text-text sm:text-3xl md:text-4xl">
        ข้อที่ {questionNumber} / {totalQuestions}
      </p>
      <div className="mx-auto mt-2 h-px w-24 bg-gradient-to-r from-transparent via-sky-400 to-transparent" />
      <div className="mx-auto mt-3 h-2 max-w-xs overflow-hidden rounded-full bg-sky-100">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-amber-400"
          animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        />
      </div>
    </motion.div>
  );
}
