'use client';

import React from 'react';
import { useCategories } from '../hooks/useCategory';
import { CategoryCard } from './CategoryCard';
import { Skeleton } from '@/components/ui/Skeleton';

export function CategoryList() {
  const { data: categories, isLoading, isError } = useCategories();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-36 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError || !categories || categories.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
        No categories available at the moment.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
