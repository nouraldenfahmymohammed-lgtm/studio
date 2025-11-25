import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock } from 'lucide-react';
import { examDetails } from '@/lib/exam-data';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <FileText size={32} />
          </div>
          <CardTitle className="text-3xl font-headline">{examDetails.title}</CardTitle>
          <CardDescription className="text-lg pt-2">{examDetails.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock size={20} />
            <span>{`المدة: ${examDetails.durationInMinutes} دقيقة`}</span>
          </div>
          <Button asChild size="lg" className="w-full max-w-xs font-bold text-lg">
            <Link href="/exam">ابدأ الامتحان</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
