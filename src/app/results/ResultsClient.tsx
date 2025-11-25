'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ExamResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Award, CheckCircle, MessageSquareQuote, Percent } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export default function ResultsClient() {
  const [result, setResult] = useState<ExamResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedResult = localStorage.getItem('examResult');
    if (savedResult) {
      setResult(JSON.parse(savedResult));
    }
    setIsLoading(false);
  }, []);

  const getEssayPerformanceSummary = (essayScore: number, essayMaxScore: number): string => {
    if (essayMaxScore === 0) return 'لا يوجد';
    const percentage = (essayScore / essayMaxScore) * 100;
    if (percentage >= 80) return 'ممتاز';
    if (percentage >= 60) return 'جيد';
    if (percentage >= 40) return 'مقبول';
    return 'يحتاج إلى تحسين';
  };

  if (isLoading) {
    return <div>جاري تحميل النتائج...</div>;
  }

  if (!result) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">لم يتم العثور على نتائج</h2>
        <p className="text-muted-foreground">يبدو أنك لم تكمل الامتحان بعد.</p>
        <Button onClick={() => router.push('/')} className="mt-4">
          العودة إلى البداية
        </Button>
      </div>
    );
  }

  const chartData = [
    { name: 'الاختيار من متعدد', 'الدرجة المحققة': (result.totalScore - result.essayScore) / (result.maxScore - result.essayMaxScore) * 100 },
    { name: 'الأسئلة المقالية', 'الدرجة المحققة': (result.essayScore / result.essayMaxScore) * 100 },
  ];

  return (
    <Card className="w-full max-w-4xl shadow-xl">
      <CardHeader className="text-center">
        <Award className="mx-auto h-16 w-16 text-primary" />
        <CardTitle className="text-4xl font-headline mt-2">نتيجتك النهائية</CardTitle>
        <CardDescription className="text-xl text-muted-foreground">أحسنت! إليك ملخص أدائك.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
          <p className="text-lg text-muted-foreground">الدرجة الإجمالية</p>
          <p className="text-6xl font-bold text-primary">
            {result.totalScore} <span className="text-3xl text-muted-foreground">/ {result.maxScore}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <Card>
            <CardHeader>
              <Percent className="mx-auto h-8 w-8 text-accent" />
              <CardTitle className="text-lg">النسبة المئوية</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{result.percentage}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CheckCircle className="mx-auto h-8 w-8 text-accent" />
              <CardTitle className="text-lg">الاختيار من متعدد</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{result.mcqCorrectCount} / {result.mcqTotal}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <MessageSquareQuote className="mx-auto h-8 w-8 text-accent" />
              <CardTitle className="text-lg">أداء الأسئلة المقالية</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{getEssayPerformanceSummary(result.essayScore, result.essayMaxScore)}</p>
            </CardContent>
          </Card>
        </div>

        <div className="pt-4">
            <h3 className="text-2xl font-headline text-center mb-4">تحليل الأداء</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} layout="vertical" margin={{right: 40}}>
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <YAxis type="category" dataKey="name" width={120} tick={{fontSize: 14}} />
                    <Tooltip formatter={(value) => `${Math.round(Number(value))}%`} />
                    <Bar dataKey="الدرجة المحققة" fill="var(--color-primary)" radius={[0, 4, 4, 0]} barSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </div>

        <div className="text-center pt-6">
          <Button onClick={() => {
            localStorage.removeItem('examResult');
            router.push('/');
          }} size="lg">
            إعادة الامتحان
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
