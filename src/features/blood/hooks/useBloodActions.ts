'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { bloodApi } from '../api/blood.api';
import { bloodKeys } from './query-keys';
import {
  CreateBloodRequestInput,
  UpdateBloodRequestStatusInput,
} from '../types/blood.types';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/constants/routes';

export function useBloodActions() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const ensureAuth = () => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
      throw new Error('Please log in to continue.');
    }
  };

  // Create blood request mutation
  const createMutation = useMutation({
    mutationFn: async (payload: CreateBloodRequestInput) => {
      ensureAuth();
      return bloodApi.createRequest(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bloodKeys.requests() });
    },
  });

  // Accept blood request (pledge donation)
  const acceptMutation = useMutation({
    mutationFn: async (requestId: string) => {
      ensureAuth();
      return bloodApi.acceptRequest(requestId);
    },
    onSuccess: (_data, requestId) => {
      queryClient.invalidateQueries({ queryKey: bloodKeys.requests() });
      queryClient.invalidateQueries({ queryKey: bloodKeys.requestDetail(requestId) });
    },
  });

  // Complete donation
  const completeDonationMutation = useMutation({
    mutationFn: async ({
      requestId,
      donationId,
    }: {
      requestId: string;
      donationId: string;
    }) => {
      ensureAuth();
      return bloodApi.completeDonation(requestId, donationId);
    },
    onSuccess: (_data, { requestId }) => {
      queryClient.invalidateQueries({ queryKey: bloodKeys.requests() });
      queryClient.invalidateQueries({ queryKey: bloodKeys.requestDetail(requestId) });
      queryClient.invalidateQueries({ queryKey: bloodKeys.donors() });
    },
  });

  // Cancel donation pledge
  const cancelDonationMutation = useMutation({
    mutationFn: async (requestId: string) => {
      ensureAuth();
      return bloodApi.cancelDonation(requestId);
    },
    onSuccess: (_data, requestId) => {
      queryClient.invalidateQueries({ queryKey: bloodKeys.requests() });
      queryClient.invalidateQueries({ queryKey: bloodKeys.requestDetail(requestId) });
    },
  });

  // Update blood request status
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      requestId,
      input,
    }: {
      requestId: string;
      input: UpdateBloodRequestStatusInput;
    }) => {
      ensureAuth();
      return bloodApi.updateRequestStatus(requestId, input);
    },
    onSuccess: (_data, { requestId }) => {
      queryClient.invalidateQueries({ queryKey: bloodKeys.requests() });
      queryClient.invalidateQueries({ queryKey: bloodKeys.requestDetail(requestId) });
    },
  });

  // Toggle donor mode
  const toggleDonorModeMutation = useMutation({
    mutationFn: async (isDonor: boolean) => {
      ensureAuth();
      return bloodApi.toggleDonorMode({ isDonor });
    },
    onMutate: async (newIsDonor: boolean) => {
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          isDonor: newIsDonor,
        });
      }
      return { previousUser: currentUser };
    },
    onError: (_err, _newIsDonor, context) => {
      if (context?.previousUser) {
        useAuthStore.getState().setUser(context.previousUser);
      }
    },
    onSuccess: (res) => {
      const updatedUser = res?.data;
      const currentUser = useAuthStore.getState().user;
      if (currentUser && updatedUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          isDonor: updatedUser.isDonor,
          donationCount:
            updatedUser.donationCount ?? currentUser.donationCount ?? 0,
        });
      }
      queryClient.invalidateQueries({ queryKey: bloodKeys.donors() });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });

  return {
    createRequest: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    acceptRequest: acceptMutation.mutateAsync,
    isAccepting: acceptMutation.isPending,
    acceptError: acceptMutation.error,

    completeDonation: completeDonationMutation.mutateAsync,
    isCompleting: completeDonationMutation.isPending,

    cancelDonation: cancelDonationMutation.mutateAsync,
    isCancelling: cancelDonationMutation.isPending,

    updateStatus: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,

    toggleDonorMode: toggleDonorModeMutation.mutateAsync,
    isTogglingDonorMode: toggleDonorModeMutation.isPending,
  };
}
