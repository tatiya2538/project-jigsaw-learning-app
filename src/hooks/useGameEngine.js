"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  CLUES_PER_CHARACTER,
  STORAGE_KEY,
  TURN_SECONDS,
  buildQuestionQueue,
  createTeams,
  getPointsForClue,
  rotateOrder,
} from "../data/gameData";

function persistSnapshot(snapshot) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // ignore
  }
}

function readSnapshot() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearSnapshot() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function useGameEngine() {
  const [phase, setPhase] = useState("setup");
  const [teams, setTeams] = useState([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [queue, setQueue] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [clueIndex, setClueIndex] = useState(0);
  const [turnOrder, setTurnOrder] = useState([]);
  const [turnPointer, setTurnPointer] = useState(0);
  const [failedTeamIds, setFailedTeamIds] = useState([]);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(TURN_SECONDS);
  const [lastAward, setLastAward] = useState(null);
  const [questionStarted, setQuestionStarted] = useState(false);
  const [clueRevealed, setClueRevealed] = useState(false);
  const [startingTeamId, setStartingTeamId] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const timerRef = useRef(null);
  const failedRef = useRef([]);
  const turnPointerRef = useRef(0);
  const turnOrderRef = useRef([]);
  const clueIndexRef = useRef(0);

  useEffect(() => {
    failedRef.current = failedTeamIds;
  }, [failedTeamIds]);

  useEffect(() => {
    turnPointerRef.current = turnPointer;
  }, [turnPointer]);

  useEffect(() => {
    turnOrderRef.current = turnOrder;
  }, [turnOrder]);

  useEffect(() => {
    clueIndexRef.current = clueIndex;
  }, [clueIndex]);

  const currentCharacter = queue[questionIndex] || null;
  const clueNumber = clueIndex + 1;
  const potentialPoints = getPointsForClue(clueNumber);
  const currentTeamId = turnOrder[turnPointer] || null;
  const currentTeam = teams.find((team) => team.id === currentTeamId) || null;
  const totalScore = teams.reduce((sum, team) => sum + team.score, 0);
  const rankedTeams = useMemo(
    () =>
      [...teams].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)),
    [teams],
  );
  const isLastClue = clueIndex >= CLUES_PER_CHARACTER - 1;
  const isLastQuestion = questionIndex >= Math.max(queue.length - 1, 0);

  const stopTimer = useCallback(() => {
    setTimerRunning(false);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const beginTurnTimer = useCallback(() => {
    if (phase !== "playing" || !questionStarted) return;
    stopTimer();
    setClueRevealed(true);
    setTimerSeconds(TURN_SECONDS);
    setTimerRunning(true);
  }, [phase, questionStarted, stopTimer]);

  /** Space: first press starts timer, second press stops (pause). */
  const toggleTurnTimer = useCallback(() => {
    if (phase !== "playing" || !questionStarted) return;
    if (timerRunning) {
      stopTimer();
      return;
    }
    if (clueRevealed && timerSeconds > 0) {
      setTimerRunning(true);
      return;
    }
    beginTurnTimer();
  }, [
    beginTurnTimer,
    clueRevealed,
    phase,
    questionStarted,
    stopTimer,
    timerRunning,
    timerSeconds,
  ]);

  const openNextClueRound = useCallback(() => {
    const clue = clueIndexRef.current;
    if (clue >= CLUES_PER_CHARACTER - 1) {
      setPhase("reveal");
      setLastAward({ teamId: null, points: 0 });
      setQuestionStarted(false);
      setClueRevealed(false);
      return;
    }

    setClueIndex(clue + 1);
    setFailedTeamIds([]);
    failedRef.current = [];
    setClueRevealed(false);
    setTimerSeconds(TURN_SECONDS);

    // เปิดคำใบ้ถัดไป → สลับทีมเริ่มตอบด้วย
    setTurnOrder((prevOrder) => {
      if (!prevOrder.length) {
        setTurnPointer(0);
        turnPointerRef.current = 0;
        return prevOrder;
      }
      const rotated = [...prevOrder.slice(1), prevOrder[0]];
      turnOrderRef.current = rotated;
      setStartingTeamId(rotated[0] || "");
      setTurnPointer(0);
      turnPointerRef.current = 0;
      return rotated;
    });
  }, []);

  const markWrongAndAdvance = useCallback(() => {
    if (phase !== "playing" || !questionStarted || !clueRevealed) return;

    const order = turnOrderRef.current;
    const pointer = turnPointerRef.current;
    const teamId = order[pointer];
    if (!teamId) return;

    stopTimer();
    setTimerSeconds(TURN_SECONDS);

    const nextFailed = failedRef.current.includes(teamId)
      ? failedRef.current
      : [...failedRef.current, teamId];

    failedRef.current = nextFailed;
    setFailedTeamIds(nextFailed);

    const remaining = order.filter((id) => !nextFailed.includes(id));
    if (!remaining.length) {
      openNextClueRound();
      return;
    }

    for (let step = 1; step <= order.length; step += 1) {
      const nextPointer = (pointer + step) % order.length;
      if (!nextFailed.includes(order[nextPointer])) {
        setTurnPointer(nextPointer);
        turnPointerRef.current = nextPointer;
        return;
      }
    }
  }, [clueRevealed, openNextClueRound, phase, questionStarted, stopTimer]);

  const startQuestion = useCallback(() => {
    if (!teams.length || !queue.length) return;

    let order = turnOrder;
    if (!order.length) {
      const startIndex = Math.floor(Math.random() * teams.length);
      order = rotateOrder(
        teams.map((team) => team.id),
        startIndex,
      );
      setTurnOrder(order);
      turnOrderRef.current = order;
      setStartingTeamId(order[0]);
    }

    setTurnPointer(0);
    turnPointerRef.current = 0;
    setClueIndex(0);
    clueIndexRef.current = 0;
    setFailedTeamIds([]);
    failedRef.current = [];
    setQuestionStarted(true);
    setClueRevealed(false);
    setPhase("playing");
    setLastAward(null);
    setShowConfetti(false);
    stopTimer();
    setTimerSeconds(TURN_SECONDS);
  }, [queue.length, stopTimer, teams, turnOrder]);

  const nextClue = useCallback(() => {
    if (phase !== "playing" || !questionStarted) return;
    if (isLastClue) return;
    stopTimer();
    openNextClueRound();
  }, [isLastClue, openNextClueRound, phase, questionStarted, stopTimer]);

  const markCorrect = useCallback(() => {
    if (phase !== "playing" || !questionStarted || !clueRevealed || !currentTeamId) {
      return;
    }

    const points = getPointsForClue(clueNumber);
    stopTimer();

    setTeams((prev) =>
      prev.map((team) =>
        team.id === currentTeamId
          ? { ...team, score: team.score + points }
          : team,
      ),
    );
    setLastAward({ teamId: currentTeamId, points });
    setShowConfetti(true);
    setPhase("reveal");
    setQuestionStarted(false);
    setClueRevealed(false);

    window.setTimeout(() => setShowConfetti(false), 1800);
  }, [
    clueNumber,
    clueRevealed,
    currentTeamId,
    phase,
    questionStarted,
    stopTimer,
  ]);

  const nextQuestion = useCallback(() => {
    stopTimer();
    setShowConfetti(false);

    if (questionIndex >= queue.length - 1) {
      setPhase("gameover");
      setQuestionStarted(false);
      setClueRevealed(false);
      return;
    }

    setQuestionIndex((value) => value + 1);
    setClueIndex(0);
    clueIndexRef.current = 0;
    setFailedTeamIds([]);
    failedRef.current = [];
    setQuestionStarted(false);
    setClueRevealed(false);
    setPhase("playing");
    setLastAward(null);
    setTimerSeconds(TURN_SECONDS);

    setTurnOrder((prevOrder) => {
      const base =
        prevOrder.length > 0
          ? prevOrder
          : teams.map((team) => team.id);
      const rotated = [...base.slice(1), base[0]];
      turnOrderRef.current = rotated;
      setStartingTeamId(rotated[0] || "");
      setTurnPointer(0);
      turnPointerRef.current = 0;
      return rotated;
    });
  }, [questionIndex, queue.length, stopTimer, teams]);

  const skipToNextTeam = useCallback(() => {
    markWrongAndAdvance();
  }, [markWrongAndAdvance]);

  const startGame = useCallback(
    ({ teamCount, teamNames, questions }) => {
      const nextTeams = createTeams(teamCount, teamNames);
      const nextQueue = buildQuestionQueue(questions);

      clearSnapshot();
      setTeams(nextTeams);
      setQuestionCount(questions);
      setQueue(nextQueue);
      setQuestionIndex(0);
      setClueIndex(0);
      clueIndexRef.current = 0;
      setTurnOrder([]);
      turnOrderRef.current = [];
      setTurnPointer(0);
      turnPointerRef.current = 0;
      setFailedTeamIds([]);
      failedRef.current = [];
      setQuestionStarted(false);
      setStartingTeamId("");
      setLastAward(null);
      setShowConfetti(false);
      setClueRevealed(false);
      setPhase("playing");
      stopTimer();
      setTimerSeconds(TURN_SECONDS);
    },
    [stopTimer],
  );

  const restartGame = useCallback(() => {
    clearSnapshot();
    stopTimer();
    setPhase("setup");
    setTeams([]);
    setQueue([]);
    setQuestionIndex(0);
    setClueIndex(0);
    setTurnOrder([]);
    setTurnPointer(0);
    setFailedTeamIds([]);
    setQuestionStarted(false);
    setClueRevealed(false);
    setStartingTeamId("");
    setLastAward(null);
    setShowConfetti(false);
    setTimerSeconds(TURN_SECONDS);
  }, [stopTimer]);

  useEffect(() => {
    if (!timerRunning) return undefined;

    timerRef.current = window.setInterval(() => {
      setTimerSeconds((value) => {
        if (value <= 1) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
          setTimerRunning(false);
          window.setTimeout(() => markWrongAndAdvance(), 30);
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [markWrongAndAdvance, timerRunning]);

  useEffect(() => {
    const saved = readSnapshot();
    if (saved?.phase && saved.phase !== "setup" && saved.teams?.length) {
      setPhase(saved.phase);
      setTeams(saved.teams);
      setQuestionCount(saved.questionCount || 10);
      setQueue(saved.queue || []);
      setQuestionIndex(saved.questionIndex || 0);
      setClueIndex(saved.clueIndex || 0);
      clueIndexRef.current = saved.clueIndex || 0;
      setTurnOrder(saved.turnOrder || []);
      turnOrderRef.current = saved.turnOrder || [];
      setTurnPointer(saved.turnPointer || 0);
      turnPointerRef.current = saved.turnPointer || 0;
      setFailedTeamIds(saved.failedTeamIds || []);
      failedRef.current = saved.failedTeamIds || [];
      setQuestionStarted(Boolean(saved.questionStarted));
      setClueRevealed(Boolean(saved.clueRevealed));
      setStartingTeamId(saved.startingTeamId || "");
      setLastAward(saved.lastAward || null);
      setTimerSeconds(TURN_SECONDS);
      setTimerRunning(false);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || phase === "setup") return;

    persistSnapshot({
      phase,
      teams,
      questionCount,
      queue,
      questionIndex,
      clueIndex,
      turnOrder,
      turnPointer,
      failedTeamIds,
      questionStarted,
      clueRevealed,
      startingTeamId,
      lastAward,
    });
  }, [
    clueIndex,
    clueRevealed,
    failedTeamIds,
    hydrated,
    lastAward,
    phase,
    questionCount,
    questionIndex,
    questionStarted,
    queue,
    startingTeamId,
    teams,
    turnOrder,
    turnPointer,
  ]);

  useEffect(() => {
    function onKeyDown(event) {
      if (phase === "setup" || phase === "gameover") return;
      const tag = event.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (event.code === "Space") {
        event.preventDefault();
        if (!questionStarted) startQuestion();
        else if (phase === "playing") toggleTurnTimer();
        return;
      }

      if (event.key === "n" || event.key === "N") {
        event.preventDefault();
        nextClue();
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        if (phase === "reveal") nextQuestion();
        else markCorrect();
        return;
      }

      if (event.key === "Backspace") {
        event.preventDefault();
        markWrongAndAdvance();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        skipToNextTeam();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (phase === "reveal") nextQuestion();
        else nextQuestion();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    markCorrect,
    markWrongAndAdvance,
    nextClue,
    nextQuestion,
    phase,
    questionStarted,
    skipToNextTeam,
    startQuestion,
    toggleTurnTimer,
  ]);

  return {
    hydrated,
    phase,
    teams,
    rankedTeams,
    questionCount,
    queue,
    questionIndex,
    clueIndex,
    clueNumber,
    potentialPoints,
    currentCharacter,
    currentTeam,
    startingTeamId,
    turnOrder,
    timerRunning,
    timerSeconds,
    totalScore,
    lastAward,
    questionStarted,
    clueRevealed,
    isLastClue,
    isLastQuestion,
    showConfetti,
    startGame,
    restartGame,
    startQuestion,
    nextClue,
    beginTurnTimer,
    toggleTurnTimer,
    stopTimer,
    markCorrect,
    markWrongAndAdvance,
    skipToNextTeam,
    nextQuestion,
  };
}
