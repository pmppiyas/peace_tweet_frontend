'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { User, KeyRound, Shield, Palette, Globe, LogOut } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';
import { SettingsLayout } from '@/features/profile/components/SettingsLayout';
import { SettingsTab } from '@/features/profile/components/SettingsSidebar';
import { ProfileSettingsCard } from '@/features/profile/components/ProfileSettingsCard';
import { PrivacySettingsCard } from '@/features/profile/components/PrivacySettingsCard';
import { ThemeSettingsCard } from '@/features/profile/components/ThemeSettingsCard';
import { LanguageSettingsCard } from '@/features/profile/components/LanguageSettingsCard';
import { LogoutConfirmModal } from '@/components/common/LogoutConfirmModal';
import { cn } from '@/lib/utils/cn';

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { locale } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const tabParam = searchParams.get('tab') as SettingsTab | null;

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Sync active tab with URL query parameter
  useEffect(() => {
    if (
      tabParam &&
      ['profile', 'security', 'privacy', 'theme', 'language'].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    } else {
      setActiveTab('profile');
    }
  }, [tabParam]);

  const handleSelectTab = (tab: SettingsTab) => {
    setActiveTab(tab);
    router.replace(`/settings?tab=${tab}`, { scroll: false });
  };

  const tabs = [
    {
      id: 'profile' as const,
      label: locale === 'bn' ? 'প্রোফাইল' : 'Profile',
      icon: User,
    },
    {
      id: 'security' as const,
      label: locale === 'bn' ? 'সিকিউরিটি' : 'Security',
      icon: KeyRound,
    },
    {
      id: 'privacy' as const,
      label: locale === 'bn' ? 'প্রাইভেসি' : 'Privacy',
      icon: Shield,
    },
    {
      id: 'theme' as const,
      label: locale === 'bn' ? 'থিম' : 'Theme',
      icon: Palette,
    },
    {
      id: 'language' as const,
      label: locale === 'bn' ? 'ভাষা' : 'Language',
      icon: Globe,
    },
  ];

  return (
    <>
      <SettingsLayout activeTab={activeTab} onSelectTab={handleSelectTab}>
        <div className="space-y-4">
          {/* Tab Content Display */}
          <div className="pt-1">
            {activeTab === 'profile' && <ProfileSettingsCard section="profile" />}
            {activeTab === 'security' && (
              <ProfileSettingsCard section="security" />
            )}
            {activeTab === 'privacy' && <PrivacySettingsCard />}
            {activeTab === 'theme' && <ThemeSettingsCard />}
            {activeTab === 'language' && <LanguageSettingsCard />}
          </div>

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
