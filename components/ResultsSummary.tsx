"use client";

import { useRouter } from "next/navigation";
import type { QuizResult } from "@/types/quiz";

interface ResultsSummaryProps {
  result: QuizResult;
}

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
};

export const ResultsSummary = ({ result }: ResultsSummaryProps) => {
  const router = useRouter();

  const correctCount = result.answers.filter((a) => {
    const q = result.questions.find((q) => q.id === a.questionId);
    return q && a.selectedKey === q.correctKey;
  }).length;

  const total = result.questions.length;
  const pct = Math.round((correctCount / total) * 100);

  const grade =
    pct >= 80 ? "Godkänd ✓" : pct >= 60 ? "Nära gränsen" : "Underkänd ✗";
  const gradeColor =
    pct >= 80
      ? "text-green-600"
      : pct >= 60
        ? "text-amber-500"
        : "text-red-500";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        {/* Score card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <div className="text-6xl font-bold text-brand-600 tabular-nums">
            {correctCount}
            <span className="text-3xl text-slate-400 font-normal">
              /{total}
            </span>
          </div>
          <div className={`text-xl font-semibold mt-2 ${gradeColor}`}>
            {grade}
          </div>
          <div className="text-sm text-slate-500 mt-1">{pct}% rätt</div>
          <div className="text-xs text-slate-400 mt-3">
            Tid: {formatTime(result.timeUsedSeconds)} /{" "}
            {formatTime(result.durationSeconds)}
          </div>
        </div>

        {/* Per-question review */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-700">Genomgång</h2>
          {result.questions.map((q, idx) => {
            const answer = result.answers.find((a) => a.questionId === q.id);
            const isCorrect = answer?.selectedKey === q.correctKey;
            const isSkipped = answer?.selectedKey === null;

            return (
              <div
                key={q.id}
                className={`bg-white rounded-xl border-2 p-5 ${
                  isCorrect
                    ? "border-green-200"
                    : isSkipped
                      ? "border-slate-200"
                      : "border-red-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                      isCorrect
                        ? "bg-green-100 text-green-700"
                        : isSkipped
                          ? "bg-slate-100 text-slate-500"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {isCorrect ? "✓" : isSkipped ? "—" : "✗"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">
                      {idx + 1}. {q.question}
                    </p>
                    <div className="mt-2 text-xs flex flex-col gap-0.5">
                      <span className="text-green-700 font-medium">
                        Rätt svar: {q.correctKey} —{" "}
                        {q.options.find((o) => o.key === q.correctKey)?.text}
                      </span>
                      {!isCorrect && !isSkipped && (
                        <span className="text-red-600">
                          Ditt svar: {answer?.selectedKey} —{" "}
                          {
                            q.options.find(
                              (o) => o.key === answer?.selectedKey
                            )?.text
                          }
                        </span>
                      )}
                      {isSkipped && (
                        <span className="text-slate-400">Ej besvarad</span>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-slate-500 italic">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex-1 px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors text-center"
          >
            Tillbaka till start
          </button>
        </div>
      </div>
    </div>
  );
};
