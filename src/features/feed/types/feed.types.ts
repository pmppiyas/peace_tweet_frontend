import { Dua } from '@/types/dua.types';
import { PaginationMeta } from '@/types/api.types';

export interface FeedResponse {
  data: Dua[];
  meta: PaginationMeta;
}

export interface FeedFilters {
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
}
