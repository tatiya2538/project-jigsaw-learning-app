"use client";

import { useState } from "react";

import { motion } from "framer-motion";

import { TEAM_PRESETS } from "../../data/gameData";
import { GUESS_BOARD_QUESTION_OPTIONS } from "../../data/guessBoardData";

export default function SetupModal({ open, onStart }) {
  const [teamCount, setTeamCount] = useState(4);
  const [questionCount, setQuestionCount] = useState(10);
  const [names, setNames] = useState(
    TEAM_PRESETS.map((item) => `${item.emoji} ${item.name}`),
  );

  if (!open) return null;

  function updateName(index, value) {
    setNames((prev) => prev.map((name, i) => (i === index ? value : name)));
  }

  function handleStart() {
    onStart({
      teamCount,
      teamNames: names.slice(0, teamCount),
      questions: questionCount,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl rounded-[2rem] border border-sky-400/25 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-6 text-slate-100 shadow-2xl sm:p-8"
      >
        <p className="text-sm font-semibold text-sky-300">Classroom Mode</p>
        <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          🧩 ตั้งค่าเกมเปิดแผ่นป้าย
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          เลือกจำนวนทีม — เปิดแผ่นป้ายหมายเลขใดก็ได้ · ถูกข้อละ 1 คะแนน
        </p>

        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold text-sky-100">จำนวนทีม</p>
          <div className="flex flex-wrap gap-2">
            {[2, 3, 4, 5].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setTeamCount(count)}
                className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
                  teamCount === count
                    ? "bg-sky-400 text-slate-950"
                    : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                }`}
              >
                {count} ทีม
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-sky-100">จำนวนข้อ</p>
          <div className="flex flex-wrap gap-2">
            {GUESS_BOARD_QUESTION_OPTIONS.map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setQuestionCount(count)}
                className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
                  questionCount === count
                    ? "bg-amber-400 text-slate-950"
                    : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                }`}
              >
                {count} ข้อ
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <p className="text-sm font-semibold text-sky-100">ชื่อทีม</p>
          {names.slice(0, teamCount).map((name, index) => (
            <input
              key={TEAM_PRESETS[index].name}
              value={name}
              onChange={(event) => updateName(index, event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-base text-white outline-none focus:ring-2 focus:ring-sky-400/50"
              style={{ borderLeft: `4px solid ${TEAM_PRESETS[index].color}` }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleStart}
          className="mt-7 w-full rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 px-5 py-4 text-lg font-bold text-slate-950 shadow-lg"
        >
          เริ่มเกม
        </button>
      </motion.div>
    </div>
  );
}
