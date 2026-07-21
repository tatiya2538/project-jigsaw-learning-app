/** Default classroom games shown on homepage when catalog has no games yet. */
export const DEFAULT_GAMES = [
  {
    id: "whoami",
    label: 'เกมห้องเรียน "ฉันคือใคร?"',
    href: "/game",
    emoji: "🎮",
    tone: "from-primary to-amber-500",
    active: true,
    order: 1,
  },
  {
    id: "guess-board",
    label: "เกมเปิดแผ่นป้ายคุณสมบัติ",
    href: "/guess-board",
    emoji: "🧩",
    tone: "from-sky-500 to-blue-600",
    active: true,
    order: 2,
  },
];

export function buildDefaultGameEntries() {
  return DEFAULT_GAMES.map((game) => ({ ...game }));
}
