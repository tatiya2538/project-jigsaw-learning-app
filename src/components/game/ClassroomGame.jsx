"use client";

import Link from "next/link";

import {
  CLUES_PER_CHARACTER,
  KEYBOARD_HINTS,
} from "../../data/gameData";
import { useGameEngine } from "../../hooks/useGameEngine";

import CharacterReveal from "./CharacterReveal";
import ConfettiBurst from "./ConfettiBurst";
import GameHeader from "./GameHeader";
import GameOverModal from "./GameOverModal";
import QuestionCard from "./QuestionCard";
import QuestionIndicator from "./QuestionIndicator";
import ScoreBoard from "./ScoreBoard";
import SetupModal from "./SetupModal";
import TeacherControls from "./TeacherControls";
import TeamTurnCard from "./TeamTurnCard";
import Timer from "./Timer";

export default function ClassroomGame() {
  const game = useGameEngine();

  if (!game.hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-text">
        กำลังโหลดเกมห้องเรียน...
      </div>
    );
  }

  const disabledMap = {
    startQuestion: game.phase !== "playing" || game.questionStarted,
    nextClue:
      game.phase !== "playing" ||
      !game.questionStarted ||
      game.isLastClue,
    startTimer: game.phase !== "playing" || !game.questionStarted,
    stopTimer: !game.timerRunning,
    correct:
      game.phase !== "playing" ||
      !game.questionStarted ||
      !game.clueRevealed,
    wrong:
      game.phase !== "playing" ||
      !game.questionStarted ||
      !game.clueRevealed,
    nextQuestion: game.phase !== "reveal" && game.phase !== "playing",
    restart: false,
  };

  function handleAction(actionId) {
    switch (actionId) {
      case "startQuestion":
        game.startQuestion();
        break;
      case "nextClue":
        game.nextClue();
        break;
      case "startTimer":
        game.beginTurnTimer();
        break;
      case "stopTimer":
        game.stopTimer();
        break;
      case "correct":
        game.markCorrect();
        break;
      case "wrong":
        game.markWrongAndAdvance();
        break;
      case "nextQuestion":
        game.nextQuestion();
        break;
      case "restart":
        game.restartGame();
        break;
      default:
        break;
    }
  }

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 sm:py-8">
        <div className="flex flex-wrap justify-between gap-3">
          <Link
            href="/"
            className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-text shadow-soft"
          >
            ← หน้าแรก
          </Link>
          <div className="flex flex-wrap gap-2">
            <a
              href="/game/who-am-i-classroom.pptx"
              download
              className="rounded-2xl bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900 shadow-soft"
            >
              📥 ดาวน์โหลด PowerPoint
            </a>
            <button
              type="button"
              onClick={game.restartGame}
              className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-text shadow-soft"
            >
              ตั้งค่าใหม่
            </button>
          </div>
        </div>

        {game.phase !== "setup" ? (
          <>
            <GameHeader
              title={`🎮 เกมทาย "ฉันคือใคร?"`}
              totalScore={game.totalScore}
            />

            <QuestionIndicator
              questionNumber={game.questionIndex + 1}
              totalQuestions={game.queue.length || game.questionCount}
            />

            <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
              <div className="space-y-4">
                <QuestionCard
                  clueNumber={game.clueNumber}
                  totalClues={CLUES_PER_CHARACTER}
                  clueText={
                    game.currentCharacter?.clues?.[game.clueIndex] || ""
                  }
                  potentialPoints={game.potentialPoints}
                  questionStarted={game.questionStarted}
                  clueRevealed={game.clueRevealed}
                />

                <TeacherControls
                  disabledMap={disabledMap}
                  onAction={handleAction}
                />

                <div className="flex flex-wrap gap-2 xl:hidden">
                  {KEYBOARD_HINTS.map((item) => (
                    <span
                      key={item.key}
                      className="rounded-full bg-white px-3 py-1 text-xs text-text/70 shadow-soft"
                    >
                      <kbd className="font-bold text-amber-700">{item.key}</kbd>{" "}
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Timer
                  seconds={game.timerSeconds}
                  running={game.timerRunning}
                  teamName={game.currentTeam?.name}
                  teamColor={game.currentTeam?.color}
                />
                <TeamTurnCard
                  currentTeam={game.currentTeam}
                  startingTeamId={game.startingTeamId}
                  teams={game.teams}
                  turnOrder={game.turnOrder}
                  questionStarted={game.questionStarted}
                />
                <ScoreBoard rankedTeams={game.rankedTeams} />
              </div>
            </div>
          </>
        ) : null}
      </div>

      <SetupModal open={game.phase === "setup"} onStart={game.startGame} />

      <CharacterReveal
        open={game.phase === "reveal"}
        character={game.currentCharacter}
        award={game.lastAward}
        teams={game.teams}
        isLastQuestion={game.isLastQuestion}
        onNext={game.nextQuestion}
      />

      <GameOverModal
        open={game.phase === "gameover"}
        rankedTeams={game.rankedTeams}
        onRestart={game.restartGame}
      />

      <ConfettiBurst active={game.showConfetti} />
    </div>
  );
}
