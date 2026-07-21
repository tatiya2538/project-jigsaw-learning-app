import WhoAmIGame from "../../components/game/WhoAmIGame";

import { SITE_NAME } from "../../lib/config";

export const metadata = {
  title: `เกมฉันคือใคร? | ${SITE_NAME}`,
  description:
    "มินิเกมทายบุคคลสำคัญทางพระพุทธศาสนา จากคำใบ้ยากไปง่าย สำหรับนักเรียนมัธยมต้น",
};

export default function GamePage() {
  return (
    <main className="min-h-screen pb-10">
      <WhoAmIGame />
    </main>
  );
}
