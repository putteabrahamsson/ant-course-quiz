import { notFound } from "next/navigation";
import { QuizEngine } from "@/components/QuizEngine";
import { QUIZ_CONFIGS } from "@/types/quiz";
import { getQuestionsForSections } from "@/data/questions";

// Re-render on every request so CI variant selection is randomized per session
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ quizId: string }>;
}

const QuizPage = async ({ params }: PageProps) => {
  const { quizId } = await params;
  const config = QUIZ_CONFIGS.find((c) => c.id === quizId);

  if (!config) {
    notFound();
  }

  const questions = getQuestionsForSections(config.sections);

  return <QuizEngine config={config} questions={questions} />;
};

export const generateStaticParams = () =>
  QUIZ_CONFIGS.map((c) => ({ quizId: c.id }));

export default QuizPage;
