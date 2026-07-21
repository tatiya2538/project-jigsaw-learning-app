import { notFound } from "next/navigation";

import GuessBoard from "../../components/GuessBoard/GuessBoard";

import { getGameEntry } from "../../lib/catalog";
import { SITE_NAME } from "../../lib/config";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `เกมเปิดแผ่นป้ายคุณสมบัติ | ${SITE_NAME}`,
  description: "เกมห้องเรียนเปิดแผ่นป้ายคุณสมบัติทีละใบ สำหรับฉายโปรเจกเตอร์",
};

export default async function GuessBoardPage() {
  const game = await getGameEntry("guess-board", { activeOnly: true });
  if (!game) notFound();

  return <GuessBoard />;
}
