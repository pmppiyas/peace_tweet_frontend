'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { User, KeyRound, Shield, Palette, Globe } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { SettingsLayout } from '@/features/profile/components/SettingsLayout';
import { SettingsTab } from '@/features/profile/components/SettingsSidebar';
import { ProfileSettingsCard } from '@/features/profile/components/ProfileSettingsCard';
import { PrivacySettingsCard } from '@/features/profile/components/PrivacySettingsCard';
import { ThemeSettingsCard } from '@/features/profile/components/ThemeSettingsCard';
import { LanguageSettingsCard } from '@/features/profile/components/LanguageSettingsCard';
import { cn } from '@/lib/utils/cn';

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { locale } = useLanguage();
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
      </div>
    </SettingsLayout>
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
