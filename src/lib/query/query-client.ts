import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 3, // 3 minutes fresh cache
      gcTime: 1000 * 60 * 15, // 15 minutes garbage collection
      retry: (failureCount, error: any) => {
        const status = error?.response?.status;
        const msg = error?.response?.data?.message;
        if (
          status === 404 ||
          status === 401 ||
          (status === 400 && typeof msg === 'string' && msg.toLowerCase().includes('user does not exist'))
        ) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
