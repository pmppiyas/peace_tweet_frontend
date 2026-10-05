'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { useLanguage } from '@/providers/LanguageProvider';
import { useFriends } from '@/features/friends/hooks/useFriends';
import { useMyGroups } from '@/features/groups/hooks/useMyGroups';
import { useBookmarks } from '@/features/bookmark/hooks/useBookmarks';
import { usersApi } from '../api/users.api';
import { uploadsApi } from '@/features/uploads/api/uploads.api';
import { PostComposer } from '@/features/feed/components/PostComposer';
import { Button } from '@/components/ui/Button';
import {
  Mail,
  Calendar,
  MapPin,
  Droplet,
  Settings,
  CheckCircle2,
  Sparkles,
  Shield,
  Award,
  Edit3,
  Camera,
  Users,
  Users2,
  Bookmark,
  Plus,
  Loader2,
  X,
  Check,
  MoreVertical,
  Eye,
  Link2,
  Move,
  MessageCircle,
} from 'lucide-react';
import { useChatStore } from '@/stores/useChatStore';
import { formatDate } from '@/lib/utils/date';
import { ROUTES } from '@/constants/routes';
import { BloodGroup, User } from '@/types/user.types';
import { UserProfileResponse } from '@/features/friends/types/friends.types';
import { FriendActionButton } from '@/features/friends/components/FriendActionButton';
import { FriendshipStatusBadge } from '@/features/friends/components/FriendshipStatus';
import { cn } from '@/lib/utils/cn';
import { ProfileFriendsTab } from './ProfileFriendsTab';
import { ProfileGroupsTab } from './ProfileGroupsTab';
import { ProfileSavedTab } from './ProfileSavedTab';
import { CoverPhotoEditorModal } from './CoverPhotoEditorModal';

const formatBloodGroup = (bg?: BloodGroup | null) => {
  if (!bg) return null;
  const map: Record<BloodGroup, string> = {
    A_POSITIVE: 'A+',
    A_NEGATIVE: 'A-',
    B_POSITIVE: 'B+',
    B_NEGATIVE: 'B-',
    AB_POSITIVE: 'AB+',
    AB_NEGATIVE: 'AB-',
    O_POSITIVE: 'O+',
    O_NEGATIVE: 'O-',
  };
  return map[bg] || bg;
};

export interface ProfileViewProps {
  activeSubTab?: 'overview' | 'friend' | 'group' | 'saved';
  isViewAs?: boolean;
  targetUser?: UserProfileResponse | User | null;
  baseUrl?: string;
}

