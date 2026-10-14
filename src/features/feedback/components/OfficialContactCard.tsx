'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Check, Copy, ExternalLink, ShieldCheck, MessageSquare, Clock, Sparkles } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { ROUTES } from '@/constants/routes';

export function OfficialContactCard() {
  const { locale } = useLanguage();
  const [copied, setCopied] = useState(false);

  const officialEmail = 'connect.peacetweet@gmail.com';
  const officialUsername = 'peacetweet';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(officialEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="bg-white dark:bg-[#242526] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs overflow-hidden transition-all">
      {/* Top Banner / Header */}
      <div className="bg-gradient-to-br from-primary-600 to-teal-700 p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <h2 className="text-base font-bold leading-snug">
              {locale === 'bn' ? 'অফিসিয়াল সহায়তা ও যোগাযোগ' : 'Official Support & Contact'}
            </h2>
            <p className="text-xs text-white/80 mt-0.5">
              {locale === 'bn'
                ? 'PeaceTweet টিমের সাথে সরাসরি যোগাযোগের মাধ্যম'
                : 'Direct channels to reach the PeaceTweet team'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Business Email Item */}
        <div className="p-3.5 rounded-xl bg-gray-50/80 dark:bg-[#18191a] border border-gray-100 dark:border-gray-800/80">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400 block">
                  {locale === 'bn' ? 'অফিসিয়াল বিজনেস ইমেইল' : 'Official Business Email'}
                </span>
                <a
                  href={`mailto:${officialEmail}?subject=PeaceTweet%20Inquiry`}
                  className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 break-all transition-colors"
                >
                  {officialEmail}
                </a>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              title={locale === 'bn' ? 'ইমেইল কপি করুন' : 'Copy email'}
              className="p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-white dark:hover:bg-[#242526] border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all shrink-0 cursor-pointer"
            >
              {copied ? (
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">{locale === 'bn' ? 'কপি হয়েছে' : 'Copied'}</span>
                </div>
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Official Account Item */}
        <div className="p-3.5 rounded-xl bg-gray-50/80 dark:bg-[#18191a] border border-gray-100 dark:border-gray-800/80">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400 block">
                  {locale === 'bn' ? 'অফিসিয়াল প্রোফাইল' : 'Official Profile'}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Link
                    href={ROUTES.USER_PROFILE(officialUsername)}
                    className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    @{officialUsername}
                  </Link>
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                    {locale === 'bn' ? 'ভেরিফাইড' : 'Verified'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Link
                href={ROUTES.USER_PROFILE(officialUsername)}
                className="p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-white dark:hover:bg-[#242526] border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all cursor-pointer"
                title={locale === 'bn' ? 'প্রোফাইল দেখুন' : 'Visit Profile'}
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
              <Link
                href={`/messages?user=${officialUsername}`}
                className="p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-white dark:hover:bg-[#242526] border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all cursor-pointer"
                title={locale === 'bn' ? 'মেসেজ পাঠান' : 'Direct Message'}
              >
                <MessageSquare className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* SLA & Assurance */}
        <div className="space-y-2 pt-1 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-primary-600 shrink-0" />
            <span>
              {locale === 'bn'
                ? 'রেসপন্স সময়: সাধারণত ২৪ ঘণ্টার মধ্যে টিম পর্যালোচনা করে।'
                : 'Response time: Reviewed by our team within 24 hours.'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>
              {locale === 'bn'
                ? 'আপনার দেওয়া তথ্য ও মতামত সম্পূর্ণ নিরাপদ ও সুরক্ষিত।'
                : 'All submissions are encrypted, safe, and confidential.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
