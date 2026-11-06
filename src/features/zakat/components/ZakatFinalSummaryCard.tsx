'use client';

import React from 'react';
import { Calculator, CheckCircle2, Info, Share2, Save, RotateCcw } from 'lucide-react';
import { ZakatCalculationResult, YearStandard } from '../types/zakat.types';
import { formatBangladeshiCurrency } from '../utils/zakatCalculator';

interface ZakatFinalSummaryCardProps {
  results: ZakatCalculationResult;
  yearStandard: YearStandard;
  onShare: () => void;
  onSave?: () => void;
  onReset?: () => void;
  locale?: string;
}

export function ZakatFinalSummaryCard({
  results,
  yearStandard,
  onShare,
  onSave,
  onReset,
  locale = 'bn',
}: ZakatFinalSummaryCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs mb-0 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {locale === 'bn' ? '৬. যাকাত হিসাবের ফলাফল' : '6. Final Zakat Summary'}
            </h3>
            <p className="text-[11px] text-slate-500">
              {results.zakatRatePercent}%{' '}
              {yearStandard === 'HIJRI'
                ? locale === 'bn'
                  ? 'হিজরি চন্দ্রবছর'
                  : 'Hijri Lunar'
                : locale === 'bn'
                ? 'ইংরেজি সৌরবছর'
                : 'Solar Year'}
            </p>
          </div>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/40">
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
            {results.isEligibleForZakat
              ? locale === 'bn'
                ? 'যাকাত ফরজ'
                : 'Obligatory'
              : locale === 'bn'
              ? 'নিসাব পৌঁছেনি'
              : 'Below Nisab'}
          </span>
        </div>
      </div>

      <div className="p-4 pb-3">
        {/* Breakdown Rows */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between py-1 text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              {locale === 'bn' ? 'মোট যাকাতযোগ্য সম্পদ (+):' : 'Total Assets (+):'}
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {formatBangladeshiCurrency(results.totalAssets, locale)}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 text-xs">
            <span className="text-rose-500">
              {locale === 'bn' ? 'বাদযোগ্য দেনা ও ঋণ (-):' : 'Deductible Debts (-):'}
            </span>
            <span className="font-semibold text-rose-600 dark:text-rose-400">
              - {formatBangladeshiCurrency(results.totalLiabilities, locale)}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-dashed border-slate-200 dark:border-slate-700 mt-1 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {locale === 'bn' ? 'নিট যাকাতযোগ্য সম্পদ:' : 'Net Zakatable Wealth:'}
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {formatBangladeshiCurrency(results.netZakatableWealth, locale)}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              {locale === 'bn' ? 'নিসাব সীমা (ন্যূনতম শর্ত):' : 'Nisab Threshold:'}
            </span>
            <span className="font-medium text-slate-600 dark:text-slate-300">
              {formatBangladeshiCurrency(results.nisabThreshold, locale)}
            </span>
          </div>
        </div>

        {/* Prominent Payable Zakat Box */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/60 mb-3">
          <div className="text-xs text-emerald-800 dark:text-emerald-300 font-bold mb-0.5">
            {locale === 'bn'
              ? `প্রদেয় যাকাতের পরিমাণ (${results.zakatRatePercent}%):`
              : `Payable Zakat Amount (${results.zakatRatePercent}%):`}
          </div>

          <div className="text-2xl md:text-3xl font-black text-emerald-600 dark:text-emerald-400 mb-2">
            {formatBangladeshiCurrency(results.payableZakat, locale)}
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {results.isEligibleForZakat ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                  {locale === 'bn'
                    ? 'আলহামদুলিল্লাহ, আপনার ওপর যাকাত ফরজ হয়েছে।'
                    : 'Alhamdulillah, Zakat is obligatory on your wealth.'}
                </span>
              </>
            ) : (
              <>
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {locale === 'bn'
                    ? 'আপনার সম্পদ এখনও নিসাব পরিমাণ পৌঁছেনি।'
                    : 'Your wealth has not reached the Nisab threshold.'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onShare}
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 shadow-xs transition-colors">
            <Share2 className="w-4 h-4" />
            <span>{locale === 'bn' ? 'যাকাত আদায় আহ্বান শেয়ার' : 'Share Inspiration'}</span>
          </button>

          {onSave && (
            <button
              type="button"
              onClick={onSave}
              className="py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs inline-flex items-center gap-1.5 transition-colors">
              <Save className="w-4 h-4" />
              <span>{locale === 'bn' ? 'সংরক্ষণ' : 'Save'}</span>
            </button>
          )}

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs inline-flex items-center gap-1.5 transition-colors">
              <RotateCcw className="w-4 h-4" />
              <span>{locale === 'bn' ? 'রিসেট' : 'Reset'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
