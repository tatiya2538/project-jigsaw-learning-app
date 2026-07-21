"use client";

import { motion } from "framer-motion";

import { getMedal } from "../../data/gameData";

export default function ScoreBoard({ rankedTeams }) {
  return (
    <aside className="rounded-[2rem] border border-secondary/40 bg-white p-5 shadow-card">
      <h2 className="text-lg font-bold text-text">🏆 กระดานคะแนน</h2>
      <div className="mt-4 space-y-3">
        {rankedTeams.map((team, index) => (
          <motion.div
            key={team.id}
            layout
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between rounded-2xl border border-secondary/30 bg-background px-4 py-3"
            style={{ boxShadow: `inset 3px 0 0 ${team.color}` }}
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-text sm:text-base">
                {getMedal(index)} {team.name}
              </p>
            </div>
            <motion.p
              key={`${team.id}-${team.score}`}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-lg font-bold text-text"
            >
              {team.score}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </aside>
  );
}
