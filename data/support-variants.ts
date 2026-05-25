import type { Question, OptionKey } from "@/types/quiz";
import variantsJson from "@/questions/customer-support-variants.json";

type VariantEntry = {
  question: string;
  answers: string[];
  correctAnswer: string;
};

type VariantBank = Record<string, VariantEntry[]>;

const EXPLANATIONS: Record<number, string> = {
  1: "Prompting Claude to batch multiple tool requests per turn and returning all results together before the next API call minimizes round-trips and reduces average latency per resolution.",
  2: "Keyword-sensitive instructions in the system prompt are the most likely cause — they steer tool selection based on surface-level terms rather than the actual intent of the request.",
  3: "When the agent calls the wrong tool, the first step is to review the tool descriptions and ensure they clearly distinguish each tool's purpose, inputs, and when to use it versus similar tools.",
  4: "Adding explicit escalation criteria with few-shot examples to the system prompt gives the agent a clear, consistent framework for deciding when to escalate versus resolve autonomously.",
  5: "Few-shot examples targeting ambiguous scenarios — with reasoning explaining why one tool was chosen over plausible alternatives — most effectively teach the model how to handle boundary cases.",
  6: "Extracting transactional facts (amounts, dates, order numbers) into a persistent 'case facts' block outside the summarized history ensures specific values survive progressive summarization.",
  7: "Decomposing the request into distinct concerns and investigating each in parallel with shared customer context, then synthesizing, is more efficient than sequential investigation with redundant data gathering.",
  8: "Few-shot examples demonstrating correct reasoning and tool call sequences for multi-concern requests directly teach the model how to handle the pattern that causes accuracy drops.",
  9: "Expanding tool descriptions to include input formats, example queries, edge cases, and explicit boundaries ('use this when X, not when Y') is the most direct fix for tool selection confusion.",
  10: "A self-critique step where the agent evaluates its draft response for completeness — checking that it addresses the concern, includes context, and anticipates follow-ups — systematically improves resolution quality.",
  11: "The `stop_reason` field is the authoritative signal: `tool_use` means Claude needs tool results to continue; `end_turn` means it has produced a final response ready for the customer.",
  12: "A PostToolUse hook intercepts tool results before the agent processes them, applying normalization transformations centrally — including for third-party tools you cannot modify.",
  13: "When a name search returns multiple matches, asking the customer for an additional identifier (email, phone, order number) before proceeding is the safest way to ensure the correct account.",
  14: "Escalate when policy is silent on the specific situation — a competitor price match request falls outside the defined policy scope and requires human judgment for policy interpretation.",
  15: "A programmatic prerequisite that blocks order and refund operations until a verified customer ID exists enforces the correct flow at the code level, making it impossible to bypass via prompt interpretation.",
};

const stripPrefix = (answer: string): string => answer.replace(/^[A-D]\.\s*/, "");

export const getRandomSupportQuestions = (): Question[] => {
  const bank = variantsJson as VariantBank;

  return Array.from({ length: 15 }, (_, i) => {
    const key = `question${i + 1}`;
    const variants = bank[key];
    const variant = variants[Math.floor(Math.random() * variants.length)];

    return {
      id: `support-${i + 1}`,
      section: "support" as const,
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
