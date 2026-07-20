export default function Timeline({ events }) {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="text-2xl font-bold text-text sm:text-3xl">
            เหตุการณ์สำคัญ
          </h2>
          <p className="mt-2 text-text/70">เส้นทางแห่งปัญญาและการตื่นรู้</p>
          <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-primary" />
        </div>

        <div className="relative space-y-4">
          <div className="absolute bottom-4 left-[1.65rem] top-4 w-1 rounded-full bg-gradient-to-b from-primary via-secondary to-accent sm:left-[1.9rem]" />

          {events.map((event, index) => (
            <article
              key={event.id}
              className="relative flex gap-4 animate-fade-in-up sm:gap-5"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-amber-500 text-base font-bold text-white shadow-soft sm:h-14 sm:w-14 sm:text-lg">
                {index + 1}
              </div>

              <div className="flex-1 rounded-3xl bg-white p-5 shadow-card transition duration-300 hover:scale-[1.02] hover:shadow-card-hover sm:p-6">
                <h3 className="text-lg font-bold text-text sm:text-xl">
                  {event.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-text/75">
                  {event.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
