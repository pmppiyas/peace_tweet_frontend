'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useGroupActions } from '../hooks/useGroupActions';
import { GroupVisibility } from '../types/groups.types';
import { GROUP_VISIBILITY_CONFIG } from '../utils/group-membership-status';
import { Globe, Lock, Users, Sparkles } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { cn } from '@/lib/utils/cn';

export function CreateGroupForm() {
  const { locale } = useLanguage();
  const { createGroup, isCreatingGroup } = useGroupActions();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');
  const [visibility, setVisibility] = useState<GroupVisibility>('PUBLIC');
  const [error, setError] = useState<string | null>(null);

  // Auto-slugify helper
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!slug || slug === slugify(name)) {
      setSlug(slugify(val));
    }
  };

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError(
        locale === 'bn'
          ? 'গ্রুপের নাম আবশ্যক।'
          : 'Group name is required.',
      );
      return;
    }

    if (!slug.trim()) {
      setError(
        locale === 'bn'
          ? 'গ্রুপের ইউনিক স্লাগ (@slug) আবশ্যক।'
          : 'Group slug is required.',
      );
      return;
    }

    try {
      await createGroup({
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        description: description.trim() || undefined,
        rules: rules.trim() || undefined,
        visibility,
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          (locale === 'bn'
            ? 'গ্রুপ তৈরি করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।'
            : 'Failed to create group. Please try again.'),
      );
    }
  };

  return (
    <Card className="rounded-3xl border border-[#e4e6eb] bg-white p-5 sm:p-7 shadow-sm dark:border-[#393a3b] dark:bg-[#242526]">
      <div className="flex items-center gap-3 border-b border-[#e4e6eb] pb-4 mb-5 dark:border-[#393a3b]">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-teal-700 text-white font-bold shadow-2xs">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-[#e4e6eb]">
            {locale === 'bn' ? 'নতুন ইসলামিক গ্রুপ তৈরি করুন' : 'Create a New Community Group'}
          </h2>
          <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
            {locale === 'bn'
              ? 'দ্বীনি জ্ঞান ও দোয়া চর্চার জন্য একটি কমিউনিটি গড়ুন।'
              : 'Build a dedicated space for Islamic knowledge and remembrance.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900">
            {error}
          </div>
        )}

        {/* Group Name */}
        <div>
          <label className="block text-xs font-bold text-[#050505] dark:text-[#e4e6eb] mb-1.5">
            {locale === 'bn' ? 'গ্রুপের নাম' : 'Group Name'} *
          </label>
          <Input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder={
              locale === 'bn'
                ? 'উদা: কুরআনের আলো ও দোয়া চর্চা'
                : 'e.g. Daily Quran Reflections'
            }
            required
            maxLength={100}
            className="rounded-xl text-xs sm:text-sm"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs font-bold text-[#050505] dark:text-[#e4e6eb] mb-1.5">
            {locale === 'bn' ? 'ইউনিক স্লাগ (Group Slug / URL)' : 'Group Slug / URL'} *
          </label>
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-3 text-xs font-bold text-gray-400">
              peacetweet.com/groups/
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder="daily-quran"
              required
              maxLength={50}
              className="h-10 w-full rounded-xl border border-[#e4e6eb] bg-white pl-44 pr-3 text-xs sm:text-sm text-[#050505] font-semibold focus:border-primary-500 focus:outline-hidden dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb]"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-[#050505] dark:text-[#e4e6eb] mb-1.5">
            {locale === 'bn' ? 'বিবরণ (Description)' : 'Description'}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={
              locale === 'bn'
                ? 'এই গ্রুপের লক্ষ্য ও উদ্দেশ্য সম্পর্কে সংক্ষিপ্ত বিবরণ লিখুন...'
                : 'A short description about this group purpose...'
            }
            rows={3}
            maxLength={500}
            className="w-full resize-none rounded-xl border border-[#e4e6eb] bg-white p-3 text-xs sm:text-sm text-[#050505] placeholder:text-[#65676b] focus:border-primary-500 focus:outline-hidden dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb]"
          />
        </div>

        {/* Visibility Selector (Public / Private) */}
        <div>
          <label className="block text-xs font-bold text-[#050505] dark:text-[#e4e6eb] mb-2">
            {locale === 'bn' ? 'গ্রুপের ধরন (Visibility)' : 'Visibility'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(['PUBLIC', 'PRIVATE'] as GroupVisibility[]).map((v) => {
              const isSelected = visibility === v;
              const config = GROUP_VISIBILITY_CONFIG[v];
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVisibility(v)}
                  className={cn(
                    'flex flex-col items-start rounded-2xl border p-4 text-left transition-all',
                    isSelected
                      ? 'border-primary-500 bg-primary-50/60 dark:border-primary-600 dark:bg-primary-900/40 shadow-xs ring-1 ring-primary-500'
                      : 'border-[#e4e6eb] bg-white hover:bg-[#f0f2f5] dark:border-[#393a3b] dark:bg-[#242526] dark:hover:bg-[#3a3b3c]',
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {v === 'PUBLIC' ? (
                      <Globe className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                    ) : (
                      <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    )}
                    <span className="text-xs sm:text-sm font-bold text-[#050505] dark:text-[#e4e6eb]">
                      {locale === 'bn' ? config.labelBn : config.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] leading-tight">
                    {locale === 'bn' ? config.descriptionBn : config.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rules */}
        <div>
          <label className="block text-xs font-bold text-[#050505] dark:text-[#e4e6eb] mb-1.5">
            {locale === 'bn' ? 'গ্রুপের নিয়মাবলী (Rules - Optional)' : 'Group Rules (Optional)'}
          </label>
          <textarea
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            placeholder={
              locale === 'bn'
                ? 'সদস্যদের অনুসরণের জন্য গ্রুপ নির্দেশিকা লিখুন...'
                : 'Rules and guidelines for members...'
            }
            rows={3}
            maxLength={1000}
            className="w-full resize-none rounded-xl border border-[#e4e6eb] bg-white p-3 text-xs sm:text-sm text-[#050505] placeholder:text-[#65676b] focus:border-primary-500 focus:outline-hidden dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb]"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-3">
          <Button
            type="submit"
            isLoading={isCreatingGroup}
            className="w-full sm:w-auto rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold px-6"
          >
            <Users className="h-4 w-4 mr-2" />
            {locale === 'bn' ? 'গ্রুপ তৈরি করুন' : 'Create Group'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
