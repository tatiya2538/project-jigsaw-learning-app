"use client";

import { motion } from "framer-motion";

const PIECES = Array.from({ length: 36 }, (_, index) => index);

export default function ConfettiBurst({ active }) {
  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {PIECES.map((piece) => {
        const left = `${(piece * 29) % 100}%`;
        const delay = (piece % 9) * 0.035;
        const color =
          piece % 4 === 0
            ? "#fbbf24"
            : piece % 4 === 1
              ? "#38bdf8"
              : piece % 4 === 2
                ? "#34d399"
                : "#f472b6";

        return (
          <motion.span
            key={piece}
            initial={{ opacity: 1, y: -30, rotate: 0 }}
            animate={{
              opacity: [1, 1, 0],
              y: ["0vh", "90vh"],
              x: [0, (piece % 2 === 0 ? 1 : -1) * (18 + (piece % 6) * 10)],
              rotate: [0, 200 + piece * 10],
            }}
            transition={{ duration: 1.5, delay, ease: "easeOut" }}
            className="absolute top-0 h-2.5 w-2.5 rounded-sm"
            style={{ left, backgroundColor: color }}
          />
        );
      })}
    </div>
  );
}
