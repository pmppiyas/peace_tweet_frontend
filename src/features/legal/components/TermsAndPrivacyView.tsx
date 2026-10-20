'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ShieldAlert,
  Lock,
  Scale,
  FileText,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  BookOpen,
  ArrowLeft,
  Search,
  EyeOff,
  UserCheck,
  Server,
  Share2,
  Trash2,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { useLanguage } from '@/providers/LanguageProvider';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/constants/routes';

export type LegalTab = 'terms' | 'privacy';

export function TermsAndPrivacyView() {
  const { locale } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTab = (searchParams?.get('tab') as LegalTab) || 'terms';
  const [activeTab, setActiveTab] = useState<LegalTab>(
    initialTab === 'privacy' ? 'privacy' : 'terms'
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Sync state with URL params
  useEffect(() => {
    const tabParam = searchParams?.get('tab') as LegalTab;
    if (tabParam === 'privacy' || tabParam === 'terms') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: LegalTab) => {
    setActiveTab(tab);
    router.replace(`/terms?tab=${tab}`, { scroll: false });
  };

  // Filter sections if search is entered
  const isMatch = (text: string) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#18191a] py-6 sm:py-10 text-[#050505] dark:text-[#e4e6eb]">
      <Container
        size="2xl"
        className="px-4 sm:px-6 lg:px-8 2xl:px-10 max-w-7xl 2xl:max-w-[1600px]"
      >
        {/* Top Back Nav & Brand */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-[#242526] px-4 py-2 text-xs sm:text-sm font-bold text-[#050505] dark:text-[#e4e6eb] shadow-2xs border border-[#e4e6eb] dark:border-[#393a3b] hover:bg-[#e4e6eb]/80 dark:hover:bg-[#3a3b3c] transition-all"
          >
            <ArrowLeft className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            <span>{locale === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}</span>
          </Link>

          <span className="text-xs font-semibold text-[#65676b] dark:text-[#b0b3b8]">
            {locale === 'bn'
              ? 'সর্বশেষ হালনাগাদ: অক্টোবর ২০২৬'
              : 'Last Updated: October 2026'}
          </span>
        </div>

        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-teal-800 p-6 sm:p-10 text-white shadow-xl mb-8">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-xs font-bold text-white mb-3">
              <Scale className="h-3.5 w-3.5" />
              <span>
                {locale === 'bn'
                  ? 'শান্তিপূর্ণ ও ইসলামিক মূল্যবোধের প্ল্যাটফর্ম'
                  : 'Peaceful & Islamic Values Platform'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {locale === 'bn'
                ? 'ব্যবহারের শর্তাবলী ও নীতিমালা'
                : 'Terms of Service & Privacy Policy'}
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-white/90 leading-relaxed">
              {locale === 'bn'
                ? 'পিসটুইট (PeaceTweet) একটি শালীন, নিরাপদ এবং আত্মশুদ্ধিমূলক সামাজিক যোগাযোগ মাধ্যম। প্ল্যাটফর্মের পরিবেশ পবিত্র ও কলুষমুক্ত রাখতে আমাদের নীতিমালা মেনে চলা সকল ব্যবহারকারীর জন্য আবশ্যক।'
                : 'PeaceTweet is a modest, safe, and spiritually conscious social platform. Adherence to our community standards and integrity guidelines is mandatory for all members.'}
            </p>
          </div>

          <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 pointer-events-none">
            <Scale className="h-80 w-80" />
          </div>
        </div>

        {/* Interactive Tab Switcher & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-white dark:bg-[#242526] p-2 sm:p-2.5 rounded-2xl border border-[#e4e6eb] dark:border-[#393a3b] shadow-2xs">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-1.5 sm:w-auto">
            <button
              type="button"
              onClick={() => handleTabChange('terms')}
              className={cn(
                'flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer',
                activeTab === 'terms'
                  ? 'bg-primary-500 text-white shadow-xs'
                  : 'text-[#65676b] dark:text-[#b0b3b8] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]'
              )}
            >
              <FileText className="h-4 w-4" />
              <span>
                {locale === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms of Service'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('privacy')}
              className={cn(
                'flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer',
                activeTab === 'privacy'
                  ? 'bg-primary-500 text-white shadow-xs'
                  : 'text-[#65676b] dark:text-[#b0b3b8] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]'
              )}
            >
              <Lock className="h-4 w-4" />
              <span>
                {locale === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
              </span>
            </button>
          </div>

          {/* Quick Search in Policies */}
          <div className="relative sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#65676b] dark:text-[#b0b3b8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                locale === 'bn'
                  ? 'নীতিমালায় খুঁজুন...'
                  : 'Search in policies...'
              }
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-[#f0f2f5] dark:bg-[#3a3b3c] border border-transparent focus:border-primary-500 focus:outline-hidden transition-colors"
            />
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* TAB 1: TERMS & COMMUNITY GUIDELINES                           */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {activeTab === 'terms' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* STRICT ZERO TOLERANCE ALERT BANNER */}
            <div className="rounded-2xl border-2 border-red-500/80 bg-red-50 dark:bg-red-950/40 p-4 sm:p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-red-600 p-2 text-white shrink-0 mt-0.5">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-red-700 dark:text-red-400">
                    {locale === 'bn'
                      ? 'অশ্লীলতা ও কুরুচিপূর্ণ কন্টেন্টে জিরো-টলারেন্স নীতি'
                      : 'Zero-Tolerance Policy on Vulgar & Obscene Content'}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-red-900/90 dark:text-red-200/90 leading-relaxed font-medium">
                    {locale === 'bn'
                      ? 'পিসটুইটে কোনো প্রকার নগ্নতা (Nudity), অর্ধনগ্ন বা যৌন ইঙ্গিতপূর্ণ ছবি/ভিডিও, অশ্লীল বা কুরুচিপূর্ণ ভাষা পোস্ট করা সম্পূর্ণ নিষিদ্ধ। এই নিয়ম লঙ্ঘনকারী কন্টেন্ট মুহূর্তেই অপসারণ করা হবে এবং সংশ্লিষ্ট অ্যাকাউন্ট স্থায়ীভাবে ব্যান (Permanent Ban) করা হবে।'
                      : 'PeaceTweet strictly prohibits nudity, sexually explicit or provocative media, vulgarity, and indecent language. Any violating post will be permanently deleted without prior warning, and the offending account will be permanently banned.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1: Content Standard */}
            {isMatch('শালীনতা অশ্লীলতা nudity vulgarity') && (
              <div className="rounded-2xl border border-[#e4e6eb] bg-white p-5 sm:p-6 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#e4e6eb] dark:border-[#393a3b] mb-4">
                  <EyeOff className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-[#e4e6eb]">
                    {locale === 'bn'
                      ? '১. কন্টেন্ট মানদণ্ড ও শালীনতা রক্ষা'
                      : '1. Content Integrity & Modesty Standards'}
                  </h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-[#65676b] dark:text-[#b0b3b8] leading-relaxed">
                  <p>
                    {locale === 'bn'
                      ? 'পিসটুইট একটি ইসলামিক পরিবেশ বজায় রাখার উদ্দেশ্যে প্রতিষ্ঠিত। তাই নিম্নলিখিত কন্টেন্ট শেয়ার করা সম্পূর্ণভাবে নিষিদ্ধ:'
                      : 'PeaceTweet was created to foster an upright Islamic online environment. The following contents are strictly forbidden:'}
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>
                      <strong className="text-[#050505] dark:text-[#e4e6eb]">
                        {locale === 'bn'
                          ? 'নগ্নতা ও অর্ধনগ্নতা:'
                          : 'Nudity & Partial Nudity:'}
                      </strong>{' '}
                      {locale === 'bn'
                        ? 'পুরুষ বা মহিলার সতর উন্মুক্তকারী কোনো ছবি, রিল বা ভিডিও আপলোড করা যাবে না।'
                        : 'No photos, reels, or videos revealing private parts or provocative attire.'}
                    </li>
                    <li>
                      <strong className="text-[#050505] dark:text-[#e4e6eb]">
                        {locale === 'bn'
                          ? 'অশ্লীল ভাষা ও গালিগালাজ:'
                          : 'Vulgar Language & Profanity:'}
                      </strong>{' '}
                      {locale === 'bn'
                        ? 'পোস্টের ক্যাপশনে বা কমেন্টে কুরুচিপূর্ণ শব্দ, দ্ব্যর্থবোধক ইঙ্গিত বা অশোভন অঙ্গভঙ্গি প্রদর্শন করা যাবে না।'
                        : 'No obscene words, sexual innuendos, slurs, or abusive expressions.'}
                    </li>
                    <li>
                      <strong className="text-[#050505] dark:text-[#e4e6eb]">
                        {locale === 'bn'
                          ? 'মদ্যপান, জুয়া ও অনৈতিক প্রমোশন:'
                          : 'Intoxicants, Gambling & Vice:'}
                      </strong>{' '}
                      {locale === 'bn'
                        ? 'মাদক, জুয়া বা কোনো অনৈসলামিক কাজের প্রচারণা বা উৎসাহ প্রদানকারী কন্টেন্ট।'
                        : 'Promotion or encouragement of alcohol, gambling, fraud, or unlawful activities.'}
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Section 2: Islamic Authenticity */}
            {isMatch('ইসলাম হাদিস কুরআন authentic quran hadith') && (
              <div className="rounded-2xl border border-[#e4e6eb] bg-white p-5 sm:p-6 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#e4e6eb] dark:border-[#393a3b] mb-4">
                  <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-[#e4e6eb]">
                    {locale === 'bn'
                      ? '২. ইসলামিক তথ্যের নির্ভুলতা ও পবিত্রতা'
                      : '2. Islamic Truthfulness & Scholarly Accuracy'}
                  </h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-[#65676b] dark:text-[#b0b3b8] leading-relaxed">
                  <p>
                    {locale === 'bn'
                      ? 'দ্বীনি তথ্যের মর্যাদা রক্ষায় যেকোনো হাদিস বা দোয়া পোস্ট করার ক্ষেত্রে নির্ভরযোগ্য রেফারেন্স থাকা আবশ্যক:'
                      : 'To uphold the sanctity of religious knowledge, posting authentic references is required:'}
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>
                      {locale === 'bn'
                        ? 'জাল ও ভিত্তিহীন হাদিস অথবা বানোয়াট আমল প্রচার করা যাবে না।'
                        : 'Do not propagate fabricated, unverified Hadiths, or baseless rituals.'}
                    </li>
                    <li>
                      {locale === 'bn'
                        ? 'কোনো মুসলিমকে অনর্থক কাফের ফতোয়া দেওয়া, দলীয় হিংসা বা সাম্প্রদায়িক বিদ্বেষমূলক আলোচনা করা যাবে না।'
                        : 'No sectarian hatred, declaring others disbelievers (takfir), or spreading communal discord.'}
                    </li>
                    <li>
                      {locale === 'bn'
                        ? 'পিসটুইট মডারেশন টিম বিভ্রান্তিকর তথ্য বা ভুল ইসলামিক ব্যাখ্যার পোস্ট সরিয়ে ফেলার অধিকার সংরক্ষণ করে।'
                        : 'PeaceTweet moderation team reserves the right to remove any post containing misleading religious interpretations.'}
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Section 3: Harassment and Cyberbullying */}
            {isMatch('বুলিং হেনস্তা harassment bullying respectful') && (
              <div className="rounded-2xl border border-[#e4e6eb] bg-white p-5 sm:p-6 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#e4e6eb] dark:border-[#393a3b] mb-4">
                  <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-[#e4e6eb]">
                    {locale === 'bn'
                      ? '৩. পারস্পরিক আচরণ ও হয়রানি প্রতিরোধ'
                      : '3. Community Conduct & Anti-Harassment'}
                  </h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-[#65676b] dark:text-[#b0b3b8] leading-relaxed">
                  <p>
                    {locale === 'bn'
                      ? 'সকল ব্যবহারকারীর সম্মান ও শালীনতা রক্ষা করা আমাদের দায়িত্ব:'
                      : 'Maintaining honor and mutual respect is our top commitment:'}
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>
                      {locale === 'bn'
                        ? 'মেসেঞ্জারে অথবা পোস্টের কমেন্টে কাউকে উত্ত্যক্ত (Harassment), ব্ল্যাকমেইল বা অযাচিত ব্যক্তিগত বার্তা পাঠানো নিষিদ্ধ।'
                        : 'Stalking, cyberbullying, unsolicited inappropriate DMs, or harassment in comments is strictly forbidden.'}
                    </li>
                    <li>
                      {locale === 'bn'
                        ? 'ব্যবহারকারীর অভিযোগ প্রমাণিত হলে অবিলম্বে সংশ্লিষ্ট ব্যবহারকারীকে প্ল্যাটফর্ম থেকে বহিষ্কার করা হবে।'
                        : 'Verified harassment complaints will result in swift account termination.'}
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Section 4: Emergency Blood Requests */}
            {isMatch('রক্তদান রক্ত blood donation emergency') && (
              <div className="rounded-2xl border border-[#e4e6eb] bg-white p-5 sm:p-6 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#e4e6eb] dark:border-[#393a3b] mb-4">
                  <HeartHandshake className="h-5 w-5 text-red-500" />
                  <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-[#e4e6eb]">
                    {locale === 'bn'
                      ? '৪. জরুরি রক্তদান অনুরোধের বিশ্বস্ততা'
                      : '4. Emergency Blood Donation Integrity'}
                  </h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-[#65676b] dark:text-[#b0b3b8] leading-relaxed">
                  <p>
                    {locale === 'bn'
                      ? 'রক্তদান সেবাটি সম্পূর্ণ মানবিক ও সওয়াবের উদ্দেশ্যে পরিচালিত:'
                      : 'Our blood donation network operates strictly on humanitarian and spiritual values:'}
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>
                      {locale === 'bn'
                        ? 'কোনো ভুয়া তথ্য বা বাণিজ্যিক স্বার্থে রক্ত চেয়ে পোস্ট করা যাবে না।'
                        : 'No fraudulent medical calls or commercial exploitation of blood requests.'}
                    </li>
                    <li>
                      {locale === 'bn'
                        ? 'যেকোনো প্রকার আর্থিক লেনদেন বা দালালি কার্যকলাপ সম্পূর্ণ নিষিদ্ধ।'
                        : 'Buying, selling, or financial brokering of blood is prohibited.'}
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Section 5: Account & Moderation Action */}
            {isMatch('ব্যান শাস্তি একাউন্ট ban moderation account') && (
              <div className="rounded-2xl border border-[#e4e6eb] bg-white p-5 sm:p-6 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#e4e6eb] dark:border-[#393a3b] mb-4">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-[#e4e6eb]">
                    {locale === 'bn'
                      ? '৫. মডারেশন ব্যবস্থা ও শাস্তিমূলক পদক্ষেপ'
                      : '5. Moderation Protocols & Penalties'}
                  </h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-[#65676b] dark:text-[#b0b3b8] leading-relaxed">
                  <p>
                    {locale === 'bn'
                      ? 'নীতিমালা ভঙ্গের তীব্রতার ওপর ভিত্তি করে নিম্নলিখিত পদক্ষেপ গ্রহণ করা হবে:'
                      : 'Depending on the severity of the violation, actions taken include:'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="rounded-xl border border-amber-300 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/20 p-3">
                      <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block mb-1">
                        {locale === 'bn' ? 'সতর্কবার্তা' : 'Warning'}
                      </span>
                      <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
                        {locale === 'bn'
                          ? 'সাধারণ ভুল বা ছোটখাটো অসাবধানতার ক্ষেত্রে কন্টেন্ট মুছে সতর্কতা জারি।'
                          : 'Content removal with gentle guidance for minor infractions.'}
                      </p>
                    </div>

                    <div className="rounded-xl border border-orange-300 bg-orange-50/60 dark:border-orange-900/40 dark:bg-orange-950/20 p-3">
                      <span className="text-xs font-bold text-orange-800 dark:text-orange-300 block mb-1">
                        {locale === 'bn' ? 'সাময়িক স্থগিত' : 'Suspension'}
                      </span>
                      <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
                        {locale === 'bn'
                          ? 'উস্কানি বা অবাধ্যতার ক্ষেত্রে ৭ থেকে ৩০ দিনের জন্য পোস্ট ও মেসেজ বন্ধ।'
                          : 'Temporary 7-30 day ban from posting and messaging for repeat issues.'}
                      </p>
                    </div>

                    <div className="rounded-xl border border-red-300 bg-red-50/60 dark:border-red-900/40 dark:bg-red-950/20 p-3">
                      <span className="text-xs font-bold text-red-800 dark:text-red-300 block mb-1">
                        {locale === 'bn' ? 'স্থায়ী বহিষ্কার' : 'Permanent Ban'}
                      </span>
                      <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
                        {locale === 'bn'
                          ? 'অশ্লীলতা, নগ্নতা বা গুরুতর অপরাধে তাৎক্ষণিক স্থায়ীভাবে একাউন্ট বন্ধ।'
                          : 'Immediate, irreversible account ban for vulgarity, pornography, or abuse.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* TAB 2: PRIVACY POLICY                                         */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {activeTab === 'privacy' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Overview Banner */}
            <div className="rounded-2xl border border-teal-200 bg-teal-50 dark:border-teal-900/40 dark:bg-teal-950/20 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-teal-600 p-2 text-white shrink-0">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-teal-800 dark:text-teal-300">
                    {locale === 'bn'
                      ? 'আপনার ব্যক্তিগত তথ্যের পূর্ণ নিরাপত্তা ও গোপনীয়তা'
                      : 'Complete Privacy & Security for Your Personal Data'}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-teal-900/80 dark:text-teal-200/80 leading-relaxed font-medium">
                    {locale === 'bn'
                      ? 'পিসটুইট আপনার ব্যক্তিগত তথ্য কখনোই কোনো ৩য় পক্ষের কাছে বিক্রি বা অপব্যবহার করে না। সমস্ত ডাটা আধুনিক ক্রিপ্টোগ্রাফিক এনক্রিপশনের মাধ্যমে সংরক্ষিত থাকে।'
                      : 'PeaceTweet never sells or misuses your personal data to any third parties. All sensitive data is safeguarded using modern cryptographic encryption.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Section 1: Info Collection */}
            {isMatch('তথ্য সংগ্রহ information collection data') && (
              <div className="rounded-2xl border border-[#e4e6eb] bg-white p-5 sm:p-6 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#e4e6eb] dark:border-[#393a3b] mb-4">
                  <Server className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-[#e4e6eb]">
                    {locale === 'bn'
                      ? '১. আমরা যেসব তথ্য সংগ্রহ করি'
                      : '1. Information We Collect'}
                  </h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-[#65676b] dark:text-[#b0b3b8] leading-relaxed">
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>
                      <strong className="text-[#050505] dark:text-[#e4e6eb]">
                        {locale === 'bn'
                          ? 'অ্যাকাউন্ট প্রোফাইল:'
                          : 'Account Profile:'}
                      </strong>{' '}
                      {locale === 'bn'
                        ? 'আপনার নাম, ইমেইল ঠিকানা, ইউজারনেম, প্রোফাইল ছবি এবং পাসওয়ার্ড (Bcrypt এনক্রিপ্টেড হ্যাশ)।'
                        : 'Your name, email address, username, avatar photo, and password (salted Bcrypt hash).'}
                    </li>
                    <li>
                      <strong className="text-[#050505] dark:text-[#e4e6eb]">
                        {locale === 'bn'
                          ? 'ইউজার কন্টেন্ট:'
                          : 'User-Generated Content:'}
                      </strong>{' '}
                      {locale === 'bn'
                        ? 'আপনার পোস্ট, কমেন্ট, শেয়ারকৃত দোয়া, রক্তদানের অনুরোধ এবং সংরক্ষিত রুটিন সময়সূচি।'
                        : 'Posts, comments, shared Duas, blood requests, and saved routine slots.'}
                    </li>
                    <li>
                      <strong className="text-[#050505] dark:text-[#e4e6eb]">
                        {locale === 'bn'
                          ? 'লোকাল স্টোরেজ প্রেফারেন্স:'
                          : 'Client Preferences:'}
                      </strong>{' '}
                      {locale === 'bn'
                        ? 'আপনার ডিভাইসে অফলাইন ডিজিটাল তাসবীহ কাউন্ট, সাউন্ড অন/অফ এবং ডার্ক/লাইট মোড সেটিংস।'
                        : 'Your offline digital tasbih count, audio sound toggles, and dark/light mode preference.'}
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Privacy Section 2: Data Usage */}
            {isMatch('ব্যবহার usage purpose') && (
              <div className="rounded-2xl border border-[#e4e6eb] bg-white p-5 sm:p-6 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#e4e6eb] dark:border-[#393a3b] mb-4">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-[#e4e6eb]">
                    {locale === 'bn'
                      ? '২. আমরা কীভাবে তথ্য ব্যবহার করি'
                      : '2. How We Utilize Your Data'}
                  </h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-[#65676b] dark:text-[#b0b3b8] leading-relaxed">
                  <p>
                    {locale === 'bn'
                      ? 'আপনার তথ্য শুধুমাত্র নিম্নলিখিত সেবার মানোন্নয়নের জন্য ব্যবহৃত হয়:'
                      : 'Your data is strictly used to deliver reliable platform features:'}
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>
                      {locale === 'bn'
                        ? 'ফিড কন্টেন্ট প্রদর্শন ও রিয়েল-টাইম মেসেঞ্জার কথোপকথন পরিচালনা করা।'
                        : 'Delivering feed streams, search queries, and instant real-time chats.'}
                    </li>
                    <li>
                      {locale === 'bn'
                        ? 'লাইক, কমেন্ট ও ফ্রেন্ড রিকোয়েস্টের লাইভ নোটিফিকেশন প্রদান করা।'
                        : 'Dispatching notifications for friend interactions and urgent blood requests.'}
                    </li>
                    <li>
                      {locale === 'bn'
                        ? 'অ্যাকাউন্টের অননুমোদিত প্রবেশ রোধ ও স্প্যাম প্রতিরোধ করা।'
                        : 'Protecting accounts from unauthorized access and filtering abusive spam.'}
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Privacy Section 3: Third-Party & Meta OAuth */}
            {isMatch('oauth facebook google meta third party') && (
              <div className="rounded-2xl border border-[#e4e6eb] bg-white p-5 sm:p-6 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#e4e6eb] dark:border-[#393a3b] mb-4">
                  <Share2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-[#e4e6eb]">
                    {locale === 'bn'
                      ? '৩. ৩য় পক্ষের সেবা ও সোশ্যাল লগইন (Meta / Google OAuth)'
                      : '3. Third-Party Integrations & Social Login'}
                  </h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-[#65676b] dark:text-[#b0b3b8] leading-relaxed">
                  <p>
                    {locale === 'bn'
                      ? 'আপনি যখন ফেসবুক বা গুগল দিয়ে লগইন করেন:'
                      : 'When you authenticate using Meta (Facebook) or Google OAuth:'}
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>
                      {locale === 'bn'
                        ? 'আমরা শুধুমাত্র আপনার মৌলিক পাবলিক প্রোফাইল নাম ও ইমেইল গ্রহণ করি।'
                        : 'We only access your basic public profile name and verified email address.'}
                    </li>
                    <li>
                      {locale === 'bn'
                        ? 'আমরা কখনোই আপনার ফেসবুক ফ্রেন্ডলিস্ট, টাইমলাইন বা ব্যক্তিগত কোনো তথ্যে প্রবেশ করি না।'
                        : 'We do NOT access your social friend lists, timeline posts, or private data.'}
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Privacy Section 4: User Data Deletion */}
            {isMatch('delete মুছে ফেলা deletion account') && (
              <div className="rounded-2xl border border-[#e4e6eb] bg-white p-5 sm:p-6 shadow-2xs dark:border-[#393a3b] dark:bg-[#242526]">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#e4e6eb] dark:border-[#393a3b] mb-4">
                  <Trash2 className="h-5 w-5 text-red-500" />
                  <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-[#e4e6eb]">
                    {locale === 'bn'
                      ? '৪. আপনার তথ্য সম্পূর্ণ মুছে ফেলার অধিকার (Data Deletion)'
                      : '4. Right to Permanent Data Deletion'}
                  </h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-[#65676b] dark:text-[#b0b3b8] leading-relaxed">
                  <p>
                    {locale === 'bn'
                      ? 'ব্যবহারকারী হিসেবে আপনি যেকোনো সময় আপনার অ্যাকাউন্ট ও সমস্ত ডাটা স্থায়ীভাবে মুছে ফেলার পূর্ণ অধিকার রাখেন (GDPR ও Meta ডেটা ডিলিশন নীতি অনুসারে):'
                      : 'You retain full rights to delete your account and all associated personal data permanently at any time (compliant with GDPR & Meta User Data Deletion protocols):'}
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>
                      {locale === 'bn'
                        ? 'প্রোফাইল সেটিংস থেকে "Delete Account" অপশন ব্যবহার করে সাথে সাথে সমস্ত পোস্ট, কমেন্ট ও চ্যাট হিস্ট্রি মুছে ফেলা যায়।'
                        : 'Use the "Delete Account" option in your Profile Settings to permanently purge your profile, posts, comments, and chat history.'}
                    </li>
                    <li>
                      {locale === 'bn'
                        ? 'অথবা যেকোনো সহায়তার জন্য সরাসরি আমাদের সাপোর্ট ইমেইলে যোগাযোগ করতে পারেন।'
                        : 'Alternatively, contact our support team directly for manual account purging.'}
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Support & Contact Footer */}
        <div className="mt-12 rounded-3xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-6 text-center shadow-2xs">
          <Mail className="mx-auto h-8 w-8 text-primary-600 dark:text-primary-400 mb-2" />
          <h3 className="text-base font-bold text-[#050505] dark:text-[#e4e6eb]">
            {locale === 'bn'
              ? 'নীতিমালা বা নিরাপত্তা সংক্রান্ত কোনো প্রশ্ন আছে?'
              : 'Have Questions About Our Policies or Security?'}
          </h3>
          <p className="mt-1 text-xs text-[#65676b] dark:text-[#b0b3b8] max-w-md mx-auto">
            {locale === 'bn'
              ? 'আমাদের টিম আপনাকে সহায়তা করতে প্রস্তুত। যেকোনো পরামর্শ বা নীতিভঙ্গের অভিযোগ জানাতে আমাদের সাথে যোগাযোগ করুন।'
              : 'Our team is dedicated to keeping our community safe. Contact us for any policy clarification or violation reports.'}
          </p>
          <a
            href="mailto:connect@peacetweet.com"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary-600 hover:bg-primary-700 px-5 py-2 text-xs font-bold text-white shadow-xs transition-all"
          >
            <span>connect@peacetweet.com</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </Container>
    </div>
  );
}
