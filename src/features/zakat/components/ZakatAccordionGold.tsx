'use client';

import React from 'react';
import { TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { ZakatNumericInput } from './ZakatNumericInput';
import { ZakatState } from '../types/zakat.types';
import { ZAKAT_TIPS, FiqhTip } from '../constants/zakatConstants';
import { formatBangladeshiCurrency } from '../utils/zakatCalculator';

interface ZakatAccordionGoldProps {
  state: ZakatState;
  onChangeField: (field: keyof ZakatState, val: any) => void;
  isOpen: boolean;
  onToggle: () => void;
  totalGoldSilver: number;
  onOpenTip: (tip: FiqhTip) => void;
  locale?: string;
}

export function ZakatAccordionGold({
  state,
  onChangeField,
  isOpen,
  onToggle,
  totalGoldSilver,
  onOpenTip,
  locale = 'bn',
}: ZakatAccordionGoldProps) {
  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs mb-3 overflow-hidden">
      <div
        onClick={onToggle}
        className="p-4 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {locale === 'bn' ? '৩. স্বর্ণ ও রূপা অলংকার' : '3. Gold & Silver Jewelry'}
            </h3>
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
              {formatBangladeshiCurrency(totalGoldSilver, locale)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenTip(ZAKAT_TIPS.gold);
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
          {/* Gold Quantity & Unit */}
          <div className="mb-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                {locale === 'bn' ? 'স্বর্ণের মোট পরিমাণ' : 'Total Gold Quantity'}
              </label>
              <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => onChangeField('goldUnit', 'VORI')}
                  className={`px-2 py-0.5 font-bold ${
                    state.goldUnit === 'VORI'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                  {locale === 'bn' ? 'ভরি' : 'Vori'}
                </button>
                <button
                  type="button"
                  onClick={() => onChangeField('goldUnit', 'GRAM')}
                  className={`px-2 py-0.5 font-bold ${
                    state.goldUnit === 'GRAM'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                  {locale === 'bn' ? 'গ্রাম' : 'Gram'}
                </button>
              </div>
            </div>

            <ZakatNumericInput
              labelBn=""
              labelEn=""
              value={state.goldQuantity}
              onChangeValue={(v) => onChangeField('goldQuantity', v)}
              isFloat
              unitText={state.goldUnit === 'VORI' ? (locale === 'bn' ? 'ভরি' : 'Vori') : (locale === 'bn' ? 'গ্রাম' : 'Gram')}
              placeholder="0.0"
              locale={locale}
            />
          </div>

          {/* Silver Quantity & Unit */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                {locale === 'bn' ? 'রূপার মোট পরিমাণ' : 'Total Silver Quantity'}
              </label>
              <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => onChangeField('silverUnit', 'VORI')}
                  className={`px-2 py-0.5 font-bold ${
                    state.silverUnit === 'VORI'
                      ? 'bg-slate-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                  {locale === 'bn' ? 'ভরি' : 'Vori'}
                </button>
                <button
                  type="button"
                  onClick={() => onChangeField('silverUnit', 'GRAM')}
                  className={`px-2 py-0.5 font-bold ${
                    state.silverUnit === 'GRAM'
                      ? 'bg-slate-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                  {locale === 'bn' ? 'গ্রাম' : 'Gram'}
                </button>
              </div>
            </div>

            <ZakatNumericInput
              labelBn=""
              labelEn=""
              value={state.silverQuantity}
              onChangeValue={(v) => onChangeField('silverQuantity', v)}
              isFloat
              unitText={state.silverUnit === 'VORI' ? (locale === 'bn' ? 'ভরি' : 'Vori') : (locale === 'bn' ? 'গ্রাম' : 'Gram')}
              placeholder="0.0"
              locale={locale}
            />
          </div>
        </div>
      )}
    </div>
  );
}
