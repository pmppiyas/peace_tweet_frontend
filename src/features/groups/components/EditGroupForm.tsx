'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useGroupActions } from '../hooks/useGroupActions';
import { GroupDetail, GroupVisibility } from '../types/groups.types';
import { GROUP_VISIBILITY_CONFIG } from '../utils/group-membership-status';
import { Globe, Lock, Save, Check } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { cn } from '@/lib/utils/cn';

export interface EditGroupFormProps {
  group: GroupDetail;
}

export function EditGroupForm({ group }: EditGroupFormProps) {
  const { locale } = useLanguage();
  const { updateGroup, isUpdatingGroup } = useGroupActions(group);

  const [name, setName] = useState(group.name);
  const [slug, setSlug] = useState(group.slug);
  const [description, setDescription] = useState(group.description || '');
  const [rules, setRules] = useState(group.rules || '');
  const [visibility, setVisibility] = useState<GroupVisibility>(
    group.visibility,
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name.trim()) {
      setError(
        locale === 'bn' ? 'গ্রুপের নাম আবশ্যক।' : 'Group name is required.',
      );
      return;
    }

    if (!slug.trim()) {
      setError(
        locale === 'bn' ? 'গ্রুপ স্লাগ আবশ্যক।' : 'Group slug is required.',
      );
      return;
    }

    try {
      await updateGroup(group.id, {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        description: description.trim() || undefined,
        rules: rules.trim() || undefined,
        visibility,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          (locale === 'bn'
            ? 'গ্রুপ আপডেট করা সম্ভব হয়নি।'
            : 'Failed to update group.'),
      );
    }
  };

  return (
    <Card className="rounded-2xl border border-[#e4e6eb] bg-white p-5 sm:p-6 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
      <h3 className="text-sm sm:text-base font-bold text-[#050505] dark:text-[#e4e6eb] mb-4">
        {locale === 'bn' ? 'গ্রুপ তথ্য পরিবর্তন' : 'Edit Group Details'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900">
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>
              {locale === 'bn'
                ? 'গ্রুপ তথ্য সফলভাবে আপডেট হয়েছে।'
                : 'Group updated successfully.'}
            </span>
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
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            className="rounded-xl text-xs sm:text-sm"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs font-bold text-[#050505] dark:text-[#e4e6eb] mb-1.5">
            {locale === 'bn' ? 'ইউনিক স্লাগ (@slug)' : 'Group Slug'} *
          </label>
          <Input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            maxLength={50}
            className="rounded-xl text-xs sm:text-sm"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-[#050505] dark:text-[#e4e6eb] mb-1.5">
            {locale === 'bn' ? 'বিবরণ (Description)' : 'Description'}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={500}
            className="w-full resize-none rounded-xl border border-[#e4e6eb] bg-white p-3 text-xs sm:text-sm text-[#050505] placeholder:text-[#65676b] focus:border-emerald-600 focus:outline-hidden dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb]"
          />
        </div>

        {/* Visibility */}
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
                    'flex flex-col items-start rounded-2xl border p-3.5 text-left transition-all',
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 dark:border-emerald-700 dark:bg-emerald-950/40 shadow-xs ring-1 ring-emerald-600'
                      : 'border-[#e4e6eb] bg-white hover:bg-[#f0f2f5] dark:border-[#393a3b] dark:bg-[#242526] dark:hover:bg-[#3a3b3c]',
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {v === 'PUBLIC' ? (
                      <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    )}
                    <span className="text-xs sm:text-sm font-bold text-[#050505] dark:text-[#e4e6eb]">
                      {locale === 'bn' ? config.labelBn : config.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
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
            {locale === 'bn' ? 'গ্রুপের নিয়মাবলী (Rules)' : 'Rules'}
          </label>
          <textarea
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            rows={3}
            maxLength={1000}
            className="w-full resize-none rounded-xl border border-[#e4e6eb] bg-white p-3 text-xs sm:text-sm text-[#050505] placeholder:text-[#65676b] focus:border-emerald-600 focus:outline-hidden dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb]"
          />
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            isLoading={isUpdatingGroup}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5"
          >
            <Save className="h-4 w-4 mr-1.5" />
            {locale === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
