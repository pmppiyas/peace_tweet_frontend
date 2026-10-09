import { BloodGroup } from '@/types/user.types';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
  country?: string;
  countryCode?: string;
  state?: string;
  city?: string;
  location?: string;
  bloodGroup?: BloodGroup;
}

export interface LoginInput {
  identifier: string;
  password: string;
}
