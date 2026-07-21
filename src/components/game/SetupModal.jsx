"use client";

import { useState } from "react";

import { motion } from "framer-motion";

import {
  QUESTION_COUNT_OPTIONS,
  TEAM_PRESETS,
} from "../../data/gameData";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl rounded-[2rem] bg-white p-6 text-text shadow-card sm:p-8"
      >
        <p className="text-sm font-semibold text-amber-700">Classroom Mode</p>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
          🎮 ตั้งค่าเกมทาย &quot;ฉันคือใคร?&quot;
        </h2>
        <p className="mt-2 text-sm text-text/65">
          โหมดครูพาเล่นบนโปรเจกเตอร์ — เลือกจำนวนทีม ตั้งชื่อ แล้วเริ่มเกมได้เลย
        </p>
        <a
          href="/game/who-am-i-classroom.pptx"
          download
          className="mt-4 inline-flex rounded-2xl bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900"
        >
          📥 ดาวน์โหลดเวอร์ชัน PowerPoint
        </a>

        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold text-text">จำนวนทีม</p>
          <div className="flex flex-wrap gap-2">
            {[2, 3, 4, 5].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setTeamCount(count)}
                className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
                  teamCount === count
                    ? "bg-amber-400 text-slate-950"
                    : "bg-background text-text hover:bg-secondary/50"
                }`}
              >
                {count} ทีม
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-text">จำนวนข้อ</p>
          <div className="flex flex-wrap gap-2">
            {QUESTION_COUNT_OPTIONS.map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setQuestionCount(count)}
                className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
                  questionCount === count
                    ? "bg-sky-400 text-slate-950"
                    : "bg-background text-text hover:bg-secondary/50"
                }`}
              >
                {count} ข้อ
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <p className="text-sm font-semibold text-text">ชื่อทีม</p>
          {names.slice(0, teamCount).map((name, index) => (
            <input
              key={TEAM_PRESETS[index].name}
              value={name}
              onChange={(event) => updateName(index, event.target.value)}
              className="w-full rounded-2xl border border-secondary bg-background px-4 py-3 text-base text-text outline-none focus:ring-2 focus:ring-amber-300"
              style={{ borderLeft: `4px solid ${TEAM_PRESETS[index].color}` }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleStart}
          className="mt-7 w-full rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 px-5 py-4 text-lg font-bold text-slate-950 shadow-soft"
        >
          เริ่มเกม
        </button>
      </motion.div>
    </div>
  );
}
