'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MessageSquarePlus,
  HelpCircle,
  ShieldCheck,
  Zap,
  MailCheck,
  HeartHandshake,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { useLanguage } from '@/providers/LanguageProvider';
import { OfficialContactCard } from './OfficialContactCard';
import { FeedbackForm } from './FeedbackForm';
import { ROUTES } from '@/constants/routes';

export function FeedbackPageView() {
  const { locale } = useLanguage();
  const router = useRouter();

  const faqs = [
    {
      qBn: 'আমার মতামত কি সত্যিই কোনো পরিবর্তন আনবে?',
      qEn: 'Will my feedback make a difference?',
      aBn: 'অবশ্যই! PeaceTweet সম্পূর্ণভাবে একটি কমিউনিটি-ভিত্তিক প্ল্যাটফর্ম। ব্যবহারকারীদের পরামর্শ অনুযায়ী আমরা নিয়মিত নতুন ফিচার ও প্রয়োজনীয় পরিবর্তন আনি।',
      aEn: 'Absolutely! PeaceTweet is built for and shaped by its community. Every feedback directly influences our feature roadmap.',
    },
    {
      qBn: 'ভুল দোয়া বা কনটেন্ট দেখতে পেলে করণীয় কী?',
      qEn: 'What should I do if I find an incorrect Dua or post?',
      aBn: 'ফর্মের "অভিযোগ ও রিপোর্ট" অপশন সিলেক্ট করে সংশ্লিষ্ট পোস্টের লিংক বা আইডি দিয়ে সাবমিট করুন। আমাদের ইসলামিক রিসার্চ টিম দ্রুত তা যাচাই করে প্রয়োজনীয় ব্যবস্থা গ্রহণ করবে।',
      aEn: 'Select the "Content Violation" category and submit the link or ID. Our verification team will review and take immediate action.',
    },
    {
      qBn: 'ব্যবসায়িক যোগাযোগ বা স্পনসরশিপ কীভাবে করব?',
      qEn: 'How can I discuss business or sponsorship?',
      aBn: 'সরাসরি connect.peacetweet@gmail.com ঠিকানায় ইমেইল পাঠাতে পারেন অথবা ফর্মের "ব্যবসায়িক যোগাযোগ" ক্যাটাগরি ব্যবহার করে প্রস্তাবনা পাঠাতে পারেন।',
      aEn: 'You can email connect.peacetweet@gmail.com directly or select the "Business Inquiry" option in the form above.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#18191a] text-gray-900 dark:text-gray-100 transition-colors pb-16">
      {/* Top Header / Breadcrumb Bar */}
      <div className="bg-white dark:bg-[#242526] border-b border-gray-200/80 dark:border-gray-800/80 sticky top-0 sm:top-14 z-30 shadow-2xs">
        <Container size="lg">
          <div className="h-14 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                title={locale === 'bn' ? 'পেছনে যান' : 'Go back'}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-primary-950/80 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                  <MessageSquarePlus className="w-4 h-4" />
                </div>
                <h1 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
                  {locale === 'bn' ? 'পরামর্শ ও অভিযোগ কেন্দ্র' : 'Feedback & Report Center'}
                </h1>
              </div>
            </div>

            <Link
              href={ROUTES.HOME}
              className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              {locale === 'bn' ? 'হোমে ফিরুন' : 'Back to Home'}
            </Link>
          </div>
        </Container>
      </div>

      <Container size="lg" className="pt-4 sm:pt-6 space-y-6">
        {/* Intro Hero Banner */}
        <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-teal-800 via-primary-700 to-primary-900 text-white shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-semibold tracking-wide text-white/95">
              <HeartHandshake className="w-3.5 h-3.5 text-yellow-300" />
              <span>{locale === 'bn' ? 'কমিউনিটি সহযোগিতা' : 'Community Driven'}</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight">
              {locale === 'bn'
                ? 'আপনার পরামর্শেই সমৃদ্ধ হবে PeaceTweet'
                : 'Your Voice Shapes the Future of PeaceTweet'}
            </h2>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
              {locale === 'bn'
                ? 'প্ল্যাটফর্মের কোনো ফিচার নিয়ে সমস্যা হচ্ছে? নতুন কোনো আইডিয়া আছে? অথবা অনুপযুক্ত কোনো কনটেন্ট চোখে পড়েছে? নিঃসঙ্কোচে জানান, আমরা প্রতিটি বিষয় অত্যন্ত গুরুত্ব সহকারে বিবেচনা করি।'
                : 'Encountered a bug, have an innovative idea, or noticed an inaccurate dua? Let us know directly. We value every submission and act promptly.'}
            </p>
          </div>
        </div>

        {/* Main Content Grid: Left Contact Card & Right Feedback Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Left Column: Official Contact Card & Guarantees */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5 order-2 lg:order-1">
            <OfficialContactCard />

            {/* Platform Guarantees Card */}
            <div className="bg-white dark:bg-[#242526] rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-5 space-y-3.5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {locale === 'bn' ? 'আমাদের অঙ্গীকার' : 'Our Commitment'}
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">
                      {locale === 'bn' ? 'পূর্ণ গোপনীয়তা' : 'Full Confidentiality'}
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      {locale === 'bn'
                        ? 'আপনার যোগাযোগের বিবরণ বা আইপি কখনই তৃতীয় পক্ষের সাথে শেয়ার করা হবে না।'
                        : 'Your contact details and submission context are strictly kept confidential.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">
                      {locale === 'bn' ? 'দ্রুত কার্যকর ব্যবস্থা' : 'Prompt Action'}
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      {locale === 'bn'
                        ? 'কারিগরি সমস্যা বা ভুল দোয়ার রিপোর্ট সর্বোচ্চ অগ্রাধিকার দিয়ে ফিক্স করা হয়।'
                        : 'Bugs and incorrect Islamic content reports receive the highest priority.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MailCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">
                      {locale === 'bn' ? 'ইমেইল আপডেট' : 'Email Updates'}
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      {locale === 'bn'
                        ? 'আপনার রিপোর্ট সমাধান হলে বা আপডেটের প্রয়োজন হলে ইমেইলে জানানো হবে।'
                        : 'We will notify your provided email address once your report is addressed.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Feedback Form */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <FeedbackForm />
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-white dark:bg-[#242526] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
              {locale === 'bn' ? 'সাধারণ জিজ্ঞাসা (FAQ)' : 'Frequently Asked Questions'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-gray-50/80 dark:bg-[#18191a] border border-gray-100 dark:border-gray-800/80 space-y-1.5"
              >
                <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-snug">
                  {locale === 'bn' ? faq.qBn : faq.qEn}
                </h4>
                <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                  {locale === 'bn' ? faq.aBn : faq.aEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
