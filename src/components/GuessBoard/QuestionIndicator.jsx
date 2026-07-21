"use client";

import { motion } from "framer-motion";

export default function QuestionIndicator({ label }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-sm font-bold text-sky-200 backdrop-blur-md"
    >
      {label}
    </motion.div>
  );
}
