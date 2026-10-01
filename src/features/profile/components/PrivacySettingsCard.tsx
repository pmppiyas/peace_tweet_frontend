'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Shield, Eye, Mail, Droplet, Bookmark, Search, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { cn } from '@/lib/utils/cn';

interface PrivacySettings {
  publicProfile: boolean;
  hideEmail: boolean;
  bloodDonorNetwork: boolean;
  privateBookmarks: boolean;
  searchDiscoverable: boolean;
}

const STORAGE_KEY = 'peacetweet_privacy_settings';

const DEFAULT_SETTINGS: PrivacySettings = {
  publicProfile: true,
  hideEmail: true,
  bloodDonorNetwork: true,
  privateBookmarks: true,
  searchDiscoverable: true,
};

export function PrivacySettingsCard() {
  const { locale } = useLanguage();
  const [settings, setSettings] = useState<PrivacySettings>(DEFAULT_SETTINGS);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch {
      // Ignore local storage read errors
    }
  }, []);

  const handleToggle = (key: keyof PrivacySettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3500);
    } catch {
      // Ignore storage errors
    }
  };

  const privacyItems = [
    {
      key: 'publicProfile' as const,
      icon: Eye,
      title: locale === 'bn' ? 'পাবলিক প্রোফাইল দৃশ্যমানতা' : 'Public Profile Visibility',
      description:
        locale === 'bn'
          ? 'অন্যান্য সদস্যদের আপনার প্রোফাইল ও পোস্ট দেখার অনুমতি দিন।'
          : 'Allow other community members to view your public profile and shared duas.',
    },
    {
      key: 'hideEmail' as const,
      icon: Mail,
      title: locale === 'bn' ? 'ইমেইল ঠিকানা গোপন রাখুন' : 'Hide Email Address',
      description:
        locale === 'bn'
          ? 'আপনার ইমেইল ঠিকানা অন্যদের কাছ থেকে সম্পূর্ণ গোপন ও সুরক্ষিত রাখুন।'
          : 'Keep your email address private and invisible from other users on your profile.',
    },
    {
      key: 'bloodDonorNetwork' as const,
      icon: Droplet,
      title: locale === 'bn' ? 'রক্তদাতা নেটওয়ার্ক সম্মতি' : 'Blood Donor Network',
      description:
        locale === 'bn'
          ? 'জরুরি প্রয়োজনে সদস্যদের সুবিধার্থে রক্তদাতা অনুসন্ধানে রক্তের গ্রুপ প্রদর্শন করুন।'
          : 'Allow emergency patient searches to discover your blood group to help save lives.',
    },
    {
      key: 'privateBookmarks' as const,
      icon: Bookmark,
      title: locale === 'bn' ? 'ব্যক্তিগত বুকমার্ক' : 'Private Bookmarks',
      description:
        locale === 'bn'
          ? 'সংরক্ষিত দোয়া ও বুকমার্কগুলো সবসময় আপনার ব্যক্তিগত রাখুন।'
          : 'Keep your saved duas and collection strictly confidential and private to you.',
    },
    {
      key: 'searchDiscoverable' as const,
      icon: Search,
      title: locale === 'bn' ? 'অনুসন্ধানযোগ্যতা' : 'Search Discoverability',
      description:
        locale === 'bn'
          ? 'ইউজাররা যখন অনুসন্ধান করবেন তখন আপনার প্রোফাইল খোঁজার অনুমতি দিন।'
          : 'Allow your profile to appear when members search for people on PeaceTweet.',
    },
  ];

  return (
    <Card className="border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xs">
      <CardHeader className="pb-3 border-b border-[#e4e6eb] dark:border-[#393a3b]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold text-[#050505] dark:text-white">
              {locale === 'bn' ? 'প্রাইভেসি ও দৃশ্যমানতা সেটিংস' : 'Privacy & Visibility Preferences'}
            </CardTitle>
            <CardDescription className="text-xs">
              {locale === 'bn'
                ? 'আপনার প্রোফাইল, তথ্য ও কর্মকাণ্ড কারা দেখতে পারবে তা নিয়ন্ত্রণ করুন'
                : 'Control who can view your profile information, donor status, and activity'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4">
        {isSaved && (
          <div className="flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 p-3 text-xs font-semibold text-teal-800 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-200 animate-in fade-in duration-200">
            <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
            <span>
              {locale === 'bn'
                ? 'প্রাইভেসি সেটিংস সফলভাবে সংরক্ষিত হয়েছে!'
                : 'Privacy preferences saved successfully!'}
            </span>
          </div>
        )}

        <div className="divide-y divide-[#e4e6eb] dark:divide-[#393a3b]">
          {privacyItems.map((item) => {
            const Icon = item.icon;
            const isChecked = settings[item.key];

            return (
              <div
                key={item.key}
                className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f0f2f5] text-[#65676b] dark:bg-[#3a3b3c] dark:text-[#b0b3b8]">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#050505] dark:text-white">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Custom Accessible Toggle Switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={isChecked}
                  onClick={() => handleToggle(item.key)}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
                    isChecked
                      ? 'bg-primary-500'
                      : 'bg-gray-300 dark:bg-[#4e4f50]'
                  )}
                >
                  <span
                    className={cn(
                      'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transform ring-0 transition duration-200 ease-in-out',
                      isChecked ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-[#e4e6eb] dark:border-[#393a3b]">
          <Button
            type="button"
            onClick={handleSave}
            className="w-full rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs"
          >
            {locale === 'bn' ? 'প্রাইভেসি পরিবর্তন সংরক্ষণ করুন' : 'Save Privacy Preferences'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
