"use client";

import { motion } from "framer-motion";

import { GUESS_BOARD_SHORTCUTS } from "../../data/guessBoardData";

const ACTIONS = [
  {
    id: "openAll",
    label: "เปิดแผ่นที่เหลือทั้งหมด",
    tone: "from-sky-400 to-blue-500",
  },
  {
    id: "correct",
    label: "✅ มีทีมตอบถูก",
    tone: "from-emerald-400 to-teal-500",
  },
  {
    id: "wrong",
    label: "❌ ยังไม่ถูก",
    tone: "from-orange-400 to-rose-500",
  },
  {
    id: "reveal",
    label: "เฉลยคำตอบ",
    tone: "from-amber-400 to-yellow-400",
  },
  {
    id: "next",
    label: "ข้อถัดไป",
    tone: "from-violet-400 to-fuchsia-500",
  },
  {
    id: "restart",
    label: "เริ่มใหม่",
    tone: "from-slate-400 to-slate-600",
  },
];

export default function TeacherControls({
  canOpenMore,
  phase,
  onOpenAll,
  onCorrect,
  onWrong,
  onReveal,
  onNext,
  onRestart,
}) {
  function handle(id) {
    switch (id) {
      case "openAll":
        onOpenAll();
        break;
      case "correct":
        onCorrect();
        break;
      case "wrong":
        onWrong();
        break;
      case "reveal":
        onReveal();
        break;
      case "next":
        onNext();
        break;
      case "restart":
        onRestart();
        break;
      default:
        break;
    }
  }

  const disabledMap = {
    openAll: !canOpenMore,
    correct: phase !== "playing",
    wrong: phase !== "playing",
    reveal: phase !== "playing",
    next: phase === "finished",
    restart: false,
  };

  return (
    <div className="border-t border-white/10 pt-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-sky-100">แผงควบคุมครู</h2>
        <p className="text-xs text-slate-400">
          คลิกแผ่นป้ายหรือกด 1–5 เพื่อเปิดหมายเลขนั้น
        </p>
      </div>
      <div className="mb-2 hidden flex-wrap gap-1.5 xl:flex">
        {GUESS_BOARD_SHORTCUTS.map((item) => (
          <span
            key={item.key}
            className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] text-slate-300"
          >
            <kbd className="font-bold text-sky-300">{item.key}</kbd>{" "}
            {item.label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {ACTIONS.map((action) => (
          <motion.button
            key={action.id}
            type="button"
            whileTap={{ scale: 0.97 }}
            disabled={Boolean(disabledMap[action.id])}
            onClick={() => handle(action.id)}
            className={`rounded-xl bg-gradient-to-r ${action.tone} px-2.5 py-2.5 text-xs font-bold text-slate-950 shadow-md disabled:cursor-not-allowed disabled:opacity-35 sm:text-sm`}
          >
            {action.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
