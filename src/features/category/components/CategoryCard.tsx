import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Category } from '@/types/category.types';
import { BookOpen, ChevronRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={ROUTES.CATEGORY_DETAIL(category.slug)} className="group block">
      <Card className="h-full border border-[#e4e6eb] bg-white p-4 hover:border-primary-500 hover:shadow-xs transition-all duration-200 dark:border-[#393a3b] dark:bg-[#242526] dark:hover:border-primary-500 rounded-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors dark:bg-primary-900/70 dark:text-primary-400">
            <BookOpen className="h-5 w-5" />
          </div>
          <ChevronRight className="h-4 w-4 text-[#65676b] group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all dark:text-[#b0b3b8]" />
        </div>

        <div className="mt-3 space-y-1">
          <h3 className="text-sm sm:text-[15px] font-bold text-[#050505] group-hover:text-primary-600 transition-colors dark:text-[#e4e6eb]">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] line-clamp-2">
              {category.description}
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-primary-600 dark:text-primary-400 font-semibold">
          <span>
            {category._count?.duas !== undefined
              ? `${category._count.duas} Duas`
              : 'View Duas'}
          </span>
        </div>
      </Card>
    </Link>
  );
}
