import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api.types';
import { BloodGroup, User, UserStatus } from '@/types/user.types';

export interface UpdateUserInput {
  name?: string;
  username?: string;
  email?: string;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  country?: string | null;
  countryCode?: string | null;
  state?: string | null;
  city?: string | null;
  location?: string | null;
  bloodGroup?: BloodGroup | null;
  bio?: string | null;
  badge?: string;
  userStatus?: UserStatus;
  isDonor?: boolean;
  donationCount?: number;
}

export interface ChangePasswordInput {
  currentPassword?: string;
  newPassword: string;
}

export const usersApi = {
  // Update current user profile
  updateProfile: async (input: UpdateUserInput): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.patch<ApiResponse<User>>(
      API_ENDPOINTS.USERS.ME,
      input,
    );
    return data;
  },

  // Change password for current logged-in user
  changePassword: async (input: ChangePasswordInput): Promise<ApiResponse<{ message: string }>> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      API_ENDPOINTS.USERS.CHANGE_PASSWORD,
      input,
    );
    return data;
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.get<ApiResponse<User>>(
      API_ENDPOINTS.USERS.ME,
    );
    return data;
  },

  // Request 6-digit email verification code
  requestEmailVerification: async (email?: string): Promise<
    ApiResponse<{
      alreadyVerified?: boolean;
      sent?: boolean;
      email: string;
      deliveryMode?: 'resend' | 'smtp' | 'dev';
      devCode?: string;
      expiresInSeconds?: number;
    }>
  > => {
    const { data } = await apiClient.post(
      API_ENDPOINTS.USERS.VERIFY_EMAIL_REQUEST,
      email ? { email } : {},
    );
    return data;
  },

  // Confirm 6-digit email verification code (+50 pts)
  confirmEmailVerification: async (
    code: string,
    email?: string,
  ): Promise<
    ApiResponse<{
      user: User;
      emailVerified: boolean;
      pointsAwarded: number;
      alreadyAwarded?: boolean;
      userStatus?: string;
    }>
  > => {
    const { data } = await apiClient.post(
      API_ENDPOINTS.USERS.VERIFY_EMAIL_CONFIRM,
      email ? { code, email } : { code },
    );
    return data;
  },

  // Verify Gmail via Google OAuth
  verifyEmailWithGoogle: async (payload: {
    accessToken?: string;
    idToken?: string;
    code?: string;
    redirectUri?: string;
  }): Promise<
    ApiResponse<{
      user: User;
      emailVerified: boolean;
      pointsAwarded: number;
      alreadyAwarded?: boolean;
      userStatus?: string;
    }>
  > => {
    const { data } = await apiClient.post(
      API_ENDPOINTS.USERS.VERIFY_EMAIL_GOOGLE,
      payload,
    );
    return data;
  },
};
