import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { BookX, Home } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-brand-600 dark:bg-emerald-950/60 dark:text-emerald-400 shadow-md">
        <BookX className="h-10 w-10" />
      </div>
      <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
        পৃষ্ঠাটি পাওয়া যায়নি (৪০৪)
      </h2>
      <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
        আপনি যে দোয়া বা পৃষ্ঠাটি খুঁজছেন তা মুছে ফেলা হয়েছে অথবা ঠিকানাটি ভুল।
      </p>
      <div className="mt-8">
        <Link href={ROUTES.HOME}>
          <Button className="gap-2 rounded-xl">
            <Home className="h-4 w-4" />
            <span>হোমে ফিরে যান</span>
          </Button>
        </Link>
      </div>
    </Container>
  );
}
