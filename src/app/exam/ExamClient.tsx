'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { examQuestions, examDetails } from '@/lib/exam-data';
import type { Answers, ExamResult, Question } from '@/lib/types';
import QuestionDisplay from './QuestionDisplay';
import ExamTimer from './ExamTimer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { gradeEssay } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

type ExamState = 'loading' | 'in-progress' | 'grading' | 'finished';

export default function ExamClient() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [examState, setExamState] = useState<ExamState>('loading');
  const [timeLeft, setTimeLeft] = useState(examDetails.durationInMinutes * 60);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setExamState('in-progress');
  }, []);

  useEffect(() => {
    if (examState !== 'in-progress') return;

    if (timeLeft <= 0) {
      handleSubmitExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, examState]);
  
  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmitExam();
    }
  };

  const handleSubmitExam = async () => {
    if (examState === 'grading') return;
    setExamState('grading');
    toast({
        title: "جاري التصحيح",
        description: "يتم الآن تصحيح إجاباتك باستخدام الذكاء الاصطناعي. قد يستغرق هذا بعض الوقت.",
    });

    const mcqQuestions = examQuestions.filter((q) => q.type === 'mcq');
    const essayQuestions = examQuestions.filter((q) => q.type === 'essay');

    let totalScore = 0;
    let mcqCorrectCount = 0;
    const maxScore = examQuestions.reduce((sum, q) => sum + q.points, 0);
    const mcqTotal = mcqQuestions.length;
    const essayMaxScore = essayQuestions.reduce((sum, q) => sum + q.points, 0);


    // Grade MCQs
    mcqQuestions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        totalScore += q.points;
        mcqCorrectCount++;
      }
    });

    // Grade Essays
    const essayPromises = essayQuestions.map((q) => {
      const studentAnswer = answers[q.id] || '';
      return gradeEssay({
        studentAnswer,
        modelAnswer: q.modelAnswer!,
        question: q.question,
        maxPoints: q.points,
      });
    });

    try {
      const essayResults = await Promise.all(essayPromises);
      const essayScore = essayResults.reduce((sum, result) => sum + result.grade, 0);
      totalScore += essayScore;

      const finalResult: ExamResult = {
        totalScore,
        maxScore,
        percentage: Math.round((totalScore / maxScore) * 100),
        mcqCorrectCount,
        mcqTotal,
        essayScore,
        essayMaxScore,
        answers,
      };

      localStorage.setItem('examResult', JSON.stringify(finalResult));
      router.push('/results');
    } catch (error) {
      console.error('Error during grading:', error);
      toast({
        variant: 'destructive',
        title: 'حدث خطأ',
        description: 'حدث خطأ أثناء تصحيح الأسئلة المقالية. يرجى المحاولة مرة أخرى.',
      });
      setExamState('in-progress');
    }
  };

  const currentQuestion: Question = examQuestions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / examQuestions.length) * 100;

  if (examState === 'loading') {
    return <Loader2 className="h-12 w-12 animate-spin text-primary" />;
  }
  
  if (examState === 'grading') {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <h2 className="text-2xl font-headline font-bold text-primary">يتم التصحيح...</h2>
            <p className="text-muted-foreground mt-2">يقوم الذكاء الاصطناعي بتقييم إجاباتك المقالية. انتظر من فضلك.</p>
        </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <CardTitle className="text-xl font-headline">{examDetails.title}</CardTitle>
          <ExamTimer timeLeft={timeLeft} />
        </div>
        <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
                <span>التقدم</span>
                <span>{`سؤال ${currentQuestionIndex + 1} من ${examQuestions.length}`}</span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
        </div>
      </CardHeader>
      <CardContent>
        <QuestionDisplay
          question={currentQuestion}
          onAnswerChange={handleAnswerChange}
          currentAnswer={answers[currentQuestion.id]}
        />
        <div className="mt-8 flex justify-end">
          <Button onClick={handleNextQuestion} size="lg">
            {currentQuestionIndex < examQuestions.length - 1 ? 'التالي' : 'إنهاء الامتحان'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
