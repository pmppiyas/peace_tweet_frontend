import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { siteConfig } from '@/config/site';
import { API_ENDPOINTS } from '@/constants/api';
import { tokenStorage } from '../auth/token';
import { useAuthStore } from '@/stores/authStore';

export const apiClient = axios.create({
  baseURL: siteConfig.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach Access Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Handle Token Refresh on 401 and invalid user state
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

const handleForceLogout = () => {
  tokenStorage.clearTokens();
  try {
    useAuthStore.getState().logout();
  } catch (e) {
    console.error('Failed to logout store:', e);
  }
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    if (!path.startsWith('/login') && !path.startsWith('/register')) {
      window.location.href = '/login';
    }
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const responseData = error.response?.data as { message?: string } | undefined;
    const errorMessage = responseData?.message || '';
    const status = error.response?.status;

    // Detect if user does not exist in database or account is inactive/deleted
    const isUserNotExist =
      (status === 400 || status === 401 || status === 404) &&
      (errorMessage === 'User does not exist!' ||
        errorMessage.toLowerCase().includes('user does not exist') ||
        errorMessage.toLowerCase().includes('user account is inactive') ||
        errorMessage.toLowerCase().includes('user not found'));

    if (isUserNotExist) {
      handleForceLogout();
      return Promise.reject(error);
    }

    // If 401 and not already retrying and not an auth endpoint
    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/register') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        handleForceLogout();
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${siteConfig.apiUrl}${API_ENDPOINTS.AUTH.REFRESH}`,
          { refreshToken },
        );

        const newAccessToken = data?.data?.accessToken || data?.accessToken;
        const newRefreshToken = data?.data?.refreshToken || data?.refreshToken;

        if (newAccessToken) {
          tokenStorage.setAccessToken(newAccessToken);
          if (newRefreshToken) {
            tokenStorage.setRefreshToken(newRefreshToken);
          }

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          processQueue(null, newAccessToken);
          return apiClient(originalRequest);
        } else {
          throw new Error('Refresh failed');
        }
      } catch (refreshError: any) {
        processQueue(refreshError as Error, null);
        handleForceLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
