"use client";

import type { Question, OptionKey } from "@/types/quiz";
import { SECTION_META } from "@/types/quiz";

type QuestionCardProps = {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedKey: OptionKey | null;
  revealed: boolean;
  onSelect: (key: OptionKey) => void;
  showSection?: boolean;
};

export const QuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  selectedKey,
  revealed,
  onSelect,
  showSection = false,
}: QuestionCardProps) => {
  const answered = selectedKey !== null;
  const isCorrect = revealed && selectedKey === question.correctKey;

  return (
    <div className="flex flex-col gap-6">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-500">
          Fråga {questionNumber} av {totalQuestions}
        </span>
        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        {showSection && (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mb-3 ${SECTION_META[question.section].colorClass}`}
          >
            {SECTION_META[question.section].label}
          </span>
        )}
        <p className="text-lg font-semibold text-slate-800 leading-relaxed">
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {question.options.map((opt) => {
          const isSelected = selectedKey === opt.key;
          const isCorrectOpt = opt.key === question.correctKey;

          let containerClass =
            "border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50";
          let badgeClass =
            "border-slate-300 text-slate-500 group-hover:border-brand-400";
          let textClass = "text-slate-700";

          if (revealed) {
            if (isCorrectOpt) {
              containerClass = "border-green-400 bg-green-50";
              badgeClass = "border-green-500 bg-green-500 text-white";
              textClass = "text-green-900 font-semibold";
            } else if (isSelected) {
              containerClass = "border-red-400 bg-red-50";
              badgeClass = "border-red-500 bg-red-500 text-white";
              textClass = "text-red-900 font-medium";
            } else {
              containerClass = "border-slate-200 bg-white opacity-50";
            }
          } else if (isSelected) {
            containerClass = "border-brand-500 bg-brand-50 shadow-md";
            badgeClass = "border-brand-500 bg-brand-500 text-white";
            textClass = "text-brand-900 font-medium";
          }

          return (
            <button
              key={opt.key}
              onClick={() => !revealed && onSelect(opt.key)}
              disabled={revealed}
              className={`group flex items-start gap-4 w-full text-left rounded-xl border-2 p-4 transition-all duration-150 disabled:cursor-default ${containerClass}`}
            >
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors ${badgeClass}`}
              >
                {revealed && isCorrectOpt
                  ? "✓"
                  : revealed && isSelected && !isCorrectOpt
                    ? "✗"
                    : opt.key}
              </span>
              <span className={`text-base leading-snug ${textClass}`}>
                {opt.text}
              </span>
            </button>
          );
        })}
      </div>

      {/* Inline feedback banner */}
      {revealed && (
        <div
          className={`rounded-xl px-5 py-4 text-sm leading-relaxed border-2 ${
            isCorrect
              ? "bg-green-50 border-green-300 text-green-800"
              : "bg-red-50 border-red-300 text-red-800"
          }`}
        >
          <span className="font-bold mr-1">{isCorrect ? "✓ Rätt!" : "✗ Fel."}</span>
          {question.explanation}
        </div>
      )}
    </div>
  );
};
