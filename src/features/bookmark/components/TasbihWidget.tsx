'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { cn } from '@/lib/utils/cn';

export const TASBIH_TARGETS = [3, 7, 11, 15, 33, 100] as const;
export type TasbihTarget = (typeof TASBIH_TARGETS)[number];

export interface TasbihItem {
  id?: string;
  title: string;
  arabicText?: string;
  transliteration?: string;
}

export const DEFAULT_TASBIH_ITEMS: TasbihItem[] = [
  {
    id: 'subhanallah',
    title: 'সুবহানাল্লাহ',
    arabicText: 'سُبْحَانَ اللَّهِ',
    transliteration: 'সুবহানাল্লাহ',
  },
  {
    id: 'alhamdulillah',
    title: 'আলহামদুলিল্লাহ',
    arabicText: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'আলহামদুলিল্লাহ',
  },
  {
    id: 'allahuakbar',
    title: 'আল্লাহু আকবার',
    arabicText: 'اللَّهُ أَكْبَرُ',
    transliteration: 'আল্লাহু আকবার',
  },
  {
    id: 'lailahaillallah',
    title: 'লা ইলাহা ইল্লাল্লাহ',
    arabicText: 'لَا إِلَهَ إِلَّا اللَّهُ',
    transliteration: 'লা ইলাহা ইল্লাল্লাহ',
  },
  {
    id: 'astaghfirullah',
    title: 'আস্তাগফিরুল্লাহ',
    arabicText: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'আস্তাগফিরুল্লাহ',
  },
  {
    id: 'hawqala',
    title: 'লা হাওলা ওয়া লা কুওয়াতা ইল্লা বিল্লাহ',
    arabicText: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'লা হাওলা ওয়া লা কুওয়াতা ইল্লা বিল্লাহ',
  },
  {
    id: 'salawat',
    title: 'দুরূদ শরীফ',
    arabicText: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    transliteration: 'আল্লাহুম্মা সাল্লি আলা মুহাম্মাদ ওয়া আলা আলি মুহাম্মাদ',
  },
  {
    id: 'subhanallah_bihamdihi',
    title: 'সুবহানাল্লাহি ওয়া বিহামদিহি',
    arabicText: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transliteration: 'সুবহানাল্লাহি ওয়া বিহামদিহি, সুবহানাল্লাহিল আজিম',
  },
  {
    id: 'dua_yunus',
    title: 'দোয়া ইউনুস',
    arabicText: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transliteration: 'লা ইলাহা ইল্লা আনতা সুবহানাকা ইন্নি কুনতু মিনাজ জোয়ালিমিন',
  },
  {
    id: 'hasbunallah',
    title: 'হাসবুনাল্লাহু ওয়া নি’মাল ওয়াকিল',
    arabicText: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: 'হাসবুনাল্লাহু ওয়া নি’মাল ওয়াকিল',
  },
];

export interface TasbihWidgetProps {
  className?: string;
  duaTitle?: string;
  arabicText?: string;
  transliteration?: string;
  items?: TasbihItem[];
  showCloseButton?: boolean;
  onClose?: () => void;
}

