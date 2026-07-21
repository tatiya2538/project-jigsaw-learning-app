"use client";

import { motion } from "framer-motion";

import { getMedal } from "../../data/gameData";

export default function GameOverModal({ open, rankedTeams, onRestart }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl rounded-[2rem] border border-amber-200 bg-white p-6 text-text shadow-card sm:p-8"
      >
        <p className="text-center text-sm font-semibold text-amber-700">
          Game Over
        </p>
        <h2 className="mt-2 text-center text-3xl font-bold text-text sm:text-4xl">
          🏆 อันดับสุดท้าย
        </h2>
        <p className="mt-2 text-center text-text/65">
          ยินดีด้วยทุกทีม — เกมจบแล้ว
        </p>

        <div className="mt-6 space-y-3">
          {rankedTeams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex items-center justify-between rounded-2xl border border-secondary/40 bg-background px-4 py-4"
              style={{ boxShadow: `inset 4px 0 0 ${team.color}` }}
            >
              <div>
                <p className="text-lg font-bold text-text">
                  {getMedal(index)}{" "}
                  {index === 0 ? "Champion · " : ""}
                  {team.name}
                </p>
              </div>
              <p className="text-2xl font-bold text-amber-700">{team.score}</p>
            </motion.div>
          ))}
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="mt-7 w-full rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 px-5 py-4 text-lg font-bold text-slate-950"
        >
          เล่นใหม่
        </button>
      </motion.div>
    </div>
  );
}
