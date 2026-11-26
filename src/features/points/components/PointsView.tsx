'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Award,
  Bookmark,
  CalendarCheck,
  CheckCircle2,
  Copy,
  Check,
  Droplet,
  Flame,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  PenLine,
  PlusSquare,
  Share2,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCheck,
  UserPlus,
  Users,
  Camera,
  User as UserIcon,
  LogIn,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/providers/LanguageProvider';
import { ROUTES } from '@/constants/routes';
import { pointsApi } from '../api/points.api';
import {
  LeaderboardEntry,
  PointsDashboard,
  PointTaskCategory,
  PointTaskItem,
} from '../types/points.types';
import { cn } from '@/lib/utils/cn';

type TabMode = 'tasks' | 'history' | 'leaderboard';
type FilterMode = 'INCOMPLETE' | PointTaskCategory | 'COMPLETED';

function TaskIcon({ code, className }: { code: string; className?: string }) {
  switch (code) {
    case 'UPLOAD_AVATAR':
      return <UserIcon className={className} />;
    case 'UPLOAD_COVER':
      return <Camera className={className} />;
    case 'ADD_BIO':
      return <PenLine className={className} />;
    case 'SET_LOCATION':
      return <MapPin className={className} />;
    case 'SET_BLOOD_GROUP':
      return <Droplet className={className} />;
    case 'VERIFY_EMAIL':
      return <Mail className={className} />;
    case 'COMPLETE_PROFILE_100':
      return <UserCheck className={className} />;
    case 'DAILY_CHECKIN':
      return <CalendarCheck className={className} />;
    case 'WEEKLY_STREAK_7':
      return <Flame className={className} />;
    case 'INVITE_FRIEND_JOIN':
    case 'INVITE_FRIEND_QUALIFIED':
      return <UserPlus className={className} />;
    case 'CREATE_POST':
      return <PlusSquare className={className} />;
    case 'COMMENT_POST':
      return <MessageCircle className={className} />;
    case 'REACT_POST':
      return <Heart className={className} />;
    case 'SHARE_CONTENT':
      return <Share2 className={className} />;
    case 'SAVE_BOOKMARK':
      return <Bookmark className={className} />;
    case 'MAKE_FRIEND':
    case 'MILESTONE_5_FRIENDS':
    case 'MILESTONE_25_FRIENDS':
    case 'JOIN_GROUP':
    case 'CREATE_GROUP':
      return <Users className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}

export function PointsView() {
  const { isAuthenticated, user, setUser } = useAuth();
  const { locale } = useLanguage();

  const [activeTab, setActiveTab] = useState<TabMode>('tasks');
  const [filter, setFilter] = useState<FilterMode>('INCOMPLETE');
  const [dashboard, setDashboard] = useState<PointsDashboard | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bannerMsg, setBannerMsg] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    try {
      const [dash, lb] = await Promise.all([
        pointsApi.getDashboard(),
        pointsApi.getLeaderboard(20).catch(() => []),
      ]);
      if (dash) {
        setDashboard(dash);
        if (user) {
          setUser({
            ...user,
            points: dash.points,
            lifetimePoints: dash.lifetimePoints,
            referralCode: dash.referral.code,
            currentStreak: dash.currentStreak,
          });
        }
      }
      if (Array.isArray(lb)) {
        setLeaderboard(lb);
      }
    } catch {
      // keep previous state
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCheckIn = async () => {
    if (isCheckingIn || dashboard?.checkedInToday) return;
    setIsCheckingIn(true);
    try {
      const res = await pointsApi.checkIn();
      if (!res.alreadyCheckedIn && res.pointsAwarded > 0) {
        const total = res.pointsAwarded + res.streakBonusAwarded;
        setBannerMsg(
          locale === 'bn'
            ? `দৈনিক চেক-ইন সম্পন্ন! +${total} পয়েন্ট যোগ হয়েছে।`
            : `Daily check-in complete! +${total} points added.`
        );
        setTimeout(() => setBannerMsg(null), 4000);
      }
      await loadData();
    } finally {
      setIsCheckingIn(false);
    }
  };

  const referralCode = user?.username || dashboard?.referral.code || '';
  const referralUrl =
    typeof window !== 'undefined' && referralCode
      ? `${window.location.origin}/register?invitedBy=${referralCode}`
      : `https://peacetweet.com/register?invitedBy=${referralCode}`;

  const handleCopyInvite = async () => {
    if (!referralCode) return;
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const allTasks = dashboard?.tasks || [];
  const categoryChips: { key: PointTaskCategory; bn: string; en: string }[] = [
    { key: 'PROFILE', bn: 'প্রোফাইল', en: 'Profile' },
    { key: 'DAILY', bn: 'দৈনিক', en: 'Daily' },
    { key: 'REFERRAL', bn: 'ইনভাইট', en: 'Invite' },
    { key: 'SOCIAL', bn: 'পোস্ট/সোশ্যাল', en: 'Social' },
    { key: 'COMMUNITY', bn: 'বন্ধু ও গ্রুপ', en: 'Community' },
  ];

  const activeCategoryChips: { key: FilterMode; bn: string; en: string }[] = [];
  const completedCategoryEntries: {
    chip: { key: FilterMode; bn: string; en: string };
    completedAt: number;
  }[] = [];

  for (const c of categoryChips) {
    const catTasks = allTasks.filter((t) => t.category === c.key);
    const isCatComplete =
      catTasks.length > 0 && catTasks.every((t) => t.isCompleted);
    if (isCatComplete) {
      const maxTs = catTasks.reduce((max, t) => {
        const ts = t.lastCompletedAt
          ? new Date(t.lastCompletedAt).getTime()
          : 0;
        return ts > max ? ts : max;
      }, 0);
      completedCategoryEntries.push({ chip: c, completedAt: maxTs });
    } else {
      activeCategoryChips.push(c);
    }
  }

  completedCategoryEntries.sort((a, b) => a.completedAt - b.completedAt);

  const filterChips: { key: FilterMode; bn: string; en: string }[] = [
    { key: 'INCOMPLETE', bn: 'বাকি অর্জন', en: 'Next Milestones' },
    ...activeCategoryChips,
    { key: 'COMPLETED', bn: 'অর্জিত', en: 'Achieved' },
    ...completedCategoryEntries.map((entry) => entry.chip),
  ];

  const filteredTasks = allTasks
    .filter((t) => {
      if (filter === 'INCOMPLETE') return !t.isCompleted;
      if (filter === 'COMPLETED') return t.isCompleted;
      return t.category === filter;
    })
    .sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted));

  const resolveTaskHref = (task: PointTaskItem): string => {
    if (!task.actionRoute || task.actionRoute === '/points')
      return ROUTES.POINTS;
    return task.actionRoute;
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-hidden bg-[#f0f2f5] dark:bg-[#18191a] text-[#050505] dark:text-[#e4e6eb]">
      <Container
        size="2xl"
        className="h-full px-0 sm:px-4 md:px-4 lg:px-6 2xl:px-8"
      >
        <div className="flex h-full gap-0 md:gap-4 lg:gap-6 2xl:gap-8">
          <Sidebar className="hidden md:block w-56 lg:w-60 xl:w-64 2xl:w-72 shrink-0 space-y-2 h-full overflow-y-auto overscroll-contain no-scrollbar scrollbar-none py-4 pr-2 select-none" />

          <main className="flex-1 w-full min-w-0 h-full overflow-y-auto overscroll-contain no-scrollbar scrollbar-none py-3 sm:py-5 lg:py-6 px-2.5 sm:px-4 lg:px-6 pb-24">
            <div className="max-w-4xl mx-auto space-y-4">
              {!isAuthenticated ? (
                <div className="rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-8 text-center shadow-xs">
                  <div className="mx-auto h-14 w-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center mb-4">
                    <Award className="h-7 w-7 text-amber-600" />
                  </div>
                  <h1 className="text-xl font-bold mb-2">
                    {locale === 'bn'
                      ? 'আপনার অর্জন ও সম্মাননা দেখতে লগইন করুন'
                      : 'Sign in to view Achievements'}
                  </h1>
                  <p className="text-sm text-[#65676b] dark:text-[#b0b3b8] mb-5 max-w-md mx-auto">
                    {locale === 'bn'
                      ? 'প্রোফাইল সম্পূর্ণ করে, পোস্ট করে, বন্ধু বানিয়ে ও ইনভাইট করে পয়েন্ট অর্জন করুন।'
                      : 'Complete your profile, share authentic posts, make friends, and invite others to earn points.'}
                  </p>
                  <Link
                    href={ROUTES.LOGIN}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold px-5 py-2.5 text-sm"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>{locale === 'bn' ? 'লগইন করুন' : 'Log In'}</span>
                  </Link>
                </div>
              ) : isLoading && !dashboard ? (
                <div className="rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-6 space-y-4 animate-pulse">
                  <div className="h-8 w-48 bg-[#e4e6eb] dark:bg-[#3a3b3c] rounded-xl" />
                  <div className="h-24 w-full bg-[#e4e6eb] dark:bg-[#3a3b3c] rounded-2xl" />
                  <div className="h-32 w-full bg-[#e4e6eb] dark:bg-[#3a3b3c] rounded-2xl" />
                </div>
              ) : (
                <>
                  {bannerMsg ? (
                    <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-4 py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      {bannerMsg}
                    </div>
                  ) : null}

                  {/* Hero Card */}
                  <div className="rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-4 sm:p-6 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="h-14 w-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center shrink-0">
                          <Trophy className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#65676b] dark:text-[#b0b3b8]">
                            {locale === 'bn'
                              ? 'আপনার অর্জিত পয়েন্ট'
                              : 'Your Achievement Score'}
                          </p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black">
                              {dashboard?.points ?? user?.points ?? 0}
                            </span>
                            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                              pts
                            </span>
                          </div>
                        </div>
                      </div>

                      <Link
                        href={ROUTES.REDEEM}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:hover:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800 transition-colors"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        <span>{locale === 'bn' ? 'রিডিম' : 'Redeem'}</span>
                      </Link>
                    </div>

                    {dashboard?.level ? (
                      <div className="mt-5">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400">
                              Lv.{dashboard.level.current.level} •{' '}
                              {locale === 'bn'
                                ? dashboard.level.current.nameBn
                                : dashboard.level.current.nameEn}
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#f0f2f5] text-[#050505] dark:bg-[#3a3b3c] dark:text-[#e4e6eb]">
                              <Flame className="h-3.5 w-3.5 text-amber-500" />
                              {dashboard.currentStreak}{' '}
                              {locale === 'bn' ? 'দিনের স্ট্রিক' : 'day streak'}
                            </span>
                          </div>
                          {dashboard.level.next ? (
                            <span className="text-xs font-medium text-[#65676b] dark:text-[#b0b3b8]">
                              {locale === 'bn'
                                ? `পরবর্তী লেভেলে ${dashboard.level.pointsToNext} pts বাকি`
                                : `${dashboard.level.pointsToNext} pts to Lv.${dashboard.level.next.level}`}
                            </span>
                          ) : null}
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-[#e4e6eb] dark:bg-[#3a3b3c] overflow-hidden">
                          <div
                            style={{
                              width: `${dashboard.level.progressPercent}%`,
                            }}
                            className="h-full rounded-full bg-primary-500 transition-all"
                          />
                        </div>
                      </div>
                    ) : null}

                    {/* Tabs */}
                    <div className="mt-5 grid grid-cols-3 gap-1 rounded-xl bg-[#f0f2f5] dark:bg-[#3a3b3c] p-1">
                      {(
                        [
                          { key: 'tasks', bn: 'অর্জনসমূহ', en: 'Achievements' },
                          { key: 'history', bn: 'ইতিহাস', en: 'History' },
                          {
                            key: 'leaderboard',
                            bn: 'র‍্যাংকিং',
                            en: 'Top Rank',
                          },
                        ] as const
                      ).map((t) => (
                        <button
                          key={t.key}
                          type="button"
                          onClick={() => setActiveTab(t.key)}
                          className={cn(
                            'py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer',
                            activeTab === t.key
                              ? 'bg-primary-500 text-white'
                              : 'text-[#65676b] dark:text-[#b0b3b8] hover:text-[#050505] dark:hover:text-white'
                          )}
                        >
                          {locale === 'bn' ? t.bn : t.en}
                        </button>
                      ))}
                    </div>
                  </div>

                  {activeTab === 'tasks' && (
                    <>
                      {/* Profile Completion + Invite Grid */}
                      <div
                        className={cn(
                          'grid grid-cols-1 gap-4',
                          dashboard?.profileCompletion &&
                            dashboard.profileCompletion.percentage < 100 &&
                            'md:grid-cols-2'
                        )}
                      >
                        {dashboard?.profileCompletion &&
                        dashboard.profileCompletion.percentage < 100 ? (
                          <div className="rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-4 sm:p-5 shadow-xs">
                            <div className="flex items-center justify-between mb-2">
                              <h2 className="text-base font-bold">
                                {locale === 'bn'
                                  ? 'প্রোফাইল কমপ্লিশন'
                                  : 'Profile Completion'}
                              </h2>
                              <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                                {dashboard.profileCompletion.percentage}%
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-[#e4e6eb] dark:bg-[#3a3b3c] overflow-hidden mb-3">
                              <div
                                style={{
                                  width: `${dashboard.profileCompletion.percentage}%`,
                                }}
                                className="h-full rounded-full bg-emerald-600"
                              />
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {dashboard.profileCompletion.steps.map((s) => (
                                <Link
                                  key={s.key}
                                  href={
                                    s.key === 'avatar' || s.key === 'cover'
                                      ? ROUTES.PROFILE
                                      : s.key === 'bloodGroup'
                                        ? '/settings?tab=blood'
                                        : s.key === 'location'
                                          ? '/settings?tab=location'
                                          : ROUTES.SETTINGS
                                  }
                                  className={cn(
                                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border',
                                    s.done
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                                      : 'bg-[#f0f2f5] text-[#050505] border-[#e4e6eb] dark:bg-[#3a3b3c] dark:text-[#e4e6eb] dark:border-[#4e4f50]'
                                  )}
                                >
                                  <CheckCircle2
                                    className={cn(
                                      'h-3.5 w-3.5',
                                      s.done
                                        ? 'text-emerald-600'
                                        : 'text-[#8a8d91]'
                                    )}
                                  />
                                  <span>
                                    {locale === 'bn' ? s.labelBn : s.labelEn}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {/* Referral Card */}
                        <div className="rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                          <div>
                            <h2 className="text-base font-bold mb-1">
                              {locale === 'bn' ? (
                                <>
                                  বন্ধুদের সাথে ভালো কিছু শেয়ার করুন
                                  <br />ও এগিয়ে যান
                                </>
                              ) : (
                                <>
                                  Share Something Good with Friends
                                  <br />
                                  &amp; Score Up!
                                </>
                              )}
                            </h2>
                            <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] mb-3">
                              {locale === 'bn'
                                ? `+30 / +50 pts • মোট ইনভাইট: ${dashboard?.referral.totalInvited ?? 0} জন • অ্যাক্টিভ: ${dashboard?.referral.qualifiedCount ?? 0}`
                                : `+30 / +50 pts • Invited: ${dashboard?.referral.totalInvited ?? 0} • Active: ${dashboard?.referral.qualifiedCount ?? 0}`}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 rounded-xl bg-[#f0f2f5] dark:bg-[#18191a] border border-[#e4e6eb] dark:border-[#393a3b] px-3 py-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
                                {locale === 'bn'
                                  ? 'ইনভাইট ইউজারনেম'
                                  : 'Invite Username'}
                              </p>
                              <p className="font-mono font-bold text-sm truncate">
                                {referralCode ? `@${referralCode}` : '---'}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={handleCopyInvite}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white px-3 py-1.5 text-xs font-bold cursor-pointer"
                            >
                              {copied ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                              <span>
                                {copied
                                  ? locale === 'bn'
                                    ? 'কপি হয়েছে'
                                    : 'Copied'
                                  : locale === 'bn'
                                    ? 'লিংক কপি'
                                    : 'Copy Link'}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Category Filter */}
                      <div className="flex flex-wrap gap-2">
                        {filterChips.map((chip) => (
                          <button
                            key={chip.key}
                            type="button"
                            onClick={() => setFilter(chip.key)}
                            className={cn(
                              'px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer',
                              filter === chip.key
                                ? 'bg-primary-500 text-white border-primary-500'
                                : 'bg-white dark:bg-[#242526] text-[#050505] dark:text-[#e4e6eb] border-[#e4e6eb] dark:border-[#393a3b]'
                            )}
                          >
                            {locale === 'bn' ? chip.bn : chip.en}
                          </button>
                        ))}
                      </div>

                      {/* Tasks Grid */}
                      {filteredTasks.length === 0 ? (
                        <div className="rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-6 text-center text-sm text-[#65676b] dark:text-[#b0b3b8]">
                          {filter === 'COMPLETED'
                            ? locale === 'bn'
                              ? 'এখনো কোনো টাস্ক সম্পন্ন হয়নি।'
                              : 'No completed tasks yet.'
                            : locale === 'bn'
                              ? 'সব টাস্ক সম্পন্ন হয়েছে! 🎉'
                              : 'All tasks in this section are completed! 🎉'}
                        </div>
                      ) : null}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {filteredTasks.map((task) => {
                          const target = Math.max(
                            1,
                            task.frequency === 'DAILY'
                              ? task.dailyLimit || 1
                              : task.targetCount || task.maxLimit || 1
                          );
                          const current = Math.min(
                            target,
                            task.currentCount || 0
                          );
                          const pct = Math.round((current / target) * 100);

                          return (
                            <div
                              key={task.code}
                              className="rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-4 shadow-xs flex flex-col justify-between gap-3"
                            >
                              <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary-950/60 flex items-center justify-center shrink-0">
                                  <TaskIcon
                                    code={task.code}
                                    className="h-5 w-5 text-primary-600 dark:text-primary-400"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <h3 className="text-sm font-bold truncate">
                                      {locale === 'bn'
                                        ? task.titleBn
                                        : task.titleEn}
                                    </h3>
                                    <span
                                      className={cn(
                                        'shrink-0 px-2.5 py-0.5 rounded-full text-xs font-bold',
                                        task.isCompleted
                                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                      )}
                                    >
                                      +{task.points} pts
                                    </span>
                                  </div>
                                  {task.descriptionBn || task.descriptionEn ? (
                                    <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] mt-1 leading-relaxed">
                                      {locale === 'bn'
                                        ? task.descriptionBn
                                        : task.descriptionEn}
                                    </p>
                                  ) : null}
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-3">
                                <div className="flex-1 h-1.5 rounded-full bg-[#e4e6eb] dark:bg-[#3a3b3c] overflow-hidden">
                                  <div
                                    style={{
                                      width: `${task.isCompleted ? 100 : pct}%`,
                                    }}
                                    className={cn(
                                      'h-full rounded-full',
                                      task.isCompleted
                                        ? 'bg-emerald-600'
                                        : 'bg-primary-500'
                                    )}
                                  />
                                </div>
                                {task.isCompleted ? (
                                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                    {locale === 'bn' ? 'সম্পন্ন ✓' : 'Done ✓'}
                                  </span>
                                ) : (
                                  <Link
                                    href={resolveTaskHref(task)}
                                    className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline shrink-0"
                                  >
                                    {locale === 'bn'
                                      ? `${current}/${target} • করুন →`
                                      : `${current}/${target} • Go →`}
                                  </Link>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {activeTab === 'history' && (
                    <div className="rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-4 sm:p-5 shadow-xs space-y-3">
                      <h2 className="text-base font-bold">
                        {locale === 'bn'
                          ? 'সাম্প্রতিক পয়েন্ট হিস্ট্রি'
                          : 'Recent Points History'}
                      </h2>
                      {!dashboard?.recentTransactions?.length ? (
                        <p className="text-sm text-[#65676b] dark:text-[#b0b3b8] py-8 text-center">
                          {locale === 'bn'
                            ? 'এখনো কোনো পয়েন্ট লেনদেন হয়নি।'
                            : 'No points transactions yet.'}
                        </p>
                      ) : (
                        <div className="divide-y divide-[#e4e6eb] dark:divide-[#393a3b]">
                          {dashboard.recentTransactions.map((tx) => (
                            <div
                              key={tx.id}
                              className="py-3 flex items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className={cn(
                                    'h-9 w-9 rounded-xl flex items-center justify-center shrink-0',
                                    tx.pointsDelta < 0
                                      ? 'bg-rose-50 dark:bg-rose-950/50'
                                      : 'bg-emerald-50 dark:bg-emerald-950/50'
                                  )}
                                >
                                  {tx.rewardCode ? (
                                    <ShieldCheck className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                                  ) : (
                                    <TaskIcon
                                      code={tx.taskCode || ''}
                                      className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                                    />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold truncate">
                                    {locale === 'bn'
                                      ? tx.titleBn ||
                                        tx.rewardCode ||
                                        tx.taskCode ||
                                        ''
                                      : tx.titleEn ||
                                        tx.rewardCode ||
                                        tx.taskCode ||
                                        ''}
                                  </p>
                                  <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
                                    {new Date(
                                      tx.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <span
                                className={cn(
                                  'text-sm font-bold shrink-0',
                                  tx.pointsDelta < 0
                                    ? 'text-rose-600 dark:text-rose-400'
                                    : 'text-emerald-600 dark:text-emerald-400'
                                )}
                              >
                                {tx.pointsDelta >= 0
                                  ? `+${tx.pointsDelta}`
                                  : tx.pointsDelta}{' '}
                                pts
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'leaderboard' && (
                    <div className="rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-4 sm:p-5 shadow-xs space-y-3">
                      <h2 className="text-base font-bold">
                        {locale === 'bn'
                          ? 'শীর্ষ অবদানকারী সদস্যগণ'
                          : 'Top Contributors'}
                      </h2>
                      {leaderboard.length === 0 ? (
                        <p className="text-sm text-[#65676b] dark:text-[#b0b3b8] py-8 text-center">
                          {locale === 'bn'
                            ? 'এখনো কোনো র‍্যাংকিং ডেটা নেই।'
                            : 'No leaderboard entries yet.'}
                        </p>
                      ) : (
                        <div className="divide-y divide-[#e4e6eb] dark:divide-[#393a3b]">
                          {leaderboard.map((entry) => (
                            <Link
                              key={entry.id}
                              href={ROUTES.USER_PROFILE(entry.username)}
                              className="py-3 flex items-center justify-between gap-3 hover:opacity-85"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span
                                  className={cn(
                                    'h-8 w-8 rounded-full flex items-center justify-center text-xs font-black shrink-0',
                                    entry.rank <= 3
                                      ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                                      : 'bg-[#f0f2f5] text-[#65676b] dark:bg-[#3a3b3c] dark:text-[#b0b3b8]'
                                  )}
                                >
                                  #{entry.rank}
                                </span>
                                <div className="min-w-0">
                                  <p className="text-sm font-bold truncate">
                                    {entry.name}
                                  </p>
                                  <p className="text-xs text-[#65676b] dark:text-[#b0b3b8] truncate">
                                    @{entry.username} •{' '}
                                    {locale === 'bn'
                                      ? entry.level.nameBn
                                      : entry.level.nameEn}
                                  </p>
                                </div>
                              </div>
                              <span className="text-sm font-bold text-primary-600 dark:text-primary-400 shrink-0">
                                {entry.lifetimePoints} pts
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
}
