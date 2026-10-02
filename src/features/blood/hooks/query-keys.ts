import { BloodRequestQueryParams, DonorQueryParams } from '../types/blood.types';

export const bloodKeys = {
  all: ['blood'] as const,
  requests: () => [...bloodKeys.all, 'requests'] as const,
  requestList: (filters?: BloodRequestQueryParams) =>
    [...bloodKeys.requests(), filters] as const,
  requestDetail: (id: string) => [...bloodKeys.requests(), 'detail', id] as const,
  myRequests: (userId?: string) =>
    [...bloodKeys.requests(), 'my', userId] as const,
  myDonations: (userId?: string) =>
    [...bloodKeys.requests(), 'donations', userId] as const,
  donors: () => [...bloodKeys.all, 'donors'] as const,
  donorList: (filters?: DonorQueryParams) =>
    [...bloodKeys.donors(), filters] as const,
  donorMode: () => [...bloodKeys.all, 'donor-mode'] as const,
};
