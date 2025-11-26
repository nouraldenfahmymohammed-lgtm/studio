'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

type AuthFormProps = {
  mode: 'login' | 'signup';
};

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('تم إرسال رابط التأكيد إلى بريدك الإلكتروني. يرجى التحقق من بريدك لتفعيل حسابك.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError('بيانات الدخول غير صحيحة. يرجى المحاولة مرة أخرى.');
      } else {
        router.push('/');
        router.refresh(); // To trigger middleware and layout updates
      }
    }
    setLoading(false);
  };

  const title = mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد';
  const description =
    mode === 'login'
      ? 'أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى الامتحان.'
      : 'املأ النموذج لإنشاء حسابك والبدء في رحلتك التعليمية.';
  const buttonText = mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب';
  const linkText = mode === 'login' ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟';
  const linkHref = mode === 'login' ? '/signup' : '/login';

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {message && <p className="text-sm text-green-600 bg-green-50 p-3 rounded-md">{message}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : buttonText}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          {linkText}{' '}
          <Link href={linkHref} className="underline">
            {mode === 'login' ? 'أنشئ حسابًا' : 'سجل الدخول'}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
