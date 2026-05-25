"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback, useRef } from "react";
import { Timer } from "@/components/Timer";
import { QuestionCard } from "@/components/QuestionCard";
import type { Question, QuizConfig, UserAnswer, OptionKey, QuizResult } from "@/types/quiz";

interface QuizEngineProps {
  config: QuizConfig;
  questions: Question[];
}

export const QuizEngine = ({ config, questions }: QuizEngineProps) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>(
    questions.map((q) => ({ questionId: q.id, selectedKey: null }))
  );
  const [revealed, setRevealed] = useState<boolean[]>(() =>
    questions.map(() => false)
  );
  const startTime = useRef(Date.now());

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const answeredCount = answers.filter((a) => a.selectedKey !== null).length;
  const isRevealed = revealed[currentIndex];

  const handleSelect = useCallback(
    (key: OptionKey) => {
      setAnswers((prev) =>
        prev.map((a, i) =>
          i === currentIndex ? { ...a, selectedKey: key } : a
        )
      );
    },
    [currentIndex]
  );

  const handleExpire = useCallback(() => {
    submitQuiz(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers]);

  const submitQuiz = (expired = false) => {
    const timeUsed = Math.floor((Date.now() - startTime.current) / 1000);
    const result: QuizResult = {
      quizId: config.id,
      questions,
      answers,
      durationSeconds: config.durationSeconds,
      timeUsedSeconds: expired ? config.durationSeconds : timeUsed,
      finishedAt: new Date().toISOString(),
    };
    sessionStorage.setItem("quizResult", JSON.stringify(result));
    router.push("/results");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-slate-600 truncate">
              {config.shortTitle}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {answeredCount} / {questions.length} besvarade
            </p>
          </div>
          <Timer
            totalSeconds={config.durationSeconds}
            onExpire={handleExpire}
          />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            selectedKey={currentAnswer.selectedKey}
            revealed={isRevealed}
            onSelect={handleSelect}
            showSection={config.sections.length > 1}
          />
        </div>
      </main>

      {/* Footer nav — no back button, next unlocks after answering */}
      <footer className="sticky bottom-0 bg-white border-t border-slate-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex justify-end">
          {!isLast ? (
            <button
              onClick={() => {
                if (!isRevealed) {
                  setRevealed((prev) =>
                    prev.map((v, i) => (i === currentIndex ? true : v))
                  );
                } else {
                  setCurrentIndex((i) => i + 1);
                }
              }}
              disabled={currentAnswer.selectedKey === null}
              className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors"
            >
              {isRevealed ? "Fortsätt →" : "Nästa →"}
            </button>
          ) : (
            <button
              onClick={() => {
                if (!isRevealed) {
                  setRevealed((prev) =>
                    prev.map((v, i) => (i === currentIndex ? true : v))
                  );
                } else {
                  submitQuiz(false);
                }
              }}
              disabled={currentAnswer.selectedKey === null}
              className="px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
            >
              {isRevealed ? "Lämna in ✓" : "Rätta →"}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
