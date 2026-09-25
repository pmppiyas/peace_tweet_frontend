export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    duas: number;
  };
}
