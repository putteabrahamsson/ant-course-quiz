import type { Question, OptionKey } from "@/types/quiz";
import variantsJson from "@/questions/claude-code-ci-variants.json";

// ---------------------------------------------------------------------------
// Types matching the structure of claude-code-ci-variants.json
// ---------------------------------------------------------------------------

type VariantEntry = {
  question: string;
  answers: string[];
  correctAnswer: string;
};

type VariantBank = Record<string, VariantEntry[]>;

// ---------------------------------------------------------------------------
// Explanations — one per question concept (shared across all 4 variants)
// ---------------------------------------------------------------------------

const EXPLANATIONS: Record<number, string> = {
  1: "Splitting a large PR review into focused per-file passes, followed by a separate integration-focused pass, produces more consistent and thorough feedback than single-pass analysis of all files.",
  2: "Few-shot examples demonstrating the exact desired output format are the most reliable technique for producing consistently structured responses when instructions alone fail.",
  3: "Explicit severity criteria with concrete code examples anchors the model's classification to defined standards, eliminating the ambiguity that causes inconsistent ratings.",
  4: "Use synchronous API calls for latency-sensitive blocking tasks. Use the Message Batches API (50% cheaper) only for deferrable tasks — weekly audits and nightly generation can tolerate up to 24-hour delays.",
  5: "The Batch API processes requests asynchronously. It cannot pause mid-request, execute a tool, receive results, and continue — that interactive loop requires synchronous calls.",
  6: "Vague criteria like 'accurate and up-to-date' produce false positives and false negatives. Specifying 'flag only when claimed behavior contradicts actual code' gives the model a precise, testable condition.",
  7: "Including prior review findings in context lets the model distinguish already-addressed issues from new ones, eliminating duplicate comments on code that has been fixed.",
  8: "Including reasoning and confidence inline with each finding lets developers quickly judge validity at a glance — removing the need to investigate each finding individually before deciding to act.",
  9: "The `-p` flag (print mode) is required to run Claude Code non-interactively in headless environments like CI pipelines.",
  10: "The `--output-format json` and `--json-schema` CLI flags enforce structured output at the tooling level, which is more reliable than prompt instructions alone for downstream parsing.",
  11: "Including the existing test file in context gives the model the information it needs to recognize which scenarios are already covered, preventing duplicate suggestions.",
  12: "Only the overnight deep-analysis workflow has the latency tolerance for batch processing. A blocking pre-merge hook requires real-time synchronous responses and must not use batch.",
  13: "An independent second agent has not committed to the generator's prior reasoning, allowing it to surface flaws the generator rationalized away — the root cause of self-review bias.",
  14: "Pre-merge checks are latency-sensitive and must remain synchronous. Technical debt reports are consumed the next morning, so they tolerate batch processing and benefit from the 50% cost saving.",
  15: "Temporarily disabling high false-positive categories (style, naming, documentation) while improving their prompts stops the credibility bleed and protects developer trust in the accurate categories.",
};

// ---------------------------------------------------------------------------
// Strips the "A. " / "B. " prefix from answer strings in the JSON
// ---------------------------------------------------------------------------

const stripPrefix = (answer: string): string => answer.replace(/^[A-D]\.\s*/, "");

// ---------------------------------------------------------------------------
// Returns 15 Question objects with one randomly selected variant each.
// Call this function at request time (not module init) to get fresh randomization.
// ---------------------------------------------------------------------------

export const getRandomCIQuestions = (): Question[] => {
  const bank = variantsJson as VariantBank;

  return Array.from({ length: 15 }, (_, i) => {
    const key = `question${i + 1}`;
    const variants = bank[key];
    const variant = variants[Math.floor(Math.random() * variants.length)];

    return {
      id: `ci-${i + 1}`,
      section: "ci" as const,
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
