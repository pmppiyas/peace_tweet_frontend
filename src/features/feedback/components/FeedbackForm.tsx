'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Lightbulb,
  Bug,
  Flag,
  Briefcase,
  MessageSquare,
  Image as ImageIcon,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Send,
  Info,
} from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { FeedbackType } from '../types/feedback.types';
import { useSubmitFeedback } from '../hooks/useFeedback';
import { uploadsApi } from '@/features/uploads/api/uploads.api';
import { cn } from '@/lib/utils/cn';

interface CategoryOption {
  type: FeedbackType;
  labelBn: string;
  labelEn: string;
  descBn: string;
  descEn: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORIES: CategoryOption[] = [
  {
    type: 'SUGGESTION',
    labelBn: 'পরামর্শ ও আইডিয়া',
    labelEn: 'Suggestion',
    descBn: 'নতুন কোনো ফিচার বা উন্নতির প্রস্তাব',
    descEn: 'Feature requests or improvements',
    icon: Lightbulb,
  },
  {
    type: 'BUG',
    labelBn: 'কারিগরি সমস্যা (বাগ)',
    labelEn: 'Bug Report',
    descBn: 'কোনো ফিচার কাজ না করলে বা ত্রুটি হলে',
    descEn: 'Something is broken or not working',
    icon: Bug,
  },
  {
    type: 'REPORT_CONTENT',
    labelBn: 'অভিযোগ ও রিপোর্ট',
    labelEn: 'Content Violation',
    descBn: 'ভুল দোয়া, আপত্তিকর বা স্প্যাম পোস্ট',
    descEn: 'Incorrect dua, offensive or spam post',
    icon: Flag,
  },
  {
    type: 'BUSINESS',
    labelBn: 'ব্যবসায়িক যোগাযোগ',
    labelEn: 'Business Inquiry',
    descBn: 'পার্টনারশিপ, স্পনসরশিপ বা প্রাতিষ্ঠানিক',
    descEn: 'Partnership or corporate inquiries',
    icon: Briefcase,
  },
  {
    type: 'OTHER',
    labelBn: 'অন্যান্য জিজ্ঞাসা',
    labelEn: 'Other',
    descBn: 'সাধারণ কোনো মতামত বা প্রশ্ন',
    descEn: 'General thoughts or questions',
    icon: MessageSquare,
  },
];

export function FeedbackForm() {
  const { locale } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const submitFeedbackMutation = useSubmitFeedback();

  const [selectedType, setSelectedType] = useState<FeedbackType>('SUGGESTION');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill user email if authenticated
  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [user?.email, email]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (attachments.length + files.length > 5) {
      setFormError(
        locale === 'bn'
          ? 'সর্বোচ্চ ৫টি ছবি যুক্ত করা যাবে।'
          : 'You can upload a maximum of 5 images.'
      );
      return;
    }

    setIsUploading(true);
    setFormError(null);

    try {
      const fileList = Array.from(files);
      const newUrls = await uploadsApi.uploadMultipleImages(fileList);
      if (newUrls.length > 0) {
        setAttachments((prev) => [...prev, ...newUrls]);
      } else {
        setFormError(
          locale === 'bn'
            ? 'ছবি আপলোড ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
            : 'Image upload failed. Please try again.'
        );
      }
    } catch {
      setFormError(
        locale === 'bn'
          ? 'ছবি আপলোডে সমস্যা হয়েছে।'
          : 'Error occurred while uploading image.'
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!subject.trim()) {
      setFormError(
        locale === 'bn'
          ? 'অনুগ্রহ করে একটি সংক্ষিপ্ত বিষয় বা শিরোনাম লিখুন।'
          : 'Please enter a subject or title.'
      );
      return;
    }

    if (!message.trim() || message.trim().length < 10) {
      setFormError(
        locale === 'bn'
          ? 'অনুগ্রহ করে অন্তত ১০ অক্ষরে বিস্তারিত বিবরণ লিখুন।'
          : 'Please provide at least 10 characters of detailed message.'
      );
      return;
    }

    // Capture safe browser/client metadata
    const metadata: Record<string, unknown> = {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      language: typeof navigator !== 'undefined' ? navigator.language : '',
      screen:
        typeof window !== 'undefined'
          ? `${window.innerWidth}x${window.innerHeight}`
          : '',
      submittedAt: new Date().toISOString(),
    };

    try {
      await submitFeedbackMutation.mutateAsync({
        type: selectedType,
        subject: subject.trim(),
        message: message.trim(),
        email: email.trim() || undefined,
        targetUrl: targetUrl.trim() || undefined,
        attachments,
        metadata,
      });

      setIsSuccess(true);
      // Reset fields
      setSubject('');
      setMessage('');
      setTargetUrl('');
      setAttachments([]);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to submit feedback';
      setFormError(
        locale === 'bn'
          ? 'মতামত পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
          : errorMsg || 'Something went wrong. Please try again.'
      );
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white dark:bg-[#242526] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 text-center space-y-5 shadow-xs">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
            {locale === 'bn'
              ? 'আপনার মতামত সফলভাবে জমা হয়েছে!'
              : 'Feedback Submitted Successfully!'}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {locale === 'bn'
              ? 'PeaceTweet-কে আরও সুন্দর ও সমৃদ্ধ করতে আপনার সহযোগিতা আমাদের কাছে অত্যন্ত মূল্যবান। আমাদের টিম দ্রুত আপনার বার্তাটি পর্যালোচনা করবে।'
              : 'Thank you for helping us make PeaceTweet better. Our core team will carefully review your submission.'}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#18191a] text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto border border-gray-100 dark:border-gray-800">
          {locale === 'bn'
            ? 'জরুরি কোনো বিষয়ে যোগাযোগ করতে সরাসরি connect.peacetweet@gmail.com এ ইমেইল করতে পারেন।'
            : 'For urgent inquiries, feel free to email connect.peacetweet@gmail.com directly.'}
        </div>

        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsSuccess(false)}
            className="text-xs font-semibold"
          >
            {locale === 'bn' ? 'আরেকটি মতামত পাঠান' : 'Submit Another Feedback'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#242526] rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-6 shadow-xs">
      <div className="mb-5">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
          {locale === 'bn' ? 'মতামত বা রিপোর্ট ফর্ম' : 'Feedback & Report Form'}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {locale === 'bn'
            ? 'নিচের অপশনগুলো থেকে আপনার প্রয়োজনীয় বিষয় নির্বাচন করে বিস্তারিত লিখুন।'
            : 'Select the appropriate category and share the details below.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Category Picker Chips */}
        <div>
          <label className="block text-xs font-bold text-[#050505] dark:text-[#e4e6eb] mb-2">
            {locale === 'bn' ? 'ক্যাটাগরি নির্বাচন করুন' : 'Select Category'} *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedType === cat.type;
              return (
                <button
                  type="button"
                  key={cat.type}
                  onClick={() => setSelectedType(cat.type)}
                  className={cn(
                    'flex flex-col items-center text-center p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer select-none',
                    isSelected
                      ? 'border-primary-500 bg-primary-50/70 dark:bg-primary-950/40 shadow-2xs ring-1 ring-primary-500/30'
                      : 'border-[#e4e6eb] dark:border-[#393a3b] bg-white dark:bg-[#18191a] hover:bg-[#f0f2f5] dark:hover:bg-[#242526]'
                  )}
                >
                  <div
                    className={cn(
                      'w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 mb-2 transition-colors',
                      isSelected
                        ? 'bg-primary-500 text-white shadow-xs'
                        : 'bg-[#f0f2f5] dark:bg-[#3a3b3c] text-[#65676b] dark:text-[#b0b3b8]'
                    )}
                  >
                    <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </div>
                  <span
                    className={cn(
                      'block text-xs sm:text-[13px] font-bold transition-colors leading-tight',
                      isSelected
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-[#050505] dark:text-[#e4e6eb]'
                    )}
                  >
                    {locale === 'bn' ? cat.labelBn : cat.labelEn}
                  </span>
                  <span className="block text-[11px] text-[#65676b] dark:text-[#b0b3b8] mt-1 line-clamp-2 leading-relaxed">
                    {locale === 'bn' ? cat.descBn : cat.descEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Context Tip based on selection */}
        {selectedType === 'REPORT_CONTENT' && (
          <div className="p-3 rounded-xl bg-primary-50/70 dark:bg-primary-950/30 border border-primary-200/80 dark:border-primary-800/50 flex items-start gap-2.5 text-xs text-primary-900 dark:text-primary-200">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-primary-600 dark:text-primary-400" />
            <div>
              <p className="font-semibold">
                {locale === 'bn'
                  ? 'দোয়া বা পোস্ট সংক্রান্ত রিপোর্টের নির্দেশিকা:'
                  : 'Content reporting guideline:'}
              </p>
              <p className="text-[11px] mt-0.5 text-primary-800/90 dark:text-primary-300/90">
                {locale === 'bn'
                  ? 'কোনো দোয়াতে হাদিস বা অর্থের অসঙ্গতি থাকলে অথবা কোনো অনুপযুক্ত পোস্ট চোখে পড়লে নিচের ফিল্ডে সেই পোস্টের লিঙ্ক বা আইডি উল্লেখ করুন।'
                  : 'If you noticed errors in a Dua translation/source or found inappropriate content, please paste the post link or ID below.'}
              </p>
            </div>
          </div>
        )}

        {selectedType === 'BUG' && (
          <div className="p-3 rounded-xl bg-primary-50/70 dark:bg-primary-950/30 border border-primary-200/80 dark:border-primary-800/50 flex items-start gap-2.5 text-xs text-primary-900 dark:text-primary-200">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-primary-600 dark:text-primary-400" />
            <div>
              <p className="font-semibold">
                {locale === 'bn'
                  ? 'কারিগরি সমস্যা দ্রুত সমাধানের টিপস:'
                  : 'Tips for faster bug resolution:'}
              </p>
              <p className="text-[11px] mt-0.5 text-primary-800/90 dark:text-primary-300/90">
                {locale === 'bn'
                  ? 'সমস্যাটি কীভাবে ঘটেছে তা ধাপে ধাপে লিখলে এবং সাথে স্ক্রিনশট যুক্ত করলে আমাদের ডেভেলপার টিম দ্রুত তা ফিক্স করতে পারবে।'
                  : 'Describing the steps to reproduce along with screenshots helps our engineering team fix it much faster.'}
              </p>
            </div>
          </div>
        )}

        {/* Target URL or Post ID (Shown prominently when REPORT_CONTENT) */}
        {selectedType === 'REPORT_CONTENT' && (
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              {locale === 'bn' ? 'পোস্ট বা কনটেন্টের লিংক / আইডি (ঐচ্ছিক)' : 'Content URL or ID (Optional)'}
            </label>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="e.g. https://peacetweet.com/duas/123 or post id"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#18191a] text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-hidden focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
            />
          </div>
        )}

        {/* Email Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              {locale === 'bn' ? 'আপনার যোগাযোগের ইমেইল' : 'Contact Email'}
              {!isAuthenticated && (
                <span className="text-[11px] font-normal text-gray-500 dark:text-gray-400 ml-1">
                  ({locale === 'bn' ? 'আপডেট পাওয়ার জন্য' : 'for reply & updates'})
                </span>
              )}
            </label>
            {isAuthenticated && (
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                {locale === 'bn' ? 'লগইনকৃত অ্যাকাউন্ট' : 'Logged in'}
              </span>
            )}
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#18191a] text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-hidden focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
            {locale === 'bn' ? 'বিষয় / শিরোনাম' : 'Subject / Summary'} *
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={
              selectedType === 'SUGGESTION'
                ? locale === 'bn'
                  ? 'যেমন: দোয়া সেভ করার পর ক্যাটাগরি ফোল্ডার তৈরি করার অপশন...'
                  : 'e.g. Add category folders for saved duas...'
                : selectedType === 'BUG'
                ? locale === 'bn'
                  ? 'যেমন: ডার্ক মোডে নোটিফিকেশন আইকন ঠিকমতো দেখা যাচ্ছে না...'
                  : 'e.g. Notification icon invisible in dark mode...'
                : locale === 'bn'
                ? 'সংক্ষেপে বিষয়টি লিখুন...'
                : 'Briefly summarize the topic...'
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#18191a] text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-hidden focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
          />
        </div>

        {/* Message */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              {locale === 'bn' ? 'বিস্তারিত বিবরণ' : 'Detailed Description'} *
            </label>
            <span
              className={cn(
                'text-[10px]',
                message.length < 10
                  ? 'text-gray-400'
                  : message.length > 1800
                  ? 'text-rose-500 font-semibold'
                  : 'text-gray-400'
              )}
            >
              {message.length} / 2000
            </span>
          </div>
          <textarea
            required
            rows={5}
            maxLength={2000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              selectedType === 'SUGGESTION'
                ? locale === 'bn'
                  ? 'আপনার পরামর্শটি কীভাবে ব্যবহারকারীদের উপকারে আসতে পারে এবং এটি কীভাবে দেখতে সুন্দর হতে পারে তা শেয়ার করুন...'
                  : 'Describe how this feature would benefit users and how it should work...'
                : selectedType === 'BUG'
                ? locale === 'bn'
                  ? 'সমস্যাটি কোন পেজে হচ্ছে? কী ক্লিক করার পর এমন হলো? ত্রুটিটির বিস্তারিত জানান...'
                  : 'On which page did this happen? What steps did you take? Explain what you expected vs what occurred...'
                : locale === 'bn'
                ? 'আপনার বক্তব্য বিস্তারিতভাবে লিখুন...'
                : 'Share full details here...'
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#18191a] text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-hidden focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-y"
          />
        </div>

        {/* Screenshot / Image Attachments */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
            {locale === 'bn' ? 'স্ক্রিনশট বা ছবি সংযুক্ত করুন (ঐচ্ছিক)' : 'Screenshots or Attachments (Optional)'}
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-2.5">
            {attachments.map((url, idx) => (
              <div
                key={idx}
                className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 group shrink-0"
              >
                <Image
                  src={url}
                  alt={`Attachment ${idx + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeAttachment(idx)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {attachments.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400 flex flex-col items-center justify-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 bg-gray-50/50 dark:bg-[#18191a] transition-all cursor-pointer disabled:opacity-50"
              >
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-[10px] font-semibold">
                      {locale === 'bn' ? 'যোগ করুন' : 'Add Image'}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5">
            {locale === 'bn'
              ? 'সর্বোচ্চ ৫টি ছবি (PNG, JPG, WebP) আপলোড করা যাবে।'
              : 'Up to 5 images (PNG, JPG, WebP) allowed.'}
          </p>
        </div>

        {/* Form Error Alert */}
        {formError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            {locale === 'bn'
              ? 'জমা দেওয়ার মাধ্যমে আপনি PeaceTweet নির্দেশাবলী মেনে নিচ্ছেন।'
              : 'By submitting, you agree to PeaceTweet platform guidelines.'}
          </p>

          <Button
            type="submit"
            isLoading={submitFeedbackMutation.isPending || isUploading}
            disabled={submitFeedbackMutation.isPending || isUploading || !subject.trim() || !message.trim()}
            className="flex items-center gap-1.5 font-bold text-xs shrink-0 px-5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{locale === 'bn' ? 'জমা দিন' : 'Submit Feedback'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
