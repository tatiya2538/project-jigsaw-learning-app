"use client";

import { AnimatePresence, motion } from "framer-motion";

import { TURN_SECONDS } from "../../data/gameData";

export default function Timer({ seconds, running, teamName, teamColor }) {
  const progress = seconds / TURN_SECONDS;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center justify-center rounded-[2rem] border border-secondary/40 bg-white p-5 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-text/55">
        เวลานับถอยหลัง
      </p>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${teamName}-${running}-${seconds}`}
          initial={{ scale: 0.9, opacity: 0.7 }}
          animate={{
            scale: running && seconds <= 2 ? [1, 1.06, 1] : 1,
            opacity: 1,
          }}
          className="relative mt-3 flex h-36 w-36 items-center justify-center"
        >
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <motion.circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={teamColor || "#f59e0b"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <p className="text-5xl font-bold text-text">{seconds}</p>
        </motion.div>
      </AnimatePresence>
      <p className="mt-2 text-sm font-medium text-text/65">
        {running ? "กำลังจับเวลา" : "พร้อมจับเวลา"}
      </p>
      {teamName ? (
        <p className="mt-1 text-base font-bold" style={{ color: teamColor }}>
          {teamName}
        </p>
      ) : null}
    </div>
  );
}
