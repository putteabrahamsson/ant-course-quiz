import type { Question } from "@/types/quiz";
import { getRandomCIQuestions } from "@/data/ci-variants";
import { getRandomCodegenQuestions } from "@/data/codegen-variants";
import { getRandomSupportQuestions } from "@/data/support-variants";
import { getRandomMultiagentQuestions } from "@/data/multiagent-variants";

// ---------------------------------------------------------------------------
// MOCK QUESTIONS — ersätts med riktiga frågor senare.
// Varje sektion har 15 platshållare; de första 3 har fullständigt innehåll.
// ---------------------------------------------------------------------------

const makePlaceholder = (
  section: Question["section"],
  index: number
): Question => ({
  id: `${section}-${index}`,
  section,
  question: `[Placeholder] Fråga ${index} för sektion "${section}" — ersätts med riktigt innehåll.`,
  options: [
    { key: "A", text: "Alternativ A (placeholder)" },
    { key: "B", text: "Alternativ B (placeholder)" },
    { key: "C", text: "Alternativ C (placeholder)" },
    { key: "D", text: "Alternativ D (placeholder)" },
  ],
  correctKey: "A",
  explanation: "Förklaring tillkommer när riktiga frågor läggs till.",
});

// ── CI ──────────────────────────────────────────────────────────────────────
const ciQuestions: Question[] = [
  {
    id: "ci-1",
    section: "ci",
    question:
      "Vilket Claude Code-kommando används för att köra en icke-interaktiv session i en CI-pipeline?",
    options: [
      { key: "A", text: "claude --headless" },
      { key: "B", text: "claude --no-input" },
      { key: "C", text: "claude -p" },
      { key: "D", text: "claude run --batch" },
    ],
    correctKey: "C",
    explanation:
      '`claude -p` (print-mode) kör Claude Code icke-interaktivt och skriver svaret till stdout, vilket gör det lämpligt för CI-pipelines.',
  },
  {
    id: "ci-2",
    section: "ci",
    question:
      "Varför bör man sätta MAX_TURNS till ett lågt värde i CI-kontext?",
    options: [
      { key: "A", text: "För att minska minnesanvändningen" },
      {
        key: "B",
        text: "För att begränsa kostnader och förhindra oändliga loopar",
      },
      { key: "C", text: "Eftersom CI inte stöder fler turns" },
      { key: "D", text: "För att snabba upp kompilering" },
    ],
    correctKey: "B",
    explanation:
      "Ett lågt MAX_TURNS begränsar antalet LLM-anrop, vilket kontrollerar kostnader och förhindrar att agenten fastnar i en oändlig loop vid ett fel.",
  },
  {
    id: "ci-3",
    section: "ci",
    question: "Hur autentiserar man Claude Code mot Anthropic API i CI?",
    options: [
      { key: "A", text: "Via OAuth-inloggning i terminalen" },
      { key: "B", text: "Genom att spara en config-fil i repot" },
      { key: "C", text: "Med miljövariabeln ANTHROPIC_API_KEY" },
      { key: "D", text: "Ingen autentisering behövs i CI" },
    ],
    correctKey: "C",
    explanation:
      "I CI sätts `ANTHROPIC_API_KEY` som en hemlig miljövariabel (GitHub Secret, GitLab CI variable etc.) — ingen interaktiv inloggning är möjlig.",
  },
  ...Array.from({ length: 12 }, (_, i) => makePlaceholder("ci", i + 4)),
];

// ── CODE GENERATION ─────────────────────────────────────────────────────────
const codegenQuestions: Question[] = [
  {
    id: "codegen-1",
    section: "codegen",
    question: "Vad är syftet med en CLAUDE.md-fil i ett projekt?",
    options: [
      { key: "A", text: "Att lagra API-nycklar säkert" },
      {
        key: "B",
        text: "Att ge Claude projektspecifik kontext och instruktioner",
      },
      { key: "C", text: "Att definiera CI/CD-pipelines" },
      { key: "D", text: "Att konfigurera TypeScript-kompilatorn" },
    ],
    correctKey: "B",
    explanation:
      "CLAUDE.md läses av Claude Code vid varje session och ger modellen kontextinformation om projektet — stack, konventioner, arbetsflöden.",
  },
  {
    id: "codegen-2",
    section: "codegen",
    question:
      "Vilket kommando visar en lista med alla tillgängliga slash-kommandon i Claude Code?",
    options: [
      { key: "A", text: "/list" },
      { key: "B", text: "/commands" },
      { key: "C", text: "/help" },
      { key: "D", text: "/skills" },
    ],
    correctKey: "C",
    explanation:
      "Kommandot `/help` listar alla tillgängliga inbyggda och användardefinierade slash-kommandon i den aktiva sessionen.",
  },
  {
    id: "codegen-3",
    section: "codegen",
    question: "Vad är ett MCP-verktyg i Claude Code-ekosystemet?",
    options: [
      { key: "A", text: "En speciell typ av Git-hook" },
      {
        key: "B",
        text: "Ett externt verktyg som Claude kan anropa via Model Context Protocol",
      },
      { key: "C", text: "En konfigurations-fil för minne" },
      { key: "D", text: "En metod för att komprimera prompts" },
    ],
    correctKey: "B",
    explanation:
      "MCP (Model Context Protocol) är ett standardiserat protokoll som låter Claude anropa externa verktyg och resurser, t.ex. databaser, API:er och filer.",
  },
  ...Array.from({ length: 12 }, (_, i) => makePlaceholder("codegen", i + 4)),
];