export function TasbihWidget({
  className,
  duaTitle,
  arabicText,
  transliteration,
  items: customItems,
  showCloseButton = false,
  onClose,
}: TasbihWidgetProps) {
  const { locale } = useLanguage();
  const [target, setTarget] = useState<TasbihTarget>(33);
  const [count, setCount] = useState<number>(0);
  const [lap, setLap] = useState<number>(1);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [totalToday, setTotalToday] = useState<number>(0);
  const [isTargetReached, setIsTargetReached] = useState<boolean>(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const autoNextTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const items: TasbihItem[] = React.useMemo(() => {
    if (customItems && customItems.length > 0) return customItems;
    if (duaTitle || arabicText || transliteration) {
      const currentItem: TasbihItem = {
        id: 'current-dua',
        title: duaTitle || (locale === 'bn' ? 'সংরক্ষিত দোয়া' : 'Saved Dua'),
        arabicText,
        transliteration,
      };
      const rest = DEFAULT_TASBIH_ITEMS.filter(
        (i) => i.arabicText !== arabicText && i.transliteration !== transliteration
      );
      return [currentItem, ...rest];
    }
    return DEFAULT_TASBIH_ITEMS;
  }, [customItems, duaTitle, arabicText, transliteration, locale]);

  const currentItem = items[currentIndex] || items[0] || DEFAULT_TASBIH_ITEMS[0];

  useEffect(() => {
    return () => {
      if (autoNextTimeoutRef.current) {
        clearTimeout(autoNextTimeoutRef.current);
      }
    };
  }, []);

  const handleNextZikr = useCallback(() => {
    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setCount(0);
    setIsTargetReached(false);
  }, [items.length]);

  const handlePrevZikr = useCallback(() => {
    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setCount(0);
    setIsTargetReached(false);
  }, [items.length]);

  // Load saved state from localStorage on mount
  useEffect(() => {
    try {
      const savedCount = localStorage.getItem('pt_tasbih_count');
      const savedTarget = localStorage.getItem('pt_tasbih_target');
      const savedLap = localStorage.getItem('pt_tasbih_lap');
      const savedSound = localStorage.getItem('pt_tasbih_sound');
      const savedToday = localStorage.getItem('pt_tasbih_today');

      if (savedCount) setCount(Number(savedCount) || 0);
      if (savedTarget && TASBIH_TARGETS.includes(Number(savedTarget) as any)) {
        setTarget(Number(savedTarget) as TasbihTarget);
      }
      if (savedLap) setLap(Number(savedLap) || 1);
      if (savedSound !== null) setIsSoundEnabled(savedSound === 'true');
      if (savedToday) setTotalToday(Number(savedToday) || 0);
    } catch {}
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pt_tasbih_count', String(count));
      localStorage.setItem('pt_tasbih_target', String(target));
      localStorage.setItem('pt_tasbih_lap', String(lap));
      localStorage.setItem('pt_tasbih_sound', String(isSoundEnabled));
      localStorage.setItem('pt_tasbih_today', String(totalToday));
    } catch {}
  }, [count, target, lap, isSoundEnabled, totalToday]);

  const playClickSound = useCallback(() => {
    if (!isSoundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch {}
  }, [isSoundEnabled]);

  const playTargetSound = useCallback(() => {
    if (!isSoundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } catch {}
  }, [isSoundEnabled]);

  const handleIncrement = () => {
    // If target was already reached and waiting or tapped again, immediately advance
    if (count >= target || isTargetReached) {
      if (autoNextTimeoutRef.current) {
        clearTimeout(autoNextTimeoutRef.current);
        autoNextTimeoutRef.current = null;
      }
      handleNextZikr();
      playClickSound();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(25);
      }
      return;
    }

    const nextCount = count + 1;
    setTotalToday((prev) => prev + 1);

    if (nextCount >= target) {
      setCount(target);
      setLap((prev) => prev + 1);
      setIsTargetReached(true);
      playTargetSound();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([80, 50, 80]);
      }

      // Automatically advance to the next zikr after 1 lap finishes
      if (autoNextTimeoutRef.current) {
        clearTimeout(autoNextTimeoutRef.current);
      }
      autoNextTimeoutRef.current = setTimeout(() => {
        handleNextZikr();
      }, 700);
    } else {
      setCount(nextCount);
      playClickSound();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(25);
      }
    }
  };

  const handleReset = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }
    setCount(0);
    setLap(1);
    setIsTargetReached(false);
  };

  const handleTargetChange = (newTarget: TasbihTarget) => {
    playClickSound();
    setTarget(newTarget);
    setCount(0);
    setIsTargetReached(false);
  };

  // Circle progress calculation (compact premium h-36 w-36 dial)
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.min(1, count / target);
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div
      className={cn(
        'rounded-3xl border border-[#e4e6eb] bg-white p-4 shadow-sm dark:border-[#393a3b] dark:bg-[#242526] select-none flex flex-col',
        className
      )}
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#e4e6eb] dark:border-[#393a3b] gap-2">
          {/* Left side: Dua title or Digital Tasbih */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl shrink-0">📿</span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#050505] dark:text-[#e4e6eb] truncate">
                {currentItem.title}
              </h3>
              <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
                {locale === 'bn'
                  ? `চক্র: ${lap} • মোট: ${totalToday} • (${currentIndex + 1}/${items.length})`
                  : `Lap: ${lap} • Total: ${totalToday} • (${currentIndex + 1}/${items.length})`}
              </p>
            </div>
          </div>

          {/* Right side: Sound button, Reload button, and X button */}
          <div className="flex items-center gap-1 shrink-0">
            {/* 1. Sound Button */}
            <button
              type="button"
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className="p-1.5 rounded-full text-[#65676b] hover:bg-[#f0f2f5] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] transition-colors cursor-pointer"
              title={isSoundEnabled ? 'শব্দ বন্ধ করুন' : 'শব্দ চালু করুন'}
            >
              {isSoundEnabled ? (
                <Volume2 className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </button>

            {/* 2. Reload / Reset Button (Left of X button) */}
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-full text-[#65676b] hover:bg-[#f0f2f5] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] transition-colors active:rotate-180 duration-200 cursor-pointer"
              title={locale === 'bn' ? 'রিসেট করুন' : 'Reset'}
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {/* 3. Close (X) button */}
            {showCloseButton && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full text-[#65676b] hover:bg-[#f0f2f5] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] transition-colors cursor-pointer ml-0.5"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Pronunciation & Arabic Text recitation box */}
        {(currentItem.transliteration || currentItem.arabicText) && (
          <div className="mt-3 rounded-2xl bg-[#f0f2f5]/80 dark:bg-[#3a3b3c]/50 p-3 text-center space-y-1.5 border border-[#e4e6eb]/60 dark:border-[#393a3b]/60">
            {currentItem.arabicText && (
              <p
                dir="rtl"
                className="font-arabic text-xl sm:text-2xl text-[#050505] dark:text-primary-200 font-bold leading-relaxed select-text"
              >
                {currentItem.arabicText}
              </p>
            )}
            {currentItem.transliteration && (
              <p className="text-sm sm:text-base font-semibold text-[#050505] dark:text-[#e4e6eb] leading-relaxed select-text">
                {currentItem.transliteration.replace(/^["'“‘\s]+|["'”’\s]+$/g, '')}
              </p>
            )}
          </div>
        )}

        {/* Target Count Selector (3, 7, 11, 15, 33, 100) */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-[#65676b] dark:text-[#b0b3b8]">
              {locale === 'bn' ? 'টার্গেট সংখ্যা:' : 'Target Count:'}
            </span>
            <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
              {target} {locale === 'bn' ? 'বার' : 'times'}
            </span>
          </div>
          <div className="grid grid-cols-6 gap-1">
            {TASBIH_TARGETS.map((t) => {
              const isSelected = target === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTargetChange(t)}
                  className={cn(
                    'py-1 text-xs font-bold rounded-xl transition-all text-center cursor-pointer',
                    isSelected
                      ? 'bg-primary-500 text-white shadow-xs scale-102'
                      : 'bg-[#f0f2f5] dark:bg-[#3a3b3c] text-[#050505] dark:text-[#e4e6eb] hover:bg-[#e4e6eb] dark:hover:bg-[#4e4f50]'
                  )}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Interactive Tap Dial with Left (<) and Right (>) Navigation Buttons */}
      <div className="mt-3 mb-1 sm:mt-4 sm:mb-1 flex items-center justify-center gap-5 sm:gap-7">
        {/* Previous Button (<) */}
        <button
          type="button"
          onClick={handlePrevZikr}
          className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-[#2d2f31] border border-[#e4e6eb] dark:border-[#3e4042] text-[#4b4f56] dark:text-[#b0b3b8] shadow-xs hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 dark:hover:border-primary-500/50 hover:bg-primary-50/50 dark:hover:bg-primary-950/30 hover:shadow-md hover:scale-108 active:scale-90 transition-all cursor-pointer select-none"
          title={locale === 'bn' ? 'পূর্ববর্তী দোয়া/যিকির (<)' : 'Previous (<)'}
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5 sm:h-5.5 sm:w-5.5 stroke-[2.8]" />
        </button>

        {/* Tap Dial Button */}
        <button
          type="button"
          onClick={handleIncrement}
          className={cn(
            'relative h-36 w-36 rounded-full flex flex-col items-center justify-center transition-all duration-150 cursor-pointer focus:outline-hidden group select-none active:scale-95',
            isTargetReached
              ? 'bg-gradient-to-b from-emerald-400 via-emerald-600 to-teal-800 text-white shadow-[0_10px_28px_-4px_rgba(16,185,129,0.5),inset_0_2px_4px_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(0,0,0,0.3)] ring-4 ring-emerald-400/30'
              : 'bg-gradient-to-b from-[#3B82F6] via-[#1D4ED8] to-[#1E40AF] text-white shadow-[0_10px_28px_-4px_rgba(37,99,235,0.45),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.3)] ring-4 ring-primary-500/25 hover:shadow-[0_12px_32px_-4px_rgba(37,99,235,0.55)]'
          )}
        >
          {/* Subtle glossy highlight at top for luxury 3D button feel */}
          <div className="pointer-events-none absolute top-2 inset-x-5 h-6 rounded-full bg-gradient-to-b from-white/25 to-transparent blur-[0.5px]" />

          {/* SVG Progress Ring */}
          <svg className="absolute inset-0 h-full w-full -rotate-90 pointer-events-none" viewBox="0 0 144 144">
            <circle
              cx="72"
              cy="72"
              r={radius}
              className="stroke-white/20"
              strokeWidth="5"
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r={radius}
              className="stroke-white transition-all duration-150 drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]"
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <span className="text-[10px] font-bold tracking-widest uppercase text-white/85 mb-0.5 drop-shadow-xs">
            {isTargetReached
              ? locale === 'bn'
                ? 'সম্পন্ন!'
                : 'Completed!'
              : locale === 'bn'
                ? 'ট্যাপ করুন'
                : 'Tap to Count'}
          </span>
          <span className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
            {count}
          </span>
          <span className="text-[11px] font-semibold text-white/85 mt-0.5 drop-shadow-xs">
            / {target}
          </span>

          {isTargetReached && (
            <div className="absolute -bottom-2 flex items-center gap-1 rounded-full bg-emerald-700/95 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-white shadow-lg border border-emerald-400/30 animate-bounce">
              <CheckCircle2 className="h-3 w-3" />
              <span>{locale === 'bn' ? 'মাশাআল্লাহ' : 'MashaAllah'}</span>
            </div>
          )}
        </button>

        {/* Next Button (>) */}
        <button
          type="button"
          onClick={handleNextZikr}
          className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-[#2d2f31] border border-[#e4e6eb] dark:border-[#3e4042] text-[#4b4f56] dark:text-[#b0b3b8] shadow-xs hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 dark:hover:border-primary-500/50 hover:bg-primary-50/50 dark:hover:bg-primary-950/30 hover:shadow-md hover:scale-108 active:scale-90 transition-all cursor-pointer select-none"
          title={locale === 'bn' ? 'পরবর্তী দোয়া/যিকির (>)' : 'Next (>)'}
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5 sm:h-5.5 sm:w-5.5 stroke-[2.8]" />
        </button>
      </div>
    </div>
  );
}
