"use client";

import { motion } from "framer-motion";

export default function RaceAwardPanel({
  teams,
  potentialPoints,
  pickingWinner,
  onAwardTeam,
  onBeginPick,
  onCancelPick,
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-xl sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        โหมดแย่งตอบ
      </p>
      <p className="mt-1 text-sm text-slate-300">
        ทุกทีมตอบพร้อมกัน — ครูกดทีมที่ตอบถูก
      </p>
      <p className="mt-3 rounded-2xl border border-amber-300/30 bg-amber-400/10 px-3 py-2 text-sm font-bold text-amber-100">
        ตอบถูกได้ +{potentialPoints} คะแนน
      </p>

      {pickingWinner ? (
        <div className="mt-4 flex min-h-0 flex-1 flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-bold text-emerald-200">เลือกทีมที่ตอบถูก</p>
            <button
              type="button"
              onClick={onCancelPick}
              className="text-xs font-semibold text-slate-400 hover:text-white"
            >
              ยกเลิก
            </button>
          </div>
          <div className="flex min-h-0 flex-1 flex-col justify-center gap-2">
            {teams.map((team, index) => (
              <motion.button
                key={team.id}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => onAwardTeam(team.id)}
                className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left font-bold text-slate-950 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${team.color}, ${team.color}cc)`,
                }}
              >
                <span>
                  {index + 1}. {team.name}
                </span>
                <span>+{potentialPoints}</span>
              </motion.button>
            ))}
          </div>
          <p className="pt-1 text-xs text-slate-400">
            ทางลัด: กดปุ่มตัวเลข 1–{Math.min(teams.length, 5)}
          </p>
        </div>
      ) : (
        <div className="mt-4 flex min-h-0 flex-1 flex-col gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={onBeginPick}
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg"
          >
            ✅ มีทีมตอบถูก — เลือกทีม
          </motion.button>
          <div className="flex min-h-0 flex-1 flex-col justify-center gap-2">
            {teams.map((team, index) => (
              <button
                key={team.id}
                type="button"
                onClick={() => onAwardTeam(team.id)}
                className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-left text-sm font-semibold text-white transition hover:bg-white/10"
                style={{ borderLeft: `4px solid ${team.color}` }}
              >
                กดให้คะแนน {team.name}
                <span className="ml-2 text-xs text-slate-400">[{index + 1}]</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
