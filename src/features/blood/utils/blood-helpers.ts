import {
  BloodGroup,
  BloodRequestStatus,
  BloodRequestUrgency,
  BloodDonationStatus,
} from '../types/blood.types';

export const BLOOD_GROUPS: { value: BloodGroup; label: string }[] = [
  { value: 'A_POSITIVE', label: 'A+' },
  { value: 'A_NEGATIVE', label: 'A-' },
  { value: 'B_POSITIVE', label: 'B+' },
  { value: 'B_NEGATIVE', label: 'B-' },
  { value: 'O_POSITIVE', label: 'O+' },
  { value: 'O_NEGATIVE', label: 'O-' },
  { value: 'AB_POSITIVE', label: 'AB+' },
  { value: 'AB_NEGATIVE', label: 'AB-' },
];

export const BLOOD_GROUP_MAP: Record<BloodGroup, string> = {
  A_POSITIVE: 'A+',
  A_NEGATIVE: 'A-',
  B_POSITIVE: 'B+',
  B_NEGATIVE: 'B-',
  O_POSITIVE: 'O+',
  O_NEGATIVE: 'O-',
  AB_POSITIVE: 'AB+',
  AB_NEGATIVE: 'AB-',
};

export function formatBloodGroup(group: BloodGroup | string | null | undefined): string {
  if (!group) return 'Unknown';
  return BLOOD_GROUP_MAP[group as BloodGroup] || group;
}

export function getUrgencyInfo(urgency: BloodRequestUrgency, locale: string = 'bn') {
  switch (urgency) {
    case 'EMERGENCY':
      return {
        label: locale === 'bn' ? 'জরুরি (Emergency)' : 'Emergency',
        badgeClass:
          'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-400 border border-rose-300 dark:border-rose-800 animate-pulse',
        dotClass: 'bg-rose-500',
      };
    case 'URGENT':
      return {
        label: locale === 'bn' ? 'অতীব জরুরি' : 'Urgent',
        badgeClass:
          'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-400 border border-amber-300 dark:border-amber-800',
        dotClass: 'bg-amber-500',
      };
    case 'REGULAR':
    default:
      return {
        label: locale === 'bn' ? 'সাধারণ' : 'Regular',
        badgeClass:
          'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-400 border border-blue-200 dark:border-blue-900',
        dotClass: 'bg-blue-500',
      };
  }
}

export function getStatusInfo(status: BloodRequestStatus, locale: string = 'bn') {
  switch (status) {
    case 'PENDING':
      return {
        label: locale === 'bn' ? 'অপেক্ষমান' : 'Pending',
        badgeClass:
          'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
      };
    case 'PARTIALLY_ACCEPTED':
      return {
        label: locale === 'bn' ? 'আংশিক গৃহীত' : 'Partially Accepted',
        badgeClass:
          'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-300',
      };
    case 'FULLY_ACCEPTED':
      return {
        label: locale === 'bn' ? 'ডোনার পাওয়া গেছে' : 'Fully Accepted',
        badgeClass:
          'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
      };
    case 'COMPLETED':
      return {
        label: locale === 'bn' ? 'সম্পন্ন হয়েছে' : 'Completed',
        badgeClass:
          'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300',
      };
    case 'CANCELLED':
      return {
        label: locale === 'bn' ? 'বাতিল' : 'Cancelled',
        badgeClass:
          'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      };
    default:
      return {
        label: status,
        badgeClass: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      };
  }
}

export function getDonationStatusInfo(status: BloodDonationStatus, locale: string = 'bn') {
  switch (status) {
    case 'ACCEPTED':
      return {
        label: locale === 'bn' ? 'স্বীকৃত (ডোনার প্রস্তুত)' : 'Accepted (Ready)',
        badgeClass:
          'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300',
      };
    case 'COMPLETED':
      return {
        label: locale === 'bn' ? 'রক্তদান সম্পন্ন' : 'Donated',
        badgeClass:
          'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
      };
    case 'CANCELLED':
      return {
        label: locale === 'bn' ? 'বাতিল' : 'Cancelled',
        badgeClass:
          'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      };
    default:
      return {
        label: status,
        badgeClass: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      };
  }
}

export function getCountryFlag(countryCode?: string | null): string {
  if (!countryCode) return '';
  const upper = countryCode.toUpperCase();
  // Safe emoji flag from ISO code
  if (upper.length === 2) {
    const codePoints = upper.split('').map((c) => 127397 + c.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }
  return '';
}

export function formatLocationWithFlag(location?: string | null, countryCode?: string | null): string {
  if (!location) return '';
  const flag = getCountryFlag(countryCode);
  return flag ? `${flag} ${location}` : location;
}
