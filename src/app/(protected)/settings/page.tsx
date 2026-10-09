'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { LogOut, Lock, LogIn, UserCheck } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { usersApi } from '@/features/profile/api/users.api';
import { SettingsLayout } from '@/features/profile/components/SettingsLayout';
import { SettingsTab } from '@/features/profile/components/SettingsSidebar';
import { ProfileNavPills } from '@/features/profile/components/ProfileNavPills';
import { BasicInfoSettingsCard } from '@/features/profile/components/BasicInfoSettingsCard';
import { PhotosSettingsCard } from '@/features/profile/components/PhotosSettingsCard';
import { LocationSettingsCard } from '@/features/profile/components/LocationSettingsCard';
import { BloodSettingsCard } from '@/features/profile/components/BloodSettingsCard';
import { SecuritySettingsCard } from '@/features/profile/components/SecuritySettingsCard';
import { PrivacySettingsCard } from '@/features/profile/components/PrivacySettingsCard';
import { ThemeSettingsCard } from '@/features/profile/components/ThemeSettingsCard';
import { LanguageSettingsCard } from '@/features/profile/components/LanguageSettingsCard';
import { LogoutConfirmModal } from '@/components/common/LogoutConfirmModal';
import { Card } from '@/components/ui/Card';

const VALID_SETTINGS_TABS: SettingsTab[] = [
  'profile',
  'photos',
  'location',
  'blood',
  'security',
  'privacy',
  'theme',
  'language',
];

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { locale } = useLanguage();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { setUser } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const tabParam = searchParams.get('tab') as SettingsTab | null;

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Sync active tab with URL query parameter
  useEffect(() => {
    if (tabParam && VALID_SETTINGS_TABS.includes(tabParam)) {
      setActiveTab(tabParam);
    } else {
      setActiveTab('profile');
    }
  }, [tabParam]);

  // Sync latest user profile on mount
  useEffect(() => {
    if (isAuthenticated) {
      usersApi
        .getProfile()
        .then((res) => {
          if (res?.data) {
            setUser(res.data);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, setUser]);

  const handleSelectTab = (tab: SettingsTab) => {
    setActiveTab(tab);
    router.replace(`/settings?tab=${tab}`, { scroll: false });
  };

  const isProfileSection = ['profile', 'photos', 'location', 'blood'].includes(
    activeTab
  );

  return (
    <>
      <SettingsLayout activeTab={activeTab} onSelectTab={handleSelectTab}>
        <div className="space-y-4">
          {/* Loading Skeleton */}
          {isLoading && (
            <div className="space-y-4 animate-pulse">
              <div className="h-44 rounded-2xl bg-[#e4e6eb] dark:bg-[#3a3b3c]" />
              <div className="h-64 rounded-2xl bg-[#e4e6eb] dark:bg-[#3a3b3c]" />
            </div>
          )}

          {/* Unauthenticated Notice */}
          {!isLoading && !isAuthenticated && (
            <Card className="border border-gray-100 dark:border-gray-800 rounded-2xl p-8 text-center space-y-4 shadow-2xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
                <Lock className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#050505] dark:text-white">
                  {locale === 'bn'
                    ? 'সেটিংস পরিবর্তনের জন্য লগইন করুন'
                    : 'Sign in to access settings'}
                </h3>
                <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] mt-1 max-w-sm mx-auto">
                  {locale === 'bn'
                    ? 'আপনার প্রোফাইল, নিরাপত্তা ও অন্যান্য ব্যক্তিগত তথ্য পরিচালনা করতে অনুগ্রহ করে আপনার অ্যাকাউন্টে সাইন ইন করুন।'
                    : 'Please sign in to your PeaceTweet account to manage your profile, security, and personal preferences.'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                <Link
                  href={`/login?redirect=${encodeURIComponent('/settings?tab=' + activeTab)}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span>{locale === 'bn' ? 'লগইন করুন' : 'Log In'}</span>
                </Link>
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] font-bold text-xs transition-colors"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>
                    {locale === 'bn'
                      ? 'নতুন অ্যাকাউন্ট তৈরি'
                      : 'Create Account'}
                  </span>
                </Link>
              </div>
            </Card>
          )}

          {/* Active Tab Content Display (when authenticated or public tabs) */}
          {!isLoading && isAuthenticated && (
            <div className="pt-1">
              {activeTab === 'profile' && <BasicInfoSettingsCard />}
              {activeTab === 'photos' && <PhotosSettingsCard />}
              {activeTab === 'location' && <LocationSettingsCard />}
              {activeTab === 'blood' && <BloodSettingsCard />}
              {activeTab === 'security' && <SecuritySettingsCard />}
              {activeTab === 'privacy' && <PrivacySettingsCard />}
              {activeTab === 'theme' && <ThemeSettingsCard />}
              {activeTab === 'language' && <LanguageSettingsCard />}
            </div>
          )}

          {/* Theme & Language are always accessible even if not logged in */}
          {!isLoading &&
            !isAuthenticated &&
            (activeTab === 'theme' || activeTab === 'language') && (
              <div className="pt-1">
                {activeTab === 'theme' && <ThemeSettingsCard />}
                {activeTab === 'language' && <LanguageSettingsCard />}
              </div>
            )}

          {/* Account Session / Logout Section */}
          {isAuthenticated && (
            <div className="pt-4 border-t border-[#e4e6eb] dark:border-[#393a3b] flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#050505] dark:text-white">
                  {locale === 'bn' ? 'অ্যাকাউন্ট সেশন' : 'Account Session'}
                </h3>
                <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
                  {locale === 'bn'
                    ? 'আপনার অ্যাকাউন্ট থেকে নিরাপদভাবে লগআউট করুন'
                    : 'Sign out of your account on this device'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/70 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer shadow-xs shrink-0"
              >
                <LogOut className="h-4 w-4" />
                <span>{locale === 'bn' ? 'লগআউট করুন' : 'Log Out'}</span>
              </button>
            </div>
          )}
        </div>
      </SettingsLayout>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-[#65676b] dark:text-[#b0b3b8]">
          Loading settings...
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
