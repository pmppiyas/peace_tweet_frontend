import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api.types';
import {
  BloodRequestItem,
  CreateBloodRequestInput,
  UpdateBloodRequestStatusInput,
  ToggleDonorModeInput,
  BloodRequestQueryParams,
  DonorQueryParams,
  PaginatedBloodRequestsResponse,
  PaginatedDonorsResponse,
  BloodDonorUser,
} from '../types/blood.types';

export const bloodApi = {
  // Get list of blood requests with filters
  getRequests: async (
    params?: BloodRequestQueryParams,
  ): Promise<ApiResponse<PaginatedBloodRequestsResponse>> => {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedBloodRequestsResponse>
    >(API_ENDPOINTS.BLOOD.REQUESTS, { params });
    return data;
  },

  // Get details of a single blood request
  getRequestById: async (
    id: string,
  ): Promise<ApiResponse<BloodRequestItem>> => {
    const { data } = await apiClient.get<ApiResponse<BloodRequestItem>>(
      API_ENDPOINTS.BLOOD.REQUEST_DETAIL(id),
    );
    return data;
  },

  // Create a new blood request
  createRequest: async (
    input: CreateBloodRequestInput,
  ): Promise<ApiResponse<BloodRequestItem>> => {
    const { data } = await apiClient.post<ApiResponse<BloodRequestItem>>(
      API_ENDPOINTS.BLOOD.REQUESTS,
      input,
    );
    return data;
  },

  // Pledge/Accept to donate blood for a request
  acceptRequest: async (
    id: string,
  ): Promise<ApiResponse<{ donation: any; request: BloodRequestItem }>> => {
    const { data } = await apiClient.post<
      ApiResponse<{ donation: any; request: BloodRequestItem }>
    >(API_ENDPOINTS.BLOOD.ACCEPT(id));
    return data;
  },

  // Mark donation as completed
  completeDonation: async (
    requestId: string,
    donationId: string,
  ): Promise<ApiResponse<{ donation: any; request: BloodRequestItem }>> => {
    const { data } = await apiClient.patch<
      ApiResponse<{ donation: any; request: BloodRequestItem }>
    >(API_ENDPOINTS.BLOOD.COMPLETE_DONATION(requestId, donationId));
    return data;
  },

  // Cancel donation pledge
  cancelDonation: async (
    requestId: string,
  ): Promise<ApiResponse<{ message: string; request: BloodRequestItem }>> => {
    const { data } = await apiClient.delete<
      ApiResponse<{ message: string; request: BloodRequestItem }>
    >(API_ENDPOINTS.BLOOD.CANCEL_DONATION(requestId));
    return data;
  },

  // Update blood request status (e.g., COMPLETED, CANCELLED)
  updateRequestStatus: async (
    id: string,
    input: UpdateBloodRequestStatusInput,
  ): Promise<ApiResponse<BloodRequestItem>> => {
    const { data } = await apiClient.patch<ApiResponse<BloodRequestItem>>(
      API_ENDPOINTS.BLOOD.STATUS(id),
      input,
    );
    return data;
  },

  // Get current user's donor status
  getDonorMode: async (): Promise<ApiResponse<BloodDonorUser>> => {
    const { data } = await apiClient.get<ApiResponse<BloodDonorUser>>(
      API_ENDPOINTS.BLOOD.DONOR_MODE,
    );
    return data;
  },

  // Toggle user's donor mode
  toggleDonorMode: async (
    input?: ToggleDonorModeInput,
  ): Promise<ApiResponse<BloodDonorUser>> => {
    const { data } = await apiClient.patch<ApiResponse<BloodDonorUser>>(
      API_ENDPOINTS.BLOOD.DONOR_MODE,
      input,
    );
    return data;
  },

  // Get available registered donors
  getDonors: async (
    params?: DonorQueryParams,
  ): Promise<ApiResponse<PaginatedDonorsResponse>> => {
    const { data } = await apiClient.get<ApiResponse<PaginatedDonorsResponse>>(
      API_ENDPOINTS.BLOOD.DONORS,
      { params },
    );
    return data;
  },
};
