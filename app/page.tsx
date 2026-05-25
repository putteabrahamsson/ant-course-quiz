import Link from "next/link";
import { QUIZ_CONFIGS } from "@/types/quiz";

const ICONS: Record<string, string> = {
  ci: "⚙️",
  codegen: "💻",
  support: "🎧",
  multiagent: "🤖",
  full: "📋",
};

const HomePage = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl flex flex-col gap-10">
        {/* Header */}
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Tentaövning
          </h1>
          <p className="text-slate-500 text-base">
            Claude Code &amp; Multi-Agent Systems
          </p>
        </div>

        {/* Quiz buttons */}
        <div className="flex flex-col gap-3">
          {QUIZ_CONFIGS.map((config, idx) => {
            const isFull = config.id === "full";
            return (
              <Link
                key={config.id}
                href={`/quiz/${config.id}`}
                className={`group flex items-center gap-4 rounded-2xl border-2 px-5 py-4 transition-all duration-150 ${
                  isFull
                    ? "border-brand-500 bg-brand-50 hover:bg-brand-100 hover:shadow-md"
                    : "border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50 hover:shadow-sm"
                }`}
              >
                <span className="text-2xl">{ICONS[config.id]}</span>
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-semibold text-sm leading-tight ${
                      isFull ? "text-brand-800" : "text-slate-700"
                    }`}
                  >
                    {isFull
                      ? config.title
                      : `Del-prov ${idx + 1}: ${config.shortTitle}`}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {config.description}
                  </div>
                </div>
                <span
                  className={`text-sm font-medium transition-colors ${
                    isFull
                      ? "text-brand-600 group-hover:text-brand-700"
                      : "text-slate-400 group-hover:text-brand-500"
                  }`}
                >
                  →
                </span>
              </Link>
            );
          })}
        </div>

        <p className="text-center text-xs text-slate-400">
          Välj ett prov ovan för att börja. Timern startar direkt.
        </p>
      </div>
    </main>
  );
};

export default HomePage;
