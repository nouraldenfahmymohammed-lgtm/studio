import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, LogIn } from 'lucide-react';
import { examDetails } from '@/lib/exam-data';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

          {user ? (
            <Button asChild size="lg" className="w-full max-w-xs font-bold text-lg">
              <Link href="/exam">ابدأ الامتحان</Link>
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
              <Button asChild size="lg" className="w-full font-bold text-lg">
                <Link href="/login">
                  <LogIn className="ml-2" />
                  تسجيل الدخول
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="w-full font-bold text-lg">
                <Link href="/signup">إنشاء حساب</Link>
              </Button>
            </div>
          )}

        </CardContent>
      </Card>
    </main>
  );
}
