import {
  GroupMemberRole,
  GroupMembershipStatus,
  GroupVisibility,
} from '../types/groups.types';

export interface StatusConfig {
  label: string;
  labelBn: string;
  variant: 'emerald' | 'gold' | 'gray' | 'outline' | 'secondary';
}

export const GROUP_MEMBERSHIP_STATUS_CONFIG: Record<
  GroupMembershipStatus,
  StatusConfig
> = {
  OWNER: {
    label: 'Owner',
    labelBn: 'প্রতিষ্ঠাতা / ওনার',
    variant: 'gold',
  },
  ADMIN: {
    label: 'Admin',
    labelBn: 'অ্যাডমিন',
    variant: 'emerald',
  },
  MODERATOR: {
    label: 'Moderator',
    labelBn: 'মডারেটর',
    variant: 'secondary',
  },
  MEMBER: {
    label: 'Joined',
    labelBn: 'যুক্ত আছেন',
    variant: 'emerald',
  },
  PENDING: {
    label: 'Request Pending',
    labelBn: 'অনুরোধ অপেক্ষমাণ',
    variant: 'gold',
  },
  NONE: {
    label: 'Not Joined',
    labelBn: 'যুক্ত হননি',
    variant: 'gray',
  },
};

export const GROUP_MEMBER_ROLE_CONFIG: Record<GroupMemberRole, StatusConfig> = {
  OWNER: {
    label: 'Owner',
    labelBn: 'ওনার',
    variant: 'gold',
  },
  ADMIN: {
    label: 'Admin',
    labelBn: 'অ্যাডমিন',
    variant: 'emerald',
  },
  MODERATOR: {
    label: 'Moderator',
    labelBn: 'মডারেটর',
    variant: 'secondary',
  },
  MEMBER: {
    label: 'Member',
    labelBn: 'সদস্য',
    variant: 'gray',
  },
};

export const GROUP_VISIBILITY_CONFIG: Record<
  GroupVisibility,
  { label: string; labelBn: string; description: string; descriptionBn: string }
> = {
  PUBLIC: {
    label: 'Public',
    labelBn: 'পাবলিক গ্রুপ',
    description: 'Anyone can view group posts and join directly.',
    descriptionBn: 'যে কেউ এই গ্রুপের পোস্ট দেখতে ও সরাসরি যুক্ত হতে পারেন।',
  },
  PRIVATE: {
    label: 'Private',
    labelBn: 'প্রাইভেট গ্রুপ',
    description: 'Only members can view posts. Admin approval is required to join.',
    descriptionBn: 'শুধুমাত্র সদস্যরা পোস্ট দেখতে পারবেন। যুক্ত হতে অ্যাডমিনের অনুমোদনের প্রয়োজন।',
  },
};
