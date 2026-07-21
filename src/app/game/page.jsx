import { notFound } from "next/navigation";

import ClassroomGame from "../../components/game/ClassroomGame";

import { getGameEntry } from "../../lib/catalog";
import { SITE_NAME } from "../../lib/config";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `เกมฉันคือใคร? (Classroom) | ${SITE_NAME}`,
  description:
    "โหมดเกมห้องเรียนสำหรับครูพาเล่นบนโปรเจกเตอร์ ทายบุคคลสำคัญทางพระพุทธศาสนา",
};

export default async function GamePage() {
  const game = await getGameEntry("whoami", { activeOnly: true });
  if (!game) notFound();

  return <ClassroomGame />;
}
