"use server";

import { gradeEssayQuestion, GradeEssayQuestionInput, GradeEssayQuestionOutput } from "@/ai/flows/grade-essay-question";

export async function gradeEssay(input: GradeEssayQuestionInput): Promise<GradeEssayQuestionOutput> {
  try {
    const result = await gradeEssayQuestion(input);
    return result;
  } catch (error) {
    console.error("Error grading essay:", error);
    // Return a default error response or rethrow
    return {
      grade: 0,
      justification: "حدث خطأ أثناء تصحيح الإجابة. سيتم مراجعتها يدويًا.",
    };
  }
}
