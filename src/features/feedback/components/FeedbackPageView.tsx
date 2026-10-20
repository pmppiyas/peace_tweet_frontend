'use client';

import React from 'react';
import {
  MessageSquarePlus,
  HelpCircle,
  ShieldCheck,
  Zap,
  MailCheck,
  HeartHandshake,
  Sparkles,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { useLanguage } from '@/providers/LanguageProvider';
import { OfficialContactCard } from './OfficialContactCard';
import { FeedbackForm } from './FeedbackForm';
import { ROUTES } from '@/constants/routes';

export function FeedbackPageView() {
  const { locale } = useLanguage();

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
    <div className="h-[calc(100vh-3.5rem)] overflow-hidden bg-[#f0f2f5] dark:bg-[#18191a] text-[#050505] dark:text-[#e4e6eb]">
      <Container
        size="2xl"
        className="h-full px-0 sm:px-4 md:px-4 lg:px-6 2xl:px-8"
      >
        <div className="flex h-full gap-0 md:gap-4 lg:gap-6 2xl:gap-8">
          {/* Left Column: Home Page's Main Sidebar */}
          <Sidebar className="hidden md:block w-56 lg:w-60 xl:w-64 2xl:w-72 shrink-0 space-y-2 h-full overflow-y-auto overscroll-contain no-scrollbar scrollbar-none py-4 pr-2 select-none" />

          {/* Right Column: Feedback Content Feed */}
          <main className="flex-1 w-full min-w-0 h-full overflow-y-auto overscroll-contain no-scrollbar scrollbar-none py-2.5 sm:py-5 lg:py-6 px-2 sm:px-4 lg:px-6 pb-24">
            <div className="max-w-4xl mx-auto space-y-3.5 sm:space-y-5">
              {/* Intro Hero Header Card */}
              <div className="w-full rounded-2xl sm:rounded-3xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-4 sm:p-7 shadow-xs text-center relative overflow-hidden">
                <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400 mb-3.5 shadow-2xs">
                  <MessageSquarePlus className="h-8 w-8 sm:h-9 sm:w-9" />
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 border border-primary-200/80 dark:border-primary-800/80 mb-3">
                  <HeartHandshake className="h-3.5 w-3.5" />
                  <span>
                    {locale === 'bn'
                      ? 'পরামর্শ, বাগ রিপোর্ট ও যোগাযোগ'
                      : 'Feedback & Contact'}
                  </span>
                </span>

                <h1 className="text-xl sm:text-3xl font-extrabold text-[#050505] dark:text-[#e4e6eb] tracking-tight leading-snug">
                  {locale === 'bn'
                    ? 'আপনার পরামর্শেই সমৃদ্ধ হবে PeaceTweet'
                    : 'Your Voice Shapes the Future of PeaceTweet'}
                </h1>
                <p className="mt-2 text-xs sm:text-base text-[#65676b] dark:text-[#b0b3b8] max-w-2xl mx-auto leading-relaxed">
                  {locale === 'bn'
                    ? 'প্ল্যাটফর্মের কোনো ফিচার নিয়ে সমস্যা হচ্ছে? নতুন কোনো আইডিয়া আছে? অথবা অনুপযুক্ত কোনো কনটেন্ট চোখে পড়েছে? নিঃসঙ্কোচে জানান, আমরা প্রতিটি বিষয় অত্যন্ত গুরুত্ব সহকারে বিবেচনা করি।'
                    : 'Encountered a bug, have an innovative idea, or noticed an inaccurate dua? Let us know directly. We value every submission and act promptly.'}
                </p>
              </div>

              {/* Main Content Grid: Left Contact Card & Right Feedback Form */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
                {/* Left Column: Official Contact Card & Guarantees */}
                <div className="lg:col-span-5 space-y-3.5 sm:space-y-4 order-2 lg:order-1">
                  <OfficialContactCard />

                  {/* Platform Guarantees Card */}
                  <div className="bg-white dark:bg-[#242526] rounded-2xl border border-[#e4e6eb] dark:border-[#393a3b] p-4 sm:p-5 space-y-3.5 shadow-2xs">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#65676b] dark:text-[#b0b3b8]">
                      {locale === 'bn' ? 'আমাদের অঙ্গীকার' : 'Our Commitment'}
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0 mt-0.5">
                          <ShieldCheck className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#050505] dark:text-[#e4e6eb]">
                            {locale === 'bn'
                              ? 'পূর্ণ গোপনীয়তা'
                              : 'Full Confidentiality'}
                          </h4>
                          <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] mt-0.5 leading-relaxed">
                            {locale === 'bn'
                              ? 'আপনার যোগাযোগের বিবরণ কখনই কোনো তৃতীয় পক্ষের সাথে শেয়ার করা হবে না।'
                              : 'Your contact details and submission context are strictly kept confidential.'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Zap className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#050505] dark:text-[#e4e6eb]">
                            {locale === 'bn'
                              ? 'দ্রুত কার্যকর ব্যবস্থা'
                              : 'Prompt Action'}
                          </h4>
                          <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] mt-0.5 leading-relaxed">
                            {locale === 'bn'
                              ? 'কারিগরি সমস্যা বা ভুল দোয়ার রিপোর্ট সর্বোচ্চ অগ্রাধিকার দিয়ে ফিক্স করা হয়।'
                              : 'Bugs and incorrect Islamic content reports receive the highest priority.'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0 mt-0.5">
                          <MailCheck className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#050505] dark:text-[#e4e6eb]">
                            {locale === 'bn' ? 'ইমেইল আপডেট' : 'Email Updates'}
                          </h4>
                          <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] mt-0.5 leading-relaxed">
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
              <div className="bg-white dark:bg-[#242526] rounded-2xl border border-[#e4e6eb] dark:border-[#393a3b] p-4 sm:p-6 shadow-2xs">
                <div className="flex items-center gap-2 mb-3.5">
                  <HelpCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <h3 className="text-sm sm:text-base font-bold text-[#050505] dark:text-[#e4e6eb]">
                    {locale === 'bn'
                      ? 'সাধারণ জিজ্ঞাসা (FAQ)'
                      : 'Frequently Asked Questions'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {faqs.map((faq, i) => (
                    <div
                      key={i}
                      className="p-3 sm:p-3.5 rounded-xl bg-[#f0f2f5]/60 dark:bg-[#18191a] border border-[#e4e6eb] dark:border-[#393a3b] space-y-1.5"
                    >
                      <h4 className="text-xs font-bold text-[#050505] dark:text-[#e4e6eb] leading-snug">
                        {locale === 'bn' ? faq.qBn : faq.qEn}
                      </h4>
                      <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8] leading-relaxed">
                        {locale === 'bn' ? faq.aBn : faq.aEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
}
