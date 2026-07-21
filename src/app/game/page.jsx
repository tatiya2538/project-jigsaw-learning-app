import ClassroomGame from "../../components/game/ClassroomGame";

import { SITE_NAME } from "../../lib/config";

export const metadata = {
  title: `เกมฉันคือใคร? (Classroom) | ${SITE_NAME}`,
  description:
    "โหมดเกมห้องเรียนสำหรับครูพาเล่นบนโปรเจกเตอร์ ทายบุคคลสำคัญทางพระพุทธศาสนา",
};

export default function GamePage() {
  return <ClassroomGame />;
}
