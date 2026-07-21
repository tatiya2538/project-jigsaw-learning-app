"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";

import {
  CLUES_PER_CHARACTER,
  TOTAL_QUESTIONS,
  createAnswerOptions,
  gameCharacters,
  getPointsForClue,
  shuffleCharacters,
} from "../../data/gameData";

import AnswerGrid from "./AnswerGrid";
import ClueCard from "./ClueCard";
import ConfettiBurst from "./ConfettiBurst";
import GameHeader from "./GameHeader";
import GameOverModal from "./GameOverModal";
import ResultModal from "./ResultModal";
import ScoreBoard from "./ScoreBoard";

function createInitialState() {
  const queue = shuffleCharacters(gameCharacters);

  return {
    queue,
    questionIndex: 0,
    clueIndex: 0,
    score: 0,
    answered: false,
    earnedPoints: 0,
    feedback: null,
    selectedSlug: "",
    showResult: false,
    showGameOver: false,
    showConfetti: false,
    showAnswers: false,
  };
}

export default function WhoAmIGame() {
  const [state, setState] = useState(null);

  useEffect(() => {
    setState(createInitialState());
  }, []);

  const answerOptions = useMemo(
    () => createAnswerOptions(gameCharacters),
    [],
  );

  if (!state) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-text/60">
        กำลังเตรียมเกม...
      </div>
    );
  }

  const current = state.queue[state.questionIndex];
  const clueNumber = state.clueIndex + 1;
  const potentialPoints = getPointsForClue(clueNumber);
  const isLastClue = state.clueIndex >= CLUES_PER_CHARACTER - 1;
  const isLastQuestion = state.questionIndex >= TOTAL_QUESTIONS - 1;
  const maxScore = TOTAL_QUESTIONS * 10;

  function revealNextClue() {
    if (state.answered || isLastClue) return;

    setState((prev) => ({
      ...prev,
      clueIndex: prev.clueIndex + 1,
      feedback: null,
      selectedSlug: "",
    }));
  }

  function handleSelectAnswer(slug) {
    if (state.answered || !current) return;

    if (slug === current.slug) {
      const points = getPointsForClue(state.clueIndex + 1);

      setState((prev) => ({
        ...prev,
        answered: true,
        earnedPoints: points,
        score: prev.score + points,
        selectedSlug: slug,
        feedback: "correct",
        showConfetti: true,
        showResult: true,
      }));

      window.setTimeout(() => {
        setState((prev) => ({ ...prev, showConfetti: false }));
      }, 1600);

      return;
    }

    setState((prev) => ({
      ...prev,
      selectedSlug: slug,
      feedback: "wrong",
    }));
  }

  function handleNextQuestion() {
    if (isLastQuestion) {
      setState((prev) => ({
        ...prev,
        showResult: false,
        showGameOver: true,
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      questionIndex: prev.questionIndex + 1,
      clueIndex: 0,
      answered: false,
      earnedPoints: 0,
      feedback: null,
      selectedSlug: "",
      showResult: false,
      showAnswers: false,
    }));
  }

  function handleRestart() {
    setState(createInitialState());
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex justify-between gap-3">
        <Link
          href="/"
          className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-text shadow-soft"
        >
          ← หน้าแรก
        </Link>
        <button
          type="button"
          onClick={handleRestart}
          className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-text shadow-soft"
        >
          เริ่มใหม่
        </button>
      </div>

      <GameHeader
        questionNumber={state.questionIndex + 1}
        totalQuestions={TOTAL_QUESTIONS}
      />

      <ScoreBoard score={state.score} potentialPoints={potentialPoints} />

      <ClueCard
        clueNumber={clueNumber}
        totalClues={CLUES_PER_CHARACTER}
        clueText={current.clues[state.clueIndex]}
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={revealNextClue}
          disabled={state.answered || isLastClue}
          className="flex-1 rounded-2xl bg-gradient-to-r from-primary to-amber-500 px-4 py-3 text-sm font-bold text-white shadow-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLastClue ? "คำใบ้สุดท้ายแล้ว" : "ดูคำใบ้ถัดไป"}
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() =>
            setState((prev) => ({ ...prev, showAnswers: !prev.showAnswers }))
          }
          disabled={state.answered}
          className="flex-1 rounded-2xl border border-secondary bg-white px-4 py-3 text-sm font-bold text-text shadow-soft disabled:opacity-50"
        >
          {state.showAnswers ? "ซ่อนตัวเลือก" : "ตอบคำถาม"}
        </motion.button>
      </div>

      {state.showAnswers || state.answered ? (
        <AnswerGrid
          options={answerOptions}
          disabled={state.answered}
          selectedSlug={state.selectedSlug}
          correctSlug={current.slug}
          feedback={state.feedback}
          onSelect={handleSelectAnswer}
        />
      ) : (
        <p className="text-center text-sm text-text/55">
          อ่านคำใบ้ให้มั่นใจ แล้วกด “ตอบคำถาม” เมื่อพร้อมทาย
        </p>
      )}

      <ConfettiBurst active={state.showConfetti} />

      <ResultModal
        open={state.showResult}
        character={current}
        earnedPoints={state.earnedPoints}
        onNext={handleNextQuestion}
        isLastQuestion={isLastQuestion}
      />

      <GameOverModal
        open={state.showGameOver}
        totalScore={state.score}
        maxScore={maxScore}
        onRestart={handleRestart}
      />
    </div>
  );
}
