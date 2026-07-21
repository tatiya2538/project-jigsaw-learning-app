import { cookies } from "next/headers";

import AudioPlayer from "./AudioPlayer";
import BiographyCard from "./BiographyCard";
import DiscussionCard from "./DiscussionCard";
import Footer from "./Footer";
import Hero from "./Hero";
import LifeLessonCard from "./LifeLessonCard";
import QuizCard from "./QuizCard";
import SectionCapture from "./SectionCapture";
import TextToSpeechControls from "./TextToSpeechControls";
import Timeline from "./Timeline";
import VirtueCard from "./VirtueCard";

import { getAdminCookieName, verifyAdminToken } from "../lib/auth";
import { normalizeSections } from "../lib/sections";

async function checkIsAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAdminCookieName())?.value;
  return verifyAdminToken(token);
}

export default async function CharacterPage({
  characterData,
  imageSrc,
  audioSrc,
}) {
  const sections = normalizeSections(characterData.sections);
  const isAdmin = await checkIsAdmin();
  const filePrefix = characterData.name || "character";

  return (
    <main className="min-h-screen">
      {isAdmin ? (
        <div className="sticky top-0 z-30 border-b border-secondary/50 bg-amber-50/95 px-4 py-2 text-center text-xs font-medium text-amber-900 backdrop-blur-sm sm:px-6">
          โหมด Admin — กดปุ่ม Capture ที่มุมขวาของแต่ละส่วนเพื่อบันทึกรูปไปพิมพ์เป็นผลงาน
        </div>
      ) : null}

      {sections.hero ? (
        <SectionCapture
          enabled={isAdmin}
          label="hero"
          filePrefix={filePrefix}
        >
          <Hero
            name={characterData.name}
            shortTitle={characterData.shortTitle}
            intro={characterData.heroIntro}
            imageSrc={imageSrc}
          />
        </SectionCapture>
      ) : null}

      {sections.audio ? (
        <SectionCapture
          enabled={isAdmin}
          label="เสียงบรรยาย"
          filePrefix={filePrefix}
        >
          {audioSrc ? (
            <AudioPlayer
              title={characterData.audio.title}
              subtitle={characterData.audio.subtitle}
              duration={characterData.audio.duration}
              imageSrc={imageSrc}
              name={characterData.name}
              audioSrc={audioSrc}
            />
          ) : (
            <TextToSpeechControls
              title={characterData.audio?.title || `เรื่องราวของ${characterData.name}`}
              subtitle={
                characterData.audio?.subtitle ||
                "อ่านชีวประวัติให้นักเรียนฟัง"
              }
              paragraphs={characterData.biography?.paragraphs || []}
              tts={characterData.audio?.tts || null}
              imageSrc={imageSrc}
              name={characterData.name}
            />
          )}
        </SectionCapture>
      ) : null}

      {sections.biography ? (
        <SectionCapture
          enabled={isAdmin}
          label="ฉันคือใคร"
          filePrefix={filePrefix}
        >
          <BiographyCard
            paragraphs={characterData.biography.paragraphs}
            imageSrc={imageSrc}
            name={characterData.name}
          />
        </SectionCapture>
      ) : null}

      {sections.timeline ? (
        <SectionCapture
          enabled={isAdmin}
          label="เหตุการณ์สำคัญ"
          filePrefix={filePrefix}
        >
          <Timeline events={characterData.timeline} />
        </SectionCapture>
      ) : null}

      {sections.virtues ? (
        <SectionCapture
          enabled={isAdmin}
          label="คุณธรรมที่ได้รับ"
          filePrefix={filePrefix}
        >
          <VirtueCard virtues={characterData.virtues} />
        </SectionCapture>
      ) : null}

      {sections.lifeLesson ? (
        <SectionCapture
          enabled={isAdmin}
          label="ข้อคิดในชีวิตประจำวัน"
          filePrefix={filePrefix}
        >
          <LifeLessonCard
            quote={characterData.lifeLesson.quote}
            note={characterData.lifeLesson.note}
          />
        </SectionCapture>
      ) : null}

      {sections.discussions ? (
        <SectionCapture
          enabled={isAdmin}
          label="คำถามชวนคิด"
          filePrefix={filePrefix}
        >
          <DiscussionCard questions={characterData.discussions} />
        </SectionCapture>
      ) : null}

      {sections.quiz ? (
        <SectionCapture
          enabled={isAdmin}
          label="Mini-Quiz"
          filePrefix={filePrefix}
        >
          <QuizCard questions={characterData.quiz} />
        </SectionCapture>
      ) : null}

      <Footer />
    </main>
  );
}
