import { BloodGroup } from '@/types/user.types';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
  location?: string;
  bloodGroup?: BloodGroup;
}

export interface LoginInput {
  identifier: string;
  password: string;
}