export function ProfileView({
  activeSubTab = 'overview',
  isViewAs: isViewAsProp,
  targetUser,
  baseUrl,
}: ProfileViewProps) {
  const searchParams = useSearchParams();
  const { user: authUser, isAuthenticated } = useAuth();
  const { setUser } = useAuthStore();
  const { locale } = useLanguage();
  const openChat = useChatStore((state) => state.openChat);

  const displayUser = targetUser || authUser;
  const isOwner = Boolean(
    !targetUser ||
      (authUser &&
        targetUser &&
        (authUser.id === targetUser.id ||
          authUser.username?.toLowerCase() === targetUser.username?.toLowerCase()))
  );
  const isViewAs =
    !isOwner || (isViewAsProp ?? searchParams?.get('view_as') === 'true');
  const effectiveBaseUrl =
    baseUrl ||
    (isOwner
      ? '/profile'
      : displayUser?.username
        ? `/${displayUser.username}`
        : '/profile');

  const exitViewAsUrl = isOwner
    ? activeSubTab === 'overview'
      ? ROUTES.PROFILE
      : `${ROUTES.PROFILE}?tab=${activeSubTab}`
    : activeSubTab === 'overview'
      ? `${effectiveBaseUrl}?from=tab`
      : `${effectiveBaseUrl}?tab=${activeSubTab}&from=tab`;

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(displayUser?.bio || '');
  const [isSavingBio, setIsSavingBio] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [copiedProfileLink, setCopiedProfileLink] = useState(false);
  const [showCoverMenu, setShowCoverMenu] = useState(false);
  const [isCoverEditorOpen, setIsCoverEditorOpen] = useState(false);
  const [coverEditorImageSrc, setCoverEditorImageSrc] = useState<string | null>(null);

  const buildTabUrl = (tab?: string) => {
    const params = new URLSearchParams();
    if (tab) params.set('tab', tab);
    params.set('from', 'tab');
    if (isOwner && isViewAs) params.set('view_as', 'true');
    return `${effectiveBaseUrl}?${params.toString()}`;
  };

  const viewAsUrl = isViewAs
    ? exitViewAsUrl
    : activeSubTab === 'overview'
      ? `${effectiveBaseUrl}?view_as=true`
      : `${effectiveBaseUrl}?tab=${activeSubTab}&from=tab&view_as=true`;

  const { data: friendsData } = useFriends(undefined, isAuthenticated && isOwner);
  const { data: myGroupsData } = useMyGroups({ limit: 4 });
  const { data: bookmarkData } = useBookmarks({ limit: 1 });

  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const friendItems =
    friendsData?.pages.flatMap((page) => page?.items || []) || [];
  const totalFriends = friendItems.length;
  const myGroups =
    myGroupsData?.pages.flatMap((page) => page?.items || []) || [];
  const totalBookmarks = bookmarkData?.meta?.total ?? 0;

  if (!displayUser) {
    return (
      <div className="p-8 text-center text-sm text-[#65676b] dark:text-[#b0b3b8]">
        User profile not found.
      </div>
    );
  }

  const bloodGroupLabel = formatBloodGroup(displayUser.bloodGroup);
  const friendshipData = (displayUser as UserProfileResponse)?.friendship;
  const relationshipStatus = friendshipData?.status || 'NONE';
  const requestId = friendshipData?.requestId;

  // Handle cover photo file selection -> open reposition/zoom editor modal
  const handleCoverFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert(
        locale === 'bn'
          ? 'ছবির সাইজ ১০MB এর কম হতে হবে।'
          : 'Cover image must be under 10MB.'
      );
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setCoverEditorImageSrc(objectUrl);
    setIsCoverEditorOpen(true);
    setShowCoverMenu(false);

    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  // Open editor with existing cover photo to reposition/zoom
  const handleRepositionExistingCover = () => {
    if (!displayUser?.coverUrl) return;
    setCoverEditorImageSrc(displayUser.coverUrl);
    setIsCoverEditorOpen(true);
    setShowCoverMenu(false);
  };

  // Save the cropped, zoomed, and repositioned cover photo
  const handleSaveCoverPhoto = async (croppedFile: File) => {
    setIsUploadingCover(true);
    try {
      const uploadRes = await uploadsApi.uploadImage(croppedFile);
      const newCoverUrl = uploadRes.data.url;
      const res = await usersApi.updateProfile({ coverUrl: newCoverUrl });
      setUser(res.data);
      setIsCoverEditorOpen(false);
      setCoverEditorImageSrc(null);
    } catch (err) {
      console.error('Failed to update cover photo', err);
      alert(
        locale === 'bn'
          ? 'কভার ছবি সেভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।'
          : 'Failed to update cover photo. Please try again.'
      );
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

  // Handle direct avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert(
        locale === 'bn'
          ? 'ছবির সাইজ ৫MB এর কম হতে হবে।'
          : 'Avatar image must be under 5MB.'
      );
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const uploadRes = await uploadsApi.uploadAvatar(file);
      const newAvatarUrl = uploadRes.data.url;
      const res = await usersApi.updateProfile({ avatarUrl: newAvatarUrl });
      setUser(res.data);
    } catch (err) {
      console.error('Failed to update avatar', err);
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  // Handle inline bio save
  const handleSaveBio = async () => {
    setIsSavingBio(true);
    try {
      const res = await usersApi.updateProfile({
        bio: bioInput.trim() || null,
      });
      setUser(res.data);
      setIsEditingBio(false);
    } catch (err) {
      console.error('Failed to update bio', err);
    } finally {
      setIsSavingBio(false);
    }
  };

  const handleCancelBio = () => {
    setBioInput(authUser?.bio || '');
    setIsEditingBio(false);
  };

  const handleCopyProfileLink = async () => {
    if (typeof window !== 'undefined' && displayUser?.username) {
      const url = `${window.location.origin}/${displayUser.username}`;
      try {
        await navigator.clipboard.writeText(url);
        setCopiedProfileLink(true);
        setTimeout(() => setCopiedProfileLink(false), 2000);
      } catch {
        // fallback
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* View As Indicator Banner (Only shown when owner is previewing own profile as public) */}
      {isOwner && isViewAs && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-primary-500/10 via-primary-500/15 to-teal-500/10 border border-primary-500/30 text-primary-950 dark:text-primary-100 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-600 text-white shrink-0 shadow-xs">
              <Eye className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-[#050505] dark:text-white truncate">
                {locale === 'bn'
                  ? 'পাবলিক ভিউ মোড (View as)'
                  : 'Viewing profile as public'}
              </p>
              <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] truncate">
                {locale === 'bn'
                  ? 'অন্যান্য ব্যবহারকারীরা আপনার প্রোফাইল যেভাবে দেখতে পান'
                  : 'This is how your profile appears to other users'}
              </p>
            </div>
          </div>

          <Link
            href={exitViewAsUrl}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            <span>{locale === 'bn' ? 'ভিউ এজ বন্ধ' : 'Exit View as'}</span>
          </Link>
        </div>
      )}

      {/* 1. Profile Hero Card */}
      <div className="relative z-20 rounded-2xl border border-[#e4e6eb] bg-white shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
        {/* Cover Photo Banner */}
        <div className="relative h-44 sm:h-56 md:h-64 rounded-t-2xl bg-gradient-to-r from-emerald-800 via-teal-700 to-primary-800 overflow-hidden">
          {displayUser.coverUrl ? (
            <Image
              src={displayUser.coverUrl}
              alt="Cover Photo"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/15 via-transparent to-black/20" />
          )}

          {/* Edit Cover Button with reposition and upload (Only for owner in normal mode) */}
          {isOwner && !isViewAs && (
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10">
              <button
                type="button"
                onClick={() => {
                  if (displayUser.coverUrl) {
                    setShowCoverMenu(!showCoverMenu);
                  } else {
                    coverInputRef.current?.click();
                  }
                }}
                disabled={isUploadingCover}
                className="inline-flex items-center gap-1.5 rounded-xl bg-black/50 hover:bg-black/70 text-white backdrop-blur-xs px-3 py-1.5 text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                title={
                  locale === 'bn' ? 'কভার ছবি পরিবর্তন' : 'Edit Cover Photo'
                }
              >
                {isUploadingCover ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Camera className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">
                  {isUploadingCover
                    ? locale === 'bn'
                      ? 'আপলোড হচ্ছে...'
                      : 'Uploading...'
                    : locale === 'bn'
                      ? 'কভার পরিবর্তন'
                      : 'Edit Cover'}
                </span>
              </button>

              {/* Cover Options Dropdown when coverUrl already exists */}
              {showCoverMenu && displayUser.coverUrl && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowCoverMenu(false)}
                  />
                  <div className="absolute bottom-full right-0 mb-2 z-30 min-w-[190px] rounded-2xl border border-[#e4e6eb] bg-white p-1.5 shadow-2xl dark:border-[#393a3b] dark:bg-[#242526] animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-1 text-left">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCoverMenu(false);
                        coverInputRef.current?.click();
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-[#050505] dark:text-[#e4e6eb] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] transition-colors w-full text-left cursor-pointer"
                    >
                      <Camera className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      <span>{locale === 'bn' ? 'নতুন ছবি আপলোড' : 'Upload Photo'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRepositionExistingCover}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-[#050505] dark:text-[#e4e6eb] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] transition-colors w-full text-left cursor-pointer"
                    >
                      <Move className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      <span>{locale === 'bn' ? 'পজিশন পরিবর্তন' : 'Reposition'}</span>
                    </button>
                  </div>
                </>
              )}

              <input
                type="file"
                ref={coverInputRef}
                onChange={handleCoverFileSelected}
                accept="image/*"
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Profile Info Header Bar (Center-wise Layout) */}
        <div className="px-4 sm:px-8 pb-4 text-center">
          {/* Avatar: Centered horizontally, exactly 50% overlaps the cover banner */}
          <div className="-mt-14 sm:-mt-[72px] md:-mt-20 relative z-10 inline-block mx-auto">
            <div className="relative h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40 rounded-full border-4 border-white dark:border-[#242526] bg-primary-600 text-white shadow-xl overflow-hidden">
              {displayUser.avatarUrl ? (
                <Image
                  src={displayUser.avatarUrl}
                  alt={displayUser.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl sm:text-4xl font-black">
                  {displayUser.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {/* Update Avatar Button with direct upload (Only for owner in normal mode) */}
            {isOwner && !isViewAs && (
              <>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-white shadow-md border-2 border-white dark:border-[#242526] transition-colors cursor-pointer"
                  title={
                    locale === 'bn' ? 'প্রোফাইল ছবি পরিবর্তন' : 'Update Avatar'
                  }
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                  ) : (
                    <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  )}
                </button>
                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
              </>
            )}
          </div>

          {/* Name & Verification Badge */}
          <div className="pt-2 sm:pt-3 space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#050505] dark:text-white tracking-tight">
                {displayUser.name}
              </h1>
              {displayUser.userStatus === 'VERIFIED' && (
                <span title="Verified Account">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 fill-blue-500 text-white" />
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm font-semibold text-primary-600 dark:text-primary-400">
              @{displayUser.username}
            </p>
          </div>

          {/* Badges & Meta (Verification, Tier, Blood Group, Friendship Status, Friends) */}
          <div className="mt-2.5 flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap">
            {/* Verification Status Badge */}
            {displayUser.userStatus === 'VERIFIED' ? (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-600 border border-blue-200 dark:bg-blue-950/60 dark:border-blue-800 dark:text-blue-300 shadow-2xs cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/60 hover:border-blue-300 transition-all select-none"
                title="Verified Account"
              >
                <CheckCircle2 className="h-3.5 w-3.5 fill-blue-500 text-white shrink-0" />
                <span>{locale === 'bn' ? 'ভেরিফাইড' : 'Verified'}</span>
              </span>
            ) : displayUser.userStatus === 'PREMIUM' ? (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2.5 py-0.5 text-xs font-bold shadow-xs cursor-pointer hover:brightness-110 hover:shadow-sm transition-all select-none"
                title="Premium Member"
              >
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                <span>{locale === 'bn' ? 'প্রিমিয়াম' : 'Premium'}</span>
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-[#f0f2f5] px-2.5 py-0.5 text-xs font-semibold text-[#65676b] border border-[#e4e6eb] dark:bg-[#3a3b3c] dark:border-[#4e4f50] dark:text-[#b0b3b8] cursor-pointer hover:bg-[#e4e6eb] dark:hover:bg-[#4e4f50] transition-all select-none"
                title="Non-verified Account"
              >
                <Shield className="h-3.5 w-3.5 shrink-0" />
                <span>{locale === 'bn' ? 'নন-ভেরিফাইড' : 'Non-verified'}</span>
              </span>
            )}

            {/* Member Tier Pill */}
            <span
              className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300 shadow-2xs cursor-pointer hover:bg-emerald-100 hover:border-emerald-300 dark:hover:bg-emerald-900/60 dark:hover:border-emerald-700 transition-all select-none"
              title={locale === 'bn' ? 'মেম্বারশিপ ব্যাজ' : 'Membership Tier'}
            >
              <Award className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{displayUser.badge || 'Standard Member'}</span>
            </span>

            {/* Blood Group Pill */}
            {bloodGroupLabel ? (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-600 border border-rose-200 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-300 shadow-2xs cursor-pointer hover:bg-rose-100 hover:border-rose-300 dark:hover:bg-rose-900/60 dark:hover:border-rose-800 transition-all select-none"
                title={locale === 'bn' ? 'রক্তের গ্রুপ' : 'Blood Group'}
              >
                <Droplet className="h-3.5 w-3.5 fill-rose-500 text-rose-500 shrink-0" />
                <span>Blood: {bloodGroupLabel}</span>
              </span>
            ) : isOwner && !isViewAs ? (
              <Link
                href={ROUTES.SETTINGS}
                className="inline-flex items-center gap-1 rounded-full bg-rose-50/70 hover:bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-600 border border-dashed border-rose-300 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300 transition-colors shadow-2xs cursor-pointer select-none"
                title={
                  locale === 'bn'
                    ? 'সেটিংসে রক্তের গ্রুপ যুক্ত করুন'
                    : 'Add blood group in settings'
                }
              >
                <Droplet className="h-3.5 w-3.5 fill-rose-500 text-rose-500 shrink-0" />
                <span>
                  {locale === 'bn' ? '+ রক্তের গ্রুপ দিন' : '+ Add Blood Group'}
                </span>
              </Link>
            ) : null}

            {/* Friendship Status Badge on Another User's Profile */}
            {!isOwner && relationshipStatus !== 'NONE' && relationshipStatus !== 'SELF' && (
              <FriendshipStatusBadge
                status={relationshipStatus}
                className="cursor-pointer select-none hover:brightness-95 dark:hover:brightness-110 transition-all"
              />
            )}

            {isOwner && totalFriends > 0 && (
              <Link
                href={buildTabUrl('friend')}
                className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 shadow-2xs hover:bg-indigo-100 hover:border-indigo-300 dark:hover:bg-indigo-900/60 dark:hover:border-indigo-700 transition-all cursor-pointer select-none"
              >
                <Users className="h-3.5 w-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                <span>
                  {totalFriends}{' '}
                  {locale === 'bn'
                    ? 'বন্ধু'
                    : totalFriends === 1
                      ? 'friend'
                      : 'friends'}
                </span>
              </Link>
            )}
          </div>

          {/* Bio Section (Centered) */}
          <div className="mt-3 max-w-lg mx-auto">
            {isEditingBio && isOwner && !isViewAs ? (
              <div className="space-y-2.5 p-3 rounded-2xl bg-[#f0f2f5]/70 dark:bg-[#3a3b3c]/50 border border-[#e4e6eb] dark:border-[#393a3b] shadow-2xs animate-in fade-in zoom-in-95 duration-150">
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  maxLength={160}
                  placeholder={
                    locale === 'bn'
                      ? 'নিজের সম্পর্কে কিছু লিখুন...'
                      : 'Describe yourself in a few words...'
                  }
                  rows={2}
                  className="w-full rounded-xl border border-primary-300 dark:border-primary-700 bg-white dark:bg-[#242526] p-3 text-xs sm:text-sm text-[#050505] dark:text-[#e4e6eb] placeholder:text-[#65676b] dark:placeholder:text-[#b0b3b8] focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-hidden text-center resize-none shadow-xs transition-all"
                  autoFocus
                />
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-mono text-[#65676b] dark:text-[#b0b3b8]">
                    {bioInput.length}/160
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelBio}
                      disabled={isSavingBio}
                      className="rounded-xl h-8 px-3 text-xs font-bold border-[#e4e6eb] dark:border-[#393a3b]"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>{locale === 'bn' ? 'বাতিল' : 'Cancel'}</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveBio}
                      disabled={isSavingBio}
                      className="rounded-xl h-8 px-3.5 text-xs font-bold gap-1 shadow-xs"
                    >
                      {isSavingBio ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      <span>{locale === 'bn' ? 'সংরক্ষণ' : 'Save'}</span>
                    </Button>
                  </div>
                </div>
              </div>
            ) : displayUser.bio ? (
              <div className="group relative flex flex-col items-center justify-center px-4 py-1.5 rounded-2xl hover:bg-[#f0f2f5]/70 dark:hover:bg-[#3a3b3c]/50 transition-colors">
                <p className="text-xs sm:text-sm text-[#050505] dark:text-[#e4e6eb] font-normal leading-relaxed text-center break-words whitespace-pre-line max-w-md">
                  {displayUser.bio}
                </p>
                {isOwner && !isViewAs && (
                  <button
                    type="button"
                    onClick={() => {
                      setBioInput(displayUser.bio || '');
                      setIsEditingBio(true);
                    }}
                    className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 border border-primary-200/60 dark:border-primary-800/60 hover:bg-primary-100 dark:hover:bg-primary-900/60 opacity-80 group-hover:opacity-100 transition-all cursor-pointer shadow-2xs"
                    title={locale === 'bn' ? 'বায়ো এডিট করুন' : 'Edit bio'}
                  >
                    <Edit3 className="h-3 w-3" />
                    <span>{locale === 'bn' ? 'বায়ো সম্পাদনা' : 'Edit Bio'}</span>
                  </button>
                )}
              </div>
            ) : isOwner && !isViewAs ? (
              <button
                type="button"
                onClick={() => {
                  setBioInput('');
                  setIsEditingBio(true);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-dashed border-primary-300 dark:border-primary-700 bg-primary-50/60 hover:bg-primary-100/70 dark:bg-primary-950/30 dark:hover:bg-primary-900/40 px-4 py-1.5 text-xs font-bold text-primary-700 dark:text-primary-300 transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer group"
              >
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-white text-[10px] group-hover:scale-110 transition-transform">
                  <Plus className="h-3 w-3" />
                </div>
                <span>{locale === 'bn' ? 'বায়ো যুক্ত করুন' : 'Add Bio'}</span>
              </button>
            ) : null}
          </div>

          {/* Action Buttons (Centered) */}
          {isOwner && !isViewAs ? (
            <div className="mt-3.5 flex items-center justify-center gap-2.5">
              <Link href={ROUTES.SETTINGS}>
                <Button
                  size="sm"
                  className="rounded-xl px-4 py-2 gap-1.5 text-xs font-bold shadow-xs"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>
                    {locale === 'bn' ? 'প্রোফাইল সম্পাদনা' : 'Edit Profile'}
                  </span>
                </Button>
              </Link>

              <Link href={ROUTES.SETTINGS}>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl px-4 py-2 gap-1.5 text-xs font-bold border-[#e4e6eb] dark:border-[#393a3b]"
                  title="Settings"
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>{locale === 'bn' ? 'সেটিংস' : 'Settings'}</span>
                </Button>
              </Link>
            </div>
          ) : isOwner && isViewAs ? (
            <div className="mt-3.5 flex items-center justify-center gap-2.5">
              <Link href={exitViewAsUrl}>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl px-4 py-2 gap-1.5 text-xs font-bold border-primary-300 text-primary-700 dark:border-primary-800 dark:text-primary-300 bg-primary-50/50 dark:bg-primary-950/30 hover:bg-primary-100 dark:hover:bg-primary-900/40"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>
                    {locale === 'bn' ? 'ভিউ এজ বন্ধ করুন' : 'Exit View As'}
                  </span>
                </Button>
              </Link>
            </div>
          ) : (
            /* Another User Profile: Relationship FriendActionButton & Message */
            <div className="mt-3.5 flex items-center justify-center gap-2.5">
              {relationshipStatus !== 'SELF' && (
                <>
                  <FriendActionButton
                    userId={displayUser.id}
                    username={displayUser.username}
                    status={relationshipStatus}
                    requestId={requestId}
                    size="md"
                  />
                  {isAuthenticated && (
                    <Button
                      size="md"
                      onClick={() =>
                        openChat({
                          id: displayUser.id,
                          name: displayUser.name,
                          username: displayUser.username,
                          avatarUrl: displayUser.avatarUrl,
                          badge: displayUser.badge,
                          userStatus: displayUser.userStatus,
                        })
                      }
                      className="rounded-xl px-4 py-2 gap-1.5 text-xs font-bold bg-[#e4e6eb] hover:bg-[#d8dadf] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb] shadow-xs cursor-pointer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{locale === 'bn' ? 'মেসেজ' : 'Message'}</span>
                    </Button>
                  )}
                </>
              )}
            </div>
          )}

          {/* Sub-Navigation Tabs & 3-Dot More Menu */}
          <div className="relative flex items-center justify-between gap-2 pt-3 mt-4 border-t border-[#e4e6eb] dark:border-[#393a3b]">
            {/* Left balance spacer on larger screens so centered tabs stay perfectly centered */}
            <div className="hidden sm:block w-9 shrink-0" />

            {/* Sub-Navigation Tabs (Centered) */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none text-xs sm:text-sm font-bold flex-1 sm:flex-initial">
              <Link
                href={buildTabUrl()}
                className={cn(
                  'py-2 px-3 sm:px-4 rounded-xl transition-colors whitespace-nowrap',
                  activeSubTab === 'overview'
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50'
                    : 'text-[#65676b] dark:text-[#b0b3b8] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]'
                )}
              >
                {locale === 'bn' ? 'পোস্ট ও পরিচিতি' : 'Overview'}
              </Link>

              <Link
                href={buildTabUrl('friend')}
                className={cn(
                  'py-2 px-3 sm:px-4 rounded-xl transition-colors whitespace-nowrap',
                  activeSubTab === 'friend'
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50'
                    : 'text-[#65676b] dark:text-[#b0b3b8] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]'
                )}
              >
                <span>{locale === 'bn' ? 'বন্ধুরা' : 'Friends'}</span>
                {isOwner && totalFriends > 0 && (
                  <span className="ml-1.5 text-xs font-semibold opacity-80">
                    {totalFriends}
                  </span>
                )}
              </Link>

              <Link
                href={buildTabUrl('group')}
                className={cn(
                  'py-2 px-3 sm:px-4 rounded-xl transition-colors whitespace-nowrap',
                  activeSubTab === 'group'
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50'
                    : 'text-[#65676b] dark:text-[#b0b3b8] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]'
                )}
              >
                <span>
                  {isOwner
                    ? locale === 'bn'
                      ? 'গ্রুপসমূহ'
                      : 'My Groups'
                    : locale === 'bn'
                      ? 'গ্রুপসমূহ'
                      : 'Groups'}
                </span>
                {isOwner && myGroups.length > 0 && (
                  <span className="ml-1.5 text-xs font-semibold opacity-80">
                    {myGroups.length}
                  </span>
                )}
              </Link>

              {/* Saved Tab - ONLY FOR OWNER */}
              {isOwner && (
                <Link
                  href={buildTabUrl('saved')}
                  className={cn(
                    'py-2 px-3 sm:px-4 rounded-xl transition-colors whitespace-nowrap',
                    activeSubTab === 'saved'
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50'
                      : 'text-[#65676b] dark:text-[#b0b3b8] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]'
                  )}
                >
                  <span>{locale === 'bn' ? 'সংরক্ষিত' : 'Saved'}</span>
                  {totalBookmarks > 0 && (
                    <span className="ml-1.5 text-xs font-semibold opacity-80">
                      {totalBookmarks}
                    </span>
                  )}
                </Link>
              )}
            </div>

            {/* 3-Dot More Menu at the Far Right */}
            <div className="relative z-30 shrink-0">
              <button
                type="button"
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-xl transition-colors cursor-pointer',
                  showMoreMenu || (isOwner && isViewAs)
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400'
                    : 'bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-[#e4e6eb]'
                )}
                title={locale === 'bn' ? 'আরও বিকল্প' : 'More options'}
                aria-label="More options"
              >
                <MoreVertical className="h-5 w-5" />
              </button>

              {/* Dropdown Menu */}
              {showMoreMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMoreMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 min-w-[190px] sm:min-w-[210px] rounded-2xl border border-[#e4e6eb] bg-white p-1.5 shadow-2xl dark:border-[#393a3b] dark:bg-[#242526] z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-1 text-left">
                    {/* View As Option (Only for owner) */}
                    {isOwner && (
                      <Link
                        href={viewAsUrl}
                        onClick={() => setShowMoreMenu(false)}
                        className={cn(
                          'py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap flex items-center gap-2.5 w-full',
                          isViewAs
                            ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50'
                            : 'text-[#65676b] dark:text-[#b0b3b8] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]'
                        )}
                      >
                        <Eye className="h-4 w-4 shrink-0" />
                        <span>
                          {isViewAs
                            ? locale === 'bn'
                              ? 'ভিউ এজ বন্ধ করুন'
                              : 'Exit View as'
                            : locale === 'bn'
                              ? 'ভিউ এজ (View as)'
                              : 'View as'}
                        </span>
                      </Link>
                    )}

                    {/* Copy Profile Link Option */}
                    <button
                      type="button"
                      onClick={() => {
                        handleCopyProfileLink();
                        setTimeout(() => setShowMoreMenu(false), 1500);
                      }}
                      className="py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap flex items-center gap-2.5 w-full text-[#65676b] dark:text-[#b0b3b8] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] cursor-pointer"
                    >
                      {copiedProfileLink ? (
                        <>
                          <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            {locale === 'bn'
                              ? 'লিংক কপি হয়েছে!'
                              : 'Link Copied!'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Link2 className="h-4 w-4 shrink-0" />
                          <span>
                            {locale === 'bn'
                              ? 'প্রোফাইল লিংক কপি'
                              : 'Copy Profile Link'}
                          </span>
                        </>
                      )}
                    </button>

                    {/* Settings Option (Only for owner) */}
                    {isOwner && (
                      <Link
                        href={ROUTES.SETTINGS}
                        onClick={() => setShowMoreMenu(false)}
                        className="py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap flex items-center gap-2.5 w-full text-[#65676b] dark:text-[#b0b3b8] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]"
                      >
                        <Settings className="h-4 w-4 shrink-0" />
                        <span>{locale === 'bn' ? 'সেটিংস' : 'Settings'}</span>
                      </Link>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub-tab Content or Default Two-Column Overview */}
      {activeSubTab === 'friend' && (
        <ProfileFriendsTab targetUser={!isOwner ? displayUser : undefined} />
      )}
      {activeSubTab === 'group' && <ProfileGroupsTab />}
      {activeSubTab === 'saved' && isOwner && <ProfileSavedTab />}

      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: Intro & Summary Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Intro Card */}
            <div className="rounded-2xl border border-[#e4e6eb] bg-white p-4 sm:p-5 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526] space-y-3.5">
              <h2 className="text-base font-bold text-[#050505] dark:text-white">
                {locale === 'bn' ? 'পরিচিতি' : 'Intro'}
              </h2>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center gap-2.5 text-[#050505] dark:text-[#e4e6eb]">
                  <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    {locale === 'bn' ? 'মেম্বার ব্যাজ:' : 'Tier:'}{' '}
                    <strong className="font-bold">
                      {displayUser.badge || 'Standard Member'}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-[#050505] dark:text-[#e4e6eb]">
                  <Shield className="h-4 w-4 text-primary-500 shrink-0" />
                  <span>
                    {locale === 'bn' ? 'স্ট্যাটাস:' : 'Status:'}{' '}
                    <strong className="font-bold">
                      {displayUser.userStatus === 'VERIFIED'
                        ? locale === 'bn'
                          ? 'ভেরিফাইড মেম্বার'
                          : 'Verified Member'
                        : displayUser.userStatus === 'PREMIUM'
                          ? locale === 'bn'
                            ? 'প্রিমিয়াম মেম্বার'
                            : 'Premium Member'
                          : locale === 'bn'
                            ? 'স্ট্যান্ডার্ড একাউন্ট'
                            : 'Non-verified Account'}
                    </strong>
                  </span>
                </div>

                {displayUser.location && (
                  <div className="flex items-center gap-2.5 text-[#050505] dark:text-[#e4e6eb]">
                    <MapPin className="h-4 w-4 text-primary-500 shrink-0" />
                    <span>
                      {locale === 'bn' ? 'বাসস্থান:' : 'Lives in:'}{' '}
                      <strong className="font-bold">{displayUser.location}</strong>
                    </span>
                  </div>
                )}

                {displayUser.email && (
                  <div className="flex items-center gap-2.5 text-[#050505] dark:text-[#e4e6eb]">
                    <Mail className="h-4 w-4 text-primary-500 shrink-0" />
                    <span className="truncate">
                      {locale === 'bn' ? 'ইমেইল:' : 'Email:'}{' '}
                      <strong className="font-bold">{displayUser.email}</strong>
                    </span>
                  </div>
                )}

                {bloodGroupLabel && (
                  <div className="flex items-center gap-2.5 text-[#050505] dark:text-[#e4e6eb]">
                    <Droplet className="h-4 w-4 text-red-500 shrink-0" />
                    <span>
                      {locale === 'bn' ? 'রক্তের গ্রুপ:' : 'Blood Group:'}{' '}
                      <strong className="font-bold text-red-600 dark:text-red-400">
                        {bloodGroupLabel}
                      </strong>
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2.5 text-[#050505] dark:text-[#e4e6eb]">
                  <Calendar className="h-4 w-4 text-primary-500 shrink-0" />
                  <span>
                    {locale === 'bn' ? 'যুক্ত হয়েছেন:' : 'Joined:'}{' '}
                    <strong className="font-bold">
                      {displayUser.createdAt
                        ? formatDate(displayUser.createdAt, locale)
                        : locale === 'bn'
                          ? 'আজ'
                          : 'Today'}
                    </strong>
                  </span>
                </div>
              </div>

              {isOwner && !isViewAs && (
                <Link href={ROUTES.SETTINGS} className="block pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-xl text-xs font-bold border-[#e4e6eb] dark:border-[#393a3b]"
                  >
                    {locale === 'bn' ? 'বিবরণ সম্পাদনা করুন' : 'Edit Details'}
                  </Button>
                </Link>
              )}
            </div>

            {/* Friends Preview Card (6-Grid) (Only for owner) */}
            {isOwner && (
              <div className="rounded-2xl border border-[#e4e6eb] bg-white p-4 sm:p-5 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
                <div className="flex items-center justify-between pb-3">
                  <div>
                    <h2 className="text-base font-bold text-[#050505] dark:text-white">
                      {locale === 'bn' ? 'বন্ধুরা' : 'Friends'}
                    </h2>
                    <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
                      {totalFriends}{' '}
                      {locale === 'bn'
                        ? 'জন বন্ধু'
                        : totalFriends === 1
                          ? 'friend'
                          : 'friends'}
                    </p>
                  </div>

                  <Link
                    href={buildTabUrl('friend')}
                    className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    {locale === 'bn' ? 'সব দেখুন' : 'See all'}
                  </Link>
                </div>

                {friendItems.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#65676b] dark:text-[#b0b3b8]">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p>
                      {locale === 'bn'
                        ? 'এখনো কোনো বন্ধু যুক্ত নেই'
                        : 'No friends yet'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {friendItems.slice(0, 6).map((f) => (
                      <Link
                        key={f.id}
                        href={ROUTES.USER_PROFILE(f.user.username)}
                        className="group block text-center"
                      >
                        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-primary-500 text-white font-bold text-sm shadow-2xs border border-[#e4e6eb] dark:border-[#393a3b]">
                          {f.user.avatarUrl ? (
                            <Image
                              src={f.user.avatarUrl}
                              alt={f.user.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              {f.user.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <p className="mt-1 text-[11px] font-bold text-[#050505] dark:text-[#e4e6eb] truncate group-hover:underline">
                          {f.user.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Groups Preview Card (Only for owner) */}
            {isOwner && (
              <div className="rounded-2xl border border-[#e4e6eb] bg-white p-4 sm:p-5 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
                <div className="flex items-center justify-between pb-2.5">
                  <div>
                    <h2 className="text-base font-bold text-[#050505] dark:text-white">
                      {locale === 'bn' ? 'আমার গ্রুপ' : 'My Groups'}
                    </h2>
                    <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
                      {myGroups.length}{' '}
                      {locale === 'bn'
                        ? 'টি গ্রুপ'
                        : myGroups.length === 1
                          ? 'group'
                          : 'groups'}
                    </p>
                  </div>

                  <Link
                    href={buildTabUrl('group')}
                    className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    {locale === 'bn' ? 'সব দেখুন' : 'See all'}
                  </Link>
                </div>

                {myGroups.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#65676b] dark:text-[#b0b3b8]">
                    <Users2 className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p>
                      {locale === 'bn'
                        ? 'কোনো গ্রুপে যুক্ত হননি'
                        : 'No groups joined yet'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    {myGroups.slice(0, 3).map((group) => (
                      <Link
                        key={group.id}
                        href={ROUTES.GROUPS.DETAIL(group.slug)}
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] transition-colors group"
                      >
                        <div className="relative h-10 w-10 rounded-xl bg-teal-500 text-white font-bold text-sm flex items-center justify-center overflow-hidden shrink-0">
                          {group.avatarUrl ? (
                            <Image
                              src={group.avatarUrl}
                              alt={group.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <span>{group.name.charAt(0)}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#050505] dark:text-[#e4e6eb] truncate group-hover:text-primary-600">
                            {group.name}
                          </p>
                          <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
                            {group.memberCount}{' '}
                            {locale === 'bn' ? 'সদস্য' : 'members'}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Post Composer & Timeline */}
          <div className="lg:col-span-7 space-y-4">
            {/* Post Composer (Hidden in View As mode or when not owner) */}
            {isOwner && !isViewAs && <PostComposer />}

            {/* Quick Shortcuts Card (Only for owner in normal mode) */}
            {isOwner && !isViewAs && (
              <div className="rounded-2xl border border-[#e4e6eb] bg-white p-4 sm:p-5 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
                <h3 className="text-sm font-bold text-[#050505] dark:text-white mb-3">
                  {locale === 'bn' ? 'দ্রুত শর্টকাট' : 'Quick Actions'}
                </h3>

                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href={buildTabUrl('saved')}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 shrink-0">
                      <Bookmark className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#050505] dark:text-[#e4e6eb] truncate">
                        {locale === 'bn' ? 'বুকমার্ক' : 'Saved'}
                      </p>
                      <p className="text-[10px] text-[#65676b] dark:text-[#b0b3b8]">
                        {totalBookmarks} {locale === 'bn' ? 'টি' : 'items'}
                      </p>
                    </div>
                  </Link>

                  <Link
                    href={ROUTES.GROUPS.CREATE}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400 shrink-0">
                      <Plus className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#050505] dark:text-[#e4e6eb] truncate">
                        {locale === 'bn' ? 'নতুন গ্রুপ' : 'Create Group'}
                      </p>
                      <p className="text-[10px] text-[#65676b] dark:text-[#b0b3b8]">
                        {locale === 'bn' ? 'তৈরি করুন' : 'Start now'}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {/* Public Activity / Timeline Card for View As or Other Users */}
            {(!isOwner || isViewAs) && (
              <div className="rounded-2xl border border-[#e4e6eb] bg-white p-8 sm:p-10 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526] text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 mb-3">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-[#050505] dark:text-white mb-1">
                  {locale === 'bn' ? 'টাইমলাইন' : 'Timeline'}
                </h3>
                <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] max-w-sm mx-auto">
                  {locale === 'bn'
                    ? `${displayUser.name}-এর সাম্প্রতিক কোনো পাবলিক পোস্ট নেই`
                    : `No recent public posts to show from ${displayUser.name}.`}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cover Photo Reposition & Zoom Editor Modal */}
      {isCoverEditorOpen && (
        <CoverPhotoEditorModal
          isOpen={isCoverEditorOpen}
          onClose={handleCloseCoverEditor}
          imageSrc={coverEditorImageSrc}
          onSave={handleSaveCoverPhoto}
          isSaving={isUploadingCover}
        />
      )}
    </div>
  );
}
