"use client";

import { motion } from "framer-motion";

import { getMedal } from "../../data/gameData";

export default function TeamScoreBoard({ rankedTeams }) {
  return (
    <aside className="shrink-0 rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-xl sm:p-5">
      <h2 className="text-sm font-bold text-sky-100">🏆 กระดานคะแนน</h2>
      <p className="mt-1 text-xs text-slate-400">ตอบถูกข้อละ 1 คะแนน · แย่งตอบ</p>
      <div className="mt-4 space-y-2.5">
        {rankedTeams.map((team, index) => (
          <motion.div
            key={team.id}
            layout
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5"
            style={{ boxShadow: `inset 3px 0 0 ${team.color}` }}
          >
            <p className="truncate text-sm font-bold text-white">
              {getMedal(index)} {team.name}
            </p>
            <motion.p
              key={`${team.id}-${team.score}`}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-lg font-bold text-sky-100"
            >
              {team.score}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </aside>
  );
}
