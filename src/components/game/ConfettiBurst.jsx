"use client";

import { motion } from "framer-motion";

const PIECES = Array.from({ length: 28 }, (_, index) => index);

export default function ConfettiBurst({ active }) {
  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {PIECES.map((piece) => {
        const left = `${(piece * 37) % 100}%`;
        const delay = (piece % 8) * 0.04;
        const color =
          piece % 3 === 0
            ? "#f59e0b"
            : piece % 3 === 1
              ? "#10b981"
              : "#fbbf24";

        return (
          <motion.span
            key={piece}
            initial={{ opacity: 1, y: -20, x: 0, rotate: 0 }}
            animate={{
              opacity: [1, 1, 0],
              y: ["0vh", "85vh"],
              x: [0, (piece % 2 === 0 ? 1 : -1) * (20 + (piece % 5) * 8)],
              rotate: [0, 180 + piece * 12],
            }}
            transition={{ duration: 1.4, delay, ease: "easeOut" }}
            className="absolute top-0 h-2.5 w-2.5 rounded-sm"
            style={{ left, backgroundColor: color }}
          />
        );
      })}
    </div>
  );
}
