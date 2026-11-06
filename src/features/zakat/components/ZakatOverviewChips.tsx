'use client';

import React from 'react';
import { RotateCcw, Save, ChevronsUpDown, Globe } from 'lucide-react';
import { ZakatCalculationResult } from '../types/zakat.types';
import { formatBangladeshiCurrency } from '../utils/zakatCalculator';

interface ZakatOverviewChipsProps {
  results: ZakatCalculationResult;
  isAllOpen: boolean;
  onToggleAll: (expand: boolean) => void;
  onReset?: () => void;
  onSave?: () => void;
  onToggleLanguage?: () => void;
  locale?: string;
}

export function ZakatOverviewChips({
  results,
  isAllOpen,
  onToggleAll,
  onReset,
  onSave,
  onToggleLanguage,
  locale = 'bn',
}: ZakatOverviewChipsProps) {
  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs p-4 mb-4">
      {/* Header Row with Actions */}
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {locale === 'bn' ? 'যাকাত হিসাব একনজরে' : 'Real-time Overview'}
        </span>

        <div className="flex items-center gap-1.5 flex-wrap">
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors">
              <RotateCcw className="w-3 h-3" />
              <span>{locale === 'bn' ? 'রিসেট' : 'Reset'}</span>
            </button>
          )}

          {onSave && (
            <button
              type="button"
              onClick={onSave}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors">
              <Save className="w-3 h-3" />
              <span>{locale === 'bn' ? 'সংরক্ষণ' : 'Save'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onToggleAll(!isAllOpen)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-emerald-600 dark:text-emerald-400 transition-colors">
            <ChevronsUpDown className="w-3 h-3" />
            <span>
              {isAllOpen
                ? locale === 'bn'
                  ? 'সব গুটিয়ে নিন'
                  : 'Collapse'
                : locale === 'bn'
                ? 'সব খুলুন'
                : 'Expand'}
            </span>
          </button>

          {onToggleLanguage && (
            <button
              type="button"
              onClick={onToggleLanguage}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border border-primary-300 dark:border-primary-700 bg-primary-50 hover:bg-primary-100 dark:bg-primary-950/50 dark:hover:bg-primary-900/60 text-primary-700 dark:text-primary-300 transition-colors">
              <Globe className="w-3 h-3" />
              <span>{locale === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 Real-time Overview Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Total Assets */}
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40">
          <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold">
            {locale === 'bn' ? 'মোট সম্পদ (+)' : 'Total Assets (+)'}
          </div>
          <div className="text-sm font-bold text-emerald-700 dark:text-emerald-200 mt-0.5 truncate">
            {formatBangladeshiCurrency(results.totalAssets, locale)}
          </div>
        </div>

        {/* Total Debts */}
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/40">
          <div className="text-[11px] text-rose-800 dark:text-rose-300 font-semibold">
            {locale === 'bn' ? 'মোট দেনা (-)' : 'Total Debts (-)'}
          </div>
          <div className="text-sm font-bold text-rose-700 dark:text-rose-200 mt-0.5 truncate">
            - {formatBangladeshiCurrency(results.totalLiabilities, locale)}
          </div>
        </div>

        {/* Net Wealth */}
        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/40">
          <div className="text-[11px] text-blue-800 dark:text-blue-300 font-semibold">
            {locale === 'bn' ? 'নিট সম্পদ' : 'Net Wealth'}
          </div>
          <div className="text-sm font-bold text-blue-700 dark:text-blue-200 mt-0.5 truncate">
            {formatBangladeshiCurrency(results.netZakatableWealth, locale)}
          </div>
        </div>
      </div>
    </div>
  );
}
