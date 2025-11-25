'use server';

/**
 * @fileOverview This file defines a Genkit flow for grading essay questions using AI.
 *
 * The flow compares a student's answer to a model answer semantically, providing a grade
 * based on coverage of key points, validity, and coherence. This allows for flexible
 * grading that considers understanding rather than exact word matching.
 *
 * @exports {
 *   gradeEssayQuestion,
 *   GradeEssayQuestionInput,
 *   GradeEssayQuestionOutput
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the gradeEssayQuestion function
const GradeEssayQuestionInputSchema = z.object({
  studentAnswer: z
    .string()
    .describe('The student\u0027s answer to the essay question.'),
  modelAnswer: z.string().describe('The model answer to the essay question.'),
  question: z.string().describe('The essay question being graded.'),
  maxPoints: z.number().describe('The maximum points possible for the question.'),
});

export type GradeEssayQuestionInput = z.infer<typeof GradeEssayQuestionInputSchema>;

// Define the output schema for the gradeEssayQuestion function
const GradeEssayQuestionOutputSchema = z.object({
  grade: z.number().describe('The grade assigned to the student\u0027s answer.'),
  justification: z
    .string()
    .describe('A justification for the assigned grade, explaining the reasoning.'),
});

export type GradeEssayQuestionOutput = z.infer<typeof GradeEssayQuestionOutputSchema>;

// Define the exported wrapper function
export async function gradeEssayQuestion(
  input: GradeEssayQuestionInput
): Promise<GradeEssayQuestionOutput> {
  return gradeEssayQuestionFlow(input);
}

// Define the prompt for grading the essay question
const gradeEssayQuestionPrompt = ai.definePrompt({
  name: 'gradeEssayQuestionPrompt',
  input: {schema: GradeEssayQuestionInputSchema},
  output: {schema: GradeEssayQuestionOutputSchema},
  prompt: `You are an AI grading assistant tasked with grading student essay answers.
  Your task is to compare the student's answer to the model answer and provide a grade
  from 0 to {{maxPoints}} and a justification for the grade.

  Here are the criteria for grading:
  - Content Validity: How much of the student's answer is valid.
  - Key Elements Coverage: How many of the key elements from the model answer does the student\u0027s answer cover.
  - Coherence: How coherent is the answer overall?

  Please follow these guidelines:
  - Provide a grade from 0 to {{maxPoints}}.
  - Justify the grade by explaining the reasoning behind it, including how well the student
    covered the key points in the model answer, the validity of their content, and the coherence of the answer.
  - Do not be too verbose; the justification should be concise.
  - Accept different formulations and synonyms as long as the meaning is correct.
  - Do not penalize simple spelling mistakes if the meaning is clear.

  Here is the essay question:
  {{question}}

  Here is the student\u0027s answer:
  {{studentAnswer}}

  Here is the model answer:
  {{modelAnswer}}`,
});

// Define the Genkit flow for grading the essay question
const gradeEssayQuestionFlow = ai.defineFlow(
  {
    name: 'gradeEssayQuestionFlow',
    inputSchema: GradeEssayQuestionInputSchema,
    outputSchema: GradeEssayQuestionOutputSchema,
  },
  async input => {
    const {output} = await gradeEssayQuestionPrompt(input);
    return output!;
  }
);
