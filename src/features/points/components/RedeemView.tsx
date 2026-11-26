'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Mail,
  ShieldCheck,
  Sparkles,
  LogIn,
  Gift,
  Palette,
  Zap,
  MapPin,
  X,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/providers/LanguageProvider';
import { useToast } from '@/providers/ToastProvider';
import { ROUTES } from '@/constants/routes';
import { pointsApi } from '../api/points.api';
import {
  RedeemCategory,
  RedeemDeliveryInfo,
  RedeemItem,
  RedeemStoreData,
} from '../types/points.types';
import { cn } from '@/lib/utils/cn';

type StoreFilter = 'ALL' | RedeemCategory | 'CLAIMED';

const FILTER_OPTIONS: { key: StoreFilter; bn: string; en: string }[] = [
  { key: 'ALL', bn: 'সব রিওয়ার্ড', en: 'All' },
  { key: 'BADGE', bn: 'ব্যাজ', en: 'Badges' },
  { key: 'COSMETIC', bn: 'স্টাইল ও ফ্রেম', en: 'Cosmetics' },
  { key: 'PERK', bn: 'সুবিধা', en: 'Perks' },
  { key: 'EXTERNAL_GIFT', bn: 'আউটসাইড গিফট', en: 'Outside Gifts' },
  { key: 'CLAIMED', bn: 'আমার রিডিম', en: 'My Claims' },
];

function CategoryIcon({
  category,
  className,
  style,
}: {
  category: RedeemCategory;
  className?: string;
  style?: React.CSSProperties;
}) {
  switch (category) {
    case 'BADGE':
      return <ShieldCheck className={className} style={style} />;
    case 'COSMETIC':
      return <Palette className={className} style={style} />;
    case 'PERK':
      return <Zap className={className} style={style} />;
    case 'EXTERNAL_GIFT':
      return <Gift className={className} style={style} />;
    default:
      return <Sparkles className={className} style={style} />;
  }
}

