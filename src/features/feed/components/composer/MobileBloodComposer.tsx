'use client';

import React from 'react';
import { User as UserIcon, Building2, Phone, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { soundEffects } from '@/lib/sound/soundEffects';
import { BloodGroup } from '@/types/user.types';
import { BloodRequestUrgency } from '@/features/blood/types/blood.types';

export const BLOOD_GROUPS: { value: BloodGroup; label: string }[] = [
  { value: 'A_POSITIVE', label: 'A+' },
  { value: 'A_NEGATIVE', label: 'A-' },
  { value: 'B_POSITIVE', label: 'B+' },
  { value: 'B_NEGATIVE', label: 'B-' },
  { value: 'AB_POSITIVE', label: 'AB+' },
  { value: 'AB_NEGATIVE', label: 'AB-' },
  { value: 'O_POSITIVE', label: 'O+' },
  { value: 'O_NEGATIVE', label: 'O-' },
];

export const URGENCIES: {
  value: BloodRequestUrgency;
  label: string;
  badgeColor: string;
}[] = [
  {
    value: 'REGULAR',
    label: 'Regular',
    badgeColor:
      'border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
  },
  {
    value: 'URGENT',
    label: 'Urgent',
    badgeColor:
      'border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
  },
  {
    value: 'EMERGENCY',
    label: 'Emergency 🚨',
    badgeColor:
      'border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
  },
];

export interface MobileBloodComposerProps {
  bloodGroup: BloodGroup | '';
  onChangeBloodGroup: (group: BloodGroup) => void;
  urgency: BloodRequestUrgency;
  onChangeUrgency: (urgency: BloodRequestUrgency) => void;
  patientName: string;
  onChangePatientName: (name: string) => void;
  units: string;
  onChangeUnits: (units: string) => void;
  hospitalName: string;
  onChangeHospitalName: (name: string) => void;
  contactNumber: string;
  onChangeContactNumber: (phone: string) => void;
  neededDate: string;
  onChangeNeededDate: (date: string) => void;
  locale?: string;
}

export function MobileBloodComposer({
  bloodGroup,
  onChangeBloodGroup,
  urgency,
  onChangeUrgency,
  patientName,
  onChangePatientName,
  units,
  onChangeUnits,
  hospitalName,
  onChangeHospitalName,
  contactNumber,
  onChangeContactNumber,
  neededDate,
  onChangeNeededDate,
  locale = 'bn',
}: MobileBloodComposerProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Blood Group Selector Chips */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
            {locale === 'bn' ? 'রক্তের গ্রুপ নির্বাচন করুন *' : 'Blood Group *'}
          </label>
          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">
            Emergency
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {BLOOD_GROUPS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                onChangeBloodGroup(value);
                soundEffects.playTab();
              }}
              className={cn(
                'py-2.5 rounded-2xl text-xs font-black border transition-all text-center select-none active:scale-95 shadow-2xs cursor-pointer',
                bloodGroup === value
                  ? 'bg-rose-600 text-white border-rose-600 shadow-rose-500/25 ring-2 ring-rose-500/20'
                  : 'bg-[#f8f9fa] dark:bg-[#242526] border-[#e4e6eb] dark:border-[#393a3b] text-[#050505] dark:text-[#e4e6eb] hover:border-rose-300'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Urgency */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
          {locale === 'bn' ? 'জরুরিতার মাত্রা' : 'Urgency Level'}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {URGENCIES.map((u) => (
            <button
              key={u.value}
              type="button"
              onClick={() => {
                onChangeUrgency(u.value);
                soundEffects.playTab();
              }}
              className={cn(
                'py-2 rounded-xl text-xs font-bold border transition-all text-center select-none cursor-pointer',
                urgency === u.value
                  ? 'border-rose-600 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 shadow-xs'
                  : 'border-[#e4e6eb] dark:border-[#393a3b] text-[#65676b] dark:text-[#b0b3b8]'
              )}
            >
              {u.label}
            </button>
          ))}
        </div>
      </div>

      {/* Patient & Units */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
            {locale === 'bn' ? 'রোগীর নাম *' : 'Patient Name *'}
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              value={patientName}
              onChange={(e) => onChangePatientName(e.target.value)}
              placeholder="Patient Name"
              className="w-full rounded-xl border border-[#e4e6eb] bg-[#f8f9fa] dark:bg-[#242526] pl-9 pr-3 py-2 text-xs text-[#050505] dark:text-[#e4e6eb] focus:border-rose-500 focus:outline-hidden dark:border-[#393a3b]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
            {locale === 'bn' ? 'কত ব্যাগ রক্ত লাগবে' : 'Units (Bags)'}
          </label>
          <input
            type="number"
            min={1}
            max={20}
            value={units}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^0-9]/g, '');
              onChangeUnits(cleaned);
            }}
            onBlur={() => {
              if (!units || parseInt(units, 10) < 1) {
                onChangeUnits('1');
              }
            }}
            className="w-full rounded-xl border border-[#e4e6eb] bg-[#f8f9fa] dark:bg-[#242526] px-3 py-2 text-xs text-[#050505] dark:text-[#e4e6eb] focus:border-rose-500 focus:outline-hidden dark:border-[#393a3b]"
          />
        </div>
      </div>

      {/* Hospital & Phone */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
            {locale === 'bn' ? 'হাসপাতালের নাম *' : 'Hospital Name *'}
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => onChangeHospitalName(e.target.value)}
              placeholder="Hospital / Clinic"
              className="w-full rounded-xl border border-[#e4e6eb] bg-[#f8f9fa] dark:bg-[#242526] pl-9 pr-3 py-2 text-xs text-[#050505] dark:text-[#e4e6eb] focus:border-rose-500 focus:outline-hidden dark:border-[#393a3b]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
            {locale === 'bn' ? 'যোগাযোগের নম্বর *' : 'Contact Phone *'}
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="tel"
              value={contactNumber}
              onChange={(e) => onChangeContactNumber(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full rounded-xl border border-[#e4e6eb] bg-[#f8f9fa] dark:bg-[#242526] pl-9 pr-3 py-2 text-xs text-[#050505] dark:text-[#e4e6eb] focus:border-rose-500 focus:outline-hidden dark:border-[#393a3b]"
            />
          </div>
        </div>
      </div>

      {/* Date Needed */}
      <div className="space-y-1">
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
          {locale === 'bn' ? 'কবে রক্ত প্রয়োজন (তারিখ)' : 'Date Needed'}
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="date"
            value={neededDate}
            onChange={(e) => onChangeNeededDate(e.target.value)}
            className="w-full rounded-xl border border-[#e4e6eb] bg-[#f8f9fa] dark:bg-[#242526] pl-9 pr-3 py-2 text-xs text-[#050505] dark:text-[#e4e6eb] focus:border-rose-500 focus:outline-hidden dark:border-[#393a3b]"
          />
        </div>
      </div>
    </div>
  );
}
