import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../api/category.api';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories(),
    select: (res) => res.data,
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => categoryApi.getCategoryBySlug(slug),
    select: (res) => res.data,
    enabled: !!slug,
  });
}
