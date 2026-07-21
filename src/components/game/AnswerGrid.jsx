"use client";

import Image from "next/image";

import { motion } from "framer-motion";

export default function AnswerGrid({
  options,
  disabled,
  selectedSlug,
  correctSlug,
  feedback,
  onSelect,
}) {
  return (
    <section>
      <h2 className="mb-3 text-center text-base font-bold text-text sm:text-lg">
        เลือกคำตอบ
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((option, index) => {
          const isSelected = selectedSlug === option.slug;
          const isCorrect = option.slug === correctSlug;
          const showCorrect = feedback === "correct" && isCorrect;
          const showWrong = feedback === "wrong" && isSelected;

          return (
            <motion.button
              key={option.slug}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(option.slug)}
              whileTap={disabled ? undefined : { scale: 0.97 }}
              whileHover={disabled ? undefined : { scale: 1.02 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: showCorrect ? 1.03 : 1,
              }}
              transition={{ delay: index * 0.04 }}
              className={`flex items-center gap-3 rounded-3xl border-2 px-4 py-3 text-left shadow-soft transition ${
                showCorrect
                  ? "border-emerald-400 bg-emerald-50"
                  : showWrong
                    ? "border-orange-400 bg-orange-50"
                    : "border-transparent bg-white hover:border-primary/40"
              } disabled:cursor-not-allowed disabled:opacity-70`}
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-secondary to-amber-100">
                <Image
                  src={option.image}
                  alt={option.name}
                  fill
                  sizes="56px"
                  className="object-contain p-1"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-snug text-text sm:text-base">
                  {option.name}
                </p>
                {showCorrect ? (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm font-semibold text-emerald-700"
                  >
                    ถูกต้อง!
                  </motion.p>
                ) : null}
                {showWrong ? (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm font-semibold text-orange-700"
                  >
                    ลองใหม่
                  </motion.p>
                ) : null}
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
