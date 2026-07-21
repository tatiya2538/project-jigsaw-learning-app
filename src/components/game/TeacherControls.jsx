"use client";

import { motion } from "framer-motion";

const controls = [
  { id: "startQuestion", label: "เริ่มคำถาม", tone: "from-sky-400 to-blue-500" },
  { id: "nextClue", label: "เปิดคำใบ้ถัดไป (+สลับทีม)", tone: "from-indigo-400 to-violet-500" },
  { id: "startTimer", label: "เริ่มจับเวลา (Space)", tone: "from-amber-400 to-yellow-400" },
  { id: "stopTimer", label: "หยุดเวลา (Space)", tone: "from-slate-400 to-slate-500" },
  { id: "correct", label: "เฉลยถูก / ให้คะแนน", tone: "from-emerald-400 to-teal-500" },
  { id: "wrong", label: "ตอบผิด / ทีมถัดไป", tone: "from-orange-400 to-rose-500" },
  { id: "nextQuestion", label: "ข้อต่อไป", tone: "from-fuchsia-400 to-pink-500" },
  { id: "restart", label: "Restart", tone: "from-slate-500 to-slate-700" },
];

export default function TeacherControls({
  disabledMap = {},
  onAction,
}) {
  return (
    <section className="rounded-[2rem] border border-secondary/40 bg-white p-4 shadow-card sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-bold text-text">แผงควบคุมครู</h2>
        <p className="text-xs text-text/55">
          Space · N · Enter · Backspace · → · ↓
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {controls.map((item) => (
          <motion.button
            key={item.id}
            type="button"
            whileTap={{ scale: 0.97 }}
            disabled={Boolean(disabledMap[item.id])}
            onClick={() => onAction(item.id)}
            className={`rounded-2xl bg-gradient-to-r ${item.tone} px-3 py-3 text-sm font-bold text-slate-950 shadow-soft disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {item.label}
          </motion.button>
        ))}
      </div>
    </section>
  );
}
