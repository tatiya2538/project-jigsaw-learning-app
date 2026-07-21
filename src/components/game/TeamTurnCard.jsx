"use client";

import { motion } from "framer-motion";

export default function TeamTurnCard({
  currentTeam,
  startingTeamId,
  teams,
  turnOrder,
  questionStarted,
}) {
  const startingTeam = teams.find((team) => team.id === startingTeamId);

  return (
    <div className="rounded-[2rem] border border-secondary/40 bg-white p-5 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-text/55">
        ลำดับการตอบ
      </p>

      {questionStarted && currentTeam ? (
        <motion.div
          key={currentTeam.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-3 rounded-2xl px-4 py-4"
          style={{
            background: `linear-gradient(135deg, ${currentTeam.color}33, #fff)`,
            border: `1px solid ${currentTeam.color}66`,
          }}
        >
          <p className="text-sm text-text/65">ทีมที่กำลังตอบ</p>
          <p
            className="mt-1 text-2xl font-bold"
            style={{ color: currentTeam.color }}
          >
            {currentTeam.name}
          </p>
        </motion.div>
      ) : (
        <p className="mt-3 text-sm text-text/55">รอเริ่มคำถาม...</p>
      )}

      {startingTeam ? (
        <p className="mt-3 text-sm text-text/70">
          ทีมเริ่มต้นข้อนี้:{" "}
          <span className="font-semibold" style={{ color: startingTeam.color }}>
            {startingTeam.name}
          </span>
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {turnOrder.map((teamId, index) => {
          const team = teams.find((item) => item.id === teamId);
          if (!team) return null;
          const isCurrent = questionStarted && team.id === currentTeam?.id;

          return (
            <span
              key={teamId}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isCurrent ? "text-white" : "text-text"
              }`}
              style={{
                backgroundColor: isCurrent ? team.color : `${team.color}33`,
              }}
            >
              {index + 1}. {team.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}
