export type Question = {
  id: number;
  type: 'mcq' | 'essay';
  question: string;
  points: number;
  options?: string[];
  correctAnswer?: string;
  modelAnswer?: string;
};

export type ExamDetails = {
  title: string;
  description:string;
  durationInMinutes: number;
};

export type Answers = {
  [key: number]: string;
};

export type ExamResult = {
  totalScore: number;
  maxScore: number;
  percentage: number;
  mcqCorrectCount: number;
  mcqTotal: number;
  essayScore: number;
  essayMaxScore: number;
  answers: Answers;
};
