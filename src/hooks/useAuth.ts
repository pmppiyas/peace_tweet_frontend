import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setUser = useAuthStore((state) => state.setUser);
  const setTokens = useAuthStore((state) => state.setTokens);
  const logout = useAuthStore((state) => state.logout);

  const isAdmin = user?.role === 'ADMIN';
  const isModerator = user?.role === 'MODERATOR' || isAdmin;

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    isModerator,
    setUser,
    setTokens,
    logout,
  };
}
