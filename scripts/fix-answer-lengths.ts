import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const client = new Anthropic();

const JSON_FILES = [
  "questions/claude-code-ci-variants.json",
  "questions/code-generation-variants.json",
  "questions/customer-support-variants.json",
  "questions/multi-agent-variants.json",
];

interface QuestionVariant {
  question: string;
  answers: string[];
  correctAnswer: string;
}

const wordCount = (text: string) => text.trim().split(/\s+/).length;

const stripPrefix = (answer: string) => answer.replace(/^[A-D]\. /, "");

const isLengthDisparate = (variant: QuestionVariant): boolean => {
  const correctIdx = variant.correctAnswer.charCodeAt(0) - 65;
  const lengths = variant.answers.map((a) => wordCount(stripPrefix(a)));
  const correctLen = lengths[correctIdx];
  const wrongLengths = lengths.filter((_, i) => i !== correctIdx);
  const avgWrong = wrongLengths.reduce((a, b) => a + b, 0) / wrongLengths.length;
  return correctLen > avgWrong * 1.25;
};

const rewriteWrongAnswers = async (
  variant: QuestionVariant
): Promise<QuestionVariant> => {
  const correctIdx = variant.correctAnswer.charCodeAt(0) - 65;
  const correctAnswer = variant.answers[correctIdx];
  const targetWords = wordCount(stripPrefix(correctAnswer));

  const wrongAnswers = variant.answers
    .map((a, i) => ({ answer: a, idx: i }))
    .filter(({ idx }) => idx !== correctIdx);

  const prompt = `You are editing a technical quiz about the Claude AI API and Claude Code CLI.

Rewrite the 3 WRONG answer options below so each is approximately ${targetWords} words long (the same length as the correct answer). Requirements:
- Keep each wrong answer plausible-sounding but technically incorrect for a Claude/Anthropic expert
- Preserve the letter prefix exactly (e.g. "A. ", "B. ")
- Do NOT change the correct answer
- Return ONLY a JSON array of the 3 rewritten wrong answers in the same order they were given, nothing else

Question: ${variant.question}

Correct answer (DO NOT CHANGE): ${correctAnswer}

Wrong answers to rewrite:
${wrongAnswers.map(({ answer }) => answer).join("\n")}`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const text = content.text.trim();
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error(`No JSON array in response: ${text}`);

  const rewritten: string[] = JSON.parse(jsonMatch[0]);
  if (rewritten.length !== 3) throw new Error(`Expected 3 answers, got ${rewritten.length}`);

  const newAnswers = [...variant.answers];
  wrongAnswers.forEach(({ idx }, i) => {
    newAnswers[idx] = rewritten[i];
  });

  return { ...variant, answers: newAnswers };
};

const processFile = async (filePath: string) => {
  const fullPath = path.resolve(filePath);
  const data: Record<string, QuestionVariant[]> = JSON.parse(
    fs.readFileSync(fullPath, "utf8")
  );

  let fixed = 0;
  let skipped = 0;

  for (const [questionKey, variants] of Object.entries(data)) {
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      if (isLengthDisparate(variant)) {
        process.stdout.write(`  ${questionKey} variant ${i + 1}... `);
        try {
          data[questionKey][i] = await rewriteWrongAnswers(variant);
          console.log("done");
          fixed++;
        } catch (err) {
          console.log(`ERROR: ${err}`);
          skipped++;
        }
      } else {
        skipped++;
      }
    }
  }

  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
  console.log(`  → ${fixed} rewritten, ${skipped} skipped\n`);
};

const main = async () => {
  console.log("Fixing answer length disparity across quiz files...\n");

  for (const file of JSON_FILES) {
    console.log(`Processing ${file}...`);
    await processFile(file);
  }

  // Verify
  let total = 0;
  let correctLongest = 0;
  for (const file of JSON_FILES) {
    const data: Record<string, QuestionVariant[]> = JSON.parse(
      fs.readFileSync(path.resolve(file), "utf8")
    );
    for (const variants of Object.values(data)) {
      for (const v of variants) {
        const correctIdx = v.correctAnswer.charCodeAt(0) - 65;
        const lengths = v.answers.map((a) => wordCount(stripPrefix(a)));
        const maxLen = Math.max(...lengths);
        total++;
        if (lengths[correctIdx] === maxLen) correctLongest++;
      }
    }
  }

  console.log("=== VERIFICATION ===");
  console.log(`Total questions: ${total}`);
  console.log(`Correct is longest: ${correctLongest} (${Math.round((correctLongest / total) * 100)}%)`);
};

main().catch(console.error);
