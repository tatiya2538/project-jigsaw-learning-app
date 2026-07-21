"use client";

import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";

import { useGuessBoard } from "../../hooks/useGuessBoard";

import ConfettiBurst from "../game/ConfettiBurst";

import ClueCard from "./ClueCard";
import PowerPointExporter from "./PowerPointExporter";
import QuestionIndicator from "./QuestionIndicator";
import RaceAwardPanel from "./RaceAwardPanel";
import RevealModal from "./RevealModal";
import SetupModal from "./SetupModal";
import TeacherControls from "./TeacherControls";
import TeamScoreBoard from "./TeamScoreBoard";

export default function GuessBoard() {
  const game = useGuessBoard();
  const question = game.currentQuestion;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(14,165,233,0.12),_transparent_45%)]" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-slate-200 backdrop-blur-md"
            >
              ← หน้าแรก
            </Link>
            {game.phase !== "setup" ? (
              <button
                type="button"
                onClick={game.restart}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-slate-200"
              >
                ตั้งค่าใหม่
              </button>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {game.phase !== "setup" ? (
              <QuestionIndicator label={game.progressLabel} />
            ) : null}
            <PowerPointExporter />
          </div>
        </div>

        {game.phase !== "setup" ? (
          <>
            <header className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl"
              >
                🧩 เกมเปิดแผ่นป้ายคุณสมบัติ
              </motion.h1>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                คลิกเปิดแผ่นป้ายหมายเลขใดก็ได้ · ตอบถูกได้ 1 คะแนน
              </p>
            </header>

            <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[1.45fr_0.8fr] lg:items-stretch">
              <section className="flex h-full min-h-0 flex-col rounded-[1.75rem] border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-xl sm:p-5">
                {game.phase === "finished" ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8 text-center">
                    <p className="text-3xl font-bold text-white">
                      🏆 จบเกมแล้ว
                    </p>
                    <div className="w-full max-w-md space-y-2 text-left">
                      {game.rankedTeams.map((team, index) => (
                        <div
                          key={team.id}
                          className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                          style={{ boxShadow: `inset 3px 0 0 ${team.color}` }}
                        >
                          <span className="font-bold text-white">
                            {game.getMedal(index)} {team.name}
                          </span>
                          <span className="text-lg font-bold text-sky-200">
                            {team.score}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={game.restart}
                      className="rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 px-5 py-3 text-sm font-bold text-slate-950"
                    >
                      เล่นใหม่
                    </button>
                  </div>
                ) : (
                  <div className="flex min-h-0 flex-1 flex-col">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-sky-200">
                        เปิดแล้ว {game.openedCount} / 5 ใบ · ถูกได้{" "}
                        {game.potentialPoints} คะแนน
                      </p>
                      <AnimatePresence mode="wait">
                        {game.feedback === "wrong" ? (
                          <motion.p
                            key="wrong"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="rounded-full bg-rose-500/20 px-3 py-1 text-sm font-bold text-rose-200"
                          >
                            ❌ ยังไม่ถูก — เปิดแผ่นอื่นหรือรอคำตอบใหม่
                          </motion.p>
                        ) : null}
                      </AnimatePresence>
                    </div>

                    <div className="grid min-h-0 flex-1 grid-cols-2 content-center gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-5 md:gap-3">
                      {question?.clues.map((clue, index) => (
                        <ClueCard
                          key={`${question.id}-${index}`}
                          index={index}
                          clue={clue}
                          isOpen={Boolean(game.openedFlags[index])}
                          onOpen={
                            game.phase === "playing" ? game.openClueAt : undefined
                          }
                        />
                      ))}
                    </div>

                    <div className="mt-auto pt-4">
                      <TeacherControls
                        canOpenMore={game.canOpenMore}
                        phase={game.phase}
                        onOpenAll={game.openAllRemaining}
                        onCorrect={game.beginPickWinner}
                        onWrong={game.markWrong}
                        onReveal={game.revealAnswer}
                        onNext={game.nextQuestion}
                        onRestart={game.restart}
                      />
                    </div>
                  </div>
                )}
              </section>

              <aside className="flex h-full min-h-0 flex-col gap-3">
                {game.phase !== "finished" ? (
                  <RaceAwardPanel
                    teams={game.teams}
                    potentialPoints={game.potentialPoints}
                    pickingWinner={game.pickingWinner}
                    onAwardTeam={game.awardTeam}
                    onBeginPick={game.beginPickWinner}
                    onCancelPick={game.cancelPickWinner}
                  />
                ) : null}
                <TeamScoreBoard rankedTeams={game.rankedTeams} />
              </aside>
            </div>
          </>
        ) : null}
      </div>

      <SetupModal open={game.phase === "setup"} onStart={game.startGame} />

      <RevealModal
        open={game.phase === "reveal"}
        question={question}
        feedback={game.feedback}
        lastAward={game.lastAward}
        isLastQuestion={game.isLastQuestion}
        onNext={game.nextQuestion}
        onRestart={game.restart}
      />

      <ConfettiBurst active={game.showConfetti} />
    </div>
  );
}
