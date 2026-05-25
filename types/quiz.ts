export type SectionId = "ci" | "codegen" | "support" | "multiagent";

export type OptionKey = "A" | "B" | "C" | "D";

export interface Option {
  key: OptionKey;
  text: string;
}

export interface Question {
  id: string;
  section: SectionId;
  question: string;
  options: Option[];
  correctKey: OptionKey;
  explanation: string;
}

export interface QuizConfig {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  sections: SectionId[];
  durationSeconds: number;
}

export interface UserAnswer {
  questionId: string;
  selectedKey: OptionKey | null;
}

export interface QuizResult {
  quizId: string;
  questions: Question[];
  answers: UserAnswer[];
  durationSeconds: number;
  timeUsedSeconds: number;
  finishedAt: string;
}

export const SECTION_META: Record<SectionId, { label: string; colorClass: string }> = {
  ci:         { label: "Del-prov 1 · CI",         colorClass: "bg-blue-100 text-blue-700" },
  codegen:    { label: "Del-prov 2 · Code Gen",   colorClass: "bg-violet-100 text-violet-700" },
  support:    { label: "Del-prov 3 · Support",    colorClass: "bg-amber-100 text-amber-700" },
  multiagent: { label: "Del-prov 4 · Multi-Agent", colorClass: "bg-emerald-100 text-emerald-700" },
};

export const QUIZ_CONFIGS: QuizConfig[] = [
  {
    id: "ci",
    title: "Del-prov 1: Claude Code for Continuous Integration",
    shortTitle: "CI / Continuous Integration",
    description: "15 frågor · 22.5 minuter",
    sections: ["ci"],
    durationSeconds: 1350,
  },
  {
    id: "codegen",
    title: "Del-prov 2: Code Generation with Claude Code",
    shortTitle: "Code Generation",
    description: "15 frågor · 22.5 minuter",
    sections: ["codegen"],
    durationSeconds: 1350,
  },
  {
    id: "support",
    title: "Del-prov 3: Customer Support Resolution Agent",
    shortTitle: "Support Resolution Agent",
    description: "15 frågor · 22.5 minuter",
    sections: ["support"],
    durationSeconds: 1350,
  },
  {
    id: "multiagent",
    title: "Del-prov 4: Multi-Agent Research System",
    shortTitle: "Multi-Agent System",
    description: "15 frågor · 22.5 minuter",
    sections: ["multiagent"],
    durationSeconds: 1350,
  },
  {
    id: "full",
    title: "Fullständigt prov",
    shortTitle: "Fullständigt prov",
    description: "60 frågor · 90 minuter",
    sections: ["ci", "codegen", "support", "multiagent"],
    durationSeconds: 5400,
  },
];