export function RedeemView() {
  const { isAuthenticated, user, setUser } = useAuth();
  const { locale } = useLanguage();
  const { showToast } = useToast();

  const [store, setStore] = useState<RedeemStoreData | null>(null);
  const [filter, setFilter] = useState<StoreFilter>('ALL');
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [redeemingCode, setRedeemingCode] = useState<string | null>(null);

  const [deliveryModalItem, setDeliveryModalItem] = useState<RedeemItem | null>(
    null,
  );
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');

  const loadStore = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const data = await pointsApi.getRedeemStore();
      setStore(data);
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadStore();
  }, [loadStore]);

  const filteredItems = useMemo(() => {
    const list = store?.items || [];
    if (filter === 'ALL') return list;
    if (filter === 'CLAIMED') return [];
    return list.filter((i) => i.category === filter);
  }, [store?.items, filter]);

  const previewItem = useMemo(() => {
    if (filter !== 'ALL' && filter !== 'BADGE' && filter !== 'COSMETIC') {
      return null;
    }
    const previewPool = (store?.items || []).filter((i) =>
      filter === 'ALL'
        ? i.category === 'BADGE' || i.category === 'COSMETIC'
        : i.category === filter
    );
    if (selectedCode) {
      const found = previewPool.find((i) => i.code === selectedCode);
      if (found) return found;
    }
    return previewPool.find((i) => !i.comingSoon) || previewPool[0] || null;
  }, [store?.items, selectedCode, filter]);

  const executeRedeem = async (
    item: RedeemItem,
    deliveryInfo?: RedeemDeliveryInfo,
  ) => {
    if (redeemingCode) return;
    setRedeemingCode(item.code);
    try {
      const res = await pointsApi.redeemReward(item.code, deliveryInfo);
      if (res?.user) {
        setUser({ ...(user || {}), ...res.user } as any);
      }
      await loadStore();
      setDeliveryModalItem(null);
      setPhone('');
      setAddress('');
      setNote('');
      showToast({
        type: 'success',
        message:
          locale === 'bn'
            ? `অভিনন্দন! ${item.costPoints} পয়েন্টে "${item.titleBn}" রিডিম সম্পন্ন হয়েছে!`
            : `Success! Redeemed "${item.titleEn}" (-${item.costPoints} pts)!`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        message:
          err?.response?.data?.message ||
          (locale === 'bn'
            ? 'রিডিম করতে সমস্যা হয়েছে।'
            : 'Failed to redeem reward.'),
      });
    } finally {
      setRedeemingCode(null);
    }
  };

  const handleToggleEquip = async (item: RedeemItem) => {
    if (redeemingCode) return;
    setRedeemingCode(item.code);
    const nextEquip = !item.isEquipped;
    try {
      const res = await pointsApi.toggleEquipCosmetic(item.code, nextEquip);
      if (res?.user) {
        setUser({ ...(user || {}), ...res.user } as any);
      }
      await loadStore();
      showToast({
        type: 'success',
        message: nextEquip
          ? locale === 'bn'
            ? `"${item.titleBn}" আপনার প্রোফাইলে সক্রিয় হয়েছে!`
            : `"${item.titleEn}" equipped on your profile!`
          : locale === 'bn'
            ? `"${item.titleBn}" বন্ধ করা হয়েছে।`
            : `"${item.titleEn}" unequipped.`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        message:
          err?.response?.data?.message ||
          (locale === 'bn' ? 'আপডেট করা যায়নি।' : 'Failed to update cosmetic.'),
      });
    } finally {
      setRedeemingCode(null);
    }
  };

  const handleRedeem = (item: RedeemItem) => {
    if (redeemingCode || item.comingSoon || !item.canRedeem) return;
    if (item.requiresDeliveryInfo) {
      setRecipientName(user?.name || '');
      setDeliveryModalItem(item);
      return;
    }
    executeRedeem(item);
  };

  const currentPoints = store?.points ?? user?.points ?? 0;
  const emailVerified = store?.emailVerified ?? Boolean(user?.emailVerified);
  const currentUserStatus = store?.userStatus ?? user?.userStatus;

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-hidden bg-[#f0f2f5] dark:bg-[#18191a] text-[#050505] dark:text-[#e4e6eb]">
      <Container
        size="2xl"
        className="h-full px-0 sm:px-4 md:px-4 lg:px-6 2xl:px-8"
      >
        <div className="flex h-full gap-0 md:gap-4 lg:gap-6 2xl:gap-8">
          <Sidebar className="hidden md:block w-56 lg:w-60 xl:w-64 2xl:w-72 shrink-0 space-y-2 h-full overflow-y-auto overscroll-contain no-scrollbar scrollbar-none py-4 pr-2 select-none" />

          <main className="flex-1 w-full min-w-0 h-full overflow-y-auto overscroll-contain no-scrollbar scrollbar-none py-3 sm:py-5 lg:py-6 px-2.5 sm:px-4 lg:px-6 pb-24">
            <div className="max-w-3xl mx-auto space-y-4">
              {!isAuthenticated ? (
                <div className="rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-8 text-center shadow-xs">
                  <div className="mx-auto h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center mb-4">
                    <ShieldCheck className="h-7 w-7 text-emerald-600" />
                  </div>
                  <h1 className="text-xl font-bold mb-2">
                    {locale === 'bn'
                      ? 'রিডিম স্টোর দেখতে লগইন করুন'
                      : 'Sign in to Redeem Rewards'}
                  </h1>
                  <p className="text-sm text-[#65676b] dark:text-[#b0b3b8] mb-5 max-w-md mx-auto">
                    {locale === 'bn'
                      ? 'অর্জিত পয়েন্ট দিয়ে ব্যাজ, প্রোফাইল স্টাইল এবং অ্যাপের বাইরের উপহার সংগ্রহ করুন।'
                      : 'Redeem points for verified badges, profile cosmetics, perks, and real outside gifts.'}
                  </p>
                  <Link
                    href={ROUTES.LOGIN}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold px-5 py-2.5 text-sm"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>{locale === 'bn' ? 'লগইন করুন' : 'Log In'}</span>
                  </Link>
                </div>
              ) : (
                <>
                  {/* Top Bar & Balance */}
                  <div className="rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={ROUTES.POINTS}
                        className="h-9 w-9 rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] flex items-center justify-center transition-colors"
                      >
                        <ArrowLeft className="h-4.5 w-4.5" />
                      </Link>
                      <div>
                        <h1 className="text-lg font-black">
                          {locale === 'bn' ? 'রিডিম শপ ও গিফটস' : 'Rewards & Gift Shop'}
                        </h1>
                        <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
                          {locale === 'bn'
                            ? 'ব্যাজ, প্রোফাইল স্টাইল ও অ্যাপের বাইরের উপহার'
                            : 'Badges, profile cosmetics, perks & external gifts'}
                        </p>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-3.5 py-1.5 text-sm font-extrabold text-amber-700 dark:text-amber-300">
                      <Sparkles className="h-4 w-4" />
                      <span>{currentPoints} pts</span>
                    </div>
                  </div>

                  {isLoading && !store ? (
                    <div className="rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-6 space-y-4 animate-pulse">
                      <div className="h-20 bg-[#e4e6eb] dark:bg-[#3a3b3c] rounded-xl" />
                      <div className="h-36 bg-[#e4e6eb] dark:bg-[#3a3b3c] rounded-xl" />
                    </div>
                  ) : (
                    <>
                      {/* Dynamic Live Preview */}
                      {previewItem ? (
                        <div className="rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-4 sm:p-5 shadow-xs space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#65676b] dark:text-[#b0b3b8]">
                              {locale === 'bn'
                                ? `লাইভ প্রিভিউ: ${previewItem.titleBn}`
                                : `Live Preview: ${previewItem.titleEn}`}
                            </p>
                            <span
                              style={{ color: previewItem.accentColor }}
                              className="text-xs font-bold"
                            >
                              {previewItem.costPoints} pts
                            </span>
                          </div>

                          <div
                            style={
                              previewItem.previewType === 'PROFILE_THEME'
                                ? {
                                    borderColor: previewItem.accentColor,
                                    backgroundColor: `${previewItem.accentColor}12`,
                                  }
                                : undefined
                            }
                            className="rounded-2xl border border-[#e4e6eb] dark:border-[#3a3b3c] bg-[#f8fafc] dark:bg-[#18191a] p-4 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                style={
                                  previewItem.previewType === 'AVATAR_FRAME'
                                    ? {
                                        borderColor: previewItem.accentColor,
                                        borderWidth: 3,
                                        padding: 2,
                                      }
                                    : undefined
                                }
                                className="rounded-full shrink-0"
                              >
                                <div className="relative h-12 w-12 rounded-full bg-primary-600 text-white font-black text-lg flex items-center justify-center overflow-hidden">
                                  {user?.avatarUrl ? (
                                    <Image
                                      src={user.avatarUrl}
                                      alt={user.name || 'User'}
                                      fill
                                      className="object-cover"
                                      unoptimized
                                    />
                                  ) : (
                                    <span>
                                      {user?.name?.charAt(0)?.toUpperCase() || 'P'}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-base font-black truncate">
                                    {user?.name || 'PeaceTweet Member'}
                                  </span>
                                  {previewItem.previewType === 'BADGE_NEXT_TO_NAME' ||
                                  currentUserStatus === 'VERIFIED' ? (
                                    <ShieldCheck className="h-5 w-5 text-emerald-500 fill-emerald-50 dark:text-emerald-400 dark:fill-emerald-950/50 shrink-0" />
                                  ) : (
                                    <CategoryIcon
                                      category={previewItem.category}
                                      className="h-4.5 w-4.5 shrink-0"
                                      style={{ color: previewItem.accentColor }}
                                    />
                                  )}
                                </div>
                                <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 truncate">
                                  @{user?.username || 'member'}
                                  {previewItem.previewType === 'GIFT_BOX'
                                    ? locale === 'bn'
                                      ? ' • গিফট ডেলিভারি প্রিভিউ'
                                      : ' • Gift Claim Preview'
                                    : ''}
                                </p>
                              </div>
                            </div>

                            <span
                              className={cn(
                                'rounded-full px-3 py-1 text-xs font-bold shrink-0',
                                previewItem.isRedeemed
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                  : 'bg-[#e4e6eb] text-[#65676b] dark:bg-[#3a3b3c] dark:text-[#b0b3b8]'
                              )}
                            >
                              {previewItem.isRedeemed
                                ? locale === 'bn'
                                  ? 'সক্রিয়'
                                  : 'Active'
                                : previewItem.comingSoon
                                  ? locale === 'bn'
                                    ? 'শীঘ্রই'
                                    : 'Soon'
                                  : locale === 'bn'
                                    ? 'প্রিভিউ'
                                    : 'Preview'}
                            </span>
                          </div>
                        </div>
                      ) : null}

                      {/* Category Tabs */}
                      <div className="rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
                        {FILTER_OPTIONS.map((opt) => {
                          const active = filter === opt.key;
                          return (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => setFilter(opt.key)}
                              className={cn(
                                'px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer',
                                active
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-[#f0f2f5] hover:bg-[#e4e6eb] text-[#050505] dark:bg-[#3a3b3c] dark:hover:bg-[#4e4f50] dark:text-[#e4e6eb]'
                              )}
                            >
                              {locale === 'bn' ? opt.bn : opt.en}
                            </button>
                          );
                        })}
                      </div>

                      {filter === 'CLAIMED' ? (
                        <div className="rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-4 sm:p-5 shadow-xs space-y-3">
                          <h2 className="text-base font-bold">
                            {locale === 'bn' ? 'আমার রিডিম হিস্ট্রি' : 'My Redeemed Rewards'}
                          </h2>
                          {(store?.redemptions || []).length === 0 ? (
                            <p className="text-sm text-[#65676b] dark:text-[#b0b3b8] py-6 text-center">
                              {locale === 'bn'
                                ? 'আপনি এখনো কোনো রিওয়ার্ড বা গিফট রিডিম করেননি।'
                                : 'You have not redeemed any rewards or gifts yet.'}
                            </p>
                          ) : (
                            <div className="space-y-2.5">
                              {(store?.redemptions || []).map((rec) => (
                                <div
                                  key={rec.id}
                                  className="rounded-xl border border-[#e4e6eb] dark:border-[#3a3b3c] bg-[#f8fafc] dark:bg-[#18191a] p-3.5 flex items-center justify-between gap-3"
                                >
                                  <div className="min-w-0">
                                    <p className="font-bold text-sm truncate">
                                      {locale === 'bn' ? rec.titleBn : rec.titleEn}
                                    </p>
                                    <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
                                      -{rec.pointsSpent} pts •{' '}
                                      {new Date(rec.redeemedAt).toLocaleDateString()}
                                    </p>
                                    {rec.fulfillmentCode ? (
                                      <p className="text-xs font-bold text-primary-600 dark:text-primary-400 mt-1">
                                        Code: {rec.fulfillmentCode}
                                      </p>
                                    ) : null}
                                  </div>
                                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 shrink-0">
                                    {rec.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {filteredItems.map((item) => {
                            const isBusy = redeemingCode === item.code;
                            const isSelected = previewItem?.code === item.code;
                            return (
                              <div
                                key={item.code}
                                onClick={() => {
                                  if (item.category === 'BADGE' || item.category === 'COSMETIC') {
                                    setSelectedCode(item.code);
                                  }
                                }}
                                style={
                                  isSelected
                                    ? { borderColor: item.accentColor }
                                    : undefined
                                }
                                className="rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] p-4 sm:p-5 shadow-xs space-y-4 cursor-pointer transition-colors"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div
                                      style={{
                                        backgroundColor: `${item.accentColor}1A`,
                                      }}
                                      className="h-11 w-11 rounded-2xl flex items-center justify-center shrink-0"
                                    >
                                      <CategoryIcon
                                        category={item.category}
                                        className="h-6 w-6"
                                        style={{ color: item.accentColor }}
                                      />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <h2 className="text-base font-bold">
                                          {locale === 'bn' ? item.titleBn : item.titleEn}
                                        </h2>
                                        {(item.badgeTagBn || item.badgeTagEn) ? (
                                          <span
                                            style={{
                                              backgroundColor: `${item.accentColor}18`,
                                              color: item.accentColor,
                                            }}
                                            className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                                          >
                                            {locale === 'bn'
                                              ? item.badgeTagBn
                                              : item.badgeTagEn}
                                          </span>
                                        ) : null}
                                      </div>
                                      <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                                        {locale === 'bn'
                                          ? `মূল্য: ${item.costPoints} পয়েন্ট`
                                          : `Price: ${item.costPoints} pts`}
                                        {item.redeemCount > 0 && item.isRepeatable
                                          ? locale === 'bn'
                                            ? ` • ${item.redeemCount} বার নেওয়া হয়েছে`
                                            : ` • Claimed ${item.redeemCount}x`
                                          : ''}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <p className="text-sm text-[#65676b] dark:text-[#b0b3b8]">
                                  {locale === 'bn'
                                    ? item.descriptionBn
                                    : item.descriptionEn}
                                </p>

                                <div className="rounded-xl border border-[#e4e6eb] dark:border-[#3a3b3c] bg-[#f8fafc] dark:bg-[#18191a] p-3.5 space-y-2.5 text-sm">
                                  {item.requiresEmailVerified ? (
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-2">
                                        {emailVerified ? (
                                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                                        ) : (
                                          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                                        )}
                                        <span className="font-semibold">
                                          {locale === 'bn'
                                            ? 'জিমেইল ভেরিফিকেশন (বাধ্যতামূলক)'
                                            : 'Gmail Verification (Mandatory)'}
                                        </span>
                                      </div>
                                      {emailVerified ? (
                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                          {locale === 'bn' ? 'সম্পন্ন' : 'Verified'}
                                        </span>
                                      ) : (
                                        <Link
                                          href="/settings?tab=profile"
                                          className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                                        >
                                          {locale === 'bn'
                                            ? 'ভেরিফাই করুন →'
                                            : 'Verify →'}
                                        </Link>
                                      )}
                                    </div>
                                  ) : null}

                                  {item.requiresDeliveryInfo ? (
                                    <div className="flex items-center gap-2">
                                      <MapPin
                                        className="h-4 w-4 shrink-0"
                                        style={{ color: item.accentColor }}
                                      />
                                      <span className="font-semibold">
                                        {locale === 'bn'
                                          ? 'ডেলিভারি / রিসিভার তথ্য প্রয়োজন'
                                          : 'Outside Delivery Info Required'}
                                      </span>
                                    </div>
                                  ) : null}

                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                      {item.pointsNeeded === 0 ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                                      ) : (
                                        <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
                                      )}
                                      <span className="font-semibold">
                                        {locale === 'bn'
                                          ? `প্রয়োজনীয় পয়েন্ট (${item.costPoints} pts)`
                                          : `Required Points (${item.costPoints} pts)`}
                                      </span>
                                    </div>
                                    <span
                                      className={cn(
                                        'text-xs font-bold',
                                        item.pointsNeeded === 0
                                          ? 'text-emerald-600 dark:text-emerald-400'
                                          : 'text-amber-600 dark:text-amber-400'
                                      )}
                                    >
                                      {currentPoints}/{item.costPoints} pts
                                    </span>
                                  </div>
                                </div>

                                {item.comingSoon ? (
                                  <div className="w-full py-3 rounded-xl bg-[#f0f2f5] dark:bg-[#3a3b3c] text-[#65676b] dark:text-[#b0b3b8] font-bold text-sm text-center">
                                    {locale === 'bn'
                                      ? 'শীঘ্রই রিডিমের জন্য উন্মুক্ত হবে'
                                      : 'Coming Soon to Redeem Shop'}
                                  </div>
                                ) : item.isRedeemed && item.category === 'COSMETIC' ? (
                                  <button
                                    type="button"
                                    disabled={isBusy}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleEquip(item);
                                    }}
                                    style={
                                      item.isEquipped
                                        ? {
                                            borderColor: item.accentColor,
                                            color: item.accentColor,
                                            backgroundColor: `${item.accentColor}14`,
                                          }
                                        : { backgroundColor: item.accentColor }
                                    }
                                    className={cn(
                                      'w-full py-3 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-opacity cursor-pointer hover:opacity-90',
                                      !item.isEquipped && 'text-white border-transparent'
                                    )}
                                  >
                                    <CheckCircle2 className="h-4.5 w-4.5" />
                                    <span>
                                      {isBusy
                                        ? locale === 'bn'
                                          ? 'আপডেট হচ্ছে...'
                                          : 'Updating...'
                                        : item.isEquipped
                                          ? locale === 'bn'
                                            ? 'সক্রিয় আছে ✓ (বন্ধ করতে ক্লিক করুন)'
                                            : 'Equipped ✓ (Click to Unequip)'
                                          : locale === 'bn'
                                            ? 'প্রোফাইলে সেট করুন'
                                            : 'Equip on Profile'}
                                    </span>
                                  </button>
                                ) : item.isRedeemed ? (
                                  <div className="w-full py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-sm flex items-center justify-center gap-2">
                                    <CheckCircle2 className="h-4.5 w-4.5" />
                                    <span>
                                      {locale === 'bn'
                                        ? 'ইতিমধ্যেই রিডিম করা হয়েছে ✓'
                                        : 'Already Redeemed ✓'}
                                    </span>
                                  </div>
                                ) : item.missingEmailVerification ? (
                                  <Link
                                    href="/settings?tab=profile"
                                    className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                                  >
                                    <Mail className="h-4.5 w-4.5" />
                                    <span>
                                      {locale === 'bn'
                                        ? 'আগে জিমেইল ভেরিফাই করুন'
                                        : 'Verify Gmail First'}
                                    </span>
                                  </Link>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRedeem(item);
                                    }}
                                    disabled={!item.canRedeem || isBusy}
                                    style={
                                      item.canRedeem
                                        ? { backgroundColor: item.accentColor }
                                        : undefined
                                    }
                                    className={cn(
                                      'w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-opacity cursor-pointer',
                                      item.canRedeem
                                        ? 'text-white hover:opacity-90'
                                        : 'bg-[#e4e6eb] dark:bg-[#3a3b3c] text-[#65676b] dark:text-[#b0b3b8] cursor-not-allowed'
                                    )}
                                  >
                                    <CategoryIcon
                                      category={item.category}
                                      className="h-4.5 w-4.5"
                                    />
                                    <span>
                                      {isBusy
                                        ? locale === 'bn'
                                          ? 'প্রসেস হচ্ছে...'
                                          : 'Redeeming...'
                                        : item.canRedeem
                                          ? locale === 'bn'
                                            ? `${item.costPoints} পয়েন্টে রিডিম করুন`
                                            : `Redeem for ${item.costPoints} pts`
                                          : locale === 'bn'
                                            ? `আরও ${item.pointsNeeded} পয়েন্ট প্রয়োজন`
                                            : `Need ${item.pointsNeeded} more pts`}
                                    </span>
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </Container>

      {/* External Gift Delivery Modal */}
      {deliveryModalItem ? (
        <div className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#3a3b3c] p-5 shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-black">
                  {locale === 'bn'
                    ? 'গিফট ডেলিভারির তথ্য দিন'
                    : 'Gift Delivery Details'}
                </h3>
                <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
                  {locale === 'bn'
                    ? `${deliveryModalItem.titleBn} (${deliveryModalItem.costPoints} pts)`
                    : `${deliveryModalItem.titleEn} (${deliveryModalItem.costPoints} pts)`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeliveryModalItem(null)}
                className="p-1 rounded-full hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder={
                  locale === 'bn' ? 'প্রাপকের নাম' : 'Recipient full name'
                }
                className="w-full rounded-xl border border-[#e4e6eb] dark:border-[#3a3b3c] bg-[#f8fafc] dark:bg-[#18191a] px-3 py-2.5 text-sm outline-none"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={locale === 'bn' ? 'মোবাইল নম্বর' : 'Phone number'}
                className="w-full rounded-xl border border-[#e4e6eb] dark:border-[#3a3b3c] bg-[#f8fafc] dark:bg-[#18191a] px-3 py-2.5 text-sm outline-none"
              />
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={
                  locale === 'bn' ? 'সম্পূর্ণ ঠিকানা' : 'Full delivery address'
                }
                className="w-full rounded-xl border border-[#e4e6eb] dark:border-[#3a3b3c] bg-[#f8fafc] dark:bg-[#18191a] px-3 py-2.5 text-sm outline-none"
              />
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={
                  locale === 'bn' ? 'নোট (ঐচ্ছিক)' : 'Optional delivery note'
                }
                className="w-full rounded-xl border border-[#e4e6eb] dark:border-[#3a3b3c] bg-[#f8fafc] dark:bg-[#18191a] px-3 py-2.5 text-sm outline-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeliveryModalItem(null)}
                className="px-4 py-2 rounded-xl bg-[#f0f2f5] dark:bg-[#3a3b3c] text-sm font-bold"
              >
                {locale === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={Boolean(redeemingCode)}
                onClick={() => {
                  if (!recipientName.trim() || !phone.trim() || !address.trim()) {
                    showToast({
                      type: 'warning',
                      message:
                        locale === 'bn'
                          ? 'নাম, মোবাইল নম্বর এবং ঠিকানা লিখুন।'
                          : 'Please fill name, phone, and address.',
                    });
                    return;
                  }
                  executeRedeem(deliveryModalItem, {
                    recipientName: recipientName.trim(),
                    phone: phone.trim(),
                    address: address.trim(),
                    note: note.trim() || undefined,
                  });
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold"
              >
                {redeemingCode
                  ? locale === 'bn'
                    ? 'প্রসেস হচ্ছে...'
                    : 'Submitting...'
                  : locale === 'bn'
                    ? 'কনফার্ম রিডিম'
                    : 'Confirm Redeem'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
