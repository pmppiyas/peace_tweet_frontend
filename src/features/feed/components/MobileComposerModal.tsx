'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Send,
  Image as ImageIcon,
  Smile,
  BookOpen,
  Droplet,
  PenTool,
  Loader2,
  AlertCircle,
  Globe,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePostActions } from '../hooks/usePostActions';
import { uploadsApi } from '@/features/uploads/api/uploads.api';
import { PostType } from '../types/feed.types';
import { BloodGroup } from '@/types/user.types';
import { BloodRequestUrgency } from '@/features/blood/types/blood.types';
import { useLanguage } from '@/providers/LanguageProvider';
import { useUiStore } from '@/stores/uiStore';
import { FEELINGS, getFeelingById } from '../constants/feelings';
import { soundEffects } from '@/lib/sound/soundEffects';
import { cn } from '@/lib/utils/cn';
import {
  MobileTextComposer,
  MobileDuaComposer,
  MobileBloodComposer,
  BLOOD_GROUPS,
  URGENCIES,
} from './composer';

interface MobileComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileComposerModal({
  isOpen,
  onClose,
}: MobileComposerModalProps) {
  const { user } = useAuth();
  const { createPost, isCreatingPost } = usePostActions();
  const { setIsUploadingPost, triggerPostSuccess, isUploadingPost } =
    useUiStore();
  const { locale } = useLanguage();

  const [mounted, setMounted] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Form State
  const [postType, setPostType] = useState<PostType>('TEXT');
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Photos & Media
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [mediaLayout, setMediaLayout] = useState<'COLLAGE' | 'SWIPE'>(
    'COLLAGE'
  );
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Feelings
  const [feeling, setFeeling] = useState<string | null>(null);
  const [showFeelingPicker, setShowFeelingPicker] = useState(false);

  // Dua Fields
  const [duaTitle, setDuaTitle] = useState('');
  const [duaArabicText, setDuaArabicText] = useState('');
  const [duaTransliteration, setDuaTransliteration] = useState('');
  const [duaMeaning, setDuaMeaning] = useState('');
  const [duaFadilah, setDuaFadilah] = useState('');

  // Blood Request Fields
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | ''>('');
  const [units, setUnits] = useState('1');
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      const frame = requestAnimationFrame(() => {
        setIsVisible(true);
      });
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 250);
      return () => {
        cancelAnimationFrame(frame);
      };
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 320);
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const resetForm = () => {
    setContent('');
    setMediaUrls([]);
    setMediaLayout('COLLAGE');
    setFeeling(null);
    setShowFeelingPicker(false);
    setDuaTitle('');
    setDuaArabicText('');
    setDuaTransliteration('');
    setDuaMeaning('');
    setDuaFadilah('');
    setPatientName('');
    setBloodGroup('');
    setUnits('1');
    setUrgency('REGULAR');
    setHospitalName('');
    setLocation('');
    setContactNumber('');
    setNeededDate(new Date().toISOString().split('T')[0]);
    setProblem('');
    setBloodNote('');
    setErrorMessage(null);
    setPostType('TEXT');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleImageFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (mediaUrls.length + files.length > 10) {
      setErrorMessage(
        locale === 'bn'
          ? 'সর্বোচ্চ ১০টি ছবি যুক্ত করা যাবে।'
          : 'You can attach a maximum of 10 photos.'
      );
      return;
    }

    setIsUploadingMedia(true);
    setErrorMessage(null);

    try {
      const fileList = Array.from(files);
      const newUrls = await uploadsApi.uploadMultipleImages(fileList);
      if (newUrls.length > 0) {
        setMediaUrls((prev) => [...prev, ...newUrls]);
        soundEffects.playTab();
      } else {
        setErrorMessage(
          locale === 'bn'
            ? 'ছবি আপলোড করা সম্ভব হয়নি।'
            : 'Failed to upload images.'
        );
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to upload photos');
    } finally {
      setIsUploadingMedia(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeMediaUrl = (index: number) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index));
    soundEffects.playTab();
  };

  // Validation
  const isPostValid =
    postType === 'TEXT'
      ? content.trim().length > 0 || mediaUrls.length > 0
      : postType === 'DUA'
        ? duaMeaning.trim().length > 0
        : Boolean(
            patientName.trim() &&
            bloodGroup &&
            hospitalName.trim() &&
            contactNumber.trim()
          );

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isPostValid) return;

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
        content: content.trim() || undefined,
        duaData: {
          title: duaTitle.trim() || undefined,
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
          units: Math.max(1, parseInt(units, 10) || 1),
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

    setIsUploadingPost(
      true,
      locale === 'bn' ? 'পোস্ট তৈরি হচ্ছে...' : 'Publishing post...'
    );
    handleClose();

    try {
      await createPost(payload);
      soundEffects.playPost();
      triggerPostSuccess(
        locale === 'bn' ? 'সফলভাবে প্রকাশিত হয়েছে!' : 'Published successfully!'
      );
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        (locale === 'bn'
          ? 'পোস্ট তৈরি করতে সমস্যা হয়েছে।'
          : 'Failed to create post. Please try again.');
      console.error('Post creation error:', msg);
      setErrorMessage(msg);
    } finally {
      setIsUploadingPost(false);
    }
  };

  if (!mounted || !isRendered || typeof document === 'undefined') {
    return null;
  }

  // Character counter circular progress
  const charLimit = 5000;
  const charLength = content.length;
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(charLength / charLimit, 1);
  const strokeDashoffset = circumference - progress * circumference;

  const pageContent = (
    <div
      className={cn(
        'fixed inset-0 w-full h-full bg-white dark:bg-[#18191a] z-[100] flex flex-col overflow-hidden transition-transform duration-300 ease-out md:hidden',
        isVisible ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      {/* ────────────────── 1. TOP HEADER (World-Class Clean Bar) ────────────────── */}
      <header className="flex items-center justify-between px-3.5 h-14 border-b border-[#e4e6eb] dark:border-[#2d2e2f] bg-white/95 dark:bg-[#18191a]/95 backdrop-blur-md shrink-0 select-none z-10">
        {/* Left: Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#f0f2f5] dark:hover:bg-[#2d2e2f] text-[#050505] dark:text-[#e4e6eb] transition-transform active:scale-90 cursor-pointer"
          title={locale === 'bn' ? 'বাতিল' : 'Cancel'}
          aria-label="Close"
        >
          <X className="h-5 w-5 stroke-[2.2]" />
        </button>

        {/* Center: Title / Breadcrumb */}
        <div className="flex items-center gap-1.5 font-bold text-sm text-[#050505] dark:text-[#e4e6eb]">
          <Sparkles className="h-4 w-4 text-primary-500" />
          <span>{locale === 'bn' ? 'নতুন পোস্ট' : 'Create Post'}</span>
        </div>

        {/* Right: Publish Pill Button */}
        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={
            !isPostValid ||
            isCreatingPost ||
            isUploadingMedia ||
            isUploadingPost
          }
          className={cn(
            'shrink-0 flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all select-none active:scale-95 shadow-xs',
            isPostValid &&
              !isCreatingPost &&
              !isUploadingMedia &&
              !isUploadingPost
              ? postType === 'BLOOD_REQUEST'
                ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-500/25 ring-2 ring-rose-500/20'
                : postType === 'DUA'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/25 ring-2 ring-emerald-500/20'
                  : 'bg-primary-500 text-white hover:bg-primary-600 shadow-primary-500/25 ring-2 ring-primary-500/20'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60'
          )}
        >
          {isCreatingPost || isUploadingPost ? (
            <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5 shrink-0" />
          )}
          <span className="shrink-0">
            {isCreatingPost || isUploadingPost
              ? locale === 'bn'
                ? 'পোস্ট হচ্ছে...'
                : 'Posting...'
              : locale === 'bn'
                ? 'পোস্ট'
                : 'Post'}
          </span>
        </button>
      </header>

      {/* ────────────────── 2. POST TYPE SEGMENTED ROW ────────────────── */}
      <div className="px-3.5 py-1.5 border-b border-[#e4e6eb]/60 dark:border-[#2d2e2f] bg-[#fbfbfb] dark:bg-[#1f2022] shrink-0">
        <div className="grid grid-cols-3 gap-1 p-0.5 rounded-xl bg-[#f0f2f5] dark:bg-[#2a2b2d]">
          {/* Option 1: General Post */}
          <button
            type="button"
            onClick={() => {
              if (postType !== 'TEXT') soundEffects.playTab();
              setPostType('TEXT');
              setErrorMessage(null);
            }}
            className={cn(
              'flex items-center justify-center gap-1.5 py-1 rounded-lg text-xs font-bold transition-all select-none',
              postType === 'TEXT'
                ? 'bg-white text-primary-600 shadow-xs dark:bg-[#18191a] dark:text-primary-300'
                : 'text-[#65676b] hover:text-[#050505] dark:text-[#b0b3b8]'
            )}
          >
            <PenTool className="h-3 w-3" />
            <span>{locale === 'bn' ? 'ভাবনা / সাধারণ' : 'Reflection'}</span>
          </button>

          {/* Option 2: Dua */}
          <button
            type="button"
            onClick={() => {
              if (postType !== 'DUA') soundEffects.playTab();
              setPostType('DUA');
              setErrorMessage(null);
            }}
            className={cn(
              'flex items-center justify-center gap-1.5 py-1 rounded-lg text-xs font-bold transition-all select-none',
              postType === 'DUA'
                ? 'bg-white text-emerald-600 shadow-xs dark:bg-[#18191a] dark:text-emerald-300'
                : 'text-[#65676b] hover:text-[#050505] dark:text-[#b0b3b8]'
            )}
          >
            <BookOpen className="h-3 w-3" />
            <span>{locale === 'bn' ? 'পবিত্র দু’আ' : 'Dua'}</span>
          </button>

          {/* Option 3: Blood Request */}
          <button
            type="button"
            onClick={() => {
              if (postType !== 'BLOOD_REQUEST') soundEffects.playTab();
              setPostType('BLOOD_REQUEST');
              setErrorMessage(null);
            }}
            className={cn(
              'flex items-center justify-center gap-1.5 py-1 rounded-lg text-xs font-bold transition-all select-none',
              postType === 'BLOOD_REQUEST'
                ? 'bg-white text-rose-600 shadow-xs dark:bg-[#18191a] dark:text-rose-300'
                : 'text-[#65676b] hover:text-[#050505] dark:text-[#b0b3b8]'
            )}
          >
            <Droplet className="h-3 w-3 fill-current" />
            <span>{locale === 'bn' ? 'রক্তদান' : 'Blood'}</span>
          </button>
        </div>
      </div>

      {/* ────────────────── 3. SCROLLABLE WRITING CANVAS ────────────────── */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3.5 pb-28 space-y-4">
        {/* User Identity & Audience Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-sm shadow-xs overflow-hidden ring-2 ring-primary-500/20',
                !user?.avatarUrl
                  ? 'bg-primary-500 text-white'
                  : 'bg-[#f0f2f5] dark:bg-[#3a3b3c]'
              )}
            >
              {user?.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={user.avatarUrl}
                  alt={user.name || 'User'}
                  className="h-full w-full object-cover rounded-full"
                  loading="eager"
                  decoding="sync"
                />
              ) : (
                <span>
                  {user?.name ? user.name.charAt(0).toUpperCase() : '🕊️'}
                </span>
              )}
            </div>

            <div>
              <p className="text-sm font-bold text-[#050505] dark:text-[#e4e6eb] leading-tight">
                {user?.name || 'PeaceTweet User'}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full dark:bg-primary-950/60 dark:text-primary-300 border border-primary-200/50 dark:border-primary-900/50">
                  <Globe className="h-3 w-3" />
                  <span>Public</span>
                </span>

                {selectedFeeling && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60">
                    <span>
                      {selectedFeeling.emoji} {selectedFeeling.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFeeling(null)}
                      className="ml-0.5 rounded-full text-amber-500 hover:text-amber-800"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Validation Error Alert */}
        {errorMessage && (
          <div className="flex items-center gap-2.5 rounded-2xl bg-red-50 p-3 text-xs text-red-700 border border-red-200 dark:bg-red-950/50 dark:border-red-900/60 dark:text-red-300 animate-in fade-in duration-150">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* ────────────── MODE 1: REFLECTION / TEXT ────────────── */}
        {postType === 'TEXT' && (
          <MobileTextComposer
            content={content}
            onChangeContent={setContent}
            textareaRef={textareaRef}
            mediaUrls={mediaUrls}
            mediaLayout={mediaLayout}
            onChangeMediaLayout={setMediaLayout}
            onRemoveMediaUrl={removeMediaUrl}
            locale={locale}
          />
        )}

        {/* ────────────── MODE 2: DUA ────────────── */}
        {postType === 'DUA' && (
          <MobileDuaComposer
            duaTitle={duaTitle}
            onChangeDuaTitle={setDuaTitle}
            duaMeaning={duaMeaning}
            onChangeDuaMeaning={setDuaMeaning}
            duaTransliteration={duaTransliteration}
            onChangeDuaTransliteration={setDuaTransliteration}
            duaFadilah={duaFadilah}
            onChangeDuaFadilah={setDuaFadilah}
            locale={locale}
          />
        )}

        {/* ────────────── MODE 3: BLOOD REQUEST ────────────── */}
        {postType === 'BLOOD_REQUEST' && (
          <MobileBloodComposer
            bloodGroup={bloodGroup}
            onChangeBloodGroup={setBloodGroup}
            urgency={urgency}
            onChangeUrgency={setUrgency}
            patientName={patientName}
            onChangePatientName={setPatientName}
            units={units}
            onChangeUnits={setUnits}
            hospitalName={hospitalName}
            onChangeHospitalName={setHospitalName}
            contactNumber={contactNumber}
            onChangeContactNumber={setContactNumber}
            neededDate={neededDate}
            onChangeNeededDate={setNeededDate}
            locale={locale}
          />
        )}

        {/* ────────────── FEELINGS CENTERED MODAL DIALOGUE ────────────── */}
        {showFeelingPicker && (
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150 select-none"
            onClick={() => setShowFeelingPicker(false)}
          >
            <div
              className="w-full max-w-sm rounded-3xl border border-[#e4e6eb] bg-white p-4 sm:p-5 shadow-2xl dark:border-[#393a3b] dark:bg-[#242526] animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e4e6eb] dark:border-[#393a3b]">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                    <Smile className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-[#050505] dark:text-[#e4e6eb]">
                    {locale === 'bn'
                      ? 'কেমন অনুভব করছেন?'
                      : 'How are you feeling?'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFeelingPicker(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  title={locale === 'bn' ? 'বন্ধ করুন' : 'Close'}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[55vh] overflow-y-auto p-0.5">
                {FEELINGS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setFeeling(item.id);
                      setShowFeelingPicker(false);
                      soundEffects.playTab();
                    }}
                    className={cn(
                      'flex items-center gap-2.5 p-2.5 rounded-2xl text-xs sm:text-sm font-semibold text-left transition-all border cursor-pointer select-none active:scale-95',
                      feeling === item.id
                        ? 'bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-700 shadow-xs'
                        : 'border-transparent hover:border-[#e4e6eb] dark:hover:border-[#393a3b] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c] text-[#050505] dark:text-[#e4e6eb]'
                    )}
                  >
                    <span className="text-xl select-none shrink-0">
                      {item.emoji}
                    </span>
                    <span className="truncate capitalize">{item.label}</span>
                  </button>
                ))}
              </div>

              {feeling && (
                <div className="mt-3 pt-3 border-t border-[#e4e6eb] dark:border-[#393a3b] flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setFeeling(null);
                      setShowFeelingPicker(false);
                    }}
                    className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    {locale === 'bn' ? 'অনুভূতি মুছুন' : 'Remove Feeling'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ────────────────── 4. FIXED BOTTOM ACCESSORY TOOLBAR ────────────────── */}
      <footer className="fixed bottom-0 left-0 right-0 h-14 border-t border-[#e4e6eb] dark:border-[#2d2e2f] bg-white/95 dark:bg-[#18191a]/95 backdrop-blur-md px-4 flex items-center justify-between z-10 select-none pb-safe">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          onChange={handleImageFiles}
          className="hidden"
        />

        {/* Left: Quick Action Icons */}
        <div className="flex items-center gap-2">
          {/* Photo Button */}
          {postType === 'TEXT' && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingMedia || mediaUrls.length >= 10}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/60 transition-all active:scale-95 cursor-pointer"
            >
              {isUploadingMedia ? (
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
              ) : (
                <ImageIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              )}
              <span>
                {isUploadingMedia
                  ? 'Uploading...'
                  : locale === 'bn'
                    ? 'ছবি যুক্ত'
                    : 'Photo'}
              </span>
              {mediaUrls.length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                  {mediaUrls.length}
                </span>
              )}
            </button>
          )}

          {/* Feeling Button */}
          <button
            type="button"
            onClick={() => setShowFeelingPicker((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60 transition-all active:scale-95 cursor-pointer"
          >
            <Smile className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>
              {selectedFeeling
                ? selectedFeeling.label
                : locale === 'bn'
                  ? 'অনুভূতি'
                  : 'Feeling'}
            </span>
          </button>
        </div>

        {/* Right: Circular Character Progress Ring (Twitter/Threads style) */}
        <div className="flex items-center gap-2">
          {postType === 'TEXT' && (
            <div className="flex items-center gap-1.5">
              <svg className="w-5 h-5 -rotate-90 transform" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r={radius}
                  className="stroke-gray-200 dark:stroke-gray-700"
                  strokeWidth="2.5"
                  fill="transparent"
                />
                <circle
                  cx="12"
                  cy="12"
                  r={radius}
                  className={cn(
                    'transition-all duration-150',
                    progress > 0.9
                      ? 'stroke-rose-500'
                      : progress > 0.7
                        ? 'stroke-amber-500'
                        : 'stroke-primary-500'
                  )}
                  strokeWidth="2.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="text-[11px] font-bold text-[#8e8e93] tabular-nums">
                {charLength > 4500
                  ? charLimit - charLength
                  : `${charLength}/${charLimit}`}
              </span>
            </div>
          )}

          {postType === 'DUA' && (
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              {locale === 'bn' ? '🌙 পবিত্র দু’আ' : '🌙 Authentic Dua'}
            </span>
          )}

          {postType === 'BLOOD_REQUEST' && (
            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
              {locale === 'bn' ? '🩸 রক্তদানের আবেদন' : '🩸 Blood Request'}
            </span>
          )}
        </div>
      </footer>
    </div>
  );

  return createPortal(pageContent, document.body);
}
