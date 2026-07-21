import { BLOB_BASE } from "../lib/config";

import gameCharacterSeed from "./gameCharacters.json";

function imageOf(slug) {
  return `${BLOB_BASE}/charactor/${slug}.webp`;
}

/**
 * Classroom Game "ฉันคือใคร?"
 * clues[0] = hardest … clues[9] = easiest
 * Correct after clue N (1–10) earns (11 - N) points.
 */
export const gameCharacters = gameCharacterSeed.map((character) => ({
  ...character,
  image: imageOf(character.slug),
}));

export const CLUES_PER_CHARACTER = 10;
export const TURN_SECONDS = 5;
export const QUESTION_COUNT_OPTIONS = [10, 15, 20];
export const STORAGE_KEY = "classroom-whoami-game-v1";

export const TEAM_PRESETS = [
  { emoji: "🔵", name: "ทีมพุทธ", color: "#38bdf8" },
  { emoji: "🟢", name: "ทีมธรรม", color: "#34d399" },
  { emoji: "🟡", name: "ทีมปัญญา", color: "#fbbf24" },
  { emoji: "🔴", name: "ทีมเมตตา", color: "#f87171" },
  { emoji: "🟣", name: "ทีมสมาธิ", color: "#c084fc" },
];

export const KEYBOARD_HINTS = [
  { key: "Space", label: "เริ่ม/หยุดจับเวลา" },
  { key: "N", label: "คำใบ้ถัดไป + สลับทีม" },
  { key: "Enter", label: "ตอบถูก" },
  { key: "Backspace", label: "ตอบผิด" },
  { key: "→", label: "ทีมถัดไป" },
  { key: "↓", label: "ข้อถัดไป" },
];

export function getPointsForClue(clueNumber) {
  return Math.max(1, 11 - clueNumber);
}

export function shuffleList(list) {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

/** Build N questions from 6 characters without consecutive repeats. */
export function buildQuestionQueue(count, pool = gameCharacters) {
  const queue = [];
  let bag = shuffleList(pool);

  while (queue.length < count) {
    if (!bag.length) {
      bag = shuffleList(pool);
    }

    let next = bag.shift();
    if (queue.length && next.slug === queue[queue.length - 1].slug && bag.length) {
      const swapIndex = bag.findIndex((item) => item.slug !== next.slug);
      if (swapIndex >= 0) {
        const temp = bag[swapIndex];
        bag[swapIndex] = next;
        next = temp;
      }
    }

    queue.push(next);
  }

  return queue;
}

export function createTeams(teamCount, customNames = []) {
  return Array.from({ length: teamCount }, (_, index) => {
    const preset = TEAM_PRESETS[index] || TEAM_PRESETS[0];
    return {
      id: `team-${index + 1}`,
      name: customNames[index]?.trim() || `${preset.emoji} ${preset.name}`,
      color: preset.color,
      score: 0,
    };
  });
}

export function rotateOrder(teamIds, startIndex) {
  const order = [...teamIds];
  const start = ((startIndex % order.length) + order.length) % order.length;
  return [...order.slice(start), ...order.slice(0, start)];
}

export function getMedal(rankIndex) {
  if (rankIndex === 0) return "🥇";
  if (rankIndex === 1) return "🥈";
  if (rankIndex === 2) return "🥉";
  return `${rankIndex + 1}️⃣`;
}
