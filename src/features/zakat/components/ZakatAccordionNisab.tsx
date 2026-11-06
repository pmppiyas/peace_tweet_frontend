'use client';

import React from 'react';
import { Settings, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { ZakatNumericInput } from './ZakatNumericInput';
import { ZakatState } from '../types/zakat.types';
import {
  SILVER_NISAB_VORI,
  GOLD_NISAB_VORI,
  DEFAULT_SILVER_PRICE_PER_VORI,
  DEFAULT_GOLD_PRICE_PER_VORI,
  ZAKAT_TIPS,
  FiqhTip,
} from '../constants/zakatConstants';
import { formatBangladeshiCurrency } from '../utils/zakatCalculator';

interface ZakatAccordionNisabProps {
  state: ZakatState;
  onChangeField: (field: keyof ZakatState, val: any) => void;
  isOpen: boolean;
  onToggle: () => void;
  nisabThreshold: number;
  onOpenTip: (tip: FiqhTip) => void;
  locale?: string;
}

export function ZakatAccordionNisab({
  state,
  onChangeField,
  isOpen,
  onToggle,
  nisabThreshold,
  onOpenTip,
  locale = 'bn',
}: ZakatAccordionNisabProps) {
  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs mb-3 overflow-hidden">
      <div
        onClick={onToggle}
        className="p-4 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {locale === 'bn' ? '১. নিসাব নির্বাচন ও বাজারদর' : '1. Nisab & Market Rates'}
            </h3>
            <span className="text-[11px] text-slate-500">
              {state.nisabStandard === 'SILVER'
                ? locale === 'bn'
                  ? `রূপার নিসাব: ${formatBangladeshiCurrency(nisabThreshold, locale)}`
                  : `Silver Nisab: ${formatBangladeshiCurrency(nisabThreshold, locale)}`
                : locale === 'bn'
                ? `স্বর্ণের নিসাব: ${formatBangladeshiCurrency(nisabThreshold, locale)}`
                : `Gold Nisab: ${formatBangladeshiCurrency(nisabThreshold, locale)}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenTip(ZAKAT_TIPS.nisab);
            }}
            className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold hover:opacity-80">
            ?
          </button>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-700/60">
          <p className="text-xs text-slate-500 mb-3">
            {locale === 'bn'
              ? 'নগদ টাকা বা মিশ্র সম্পদ থাকলে রূপার নিসাব (৫২.৫ ভরি) ধরা বাংলাদেশের আলেমদের সর্বসম্মত ফতোয়া।'
              : 'Silver Nisab (52.5 Vori) is universally recommended for mixed cash and wealth in Bangladesh.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => onChangeField('nisabStandard', 'SILVER')}
              className={`p-3 rounded-xl border text-left transition-all ${
                state.nisabStandard === 'SILVER'
                  ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800'
              }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  {locale === 'bn' ? 'রূপার নিসাব (প্রস্তাবিত)' : 'Silver (Recommended)'}
                </span>
                {state.nisabStandard === 'SILVER' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                )}
              </div>
              <div className="text-[11px] text-slate-500">
                {SILVER_NISAB_VORI} {locale === 'bn' ? 'ভরি রূপা' : 'Vori Silver'}
              </div>
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                ≈ {formatBangladeshiCurrency(SILVER_NISAB_VORI * state.silverPricePerVori, locale)}
              </div>
            </button>

            <button
              type="button"
              onClick={() => onChangeField('nisabStandard', 'GOLD')}
              className={`p-3 rounded-xl border text-left transition-all ${
                state.nisabStandard === 'GOLD'
                  ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 ring-1 ring-amber-500'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800'
              }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                  {locale === 'bn' ? 'স্বর্ণের নিসাব' : 'Gold Nisab'}
                </span>
                {state.nisabStandard === 'GOLD' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                )}
              </div>
              <div className="text-[11px] text-slate-500">
                {GOLD_NISAB_VORI} {locale === 'bn' ? 'ভরি স্বর্ণ' : 'Vori Gold'}
              </div>
              <div className="text-xs font-bold text-amber-700 dark:text-amber-400 mt-1">
                ≈ {formatBangladeshiCurrency(GOLD_NISAB_VORI * state.goldPricePerVori, locale)}
              </div>
            </button>
          </div>

          {/* Market Price Input - Only show the input for whichever Nisab standard is currently selected */}
          {state.nisabStandard === 'SILVER' ? (
            <ZakatNumericInput
              labelBn="প্রতি ভরি রূপার দর"
              labelEn="Silver Price per Vori"
              value={state.silverPricePerVori}
              onChangeValue={(v) => onChangeField('silverPricePerVori', v)}
              placeholder={String(DEFAULT_SILVER_PRICE_PER_VORI)}
              locale={locale}
            />
          ) : (
            <ZakatNumericInput
              labelBn="প্রতি ভরি ২২ ক্যারেট স্বর্ণের দর"
              labelEn="Gold Price per Vori (22K)"
              value={state.goldPricePerVori}
              onChangeValue={(v) => onChangeField('goldPricePerVori', v)}
              placeholder={String(DEFAULT_GOLD_PRICE_PER_VORI)}
              locale={locale}
            />
          )}

          <div className="border-t border-slate-100 dark:border-slate-700/60 pt-3 mt-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              {locale === 'bn' ? 'বছর গণনার ধরন' : 'Year Calculation Method'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onChangeField('yearStandard', 'HIJRI')}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-left ${
                  state.yearStandard === 'HIJRI'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                    : 'border-slate-200 dark:border-slate-700'
                }`}>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {locale === 'bn' ? 'হিজরি চন্দ্রবছর' : 'Hijri (Lunar)'}
                  </div>
                  <div className="text-[10px] text-slate-400">২.৫% (১/৪০ অংশ)</div>
                </div>
                {state.yearStandard === 'HIJRI' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                )}
              </button>

              <button
                type="button"
                onClick={() => onChangeField('yearStandard', 'SOLAR')}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-left ${
                  state.yearStandard === 'SOLAR'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                    : 'border-slate-200 dark:border-slate-700'
                }`}>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {locale === 'bn' ? 'ইংরেজি সৌরবছর' : 'Solar (365 days)'}
                  </div>
                  <div className="text-[10px] text-slate-400">২.৫৭৭%</div>
                </div>
                {state.yearStandard === 'SOLAR' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
