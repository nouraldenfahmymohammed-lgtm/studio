'use client';

import type { Question } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

interface QuestionDisplayProps {
  question: Question;
  onAnswerChange: (questionId: number, answer: string) => void;
  currentAnswer?: string;
}

export default function QuestionDisplay({ question, onAnswerChange, currentAnswer }: QuestionDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">{`سؤال ${question.id} (${question.points} ${question.points > 2 ? 'درجات' : 'درجة'})`}</p>
        <h2 className="text-2xl font-bold whitespace-pre-wrap">{question.question}</h2>
      </div>

      {question.type === 'mcq' && question.options && (
        <RadioGroup
          value={currentAnswer}
          onValueChange={(value) => onAnswerChange(question.id, value)}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-3 space-x-reverse">
              <RadioGroupItem value={option} id={`q${question.id}-o${index}`} />
              <Label htmlFor={`q${question.id}-o${index}`} className="text-lg cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}

      {question.type === 'essay' && (
        <div>
          <Label htmlFor={`q${question.id}-essay`} className="text-lg font-semibold mb-2 block">
            اكتب إجابتك هنا:
          </Label>
          <Textarea
            id={`q${question.id}-essay`}
            value={currentAnswer || ''}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            rows={15}
            className="text-lg p-4"
            placeholder="ابدأ بكتابة إجابتك..."
          />
        </div>
      )}
    </div>
  );
}
