'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  EyeOff,
  Sparkles,
  BookOpen,
  HeartHandshake,
  UserCheck,
  Share2,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Compass,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

export function PurposeView() {
  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-hidden bg-[#f0f2f5] dark:bg-[#18191a] text-[#050505] dark:text-[#e4e6eb]">
      <Container
        size="2xl"
        className="h-full px-0 sm:px-4 md:px-4 lg:px-6 2xl:px-8"
      >
        <div className="flex h-full gap-0 md:gap-4 lg:gap-6 2xl:gap-8">
          {/* Left Column: Home Page's Main Sidebar */}
          <Sidebar className="hidden md:block w-56 lg:w-60 xl:w-64 2xl:w-72 shrink-0 space-y-2 h-full overflow-y-auto overscroll-contain no-scrollbar scrollbar-none py-4 pr-2 select-none" />

          {/* Right Column: Purpose View Content */}
          <main className="flex-1 w-full min-w-0 h-full overflow-y-auto overscroll-contain no-scrollbar scrollbar-none py-2.5 sm:py-5 lg:py-6 px-2 sm:px-4 lg:px-6 pb-24">
            <div className="max-w-4xl mx-auto space-y-3 sm:space-y-5">
              {/* Hero Header Card */}
              <div className="w-full rounded-2xl sm:rounded-3xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-4 sm:p-7 shadow-xs text-center relative overflow-hidden">
                <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400 mb-4 shadow-2xs">
                  <ShieldCheck className="h-8 w-8 sm:h-9 sm:w-9" />
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 mb-3">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>আমাদের লক্ষ্য, প্রেরণা ও স্বচ্ছতার অঙ্গীকার</span>
                </span>

                <h1 className="text-xl sm:text-3xl font-extrabold text-[#050505] dark:text-[#e4e6eb] tracking-tight leading-snug">
                  PeaceTweet কেন তৈরি করেছি?
                </h1>
                <p className="mt-2.5 text-xs sm:text-base text-[#65676b] dark:text-[#b0b3b8] max-w-2xl mx-auto leading-relaxed">
                  একটি পরিচ্ছন্ন, নিরাপদ, চোখের যিনামুক্ত ও বিরক্তিকর বিজ্ঞাপনবিহীন ডিজিটাল স্থান—যেখানে স্ক্রল
                  করলেই চোখ ও মন শান্ত থাকে এবং জীবন পরিবর্তনের মতো খাঁটি
                  জ্ঞান মেলে।
                </p>
              </div>

              {/* Content Sections */}
              <div className="space-y-4 sm:space-y-5">
                {/* Section 1: চোখের যিনা ও সকল প্রকার ডিজিটাল পাপ থেকে সুরক্ষা */}
                <section className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-3.5 sm:p-6 shadow-2xs transition-all">
                  <div className="flex flex-col items-center sm:items-start">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 shadow-2xs mb-3.5">
                      <EyeOff className="h-6 w-6" />
                    </div>
                    <div className="w-full">
                      <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-[#e4e6eb] text-center sm:text-left">
                        ১. চোখের যিনা, অশ্লীলতা ও বিরক্তিকর বিজ্ঞাপনমুক্ত নিরাপদ প্ল্যাটফর্ম
                      </h2>
                      <p className="mt-2 text-xs sm:text-sm text-[#65676b] dark:text-[#b0b3b8] leading-relaxed">
                        বর্তমান সোশ্যাল মিডিয়াগুলোতে (যেমন ফেসবুক, টিকটক,
                        ইনস্টাগ্রাম) ঢুকলেই চোখের সামনে বেহায়াপনা, অশ্লীল ছবি ও
                        ভিডিও এবং চোখের যিনার অসংখ্য ফাঁদ অনবরত ভেসে ওঠে। সেই সাথে যুক্ত থাকে বারবার সামনে আসা অনাকাঙ্ক্ষিত ও বিরক্তিকর সব বিজ্ঞাপন (Ads), যা মনোযোগ নষ্ট করে এবং যার অনেকগুলোতেই থাকে বিভ্রান্তিকর ও অনৈতিক বিষয়বস্তু। এতে মনের অজান্তেই নিজের চোখ, অন্তর, ঈমান এবং মূল্যবান সময় ক্ষতিগ্রস্ত হয়।
                      </p>
                      <div className="mt-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60 p-3 sm:p-4 text-xs sm:text-sm text-rose-950 dark:text-rose-200 leading-relaxed font-medium">
                        🛡️ <strong>PeaceTweet-এর সংকল্প:</strong> এটি এমন একটি
                        নিরাপদ ও শান্ত ডিজিটাল স্থান—যেখানে আপনি যখনই স্ক্রল করবেন, কোনো
                        অশ্লীলতা, চোখের যিনা কিংবা বারবার আসা বিরক্তিকর বিজ্ঞাপনের (Ads) যন্ত্রণা থাকবে না। আপনার চোখ, মন ও সময়—সবই সুরক্ষিত থাকবে ইনশাআল্লাহ।
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 2: শুধু ধর্মীয় নয়, জীবনের সকল ইতিবাচক জ্ঞান ও আত্মউন্নয়ন */}
                <section className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-3.5 sm:p-6 shadow-2xs transition-all">
                  <div className="flex flex-col items-center sm:items-start">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 shadow-2xs mb-3.5">
                      <Compass className="h-6 w-6" />
                    </div>
                    <div className="w-full">
                      <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-[#e4e6eb] text-center sm:text-left">
                        ২. শুধু ধর্মীয় নয়—সকল ইতিবাচক জ্ঞান ও আত্মউন্নয়ন
                      </h2>
                      <p className="mt-2 text-xs sm:text-sm text-[#65676b] dark:text-[#b0b3b8] leading-relaxed">
                        PeaceTweet কেবল চিরাচরিত ধর্মীয় দোয়ার গণ্ডিতে সীমাবদ্ধ
                        নয়। বরং মানুষের জীবনকে সুন্দর, গঠনমূলক ও সফল করতে যা
                        কিছু কল্যাণকর—তার সব কিছুই এখানে স্থান পায়:
                      </p>
                      <ul className="mt-3 space-y-2 text-xs sm:text-sm text-[#050505] dark:text-[#e4e6eb]">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary-500 shrink-0" />
                          <span>
                            আল্লাহ্‌র স্মরণ, সহিহ দো’আ ও প্রামাণ্য হাদিসের
                            দিকনির্দেশনা।
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary-500 shrink-0" />
                          <span>
                            ইতিবাচক তথ্য (Positive Information) ও মননশীল
                            চিন্তাভাবনা।
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary-500 shrink-0" />
                          <span>
                            আত্মউন্নয়ন (Self-Development), চরিত্র গঠন ও মানসিক
                            প্রশান্তির বার্তা।
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary-500 shrink-0" />
                          <span>
                            মানুষের উপকারে আসে এমন শিক্ষণীয় ও প্রেরণাদায়ী কথা।
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Section 3: কনটেন্ট কোথা থেকে পাই ও কীভাবে সংগ্রহ করি? */}
                <section className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-3.5 sm:p-6 shadow-2xs transition-all">
                  <div className="flex flex-col items-center sm:items-start">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 shadow-2xs mb-3.5">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div className="w-full">
                      <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-[#e4e6eb] text-center sm:text-left">
                        ৩. কনটেন্ট কোথা থেকে আসে এবং কীভাবে সংগ্রহ করা হয়?
                      </h2>
                      <p className="mt-2 text-xs sm:text-sm text-[#65676b] dark:text-[#b0b3b8] leading-relaxed">
                        আমরা কুরআন, প্রামাণ্য সহিহ হাদিসের কিতাব এবং নির্ভরযোগ্য
                        ইসলামিক গবেষকদের বইয়ের পাশাপাশি সোশ্যাল মিডিয়ায় ভালো ও
                        শিক্ষণীয় কাজ করে যাচ্ছেন এমন গুণী ক্রিয়েটরদের লেখাগুলো
                        সংগ্রহ করি। উদ্দেশ্য একটাই—ভালো কথাগুলোকে এক ছাদের নিচে
                        জড়ো করা, যেন যে কেউ খুব সহজে এগুলো খুঁজে পেতে এবং নিজের
                        জীবনে চর্চা করতে পারেন।
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 4: ক্রিয়েটরের সম্মানে অ্যাকাউন্ট তৈরি ও স্বচ্ছতার নীতি */}
                <section className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-3.5 sm:p-6 shadow-2xs transition-all">
                  <div className="flex flex-col items-center sm:items-start">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 shadow-2xs mb-3.5">
                      <HeartHandshake className="h-6 w-6" />
                    </div>
                    <div className="w-full">
                      <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-[#e4e6eb] text-center sm:text-left">
                        ৪. ক্রিয়েটরের সম্মানে অ্যাকাউন্ট তৈরি ও স্বচ্ছতার নীতি
                      </h2>
                      <p className="mt-2 text-xs sm:text-sm text-[#65676b] dark:text-[#b0b3b8] leading-relaxed">
                        ফেসবুক বা অন্যান্য সোশ্যাল প্ল্যাটফর্মে যেসকল লেখক ও
                        গুণী ক্রিয়েটররা সুন্দর ও শিক্ষণীয় কনটেন্ট শেয়ার করেন,
                        আমরা তাদের কনটেন্ট কোনো ফেক বা বেনামী প্রোফাইলে প্রকাশ
                        করি না। বরং তাদের প্রকৃত মর্যাদা বজায় রাখতে একটি
                        সুনির্দিষ্ট নিয়ম অনুসরণ করি:
                      </p>
                      <div className="mt-3.5 space-y-2.5">
                        <div className="rounded-xl bg-[#f0f2f5] dark:bg-[#3a3b3c]/50 p-3 sm:p-3.5 border border-[#e4e6eb] dark:border-[#393a3b] text-xs sm:text-sm">
                          <span className="font-bold text-[#050505] dark:text-white block mb-1">
                            👤 মূল ক্রিয়েটরের নামে প্রোফাইল গঠন ও হ্যান্ডওভার:
                          </span>
                          <p className="text-[#65676b] dark:text-[#b0b3b8] text-xs leading-relaxed">
                            মূল লেখকের নাম (Name) এবং তার ইউজারনেম (Username)
                            ব্যবহার করে PeaceTweet-এ একটি নিবেদিত অ্যাকাউন্ট
                            তৈরি করা হয় এবং সেই অ্যাকাউন্ট থেকেই তার মূল্যবান
                            পোস্টগুলো পাবলিশ করা হয়।
                          </p>
                          <p className="mt-2.5 text-[#050505] dark:text-[#e4e6eb] text-xs leading-relaxed font-medium bg-white/80 dark:bg-[#242526]/80 p-2.5 rounded-lg border border-[#e4e6eb]/80 dark:border-[#393a3b]/80">
                            💡{' '}
                            <strong>পূর্ণ স্বাধীনতা ও শতভাগ গোপনীয়তা:</strong>{' '}
                            সেই ক্রিয়েটর বা সম্মানিত লেখক যখনই PeaceTweet-এর
                            কার্যক্রম পছন্দ করে নিজে নিয়মিত পোস্ট করতে চান বা
                            এখানকার সক্রিয় ব্যবহারকারী হতে চান, তখন তার নাম ও
                            ইউজারনেমে থাকা আইডিটি সম্পূর্ণভাবে তাকে বুঝিয়ে দেওয়া
                            হয়। হস্তান্তর সম্পন্ন হওয়ার পর PeaceTweet অ্যাডমিন
                            বা টিমের কাছে সেই অ্যাকাউন্টের আর কোনো অ্যাক্সেস
                            থাকে না—তিনিই হন সেই প্রোফাইলের একক ও পূর্ণ মালিক।
                          </p>
                        </div>
                        <div className="rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 p-3 sm:p-3.5 border border-emerald-200/80 dark:border-emerald-900/60 text-xs sm:text-sm">
                          <span className="font-bold text-emerald-900 dark:text-emerald-200 block mb-1">
                            📩 ক্রিয়েটরকে অবগতকরণ ও সম্মতি:
                          </span>
                          <p className="text-emerald-800 dark:text-emerald-300 text-xs leading-relaxed">
                            এটি অবশ্যই সংশ্লিষ্ট লেখক বা ক্রিয়েটরকে জানিয়ে/অবহিত
                            করে করা হয়। উদ্দেশ্য কেবল একটাই—সাদাকায়ে জারিয়া ও
                            কল্যাণকর কথাগুলোকে আরও বেশি মানুষের কাছে পৌঁছে
                            দেওয়া।
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 5: প্রোফাইল ও কনটেন্টের পূর্ণ মালিকানা (Account Claim) পাওয়ার সুযোগ */}
                <section className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-3.5 sm:p-6 shadow-2xs transition-all">
                  <div className="flex flex-col items-center sm:items-start">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400 shadow-2xs mb-3.5">
                      <UserCheck className="h-6 w-6" />
                    </div>
                    <div className="w-full">
                      <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-[#e4e6eb] text-center sm:text-left">
                        ৫. প্রোফাইল ও কনটেন্টের পূর্ণ মালিকানা (Account Claim)
                        পাওয়ার সুযোগ
                      </h2>
                      <p className="mt-2 text-xs sm:text-sm text-[#65676b] dark:text-[#b0b3b8] leading-relaxed">
                        যেসব লেখকের নামে PeaceTweet-এ প্রোফাইল তৈরি ও কনটেন্ট
                        শেয়ার হয়েছে, তাদের জন্য আমাদের রয়েছে উন্মুক্ত ও আন্তরিক
                        ব্যবস্থাপনা:
                      </p>
                      <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="rounded-xl border border-teal-200/80 bg-teal-50/60 dark:border-teal-900/60 dark:bg-teal-950/30 p-3.5 text-xs sm:text-sm">
                          <span className="font-bold text-teal-900 dark:text-teal-200 block mb-1">
                            ✅ সরাসরি অ্যাকাউন্টের শতভাগ মালিকানা গ্রহণ
                          </span>
                          <p className="text-teal-800 dark:text-teal-300 text-xs leading-relaxed">
                            মূল ক্রিয়েটর নিজে PeaceTweet ব্যবহার করতে চাইলে
                            আইডিটির পূর্ণ অ্যাক্সেস তাকে হস্তান্তর করা হয়। এর
                            পর PeaceTweet-এর কাছে অ্যাকাউন্টের কোনো এক্সেস বা
                            নিয়ন্ত্রণ থাকে না।
                          </p>
                        </div>
                        <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/30 p-3.5 text-xs sm:text-sm">
                          <span className="font-bold text-amber-900 dark:text-amber-200 block mb-1">
                            🕊️ অপসারণ বা বন্ধের অধিকার
                          </span>
                          <p className="text-amber-800 dark:text-amber-300 text-xs leading-relaxed">
                            কোনো ক্রিয়েটর যদি চান তার নামে খোলা প্রোফাইল বা
                            পোস্টগুলো PeaceTweet-এ না থাকুক, তিনি জানানো মাত্রই
                            কোনো বিতর্ক ছাড়া তা অবিলম্বে সসম্মানে মুছে ফেলা হবে।
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 6: সবার জন্য উন্মুক্ত ও সদকায়ে জারিয়া */}
                <section className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-3.5 sm:p-6 shadow-2xs transition-all">
                  <div className="flex flex-col items-center sm:items-start">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 shadow-2xs mb-3.5">
                      <Share2 className="h-6 w-6" />
                    </div>
                    <div className="w-full">
                      <h2 className="text-base sm:text-lg font-bold text-[#050505] dark:text-[#e4e6eb] text-center sm:text-left">
                        ৬. উন্মুক্ত প্রচার ও সাদাকায়ে জারিয়া
                      </h2>
                      <p className="mt-2 text-xs sm:text-sm text-[#65676b] dark:text-[#b0b3b8] leading-relaxed">
                        রাসূলুল্লাহ (সা.) বলেছেন,{' '}
                        <em>
                          “যে ব্যক্তি কোনো ভালো কাজের পথ দেখায়, সে সেই কাজ
                          সম্পাদনকারীর সমান সওয়াব লাভ করে।”
                        </em>{' '}
                        (সহিহ মুসলিম)।
                      </p>
                      <p className="mt-2 text-xs sm:text-sm text-[#65676b] dark:text-[#b0b3b8] leading-relaxed">
                        যে কেউ চাইলে এই প্ল্যাটফর্মে সুন্দর কথা ও দো’আ লিখতে
                        পারেন। একইভাবে, যে কেউ এখানকার যেকোনো দো’আ ও ইতিবাচক কথা
                        কপি করে নিজের সোশ্যাল মিডিয়া বা দৈনন্দিন জীবনে
                        নির্দ্বিধায় শেয়ার করতে পারেন—আমাদের তরফ থেকে সম্পূর্ণ
                        অনুমতি রয়েছে।
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Footer Contact Card */}
              <div className="mt-5 sm:mt-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-primary-600 via-primary-700 to-brand-700 text-white p-5 sm:p-8 text-center shadow-md">
                <h3 className="text-base sm:text-xl font-extrabold text-white">
                  আপনার কোনো পরামর্শ, প্রশ্ন বা কনটেন্ট ক্লেইম আছে?
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-white/95 max-w-xl mx-auto leading-relaxed">
                  আমরা যেকোনো গঠনমূলক মতামত ও সহযোগিতাকে আন্তরিকভাবে স্বাগত
                  জানাই। সরাসরি আমাদের সাথে যোগাযোগ করুন।
                </p>

                <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                  <Link href={ROUTES.FEEDBACK}>
                    <Button
                      variant="secondary"
                      size="md"
                      className="rounded-xl bg-white text-primary-700 hover:bg-white/95 font-bold text-xs sm:text-sm shadow-xs"
                    >
                      <MessageSquare className="h-4 w-4 mr-1.5 text-primary-600" />
                      <span>ফিডব্যাক ফর্ম ওপেন করুন</span>
                    </Button>
                  </Link>

                  <a href="mailto:connect@peacetweet.com">
                    <Button
                      variant="outline"
                      size="md"
                      className="rounded-xl border border-white/50 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm shadow-xs backdrop-blur-xs"
                    >
                      <Mail className="h-4 w-4 mr-1.5 text-white" />
                      <span>connect@peacetweet.com</span>
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
}
