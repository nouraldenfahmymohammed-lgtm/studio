'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function AuthButton({ user }: { user: any }) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground hidden sm:inline">أهلاً بك، {user.email}</span>
      <Button variant="ghost" size="icon" onClick={handleSignOut} title="تسجيل الخروج">
        <LogOut />
      </Button>
    </div>
  ) : null;
}
