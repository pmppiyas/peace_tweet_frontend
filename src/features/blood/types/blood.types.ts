export type BloodGroup =
  | 'A_POSITIVE'
  | 'A_NEGATIVE'
  | 'B_POSITIVE'
  | 'B_NEGATIVE'
  | 'AB_POSITIVE'
  | 'AB_NEGATIVE'
  | 'O_POSITIVE'
  | 'O_NEGATIVE';

export type BloodRequestUrgency = 'REGULAR' | 'URGENT' | 'EMERGENCY';

export type BloodRequestStatus =
  | 'PENDING'
  | 'PARTIALLY_ACCEPTED'
  | 'FULLY_ACCEPTED'
  | 'COMPLETED'
  | 'CANCELLED';

export type BloodDonationStatus = 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';

export interface BloodRequesterUser {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
  email?: string;
}

export interface BloodDonorUser {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
  bloodGroup?: BloodGroup | null;
  country?: string | null;
  countryCode?: string | null;
  state?: string | null;
  city?: string | null;
  location?: string | null;
  bio?: string | null;
  isDonor?: boolean;
  donationCount: number;
  badge?: string | null;
  userStatus?: string | null;
}

export interface BloodDonationItem {
  id: string;
  bloodRequestId: string;
  donorId: string;
  donor: BloodDonorUser;
  status: BloodDonationStatus;
  donatedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BloodRequestItem {
  id: string;
  requesterId: string;
  requester: BloodRequesterUser;
  forMyself: boolean;
  patientName: string;
  patientAge?: number | null;
  problem?: string | null;
  bloodGroup: BloodGroup;
  units: number;
  unitsFulfilled: number;
  hospitalName: string;
  hospitalAddress?: string | null;
  country?: string | null;
  countryCode?: string | null;
  state?: string | null;
  city?: string | null;
  location: string;
  contactNumber: string;
  alternateContact?: string | null;
  neededDate: string;
  urgency: BloodRequestUrgency;
  status: BloodRequestStatus;
  note?: string | null;
  donations: BloodDonationItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBloodRequestInput {
  forMyself?: boolean;
  patientName: string;
  patientAge?: number;
  problem?: string;
  bloodGroup: BloodGroup;
  units?: number;
  hospitalName: string;
  hospitalAddress?: string;
  country?: string;
  countryCode?: string;
  state?: string;
  city?: string;
  location: string;
  contactNumber: string;
  alternateContact?: string;
  neededDate: string;
  urgency?: BloodRequestUrgency;
  note?: string;
}

export interface UpdateBloodRequestStatusInput {
  status: BloodRequestStatus;
}

export interface ToggleDonorModeInput {
  isDonor: boolean;
}

export interface BloodRequestQueryParams {
  bloodGroup?: BloodGroup;
  status?: BloodRequestStatus;
  urgency?: BloodRequestUrgency;
  countryCode?: string;
  state?: string;
  city?: string;
  location?: string;
  search?: string;
  requesterId?: string;
  donorId?: string;
  page?: number;
  limit?: number;
}

export interface DonorQueryParams {
  bloodGroup?: BloodGroup;
  countryCode?: string;
  state?: string;
  city?: string;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedBloodRequestsResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  items: BloodRequestItem[];
}

export interface PaginatedDonorsResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  items: BloodDonorUser[];
}
