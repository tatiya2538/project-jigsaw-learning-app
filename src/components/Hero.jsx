import Image from "next/image";

export default function Hero({ name, shortTitle, intro, imageSrc }) {
  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14">
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-secondary/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-24 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center animate-fade-in">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium text-primary shadow-soft backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-accent" />
          Buddhist Learning Card
        </span>

        <div className="relative mb-6 h-64 w-64 animate-float sm:h-80 sm:w-80">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary via-amber-100 to-orange-100 shadow-inner" />
          <Image
            src={imageSrc}
            alt={name}
            fill
            priority
            sizes="(max-width: 640px) 256px, 320px"
            className="relative z-10 object-contain p-2 drop-shadow-lg"
          />
        </div>

        <h1 className="text-3xl font-bold leading-tight tracking-tight text-text sm:text-4xl md:text-5xl">
          {name}
        </h1>

        <p className="mt-3 text-lg font-semibold text-primary sm:text-xl">
          {shortTitle}
        </p>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-text/80 sm:text-lg">
          {intro}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-text/60">
          <span className="rounded-full bg-white px-3 py-1 shadow-soft">
            อ่าน 2–3 นาที
          </span>
          <span className="rounded-full bg-white px-3 py-1 shadow-soft">
            Jigsaw Learning
          </span>
        </div>
      </div>
    </section>
  );
}