// ── SUPPORT AGENT ────────────────────────────────────────────────────────────
const supportQuestions: Question[] = [
  {
    id: "support-1",
    section: "support",
    question:
      "Vilket mönster används för att dirigera ärenden till rätt specialistagent i ett support-system?",
    options: [
      { key: "A", text: "Round-robin routing" },
      { key: "B", text: "Orchestrator-worker pattern med intent-klassificering" },
      { key: "C", text: "FIFO-kö utan klassificering" },
      { key: "D", text: "Random selection" },
    ],
    correctKey: "B",
    explanation:
      "En orchestrator-agent klassificerar inkommande ärendens intent och delegerar till rätt specialistagent (t.ex. faktura, teknisk support, returer).",
  },
  {
    id: "support-2",
    section: "support",
    question:
      "Hur hanteras fel i ett agentbaserat support-system för att undvika att hela flödet kraschar?",
    options: [
      { key: "A", text: "Ignorera alla fel och fortsätt" },
      { key: "B", text: "Avbryt sessionen omedelbart" },
      {
        key: "C",
        text: "Implementera retry-logik med exponentiell backoff och fallback-agent",
      },
      { key: "D", text: "Logga felet och vänta på manuell åtgärd" },
    ],
    correctKey: "C",
    explanation:
      "Robusta agentsystem använder retry med exponentiell backoff för övergående fel och en fallback-agent som hanterar ärenden när specialistagenten misslyckas.",
  },
  {
    id: "support-3",
    section: "support",
    question: "Vad innebär 'tool use' i kontexten av en kundtjänst-agent?",
    options: [
      { key: "A", text: "Att agenten använder tangentbordet" },
      {
        key: "B",
        text: "Att agenten anropar externa API:er/funktioner för att hämta eller uppdatera data",
      },
      { key: "C", text: "Att systemet loggar konversationer" },
      { key: "D", text: "Att agenten använder RAG för sökning" },
    ],
    correctKey: "B",
    explanation:
      "Tool use innebär att agenten kan anropa strukturerade funktioner — t.ex. hämta orderinfo, uppdatera ärendestatus eller söka i FAQ — för att ge korrekta svar.",
  },
  ...Array.from({ length: 12 }, (_, i) => makePlaceholder("support", i + 4)),
];

// ── MULTI-AGENT ──────────────────────────────────────────────────────────────
const multiagentQuestions: Question[] = [
  {
    id: "multiagent-1",
    section: "multiagent",
    question:
      "Vad är den primära fördelen med att använda parallella agenter i ett research-system?",
    options: [
      { key: "A", text: "Lägre kostnad per token" },
      {
        key: "B",
        text: "Snabbare resultat genom att utföra oberoende uppgifter samtidigt",
      },
      { key: "C", text: "Enklare felhantering" },
      { key: "D", text: "Bättre kontext-retention" },
    ],
    correctKey: "B",
    explanation:
      "Parallella agenter kan utföra oberoende sökningar och analyser samtidigt, vilket drastiskt minskar den totala exekveringstiden jämfört med sekventiell körning.",
  },
  {
    id: "multiagent-2",
    section: "multiagent",
    question:
      "Hur sprider sig fel i ett multi-agent-system utan korrekt felhantering?",
    options: [
      { key: "A", text: "Felen isoleras automatiskt per agent" },
      {
        key: "B",
        text: "En agents fel kan kaskaderas och påverka beroende agenters output",
      },
      { key: "C", text: "Felen loggas men påverkar inte resultatet" },
      { key: "D", text: "Systemet pausar tills felet åtgärdas manuellt" },
    ],
    correctKey: "B",
    explanation:
      "Utan felgränser kan en misslyckandeagent orsaka kaskadfel — beroende agenter får felaktig input och returnerar i sin tur felaktiga resultat.",
  },
  {
    id: "multiagent-3",
    section: "multiagent",
    question:
      "Vilket kommunikationsmönster används när en orchestrator-agent delegerar uppgifter och samlar ihop resultaten?",
    options: [
      { key: "A", text: "Pub/Sub" },
      { key: "B", text: "Fan-out / Fan-in" },
      { key: "C", text: "Request-Response" },
      { key: "D", text: "Event Sourcing" },
    ],
    correctKey: "B",
    explanation:
      "Fan-out/Fan-in: orchestratorn distribuerar (fan-out) uppgifter till parallella worker-agenter och samlar sedan (fan-in) deras resultat till ett sammanhållet svar.",
  },
  ...Array.from({ length: 12 }, (_, i) => makePlaceholder("multiagent", i + 4)),
];

export const ALL_QUESTIONS: Question[] = [
  ...ciQuestions,
  ...codegenQuestions,
  ...supportQuestions,
  ...multiagentQuestions,
];

export const getQuestionsForSections = (
  sections: Question["section"][]
): Question[] => {
  const result: Question[] = [];
  for (const section of sections) {
    switch (section) {
      case "ci":
        result.push(...getRandomCIQuestions());
        break;
      case "codegen":
        result.push(...getRandomCodegenQuestions());
        break;
      case "support":
        result.push(...getRandomSupportQuestions());
        break;
      case "multiagent":
        result.push(...getRandomMultiagentQuestions());
        break;
    }
  }
  return result;
};
