"use client";

import { motion } from "framer-motion";

export default function GameHeader({ questionNumber, totalQuestions }) {
  return (
    <header className="text-center">
      <motion.h1
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold leading-snug text-text sm:text-3xl md:text-4xl"
      >
        🎮 เกมทาย &quot;ฉันคือใคร?&quot;
      </motion.h1>
      <p className="mt-2 text-sm text-text/65 sm:text-base">
        อ่านคำใบ้จากยากไปง่าย แล้วทายบุคคลสำคัญทางพระพุทธศาสนา
      </p>
      <motion.p
        key={questionNumber}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow-soft"
      >
        คำถามที่ {questionNumber} / {totalQuestions}
      </motion.p>
    </header>
  );
}
