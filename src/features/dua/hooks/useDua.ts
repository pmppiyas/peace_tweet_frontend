import { useQuery } from '@tanstack/react-query';
import { duaApi } from '../api/dua.api';

export function useDua(id: string) {
  return useQuery({
    queryKey: ['dua', id],
    queryFn: () => duaApi.getDuaById(id),
    select: (res) => res.data,
    enabled: !!id,
  });
}
