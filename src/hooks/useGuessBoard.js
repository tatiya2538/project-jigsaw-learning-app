"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { createTeams, getMedal } from "../data/gameData";
import {
  CLUES_PER_QUESTION,
  POINTS_PER_CORRECT,
  createEmptyOpenedFlags,
  guessBoardQuestions,
} from "../data/guessBoardData";

function buildQueue(count) {
  const pool = [...guessBoardQuestions];
  const queue = [];
  let cursor = 0;
  while (queue.length < count) {
    queue.push(pool[cursor % pool.length]);
    cursor += 1;
  }
  return queue;
}

export function useGuessBoard() {
  const [phase, setPhase] = useState("setup");
  const [teams, setTeams] = useState([]);
  const [queue, setQueue] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [openedFlags, setOpenedFlags] = useState(createEmptyOpenedFlags);
  const [feedback, setFeedback] = useState(null);
  const [lastAward, setLastAward] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [pickingWinner, setPickingWinner] = useState(false);

  const totalQuestions = queue.length || guessBoardQuestions.length;
  const currentQuestion = queue[questionIndex] || null;
  const isLastQuestion = questionIndex >= Math.max(totalQuestions - 1, 0);
  const openedCount = openedFlags.filter(Boolean).length;
  const canOpenMore =
    phase === "playing" && openedCount < CLUES_PER_QUESTION;
  const potentialPoints = POINTS_PER_CORRECT;
  const rankedTeams = useMemo(
    () =>
      [...teams].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)),
    [teams],
  );

  const progressLabel = useMemo(
    () =>
      `ข้อที่ ${Math.min(questionIndex + 1, Math.max(totalQuestions, 1))} / ${Math.max(totalQuestions, 1)}`,
    [questionIndex, totalQuestions],
  );

  const openClueAt = useCallback(
    (index) => {
      if (phase !== "playing") return;
      if (index < 0 || index >= CLUES_PER_QUESTION) return;
      setOpenedFlags((prev) => {
        if (prev[index]) return prev;
        const next = [...prev];
        next[index] = true;
        return next;
      });
      setFeedback(null);
      setPickingWinner(false);
    },
    [phase],
  );

  const openAllRemaining = useCallback(() => {
    if (phase !== "playing") return;
    setOpenedFlags(Array(CLUES_PER_QUESTION).fill(true));
    setFeedback(null);
    setPickingWinner(false);
  }, [phase]);

  const awardTeam = useCallback(
    (teamId) => {
      if (phase !== "playing" || !teamId) return;
      const team = teams.find((item) => item.id === teamId);
      if (!team) return;

      const points = POINTS_PER_CORRECT;
      setTeams((prev) =>
        prev.map((item) =>
          item.id === teamId ? { ...item, score: item.score + points } : item,
        ),
      );
      setLastAward({ teamId, points, teamName: team.name });
      setFeedback("correct");
      setPickingWinner(false);
      setShowConfetti(true);
      setPhase("reveal");
      window.setTimeout(() => setShowConfetti(false), 1800);
    },
    [phase, teams],
  );

  const beginPickWinner = useCallback(() => {
    if (phase !== "playing" || !teams.length) return;
    setPickingWinner(true);
    setFeedback(null);
  }, [phase, teams.length]);

  const cancelPickWinner = useCallback(() => {
    setPickingWinner(false);
  }, []);

  const markWrong = useCallback(() => {
    if (phase !== "playing") return;
    setPickingWinner(false);
    setFeedback("wrong");
  }, [phase]);

  const revealAnswer = useCallback(() => {
    if (phase !== "playing") return;
    setLastAward(null);
    setFeedback(null);
    setPickingWinner(false);
    setPhase("reveal");
    setShowConfetti(true);
    window.setTimeout(() => setShowConfetti(false), 1800);
  }, [phase]);

  const nextQuestion = useCallback(() => {
    if (isLastQuestion) {
      setPhase("finished");
      setOpenedFlags(createEmptyOpenedFlags());
      setFeedback(null);
      setPickingWinner(false);
      return;
    }

    setQuestionIndex((value) => value + 1);
    setPhase("playing");
    setOpenedFlags(createEmptyOpenedFlags());
    setFeedback(null);
    setLastAward(null);
    setShowConfetti(false);
    setPickingWinner(false);
  }, [isLastQuestion]);

  const startGame = useCallback(({ teamCount, teamNames, questions }) => {
    setTeams(createTeams(teamCount, teamNames));
    setQueue(buildQueue(questions));
    setQuestionIndex(0);
    setOpenedFlags(createEmptyOpenedFlags());
    setFeedback(null);
    setLastAward(null);
    setShowConfetti(false);
    setPickingWinner(false);
    setPhase("playing");
  }, []);

  const restart = useCallback(() => {
    setPhase("setup");
    setTeams([]);
    setQueue([]);
    setQuestionIndex(0);
    setOpenedFlags(createEmptyOpenedFlags());
    setFeedback(null);
    setLastAward(null);
    setShowConfetti(false);
    setPickingWinner(false);
  }, []);

  useEffect(() => {
    function onKeyDown(event) {
      if (phase === "setup") return;
      const tag = event.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (event.key === "Enter") {
        event.preventDefault();
        if (phase === "playing") {
          if (pickingWinner) return;
          beginPickWinner();
        } else if (phase === "reveal") {
          nextQuestion();
        }
        return;
      }

      if (phase === "playing" && /^[1-5]$/.test(event.key)) {
        const index = Number(event.key) - 1;
        event.preventDefault();
        if (pickingWinner) {
          const team = teams[index];
          if (team) awardTeam(team.id);
        } else {
          openClueAt(index);
        }
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        cancelPickWinner();
        return;
      }

      if (event.key === "Backspace") {
        event.preventDefault();
        if (phase === "playing") markWrong();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (phase === "reveal" || phase === "playing") nextQuestion();
        return;
      }

      if (event.key === "r" || event.key === "R") {
        event.preventDefault();
        restart();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    awardTeam,
    beginPickWinner,
    cancelPickWinner,
    markWrong,
    nextQuestion,
    openClueAt,
    phase,
    pickingWinner,
    restart,
    teams,
  ]);

  return {
    phase,
    teams,
    rankedTeams,
    currentQuestion,
    questionIndex,
    totalQuestions,
    progressLabel,
    openedFlags,
    openedCount,
    canOpenMore,
    feedback,
    lastAward,
    potentialPoints,
    showConfetti,
    pickingWinner,
    isLastQuestion,
    getMedal,
    startGame,
    openClueAt,
    openAllRemaining,
    beginPickWinner,
    cancelPickWinner,
    awardTeam,
    markWrong,
    revealAnswer,
    nextQuestion,
    restart,
  };
}
