'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { cn } from '@/lib/utils/cn';

export const TASBIH_TARGETS = [3, 7, 11, 15, 33, 100] as const;
export type TasbihTarget = (typeof TASBIH_TARGETS)[number];

interface TasbihWidgetProps {
  className?: string;
}

export function TasbihWidget({ className }: TasbihWidgetProps) {
  const { locale } = useLanguage();
  const [target, setTarget] = useState<TasbihTarget>(33);
  const [count, setCount] = useState<number>(0);
  const [lap, setLap] = useState<number>(1);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [totalToday, setTotalToday] = useState<number>(0);
  const [isTargetReached, setIsTargetReached] = useState<boolean>(false);

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
    // If target was already reached, start next lap
    if (count >= target) {
      setCount(1);
      setLap((prev) => prev + 1);
      setTotalToday((prev) => prev + 1);
      setIsTargetReached(false);
      playClickSound();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(30);
      }
      return;
    }

    const nextCount = count + 1;
    setCount(nextCount);
    setTotalToday((prev) => prev + 1);

    if (nextCount >= target) {
      setIsTargetReached(true);
      playTargetSound();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([80, 50, 80]);
      }
    } else {
      playClickSound();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(25);
      }
    }
  };

  const handleReset = (e?: React.MouseEvent) => {
    e?.stopPropagation();
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

  // Circle progress calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.min(1, count / target);
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div
      className={cn(
        'rounded-3xl border border-[#e4e6eb] bg-white p-4 shadow-sm dark:border-[#393a3b] dark:bg-[#242526] select-none flex flex-col justify-between',
        className
      )}
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#e4e6eb] dark:border-[#393a3b]">
          <div className="flex items-center gap-2">
            <span className="text-xl">📿</span>
            <div>
              <h3 className="text-sm font-bold text-[#050505] dark:text-[#e4e6eb]">
                {locale === 'bn' ? 'ডিজিটাল তাসবীহ' : 'Digital Tasbih'}
              </h3>
              <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
                {locale === 'bn'
                  ? `চক্র: ${lap} • মোট: ${totalToday}`
                  : `Lap: ${lap} • Total: ${totalToday}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className="p-1.5 rounded-full text-[#65676b] hover:bg-[#f0f2f5] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] transition-colors"
              title={isSoundEnabled ? 'শব্দ বন্ধ করুন' : 'শব্দ চালু করুন'}
            >
              {isSoundEnabled ? (
                <Volume2 className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-full text-[#65676b] hover:bg-[#f0f2f5] dark:text-[#b0b3b8] dark:hover:bg-[#3a3b3c] transition-colors active:rotate-180 duration-200"
              title={locale === 'bn' ? 'রিসেট করুন' : 'Reset'}
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

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

      {/* Main Interactive Tap Dial */}
      <div className="my-5 flex flex-col items-center justify-center">
        <button
          type="button"
          onClick={handleIncrement}
          className={cn(
            'relative h-44 w-44 rounded-full flex flex-col items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer focus:outline-hidden group',
            isTargetReached
              ? 'bg-gradient-to-b from-emerald-500 to-teal-600 text-white ring-4 ring-emerald-400/30'
              : 'bg-gradient-to-b from-primary-500 to-primary-600 text-white ring-4 ring-primary-500/20'
          )}
        >
          {/* SVG Progress Ring */}
          <svg className="absolute inset-0 h-full w-full -rotate-90">
            <circle
              cx="88"
              cy="88"
              r={radius}
              className="stroke-white/20"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="88"
              cy="88"
              r={radius}
              className={cn(
                'transition-all duration-150',
                isTargetReached ? 'stroke-white' : 'stroke-white'
              )}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <span className="text-[11px] font-medium tracking-wider uppercase opacity-80 mb-0.5">
            {isTargetReached
              ? locale === 'bn'
                ? 'সম্পন্ন!'
                : 'Completed!'
              : locale === 'bn'
                ? 'ট্যাপ করুন'
                : 'Tap to Count'}
          </span>
          <span className="text-4xl font-extrabold tracking-tight">
            {count}
          </span>
          <span className="text-xs font-semibold opacity-85 mt-0.5">
            / {target}
          </span>

          {isTargetReached && (
            <div className="absolute -bottom-2 flex items-center gap-1 rounded-full bg-emerald-700 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md animate-bounce">
              <CheckCircle2 className="h-3 w-3" />
              <span>{locale === 'bn' ? 'মাশাআল্লাহ' : 'MashaAllah'}</span>
            </div>
          )}
        </button>
      </div>

      {/* Footer Info / Controls */}
      <div className="pt-2 border-t border-[#e4e6eb] dark:border-[#393a3b] text-center">
        <p className="text-[11px] text-[#65676b] dark:text-[#b0b3b8]">
          {locale === 'bn'
            ? 'পর্দার যেকোনো অংশে ট্যাপ করে পাঠ সম্পন্ন করুন'
            : 'Tap the dial or spacebar to increment count'}
        </p>
      </div>
    </div>
  );
}
