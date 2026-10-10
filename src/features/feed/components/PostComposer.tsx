'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { usePostActions } from '../hooks/usePostActions';
import { uploadsApi } from '@/features/uploads/api/uploads.api';
import { PostType } from '../types/feed.types';
import { PostMediaGallery } from './PostMediaGallery';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BloodGroup } from '@/types/user.types';
import { BloodRequestUrgency } from '@/features/blood/types/blood.types';
import {
  PenTool,
  BookOpen,
  Droplet,
  Image as ImageIcon,
  X,
  Loader2,
  Calendar,
  AlertCircle,
  LayoutGrid,
  SlidersHorizontal,
  Smile,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/constants/routes';
import { useUiStore } from '@/stores/uiStore';
import { FEELINGS, getFeelingById } from '../constants/feelings';
import { soundEffects } from '@/lib/sound/soundEffects';

const BLOOD_GROUPS: { value: BloodGroup; label: string }[] = [
  { value: 'A_POSITIVE', label: 'A+' },
  { value: 'A_NEGATIVE', label: 'A-' },
  { value: 'B_POSITIVE', label: 'B+' },
  { value: 'B_NEGATIVE', label: 'B-' },
  { value: 'AB_POSITIVE', label: 'AB+' },
  { value: 'AB_NEGATIVE', label: 'AB-' },
  { value: 'O_POSITIVE', label: 'O+' },
  { value: 'O_NEGATIVE', label: 'O-' },
];

const URGENCIES: {
  value: BloodRequestUrgency;
  label: string;
  color: string;
}[] = [
  {
    value: 'REGULAR',
    label: 'Regular',
    color:
      'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300',
  },
  {
    value: 'URGENT',
    label: 'Urgent',
    color:
      'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300',
  },
  {
    value: 'EMERGENCY',
    label: 'Emergency',
    color:
      'bg-red-50 text-red-700 border-red-300 dark:bg-red-900/40 dark:text-red-300',
  },
];

export function PostComposer() {
  const { user, isAuthenticated } = useAuth();
  const { createPost, isCreatingPost } = usePostActions();
  const {
    isUploadingPost,
    setIsUploadingPost,
    uploadingMessage,
    isPostUploadSuccess,
    postSuccessMessage,
  } = useUiStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isSuccessActive = isSuccess || isPostUploadSuccess;
  const successText = postSuccessMessage || 'Posted successfully!';
  const activeLoadingText = uploadingMessage || 'Posting your reflection...';
  const [postType, setPostType] = useState<PostType>('TEXT');
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // General Mode State (Images & Feelings)
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [mediaLayout, setMediaLayout] = useState<'COLLAGE' | 'SWIPE'>('COLLAGE');
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [uploadingCount, setUploadingCount] = useState<number>(0);
  const [feeling, setFeeling] = useState<string | null>(null);
  const [showFeelingPicker, setShowFeelingPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dua Mode State (Inline Creation Only)
  const [duaTransliteration, setDuaTransliteration] = useState('');
  const [duaMeaning, setDuaMeaning] = useState('');
  const [duaFadilah, setDuaFadilah] = useState('');

  // Blood Request Mode State
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | ''>('');
  const [units, setUnits] = useState(1);
  const [urgency, setUrgency] = useState<BloodRequestUrgency>('REGULAR');
  const [hospitalName, setHospitalName] = useState('');
  const [location, setLocation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [neededDate, setNeededDate] = useState(
    () => new Date().toISOString().split('T')[0]
  );
  const [problem, setProblem] = useState('');
  const [bloodNote, setBloodNote] = useState('');

  const selectedFeeling = getFeelingById(feeling);

  if (!isAuthenticated) {
    return (
      <Card className="border border-[#e4e6eb] bg-white p-3.5 sm:p-4 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526] rounded-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative h-9 w-9 shrink-0">
            <Image
              src="/p-logo.svg"
              alt="PeaceTweet"
              width={36}
              height={36}
              className="rounded-xl shadow-xs"
            />
          </div>
          <p className="text-xs sm:text-sm text-[#65676b] dark:text-[#b0b3b8]">
            Sign in to share reflections, Duas, or blood donation requests.
          </p>
        </div>
        <Link href={ROUTES.LOGIN}>
          <Button
            size="sm"
            className="rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold"
          >
            Log In
          </Button>
        </Link>
      </Card>
    );
  }

  const resetForm = () => {
    setContent('');
    setMediaUrls([]);
    setMediaLayout('COLLAGE');
    setFeeling(null);
    setShowFeelingPicker(false);
    setDuaTransliteration('');
    setDuaMeaning('');
    setDuaFadilah('');
    setPatientName('');
    setBloodGroup('');
    setUnits(1);
    setUrgency('REGULAR');
    setHospitalName('');
    setLocation('');
    setContactNumber('');
    setNeededDate(new Date().toISOString().split('T')[0]);
    setProblem('');
    setBloodNote('');
    setErrorMessage(null);
    setIsOpen(false);
    setPostType('TEXT');
  };

  const handleImageFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (mediaUrls.length + files.length > 10) {
      setErrorMessage('You can attach a maximum of 10 photos per post.');
      return;
    }

    setIsUploadingMedia(true);
    setUploadingCount(files.length);
    setErrorMessage(null);

    try {
      const fileList = Array.from(files);
      const newUrls = await uploadsApi.uploadMultipleImages(fileList);

      if (newUrls.length > 0) {
        setMediaUrls((prev) => [...prev, ...newUrls]);
      } else {
        setErrorMessage('Failed to upload images. Please check file format and try again.');
      }
    } catch {
      setErrorMessage('Failed to upload image(s). Please try again.');
    } finally {
      setIsUploadingMedia(false);
      setUploadingCount(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeMediaUrl = (index: number) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation per mode
    if (postType === 'TEXT') {
      if (!content.trim() && mediaUrls.length === 0) {
        setErrorMessage('Please enter some text or attach an image.');
        return;
      }
    } else if (postType === 'DUA') {
      if (!duaMeaning.trim()) {
        setErrorMessage('Please enter the meaning or translation of the Dua.');
        return;
      }
    } else if (postType === 'BLOOD_REQUEST') {
      if (!patientName.trim()) {
        setErrorMessage('Patient name is required.');
        return;
      }
      if (!bloodGroup) {
        setErrorMessage('Please select a blood group.');
        return;
      }
      if (!hospitalName.trim()) {
        setErrorMessage('Hospital name is required.');
        return;
      }
      if (!location.trim()) {
        setErrorMessage('Location / Area is required.');
        return;
      }
      if (!contactNumber.trim()) {
        setErrorMessage('Contact phone number is required.');
        return;
      }
      if (!neededDate) {
        setErrorMessage('Date needed is required.');
        return;
      }
    }

    let payload: any;
    if (postType === 'TEXT') {
      payload = {
        type: 'TEXT',
        content: content.trim() || undefined,
        mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
        mediaLayout: mediaUrls.length > 1 ? mediaLayout : 'COLLAGE',
        feeling: feeling || undefined,
      };
    } else if (postType === 'DUA') {
      payload = {
        type: 'DUA',
        feeling: feeling || undefined,
        duaData: {
          transliteration: duaTransliteration.trim() || undefined,
          meaning: duaMeaning.trim(),
          fadilah: duaFadilah.trim() || undefined,
        },
      };
    } else if (postType === 'BLOOD_REQUEST') {
      payload = {
        type: 'BLOOD_REQUEST',
        content: content.trim() || undefined,
        feeling: feeling || undefined,
        bloodRequestData: {
          patientName: patientName.trim(),
          bloodGroup,
          units: Number(units) || 1,
          urgency,
          hospitalName: hospitalName.trim(),
          location: location.trim(),
          contactNumber: contactNumber.trim(),
          neededDate,
          problem: problem.trim() || undefined,
          note: bloodNote.trim() || undefined,
        },
      };
    }

    // 1. Immediately close form & reset form fields so UI responds instantly!
    resetForm();

    // 2. Start background upload with circle animation
    setIsUploadingPost(true);
    try {
      await createPost(payload);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 4000);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create post. Please try again.';
      console.error('Post creation error:', msg);
      if (typeof window !== 'undefined') {
        window.alert(msg);
      }
    } finally {
      setIsUploadingPost(false);
    }
  };

  return (
    <Card className="border border-[#e4e6eb] bg-white p-3 sm:p-4 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526] rounded-xl transition-all overflow-hidden w-full">
      {!isOpen ? (
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 w-full">
          <div className="relative flex items-center justify-center shrink-0">
            {isUploadingPost && (
              <>
                <div className="absolute -inset-1.5 rounded-full border-[2.5px] border-transparent border-t-primary-500 border-r-primary-500 animate-spin" />
                <div className="absolute -inset-2.5 rounded-full border border-primary-400/40 animate-pulse" />
              </>
            )}
            <div
              className={cn(
                'relative flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white font-bold text-xs sm:text-sm select-none overflow-hidden shadow-xs transition-all',
                isUploadingPost &&
                  'ring-2 ring-primary-500 ring-offset-2 ring-offset-white dark:ring-offset-[#242526]',
                isSuccessActive &&
                  'ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-[#242526]',
              )}
            >
              {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name || 'User'}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <span>{user?.name ? user.name.charAt(0).toUpperCase() : '🕊️'}</span>
              )}
            </div>
          </div>
          {isSuccessActive ? (
            <div className="h-9 sm:h-10 flex-1 min-w-0 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 px-3.5 sm:px-4 text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-300 flex items-center justify-between animate-in fade-in zoom-in-95 duration-200 select-none overflow-hidden">
              <div className="flex items-center gap-2 min-w-0 truncate">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shrink-0 shadow-xs">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
                <span className="truncate">{successText}</span>
              </div>
              <span className="text-[11px] font-normal text-emerald-600 dark:text-emerald-400 hidden sm:inline shrink-0">
                Visible in feed
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                soundEffects.playTab();
                setIsOpen(true);
              }}
              className="h-9 sm:h-10 flex-1 min-w-0 rounded-full bg-[#f0f2f5] px-3.5 sm:px-4 text-left text-xs sm:text-sm text-[#65676b] hover:bg-[#e4e6eb] transition-colors dark:bg-[#3a3b3c] dark:text-[#b0b3b8] dark:hover:bg-[#4e4f50] flex items-center justify-between gap-2 overflow-hidden"
            >
              <span className="truncate min-w-0 block">
                {isUploadingPost ? (
                  activeLoadingText
                ) : user?.name ? (
                  <>
                    <span className="sm:hidden">{user.name.split(' ')[0]}, what&apos;s on your mind?</span>
                    <span className="hidden sm:inline">
                      {user.name.split(' ')[0]}, Share a reflection, Dua, or Blood Request...
                    </span>
                  </>
                ) : (
                  <>
                    <span className="sm:hidden">What&apos;s on your mind?</span>
                    <span className="hidden sm:inline">Share a reflection, Dua, or Blood Request...</span>
                  </>
                )}
              </span>
              {isUploadingPost && (
                <span className="flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 font-semibold shrink-0">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span className="hidden xs:inline">Processing...</span>
                </span>
              )}
            </button>
          )}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-3.5 animate-in fade-in duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#e4e6eb] pb-2.5 dark:border-[#393a3b]">
            <div className="flex items-center gap-2">
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white font-bold text-xs select-none overflow-hidden shadow-xs">
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name || 'User'}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span>{user?.name ? user.name.charAt(0).toUpperCase() : '🕊️'}</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-xs font-bold text-[#050505] dark:text-[#e4e6eb] leading-none">
                    {user?.name}
                  </p>
                  {selectedFeeling && (
                    <span className="text-xs text-[#65676b] dark:text-[#b0b3b8] font-normal flex items-center gap-1">
                      <span>is feeling</span>
                      <span className="font-semibold text-[#050505] dark:text-[#e4e6eb]">
                        {selectedFeeling.label}
                      </span>
                      <span className="text-sm">{selectedFeeling.emoji}</span>
                      <button
                        type="button"
                        onClick={() => setFeeling(null)}
                        className="ml-0.5 rounded-full p-0.5 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        title="Remove feeling"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-primary-600 dark:text-primary-400 font-semibold">
                  Public Post
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="text-[#65676b] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] p-1.5 rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                if (postType !== 'TEXT') soundEffects.playTab();
                setPostType('TEXT');
                setErrorMessage(null);
              }}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all',
                postType === 'TEXT'
                  ? 'bg-primary-50 text-primary-700 border border-primary-500 shadow-2xs dark:bg-primary-900/60 dark:text-primary-300'
                  : 'bg-[#f0f2f5] text-[#65676b] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:text-[#b0b3b8]'
              )}
            >
              <PenTool className="h-3.5 w-3.5 text-primary-500" />
              <span>General Post</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (postType !== 'DUA') soundEffects.playTab();
                setPostType('DUA');
                setErrorMessage(null);
              }}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all',
                postType === 'DUA'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-500 shadow-2xs dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-[#f0f2f5] text-[#65676b] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:text-[#b0b3b8]'
              )}
            >
              <BookOpen className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Dua</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (postType !== 'BLOOD_REQUEST') soundEffects.playTab();
                setPostType('BLOOD_REQUEST');
                setErrorMessage(null);
              }}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all',
                postType === 'BLOOD_REQUEST'
                  ? 'bg-rose-50 text-rose-800 border border-rose-500 shadow-2xs dark:bg-rose-950/60 dark:text-rose-300'
                  : 'bg-[#f0f2f5] text-[#65676b] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:text-[#b0b3b8]'
              )}
            >
              <Droplet className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400 fill-rose-500/20" />
              <span>Blood Request</span>
            </button>
          </div>

          {/* Validation Error Banner */}
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-2.5 text-xs text-red-600 border border-red-200 dark:bg-red-950/50 dark:border-red-900 dark:text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ────────────────── 1. GENERAL MODE ────────────────── */}
          {postType === 'TEXT' && (
            <div className="space-y-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind? Share a reflection, reminder, or story..."
                rows={3}
                className="w-full resize-none rounded-xl border border-[#e4e6eb] bg-[#f0f2f5] p-3 text-xs sm:text-sm text-[#050505] placeholder:text-[#65676b] focus:border-primary-500 focus:bg-white focus:outline-hidden dark:border-[#393a3b] dark:bg-[#3a3b3c] dark:text-[#e4e6eb] dark:placeholder:text-[#b0b3b8] dark:focus:bg-[#242526]"
              />

              {/* Uploaded Photos (removable thumbnails) */}
              {mediaUrls.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pt-1 pb-1">
                  {mediaUrls.map((url, idx) => (
                    <div
                      key={`${url}-${idx}`}
                      className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
                    >
                      <Image
                        src={url}
                        alt={`Attachment ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => removeMediaUrl(idx)}
                        className="absolute top-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                        title="Remove photo"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Layout Picker + Live Preview (2+ photos) */}
              {mediaUrls.length > 1 && (
                <div className="space-y-2 rounded-xl border border-[#e4e6eb] p-2.5 dark:border-[#393a3b]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#050505] dark:text-[#e4e6eb]">
                      Photo Layout
                    </span>
                    <div className="flex items-center gap-1 rounded-lg bg-[#f0f2f5] p-0.5 dark:bg-[#3a3b3c]">
                      {(
                        [
                          { value: 'COLLAGE', label: 'Collage', Icon: LayoutGrid },
                          { value: 'SWIPE', label: 'Swipe', Icon: SlidersHorizontal },
                        ] as const
                      ).map(({ value, label, Icon }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setMediaLayout(value)}
                          className={cn(
                            'flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all select-none',
                            mediaLayout === value
                              ? 'bg-white text-primary-600 shadow-2xs dark:bg-[#242526] dark:text-primary-400'
                              : 'text-[#65676b] hover:text-[#050505] dark:text-[#b0b3b8] dark:hover:text-[#e4e6eb]'
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
                    {mediaLayout === 'COLLAGE'
                      ? 'Photos are shown together in a grid.'
                      : 'Photos are shown one at a time. Viewers swipe to see the next one.'}
                  </p>
                  <PostMediaGallery mediaUrls={mediaUrls} layout={mediaLayout} />
                </div>
              )}

              {/* Photo & Feeling Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  multiple
                  onChange={handleImageFiles}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingMedia || mediaUrls.length >= 10}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold transition-colors dark:border-gray-700',
                    mediaUrls.length >= 10
                      ? 'opacity-50 cursor-not-allowed text-gray-400'
                      : 'text-[#65676b] hover:bg-[#f0f2f5] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c]'
                  )}
                >
                  {isUploadingMedia ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary-500" />
                  ) : (
                    <ImageIcon className="h-3.5 w-3.5 text-emerald-500" />
                  )}
                  <span>
                    {isUploadingMedia
                      ? `Uploading ${uploadingCount > 1 ? `${uploadingCount} photos...` : 'photo...'}`
                      : mediaUrls.length > 0
                        ? 'Add More Photos'
                        : 'Add Photos'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowFeelingPicker((prev) => !prev)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
                    selectedFeeling
                      ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                      : 'border-gray-200 text-[#65676b] hover:bg-[#f0f2f5] dark:border-gray-700 dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c]'
                  )}
                >
                  <Smile className="h-3.5 w-3.5 text-amber-500" />
                  <span>
                    {selectedFeeling ? `${selectedFeeling.emoji} ${selectedFeeling.label}` : 'Feeling / Activity'}
                  </span>
                </button>

                {mediaUrls.length > 0 && (
                  <span className="text-[11px] font-medium text-[#65676b] dark:text-[#b0b3b8]">
                    {mediaUrls.length}/10 {mediaUrls.length === 1 ? 'photo' : 'photos'} attached
                  </span>
                )}
              </div>

              {/* Feeling Picker Popover Grid */}
              {showFeelingPicker && (
                <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-md dark:border-gray-700 dark:bg-[#242526] animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                      How are you feeling?
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowFeelingPicker(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 max-h-48 overflow-y-auto">
                    {FEELINGS.map((item) => {
                      const isSelected = feeling === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setFeeling(item.id);
                            setShowFeelingPicker(false);
                          }}
                          className={cn(
                            'flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors',
                            isSelected
                              ? 'bg-primary-50 text-primary-700 border border-primary-300 dark:bg-primary-950 dark:text-primary-300 dark:border-primary-800'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                          )}
                        >
                          <span className="text-base select-none">{item.emoji}</span>
                          <span className="truncate capitalize">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ────────────────── 2. DUA MODE (INLINE ONLY) ────────────────── */}
          {postType === 'DUA' && (
            <div className="space-y-2.5 rounded-xl bg-emerald-50/50 p-3 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/60">

              <Input
                label="Pronunciation (Bangla/English)"
                placeholder="e.g. Allahumma bismika amutu wa ahya"
                value={duaTransliteration}
                onChange={(e) => setDuaTransliteration(e.target.value)}
              />

              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Meaning / Translation *
                </label>
                <textarea
                  value={duaMeaning}
                  onChange={(e) => setDuaMeaning(e.target.value)}
                  placeholder="e.g. O Allah, in Your name I die and I live..."
                  rows={2}
                  className="w-full resize-none rounded-xl border border-[#e4e6eb] bg-white p-2.5 text-xs sm:text-sm text-[#050505] placeholder:text-[#65676b] focus:border-emerald-500 focus:outline-hidden dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb]"
                  required
                />
              </div>

              <Input
                label="Fadilah (Optional)"
                placeholder="e.g. Recite before sleeping for protection throughout the night"
                value={duaFadilah}
                onChange={(e) => setDuaFadilah(e.target.value)}
              />
            </div>
          )}

          {/* ────────────────── 3. BLOOD REQUEST MODE ────────────────── */}
          {postType === 'BLOOD_REQUEST' && (
            <div className="space-y-3 rounded-xl bg-rose-50/50 p-3 border border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/60">
              <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 pb-1">
                <Droplet className="h-4 w-4 fill-rose-600" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Blood Donation Request Details
                </span>
              </div>

              {/* Patient Name */}
              <Input
                label="Patient Name *"
                placeholder="e.g. Md. Tariqul Islam"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
              />

              {/* Blood Group Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Required Blood Group *
                </label>
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                  {BLOOD_GROUPS.map((bg) => {
                    const isSelected = bloodGroup === bg.value;
                    return (
                      <button
                        key={bg.value}
                        type="button"
                        onClick={() => setBloodGroup(bg.value)}
                        className={cn(
                          'flex items-center justify-center rounded-xl py-1.5 px-2 text-xs font-bold transition-all border',
                          isSelected
                            ? 'border-rose-600 bg-rose-600 text-white shadow-xs'
                            : 'border-[#e4e6eb] bg-white text-[#050505] hover:bg-rose-50 dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb] dark:hover:bg-[#3a3b3c]'
                        )}
                      >
                        {bg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Units & Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Units / Bags Needed *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={units}
                    onChange={(e) =>
                      setUnits(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="h-10 w-full rounded-xl border border-[#e4e6eb] bg-white px-3 text-xs sm:text-sm text-[#050505] dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb] focus:border-rose-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Urgency Level *
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {URGENCIES.map((u) => {
                      const isSelected = urgency === u.value;
                      return (
                        <button
                          key={u.value}
                          type="button"
                          onClick={() => setUrgency(u.value)}
                          className={cn(
                            'rounded-xl py-2 px-1 text-[11px] font-bold border transition-all text-center',
                            isSelected
                              ? 'border-rose-600 bg-rose-600 text-white shadow-xs'
                              : 'border-[#e4e6eb] bg-white text-[#65676b] hover:bg-gray-100 dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#b0b3b8]'
                          )}
                        >
                          {u.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Hospital & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Input
                  label="Hospital Name *"
                  placeholder="e.g. Dhaka Medical College Hospital"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  required
                />
                <Input
                  label="Location / Area *"
                  placeholder="e.g. Shahbagh, Dhaka"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              {/* Contact & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Input
                  label="Contact Phone Number *"
                  placeholder="e.g. +880 1712 345678"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                />
                <Input
                  label="Date Needed *"
                  type="date"
                  value={neededDate}
                  onChange={(e) => setNeededDate(e.target.value)}
                  leftIcon={<Calendar className="h-4 w-4 text-rose-500" />}
                  required
                />
              </div>

              {/* Medical Reason & Notes */}
              <Input
                label="Medical Reason / Condition (Optional)"
                placeholder="e.g. Surgery, Delivery, Dengue, Thalassemia"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
              />

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={bloodNote}
                  onChange={(e) => setBloodNote(e.target.value)}
                  placeholder="Any special instructions for donors (e.g. transportation provided, exact ward)..."
                  rows={2}
                  className="w-full resize-none rounded-xl border border-[#e4e6eb] bg-white p-2.5 text-xs text-[#050505] placeholder:text-[#65676b] focus:border-rose-500 focus:outline-hidden dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb]"
                />
              </div>

              {/* Optional general content caption */}
              <div className="space-y-1 pt-1">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Post Caption (Optional)
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Brief note to your followers on the feed..."
                  rows={1}
                  className="w-full resize-none rounded-xl border border-[#e4e6eb] bg-white p-2 text-xs text-[#050505] placeholder:text-[#65676b] focus:border-rose-500 focus:outline-hidden dark:border-[#393a3b] dark:bg-[#242526] dark:text-[#e4e6eb]"
                />
              </div>
            </div>
          )}

          {/* Footer Submit Bar */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
              {postType === 'TEXT' && `${content.length}/5000 characters`}
              {postType === 'DUA' && 'Auto-categorized Dua'}
              {postType === 'BLOOD_REQUEST' && 'Emergency Donor Request'}
            </span>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetForm}
                className="rounded-xl text-xs px-3 text-[#65676b]"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isCreatingPost || isUploadingMedia}
                isLoading={isCreatingPost}
                size="sm"
                className={cn(
                  'rounded-xl text-white font-bold px-4 transition-all',
                  postType === 'BLOOD_REQUEST'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : postType === 'DUA'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-primary-500 hover:bg-primary-600'
                )}
              >
                {postType === 'BLOOD_REQUEST'
                  ? 'Post Blood Request'
                  : postType === 'DUA'
                    ? 'Post Dua'
                    : 'Post'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </Card>
  );
}
