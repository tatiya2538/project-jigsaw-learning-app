function QuoteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-10 w-10 text-primary"
      aria-hidden="true"
    >
      <path d="M7.17 17c.51 0 .98-.24 1.28-.64l2.2-2.95A2.75 2.75 0 0 0 11.5 11.5V7.75A2.75 2.75 0 0 0 8.75 5H5.5A2.75 2.75 0 0 0 2.75 7.75v3.5A2.75 2.75 0 0 0 5.5 14h1.2l-1.1 1.47A1.75 1.75 0 0 0 7.17 17Zm9.5 0c.51 0 .98-.24 1.28-.64l2.2-2.95a2.75 2.75 0 0 0 .85-1.91V7.75A2.75 2.75 0 0 0 18.25 5H15a2.75 2.75 0 0 0-2.75 2.75v3.5A2.75 2.75 0 0 0 15 14h1.2l-1.1 1.47A1.75 1.75 0 0 0 16.67 17Z" />
    </svg>
  );
}

export default function LifeLessonCard({ quote, note }) {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="text-2xl font-bold text-text sm:text-3xl">
            ข้อคิดในชีวิตประจำวัน
          </h2>
          <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-primary" />
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-amber-400 to-orange-300 p-1 shadow-card animate-fade-in-up">
          <div className="rounded-[1.4rem] bg-white/95 px-6 py-10 text-center backdrop-blur-sm sm:px-10 sm:py-12">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/70 shadow-soft">
              <QuoteIcon />
            </div>

            <blockquote className="whitespace-pre-line text-2xl font-bold leading-relaxed text-text sm:text-3xl">
              “{quote}”
            </blockquote>

            {note ? (
              <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-text/70 sm:text-lg">
                {note}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
