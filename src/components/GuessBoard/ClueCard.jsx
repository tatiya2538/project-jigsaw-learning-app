"use client";

import { motion } from "framer-motion";

export default function ClueCard({ index, clue, isOpen, onOpen }) {
  const canClick = Boolean(onOpen) && !isOpen;

  return (
    <button
      type="button"
      disabled={!canClick}
      onClick={() => onOpen?.(index)}
      className={`perspective-[1200px] h-36 w-full text-left sm:h-40 md:h-44 lg:h-48 ${
        canClick
          ? "cursor-pointer transition hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
          : "cursor-default"
      }`}
      aria-label={
        isOpen
          ? `คุณสมบัติ ${index + 1}: ${clue}`
          : `เปิดคุณสมบัติ ${index + 1}`
      }
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isOpen ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-sky-400/25 bg-gradient-to-br from-sky-700/90 via-blue-800/90 to-slate-900/95 p-4 shadow-[0_0_30px_rgba(56,189,248,0.18)] backdrop-blur-xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="mb-2 text-3xl">🟦</span>
          <p className="text-center text-base font-bold text-white sm:text-lg">
            คุณสมบัติ {index + 1}
          </p>
          {canClick ? (
            <p className="mt-2 text-center text-[11px] font-semibold text-sky-200/90">
              คลิกเพื่อเปิด · กด {index + 1}
            </p>
          ) : (
            <div className="mt-3 h-1.5 w-12 rounded-full bg-sky-300/50" />
          )}
        </div>

        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-emerald-300/30 bg-gradient-to-br from-teal-600/95 via-emerald-700/90 to-slate-900/95 p-4 shadow-[0_0_34px_rgba(45,212,191,0.25)] backdrop-blur-xl"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <motion.span
            initial={false}
            animate={isOpen ? { scale: [0.8, 1.15, 1], opacity: 1 } : {}}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="mb-2 text-3xl"
          >
            💡
          </motion.span>
          <p className="text-center text-sm font-bold leading-snug text-white sm:text-base md:text-lg">
            {clue}
          </p>
        </div>
      </motion.div>
    </button>
  );
}
