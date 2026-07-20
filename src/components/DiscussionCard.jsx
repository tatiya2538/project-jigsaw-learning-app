export default function DiscussionCard({ questions }) {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="text-2xl font-bold text-text sm:text-3xl">
            คำถามชวนคิด
          </h2>
          <p className="mt-2 text-text/70">คุยกับเพื่อนในกลุ่มก่อนอธิบายต่อ</p>
          <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-accent" />
        </div>

        <div className="space-y-4">
          {questions.map((item, index) => (
            <article
              key={item.id}
              className="flex gap-4 rounded-3xl bg-white p-5 shadow-card transition duration-300 hover:-translate-y-0.5 hover:shadow-card-hover sm:p-6 animate-fade-in-up"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-emerald-400 text-lg font-bold text-white shadow-soft">
                {index + 1}
              </div>
              <p className="pt-1.5 text-base leading-relaxed text-text sm:text-lg">
                {item.question}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
