import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import AuthButton from './components/AuthButton';

export const metadata: Metadata = {
  title: 'ExaminatorAI',
  description: 'نظام امتحان إلكتروني ذكي',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <header className="absolute top-0 left-0 right-0 p-4">
          <div className="container mx-auto flex justify-end">
            <AuthButton user={user} />
          </div>
        </header>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
