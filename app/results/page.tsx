"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ResultsSummary } from "@/components/ResultsSummary";
import type { QuizResult } from "@/types/quiz";

const ResultsPage = () => {
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("quizResult");
    if (!raw) {
      router.replace("/");
      return;
    }
    setResult(JSON.parse(raw) as QuizResult);
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-slate-400 text-sm">Laddar resultat…</span>
      </div>
    );
  }

  return <ResultsSummary result={result} />;
};

export default ResultsPage;
