'use client';

import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExamTimerProps {
  timeLeft: number;
}

export default function ExamTimer({ timeLeft }: ExamTimerProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const isLowTime = timeLeft < 300; // Less than 5 minutes

  return (
    <div className={cn(
        "flex items-center gap-2 text-lg font-semibold tabular-nums rounded-full px-4 py-2",
        isLowTime ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
    )}>
      <Clock size={20} />
      <span>{`الوقت المتبقي: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}</span>
    </div>
  );
}
