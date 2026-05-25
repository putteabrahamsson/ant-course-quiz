import type { Question, OptionKey } from "@/types/quiz";
import variantsJson from "@/questions/code-generation-variants.json";

type VariantEntry = {
  question: string;
  answers: string[];
  correctAnswer: string;
};

type VariantBank = Record<string, VariantEntry[]>;

const EXPLANATIONS: Record<number, string> = {
  1: "Concrete input-output examples showing the expected transformation are the most effective way to align understanding when prose descriptions cause repeated misinterpretation.",
  2: "`context: fork` in a skill's frontmatter runs the skill in an isolated sub-agent context, preventing exploration or analysis output from persisting into the main conversation.",
  3: "Team-shared slash commands belong in `.claude/commands/` inside the project repository, so they are available to every developer who clones or pulls the repo.",
  4: "A skill invoked on-demand via slash command keeps context clean — exemplar code is loaded only when generating new endpoints, not during bug fixes or reviews.",
  5: "A project-scoped `.mcp.json` with `${GITHUB_TOKEN}` environment variable expansion lets each developer supply their own token without committing credentials to version control.",
  6: "Rule files in `.claude/rules/` with YAML frontmatter glob patterns apply conventions automatically and only when working in matching file paths — no manual invocation needed.",
  7: "Plan mode is appropriate for complex, broad tasks with many interdependencies — it lets you explore the codebase and design an approach before making potentially hard-to-reverse changes.",
  8: "Separate markdown files in `.claude/rules/` (one per topic) give each area its own focused file that can be found, read, and updated independently.",
  9: "A personal skill override goes in `~/.claude/skills/` with a *different name* to avoid shadowing the project skill for other developers who share the same project skill name.",
  10: "Universal standards (always applicable) stay in CLAUDE.md; task-specific workflows (PR review, deployment, migrations) become Skills that are invoked only when needed.",
  11: "A guideline only in a developer's `~/.claude/CLAUDE.md` (user-level) is invisible to teammates. Moving it to the project's `.claude/CLAUDE.md` (project-level) makes it apply to everyone.",
  12: "Using an Explore subagent for the verbose discovery phase isolates its output and returns a concise summary, preserving the main conversation's context window for subsequent design and implementation phases.",
  13: "When requirements are unclear or architectural decisions have significant implications, plan mode lets you explore options and present a recommendation before committing to an implementation path.",
  14: "`argument-hint` prompts for required parameters, `context: fork` isolates execution to prevent context bleed, and `allowed-tools` scoped to file writes prevents accidental destructive operations.",
  15: "`context: fork` in the skill's frontmatter runs the analysis in an isolated sub-agent context, so its verbose output does not pollute the main session's context or distract subsequent responses.",
};

const stripPrefix = (answer: string): string => answer.replace(/^[A-D]\.\s*/, "");

export const getRandomCodegenQuestions = (): Question[] => {
  const bank = variantsJson as VariantBank;

  return Array.from({ length: 15 }, (_, i) => {
    const key = `question${i + 1}`;
    const variants = bank[key];
    const variant = variants[Math.floor(Math.random() * variants.length)];

    return {
      id: `codegen-${i + 1}`,
      section: "codegen" as const,
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
