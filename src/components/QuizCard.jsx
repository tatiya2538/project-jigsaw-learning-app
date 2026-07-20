"use client";

import { useMemo, useState } from "react";

const optionLabels = ["ก", "ข", "ค", "ง"];

function getResultMessage(score, total) {
  const ratio = total === 0 ? 0 : score / total;

  if (ratio === 1) {
    return {
      title: "ยอดเยี่ยมมาก!",
      detail: "ตอบถูกทุกข้อ พร้อมไปเล่าให้เพื่อนฟังแล้ว",
      tone: "success",
    };
  }

  if (ratio >= 2 / 3) {
    return {
      title: "ดีมาก!",
      detail: "เข้าใจเรื่องราวได้ดีแล้ว ลองทบทวนข้อที่ยังผิดอีกนิด",
      tone: "good",
    };
  }

  if (ratio >= 1 / 3) {
    return {
      title: "เริ่มเข้าใจแล้ว",
      detail: "ลองอ่าน timeline และคุณธรรมอีกครั้ง แล้วมาตอบใหม่ได้เลย",
      tone: "ok",
    };
  }

  return {
    title: "ยังไม่เป็นไร",
    detail: "อ่านเรื่องราวซ้ำอีกนิด แล้วลองใหม่อีกครั้งนะ",
    tone: "retry",
  };
}

export default function QuizCard({ questions }) {
  const [selected, setSelected] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showIncompleteHint, setShowIncompleteHint] = useState(false);

  const total = questions.length;
  const answeredCount = Object.keys(selected).length;
  const allAnswered = answeredCount === total;

  const score = useMemo(() => {
    if (!isSubmitted) return 0;

    return questions.reduce((sum, quiz) => {
      const answer = selected[quiz.id];
      return answer === quiz.correctIndex ? sum + 1 : sum;
    }, 0);
  }, [isSubmitted, questions, selected]);

  const result = getResultMessage(score, total);

  function handleSelect(quizId, optionIndex) {
    if (isSubmitted) return;

    setShowIncompleteHint(false);
    setSelected((prev) => ({
      ...prev,
      [quizId]: optionIndex,
    }));
  }

  function handleSubmit() {
    if (!allAnswered) {
      setShowIncompleteHint(true);
      return;
    }

    setIsSubmitted(true);
    setShowIncompleteHint(false);
  }

  function handleRetry() {
    setSelected({});
    setIsSubmitted(false);
    setShowIncompleteHint(false);
  }

  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="text-2xl font-bold text-text sm:text-3xl">Mini Quiz</h2>
          <p className="mt-2 text-text/70">
            ลองตอบคำถามสั้น ๆ เพื่อทบทวนความเข้าใจ
          </p>
          <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-primary" />
        </div>

        {isSubmitted ? (
          <div
            className={`mb-6 rounded-3xl p-5 text-center shadow-card sm:p-7 animate-fade-in-up ${
              result.tone === "success" || result.tone === "good"
                ? "bg-emerald-50"
                : result.tone === "ok"
                  ? "bg-amber-50"
                  : "bg-orange-50"
            }`}
          >
            <p className="text-sm font-medium text-text/60">คะแนนของคุณ</p>
            <p className="mt-2 text-4xl font-bold text-text sm:text-5xl">
              {score}
              <span className="text-2xl text-text/50"> / {total}</span>
            </p>
            <p className="mt-3 text-xl font-bold text-text">{result.title}</p>
            <p className="mt-2 text-base text-text/75">{result.detail}</p>
          </div>
        ) : null}

        <div className="space-y-5">
          {questions.map((quiz, index) => {
            const userAnswer = selected[quiz.id];
            const isCorrect =
              isSubmitted && userAnswer === quiz.correctIndex;
            const isWrong =
              isSubmitted &&
              userAnswer !== undefined &&
              userAnswer !== quiz.correctIndex;

            return (
              <article
                key={quiz.id}
                className={`rounded-3xl bg-white p-5 shadow-card sm:p-7 animate-fade-in-up ${
                  isCorrect
                    ? "ring-2 ring-accent/40"
                    : isWrong
                      ? "ring-2 ring-orange-300/60"
                      : ""
                }`}
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="mb-4 flex items-start gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-amber-800">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="pt-1 text-base font-bold leading-relaxed text-text sm:text-lg">
                      {quiz.question}
                    </h3>
                    {isSubmitted ? (
                      <p
                        className={`mt-2 text-sm font-semibold ${
                          isCorrect ? "text-accent" : "text-orange-600"
                        }`}
                      >
                        {isCorrect ? "ตอบถูก" : "ยังไม่ถูก — ดูเฉลยด้านล่าง"}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-3">
                  {quiz.options.map((option, optionIndex) => {
                    const isActive = userAnswer === optionIndex;
                    const isAnswer = optionIndex === quiz.correctIndex;
                    let style =
                      "border-transparent bg-background hover:border-secondary hover:bg-secondary/20";

                    if (isSubmitted) {
                      if (isAnswer) {
                        style =
                          "border-accent bg-emerald-50 shadow-soft scale-[1.01]";
                      } else if (isActive && !isAnswer) {
                        style = "border-orange-400 bg-orange-50";
                      } else {
                        style = "border-transparent bg-background opacity-70";
                      }
                    } else if (isActive) {
                      style =
                        "border-primary bg-secondary/40 shadow-soft scale-[1.01]";
                    }

                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => handleSelect(quiz.id, optionIndex)}
                        className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-base transition duration-200 disabled:cursor-default ${style}`}
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                            isSubmitted && isAnswer
                              ? "bg-accent text-white"
                              : isSubmitted && isActive && !isAnswer
                                ? "bg-orange-500 text-white"
                                : isActive
                                  ? "bg-primary text-white"
                                  : "bg-white text-text/70 shadow-soft"
                          }`}
                        >
                          {optionLabels[optionIndex]}
                        </span>
                        <span className="text-text">{option}</span>
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          {!isSubmitted ? (
            <>
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-amber-500 px-8 py-3.5 text-base font-bold text-white shadow-soft transition duration-300 hover:scale-105 hover:shadow-card-hover active:scale-95"
              >
                ตรวจคำตอบ
              </button>
              <p className="mt-3 text-sm text-text/50">
                ตอบแล้ว {answeredCount}/{total} ข้อ
              </p>
              {showIncompleteHint ? (
                <p className="mt-2 text-sm font-medium text-orange-600">
                  กรุณาตอบให้ครบทุกข้อก่อนตรวจคะแนน
                </p>
              ) : null}
            </>
          ) : (
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center justify-center rounded-2xl border-2 border-primary bg-white px-8 py-3.5 text-base font-bold text-primary shadow-soft transition duration-300 hover:scale-105 hover:bg-secondary/30 active:scale-95"
            >
              ลองใหม่อีกครั้ง
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
