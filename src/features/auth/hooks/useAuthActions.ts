import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '@/stores/authStore';
import { LoginInput, RegisterInput } from '../types/auth.types';
import { ROUTES } from '@/constants/routes';

export function useAuthActions() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser, setTokens, logout: storeLogout } = useAuthStore();

  const registerMutation = useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
    onSuccess: (response) => {
      const { user, accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);
      setUser(user);
      queryClient.clear();
      router.push(ROUTES.HOME);
    },
  });

  const loginMutation = useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (response) => {
      const { user, accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);
      setUser(user);
      queryClient.clear();
      router.push(ROUTES.HOME);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      storeLogout();
      queryClient.clear();
      router.push(ROUTES.LOGIN);
    },
  });

  return {
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}
