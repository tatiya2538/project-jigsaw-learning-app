import Image from "next/image";

export default function BiographyCard({ paragraphs, imageSrc, name }) {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 text-center animate-fade-in">
          <h2 className="text-2xl font-bold text-text sm:text-3xl">ฉันคือใคร</h2>
          <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-primary" />
        </div>

        <div className="group rounded-3xl bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-secondary via-amber-100 to-orange-100 shadow-soft">
              <Image
                src={imageSrc}
                alt={name}
                fill
                sizes="160px"
                className="object-contain p-1"
              />
            </div>

            <div className="space-y-4 text-base leading-relaxed text-text/85 sm:text-lg">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
