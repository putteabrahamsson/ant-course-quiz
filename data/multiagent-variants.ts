import type { Question, OptionKey } from "@/types/quiz";
import variantsJson from "@/questions/multi-agent-variants.json";

type VariantEntry = {
  question: string;
  answers: string[];
  correctAnswer: string;
};

type VariantBank = Record<string, VariantEntry[]>;

const EXPLANATIONS: Record<number, string> = {
  1: "Placing a key findings summary at the start and using explicit section headers counteracts the lost-in-the-middle problem, where models reliably attend to the beginning and end but miss dense middle content.",
  2: "Giving the synthesis agent a scoped verify_fact tool handles the 85% of simple fact-checks locally, while complex verifications still route through the coordinator — reducing overhead without giving up oversight.",
  3: "Renaming the web search tool and updating its description to clearly reference web/URL content removes the ambiguity with the document analysis tool's similarly worded description, fixing the misrouting at its source.",
  4: "Having upstream agents return structured summaries (key facts, citations, relevance scores) instead of verbose content and reasoning chains solves the token budget problem at the source.",
  5: "Explicitly partitioning the research space before delegation — assigning distinct subtopics or source types to each agent — prevents overlap and ensures token usage maps to breadth of coverage.",
  6: "The coordinator receives outputs from both agents and passes them together to the synthesis agent — this maintains central oversight and ensures synthesis has all findings in a unified pass.",
  7: "Returning structured error context (failure type, attempted query, partial results, alternative approaches) to the coordinator enables intelligent, targeted recovery decisions rather than generic retries or hard failures.",
  8: "The root cause is the coordinator's task decomposition being too narrow — it only assigned visual art subtasks, so no agent ever covered music, writing, or film regardless of how well they executed.",
  9: "Returning the error with full context to the coordinator lets it decide the best recovery path (skip, retry, partial results) — keeping recovery logic centralized rather than buried in subagent code.",
  10: "Completing the analysis with both figures, explicitly annotating the conflict with source attribution, and letting the coordinator reconcile before synthesis preserves information and keeps decision authority at the right level.",
  11: "A central coordinator can observe all inter-agent communication, apply consistent error handling policies, and control exactly what context each subagent receives — capabilities lost with direct agent-to-agent communication.",
  12: "Subagent-local recovery for transient failures (corrupted sections, timeouts) reduces coordinator noise; only unresolvable errors bubble up — with context about what was tried and any partial results obtained.",
  13: "Coverage annotations in the synthesis output explicitly distinguish well-supported findings from topic areas with gaps, giving consumers of the report accurate confidence signals without discarding partial work.",
  14: "Replacing `fetch_url` with a `load_document` tool that validates URLs point to document formats prevents the misuse by design — the agent simply cannot issue search-engine queries with a document-only tool.",
  15: "Distinguishing access failures (timeout = infrastructure issue, needs retry) from valid empty results ('0 results' = successful query with no matches) enables the coordinator to apply the right recovery action for each case.",
};

const stripPrefix = (answer: string): string => answer.replace(/^[A-D]\.\s*/, "");

export const getRandomMultiagentQuestions = (): Question[] => {
  const bank = variantsJson as VariantBank;

  return Array.from({ length: 15 }, (_, i) => {
    const key = `question${i + 1}`;
    const variants = bank[key];
    const variant = variants[Math.floor(Math.random() * variants.length)];

    return {
      id: `multiagent-${i + 1}`,
      section: "multiagent" as const,
      question: variant.question,
      options: variant.answers.map((answer, idx) => ({
        key: (["A", "B", "C", "D"] as const)[idx] as OptionKey,
        text: stripPrefix(answer),
      })),
      correctKey: variant.correctAnswer as OptionKey,
      explanation: EXPLANATIONS[i + 1] ?? "",
    };
  });
};
