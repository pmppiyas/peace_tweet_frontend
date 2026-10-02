'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { tokenStorage } from '@/lib/auth/token';
import { authApi } from '@/features/auth/api/auth.api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
    const token = tokenStorage.getAccessToken();
    if (token) {
      authApi
        .getMe()
        .then((res) => {
          if (res?.data) {
            useAuthStore.getState().setUser(res.data);
          }
        })
        .catch(() => {});
    }
  }, [initialize]);

  return <>{children}</>;
}
