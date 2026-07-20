export default function VirtueCard({ virtues }) {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="text-2xl font-bold text-text sm:text-3xl">
            คุณธรรมที่ได้รับ
          </h2>
          <p className="mt-2 text-text/70">บทเรียนใจที่นำไปใช้ได้ทุกวัน</p>
          <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-accent" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {virtues.map((virtue, index) => (
            <article
              key={virtue.id}
              className={`rounded-3xl ${virtue.bg} p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-card-hover sm:p-6 animate-fade-in-up`}
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${virtue.color} text-xl shadow-soft`}
              >
                {virtue.emoji}
              </div>
              <h3 className="text-lg font-bold text-text">{virtue.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-text/75">
                {virtue.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
