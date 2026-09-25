'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error boundary caught:', error);
  }, [error]);

  return (
    <Container className="py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
        কিছু ভুল হয়েছে!
      </h2>
      <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
        পৃষ্ঠাটি লোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।
      </p>
      <div className="mt-6">
        <Button onClick={() => reset()} className="gap-2 rounded-xl">
          <RotateCcw className="h-4 w-4" />
          <span>পুনরায় চেষ্টা করুন</span>
        </Button>
      </div>
    </Container>
  );
}
