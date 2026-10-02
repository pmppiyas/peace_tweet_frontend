'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Droplet,
  Users,
  PlusCircle,
  FileText,
  HeartHandshake,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';
import { useBloodActions } from '../hooks/useBloodActions';
import { useDonorStatus } from '../hooks/useDonorStatus';
import { SectionSidebar, SidebarNavItem } from '@/components/navigation/SectionSidebar';

export interface BloodSidebarProps {
  activeId?: string;
  onSelectTab?: (tab: 'all' | 'donors' | 'my-requests' | 'my-donations') => void;
}

export function BloodSidebar({ activeId, onSelectTab }: BloodSidebarProps) {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const { toggleDonorMode, isTogglingDonorMode } = useBloodActions();
  useDonorStatus();

  const [toggleError, setToggleError] = useState<string | null>(null);

  const isDonorActive = Boolean(user?.isDonor);

  const handleToggleDonor = async () => {
    setToggleError(null);
    try {
      await toggleDonorMode(!isDonorActive);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        (locale === 'bn' ? 'টগল করতে ব্যর্থ হয়েছে।' : 'Failed to toggle donor mode.');
      setToggleError(msg);
    }
  };

  const navItems: SidebarNavItem[] = [
    {
      id: 'blood-all',
      label: locale === 'bn' ? 'রক্তের রিকোয়েস্ট' : 'Blood Requests',
      href: ROUTES.BLOOD.HOME,
      icon: Droplet,
      iconBg: 'bg-rose-500 text-white',
      exact: true,
      onClick: onSelectTab ? () => onSelectTab('all') : undefined,
    },
    {
      id: 'blood-donors',
      label: locale === 'bn' ? 'রক্তদাতা খুঁজুন' : 'Find Donors',
      href: '/blood?tab=donors',
      icon: Users,
      iconBg: 'bg-indigo-600 text-white',
      onClick: onSelectTab ? () => onSelectTab('donors') : undefined,
    },
    {
      id: 'blood-my-requests',
      label: locale === 'bn' ? 'আমার আবেদন' : 'My Requests',
      href: isAuthenticated ? '/blood?tab=my-requests' : ROUTES.LOGIN,
      icon: FileText,
      iconBg: 'bg-amber-500 text-white',
      onClick: onSelectTab ? () => onSelectTab('my-requests') : undefined,
    },
    {
      id: 'blood-my-donations',
      label: locale === 'bn' ? 'আমার রক্তদান' : 'My Donations',
      href: isAuthenticated ? '/blood?tab=my-donations' : ROUTES.LOGIN,
      icon: HeartHandshake,
      iconBg: 'bg-teal-600 text-white',
      onClick: onSelectTab ? () => onSelectTab('my-donations') : undefined,
    },
    {
      id: 'blood-create',
      label: locale === 'bn' ? 'রক্তের আবেদন করুন' : 'Request Blood',
      href: isAuthenticated ? ROUTES.BLOOD.CREATE : ROUTES.LOGIN,
      icon: PlusCircle,
      iconBg: 'bg-rose-600 text-white',
    },
  ];

  // Donor Mode Switch Card in Sidebar Footer
  const donorFooter = (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-3.5 dark:border-rose-900/50 dark:bg-rose-950/20">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-300">
            <HeartHandshake className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{locale === 'bn' ? 'রক্তদাতা মোড' : 'Donor Mode'}</span>
          </div>
          <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
            {isDonorActive
              ? locale === 'bn'
                ? 'আপনি রক্তদাতা হিসেবে তালিকায় আছেন'
                : 'You are listed as an active blood donor'
              : locale === 'bn'
                ? 'রক্ত দিয়ে মানুষের জীবন বাঁচান'
                : 'Help save lives by donating blood'}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-rose-200/60 pt-2.5 dark:border-rose-900/40">
        <span className="flex items-center gap-1 text-[11px] font-bold">
          {isDonorActive ? (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              {locale === 'bn' ? 'সক্রিয়' : 'Active'}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <ShieldAlert className="h-3 w-3" />
              {locale === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive'}
            </span>
          )}
        </span>

        {isAuthenticated ? (
          <button
            type="button"
            onClick={handleToggleDonor}
            disabled={isTogglingDonorMode}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden disabled:opacity-50 ${
              isDonorActive ? 'bg-rose-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                isDonorActive ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        ) : (
          <a
            href={ROUTES.LOGIN}
            className="text-[11px] font-bold text-rose-600 hover:underline dark:text-rose-400"
          >
            {locale === 'bn' ? 'লগইন করুন' : 'Login'}
          </a>
        )}
      </div>

      {toggleError && (
        <p className="mt-2 text-[10px] text-rose-600 dark:text-rose-400 font-semibold">
          {toggleError}
        </p>
      )}
    </div>
  );

  return (
    <SectionSidebar
      title={
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400">
            <Droplet className="h-4 w-4 fill-current" />
          </div>
          <span className="font-bold text-lg text-[#050505] dark:text-white">
            {locale === 'bn' ? 'রক্তদান' : 'Blood Donation'}
          </span>
        </div>
      }
      backHref={pathname === ROUTES.BLOOD.HOME ? '/' : ROUTES.BLOOD.HOME}
      items={navItems}
      showUserProfile={true}
      activeId={activeId}
      footer={donorFooter}
    />
  );
}
