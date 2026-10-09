'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { useLanguage } from '@/providers/LanguageProvider';
import { usersApi } from '../api/users.api';
import {
  User,
  AtSign,
  Mail,
  FileText,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function BasicInfoSettingsCard() {
  const { user } = useAuth();
  const { setUser } = useAuthStore();
  const { locale } = useLanguage();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUsername(user.username || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setStatus({
        type: 'error',
        text:
          locale === 'bn' ? 'নাম খালি রাখা যাবে না।' : 'Name cannot be empty.',
      });
      return;
    }

    if (!username.trim() || username.trim().length < 3) {
      setStatus({
        type: 'error',
        text:
          locale === 'bn'
            ? 'ইউজারনেম অন্তত ৩ অক্ষরের হতে হবে।'
            : 'Username must be at least 3 characters.',
      });
      return;
    }

    if (!email.trim()) {
      setStatus({
        type: 'error',
        text:
          locale === 'bn'
            ? 'ইমেইল খালি রাখা যাবে না।'
            : 'Email cannot be empty.',
      });
      return;
    }

    setIsSaving(true);
    setStatus(null);

    try {
      const res = await usersApi.updateProfile({
        name: name.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        bio: bio.trim() || null,
      });

      setUser(res.data);
      setStatus({
        type: 'success',
        text:
          locale === 'bn'
            ? 'সাধারণ তথ্য সফলভাবে সংরক্ষিত হয়েছে!'
            : 'Basic info saved successfully!',
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (locale === 'bn'
          ? 'তথ্য আপডেট করতে ব্যর্থ হয়েছে।'
          : 'Failed to update info.');
      setStatus({ type: 'error', text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xs">
      <CardHeader className="pb-3 border-b border-[#e4e6eb] dark:border-[#393a3b]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
            <User className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold text-[#050505] dark:text-white">
              {locale === 'bn' ? 'সাধারণ প্রোফাইল তথ্য' : 'Basic Profile Info'}
            </CardTitle>
            <CardDescription className="text-xs">
              {locale === 'bn'
                ? 'আপনার পুরো নাম, ইউজারনেম, ইমেইল ও সংক্ষিপ্ত পরিচয় পরিবর্তন করুন'
                : 'Manage your name, username, email, and short biography'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-4 sm:pt-5 md:pt-5">
        {status && (
          <div
            className={cn(
              'mb-4 flex items-center gap-2 rounded-xl p-3 text-xs font-medium border',
              status.type === 'success'
                ? 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/60 dark:border-primary-800 dark:text-primary-300'
                : 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/60 dark:border-red-900 dark:text-red-300'
            )}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-primary-500 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            )}
            <span>{status.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label={locale === 'bn' ? 'পুরো নাম *' : 'Full Name *'}
              placeholder="e.g. Abdullah Hasan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="h-4 w-4" />}
              required
            />

            <Input
              label={locale === 'bn' ? 'ইউজারনেম *' : 'Username *'}
              placeholder="e.g. abdullah99"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              leftIcon={<AtSign className="h-4 w-4" />}
              required
            />
          </div>

          <Input
            label={locale === 'bn' ? 'ইমেইল অ্যাড্রেস *' : 'Email Address *'}
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="h-4 w-4" />}
            required
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {locale === 'bn'
                  ? 'বায়ো / সংক্ষিপ্ত পরিচয়'
                  : 'Bio (Short Intro)'}
              </label>
              <span className="text-[10px] text-gray-400">
                {bio.length}/250
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={250}
              placeholder={
                locale === 'bn'
                  ? 'নিজের সম্পর্কে কিছু লিখুন...'
                  : 'Write a short intro, quote or reflection about yourself...'
              }
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl border border-[#e4e6eb] bg-[#f0f2f5] p-3 text-xs placeholder:text-[#65676b] focus:border-primary-500 focus:outline-hidden dark:border-[#393a3b] dark:bg-[#3a3b3c] dark:text-[#e4e6eb] dark:placeholder:text-[#b0b3b8] resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              isLoading={isSaving}
              disabled={isSaving}
              className="rounded-xl px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-xs h-9.5"
            >
              {locale === 'bn' ? 'তথ্য সংরক্ষণ করুন' : 'Save Details'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
