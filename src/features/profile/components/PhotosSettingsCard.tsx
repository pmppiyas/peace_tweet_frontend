'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { useLanguage } from '@/providers/LanguageProvider';
import { uploadsApi } from '@/features/uploads/api/uploads.api';
import { usersApi } from '../api/users.api';
import { CoverPhotoEditorModal } from './CoverPhotoEditorModal';
import {
  Camera,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Info,
  Move,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function PhotosSettingsCard() {
  const { user } = useAuth();
  const { setUser } = useAuthStore();
  const { locale } = useLanguage();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user?.avatarUrl || null
  );
  const [coverUrl, setCoverUrl] = useState<string | null>(
    user?.coverUrl || null
  );

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Cover photo reposition / crop modal state
  const [isCoverEditorOpen, setIsCoverEditorOpen] = useState(false);
  const [coverEditorImageSrc, setCoverEditorImageSrc] = useState<string | null>(
    null
  );

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setAvatarUrl(user.avatarUrl || null);
      setCoverUrl(user.coverUrl || null);
    }
  }, [user]);

  // Handle avatar upload directly
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setStatus({
        type: 'error',
        text:
          locale === 'bn'
            ? 'ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।'
            : 'Profile image must be under 5MB.',
      });
      return;
    }

    setIsUploadingAvatar(true);
    setStatus(null);

    try {
      const uploadRes = await uploadsApi.uploadAvatar(file);
      const newUrl = uploadRes.data.url;
      setAvatarUrl(newUrl);

      const updateRes = await usersApi.updateProfile({ avatarUrl: newUrl });
      setUser(updateRes.data);
      setStatus({
        type: 'success',
        text:
          locale === 'bn'
            ? 'প্রোফাইল ছবি সফলভাবে আপডেট করা হয়েছে!'
            : 'Profile picture updated successfully!',
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (locale === 'bn'
          ? 'ছবি আপলোড করতে সমস্যা হয়েছে।'
          : 'Failed to upload photo.');
      setStatus({ type: 'error', text: msg });
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  // When a new cover photo file is selected, open the resize/reposition editor modal
  const handleCoverFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setStatus({
        type: 'error',
        text:
          locale === 'bn'
            ? 'কভার ছবির সাইজ সর্বোচ্চ ১০ মেগাবাইট হতে পারবে।'
            : 'Cover image must be under 10MB.',
      });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setCoverEditorImageSrc(objectUrl);
    setIsCoverEditorOpen(true);

    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  // Open editor with existing cover photo to reposition or zoom
  const handleRepositionExistingCover = () => {
    if (!coverUrl) return;
    setCoverEditorImageSrc(coverUrl);
    setIsCoverEditorOpen(true);
  };

  // Save the cropped, zoomed, and repositioned cover photo
  const handleSaveCoverPhoto = async (croppedFile: File) => {
    setIsUploadingCover(true);
    setStatus(null);

    try {
      const uploadRes = await uploadsApi.uploadImage(croppedFile);
      const newUrl = uploadRes.data.url;
      setCoverUrl(newUrl);

      const updateRes = await usersApi.updateProfile({ coverUrl: newUrl });
      setUser(updateRes.data);
      setIsCoverEditorOpen(false);
      setCoverEditorImageSrc(null);
      setStatus({
        type: 'success',
        text:
          locale === 'bn'
            ? 'কভার ফটো সফলভাবে রিসাইজ ও সংরক্ষণ করা হয়েছে!'
            : 'Cover photo resized & updated successfully!',
      });
    } catch (err: any) {
      console.error('Failed to update cover photo', err);
      setStatus({
        type: 'error',
        text:
          locale === 'bn'
            ? 'কভার ছবি সেভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।'
            : 'Failed to update cover photo. Please try again.',
      });
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleCloseCoverEditor = () => {
    if (!isUploadingCover) {
      setIsCoverEditorOpen(false);
      setCoverEditorImageSrc(null);
    }
  };

  return (
    <Card className="border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xs">
      <CardHeader className="pb-3 border-b border-[#e4e6eb] dark:border-[#393a3b]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
            <ImageIcon className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold text-[#050505] dark:text-white">
              {locale === 'bn'
                ? 'প্রোফাইল ছবি ও কভার ফটো'
                : 'Profile Picture & Cover Photo'}
            </CardTitle>
            <CardDescription className="text-xs">
              {locale === 'bn'
                ? 'আপনার প্রোফাইল ফটো এবং কভার ব্যানার ছবি আপলোড, রিসাইজ ও পজিশন করুন'
                : 'Upload, resize, and reposition your personal avatar and cover banner'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-4 sm:pt-5 md:pt-5 space-y-6">
        {/* 1. Cover Photo Section with Reposition / Resize Controls */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#050505] dark:text-white flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4 text-purple-500" />
              <span>
                {locale === 'bn'
                  ? 'কভার ব্যানার (Cover Banner)'
                  : 'Cover Banner'}
              </span>
            </label>
            <span className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
              {locale === 'bn'
                ? 'অনুপাত: ৩:১ (সর্বোচ্চ ১০MB)'
                : 'Aspect: 3:1 (max 10MB)'}
            </span>
          </div>

          <div className="relative group h-40 sm:h-52 w-full rounded-2xl overflow-hidden border border-[#e4e6eb] dark:border-[#393a3b] bg-gradient-to-r from-emerald-800 to-teal-700 shadow-xs">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt="Cover Banner"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60 space-y-1">
                <ImageIcon className="h-10 w-10 stroke-1" />
                <span className="text-xs font-medium">
                  {locale === 'bn'
                    ? 'কোনো কভার ছবি যুক্ত করা হয়নি'
                    : 'No cover banner set'}
                </span>
              </div>
            )}

            {isUploadingCover && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white z-10 space-y-2">
                <Loader2 className="h-7 w-7 animate-spin text-white" />
                <span className="text-xs font-bold">
                  {locale === 'bn'
                    ? 'কভার ছবি সেভ হচ্ছে...'
                    : 'Saving cover photo...'}
                </span>
              </div>
            )}

            {/* Action Buttons overlay */}
            <div className="absolute right-3 bottom-3 flex items-center gap-2 z-10">
              {coverUrl && (
                <button
                  type="button"
                  onClick={handleRepositionExistingCover}
                  disabled={isUploadingCover}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-md text-white text-xs font-bold transition-all cursor-pointer shadow-md border border-white/20"
                  title={
                    locale === 'bn'
                      ? 'কভার ছবি রিসাইজ ও পজিশন করুন'
                      : 'Reposition & Resize Cover'
                  }
                >
                  <Move className="h-3.5 w-3.5" />
                  <span>
                    {locale === 'bn' ? 'রিসাইজ ও পজিশন' : 'Reposition / Resize'}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={isUploadingCover}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                <Camera className="h-3.5 w-3.5" />
                <span>
                  {coverUrl
                    ? locale === 'bn'
                      ? 'নতুন ছবি আপলোড'
                      : 'Change Cover'
                    : locale === 'bn'
                      ? 'কভার ছবি যুক্ত করুন'
                      : 'Add Cover'}
                </span>
              </button>
            </div>
          </div>

          <input
            ref={coverInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleCoverFileSelected}
            className="hidden"
          />

          <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
            💡{' '}
            {locale === 'bn'
              ? 'কভার ছবি সুন্দরভাবে সেট করতে "রিসাইজ ও পজিশন" বোতামে ক্লিক করে জুম বা ড্র্যাগ করে আপনার মুখ বা ব্যাকগ্রাউন্ড ঠিকমতো বসিয়ে নিন।'
              : 'Click "Reposition / Resize" to drag and zoom your cover photo for perfect framing.'}
          </p>
        </div>

        {/* 2. Profile Photo (Avatar) Section */}
        <div className="pt-4 border-t border-[#f0f2f5] dark:border-[#3a3b3c] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-primary-500/40 bg-primary-500 text-white shadow-md">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={user?.name || 'User'}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}

                {isUploadingAvatar && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary-500 text-white shadow-xs hover:bg-primary-600 transition-all cursor-pointer ring-2 ring-white dark:ring-[#242526]"
                title="Change Photo"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div>
              <p className="text-xs font-bold text-[#050505] dark:text-white">
                {locale === 'bn' ? 'প্রোফাইল ছবি (Avatar)' : 'Profile Avatar'}
              </p>
              <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
                {locale === 'bn'
                  ? 'PNG, JPG বা WEBP (সর্বোচ্চ ৫MB)'
                  : 'PNG, JPG or WEBP up to 5MB'}
              </p>
              <div className="mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => avatarInputRef.current?.click()}
                  isLoading={isUploadingAvatar}
                  disabled={isUploadingAvatar}
                  className="rounded-xl h-8 text-xs font-semibold"
                >
                  <Camera className="h-3.5 w-3.5 mr-1.5" />
                  <span>
                    {locale === 'bn' ? 'নতুন ছবি আপলোড' : 'Upload New'}
                  </span>
                </Button>
              </div>
            </div>

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          <div className="rounded-xl p-3 bg-[#f0f2f5] dark:bg-[#3a3b3c]/50 text-[11px] text-[#65676b] dark:text-[#b0b3b8] max-w-xs space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#050505] dark:text-white">
              <Info className="h-3.5 w-3.5 text-primary-500 shrink-0" />
              <span>{locale === 'bn' ? 'টিপস' : 'Tips'}</span>
            </div>
            <p>
              {locale === 'bn'
                ? 'একটি পরিষ্কার ও সুন্দর ছবি ব্যবহার করুন যাতে আপনার বন্ধুরা সহজেই আপনাকে খুঁজে পান।'
                : 'Use a clear photo where your face is easily recognized by friends.'}
            </p>
          </div>
        </div>
      </CardContent>

      {/* Cover Photo Reposition & Crop Editor Modal */}
      <CoverPhotoEditorModal
        isOpen={isCoverEditorOpen}
        onClose={handleCloseCoverEditor}
        imageSrc={coverEditorImageSrc}
        onSave={handleSaveCoverPhoto}
        isSaving={isUploadingCover}
      />
    </Card>
  );
}
