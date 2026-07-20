import AudioPlayer from "./AudioPlayer";
import BiographyCard from "./BiographyCard";
import DiscussionCard from "./DiscussionCard";
import Footer from "./Footer";
import Hero from "./Hero";
import LifeLessonCard from "./LifeLessonCard";
import QuizCard from "./QuizCard";
import Timeline from "./Timeline";
import VirtueCard from "./VirtueCard";

export default function CharacterPage({ characterData, imageSrc }) {
  return (
    <main className="min-h-screen">
      <Hero
        name={characterData.name}
        shortTitle={characterData.shortTitle}
        intro={characterData.heroIntro}
        imageSrc={imageSrc}
      />

      <AudioPlayer
        title={characterData.audio.title}
        subtitle={characterData.audio.subtitle}
        duration={characterData.audio.duration}
        imageSrc={imageSrc}
        name={characterData.name}
      />

      <BiographyCard
        title={characterData.biography.title}
        paragraphs={characterData.biography.paragraphs}
        imageSrc={imageSrc}
        name={characterData.name}
      />

      <Timeline events={characterData.timeline} />

      <VirtueCard virtues={characterData.virtues} />

      <LifeLessonCard
        quote={characterData.lifeLesson.quote}
        note={characterData.lifeLesson.note}
      />

      <DiscussionCard questions={characterData.discussions} />

      <QuizCard questions={characterData.quiz} />

      <Footer />
    </main>
  );
}
