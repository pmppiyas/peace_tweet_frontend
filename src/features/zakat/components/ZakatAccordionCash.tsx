'use client';

import React from 'react';
import { CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { ZakatNumericInput } from './ZakatNumericInput';
import { ZakatState } from '../types/zakat.types';
import { ZAKAT_TIPS, FiqhTip } from '../constants/zakatConstants';
import { formatBangladeshiCurrency } from '../utils/zakatCalculator';

interface ZakatAccordionCashProps {
  state: ZakatState;
  onChangeField: (field: keyof ZakatState, val: number) => void;
  isOpen: boolean;
  onToggle: () => void;
  totalCash: number;
  onOpenTip: (tip: FiqhTip) => void;
  locale?: string;
}

export function ZakatAccordionCash({
  state,
  onChangeField,
  isOpen,
  onToggle,
  totalCash,
  onOpenTip,
  locale = 'bn',
}: ZakatAccordionCashProps) {
  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs mb-3 overflow-hidden">
      <div
        onClick={onToggle}
        className="p-4 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {locale === 'bn' ? '২. নগদ অর্থ ও ব্যাংক সঞ্চয়' : '2. Cash & Bank Savings'}
            </h3>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              {formatBangladeshiCurrency(totalCash, locale)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenTip(ZAKAT_TIPS.dps);
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
          <ZakatNumericInput
            labelBn="হাতে থাকা নগদ টাকা"
            labelEn="Cash in Hand"
            value={state.cashInHand}
            onChangeValue={(v) => onChangeField('cashInHand', v)}
            locale={locale}
          />
          <ZakatNumericInput
            labelBn="ব্যাংক অ্যাকাউন্টে জমার ব্যালেন্স"
            labelEn="Bank Account Balance"
            value={state.bankBalance}
            onChangeValue={(v) => onChangeField('bankBalance', v)}
            locale={locale}
          />
          <ZakatNumericInput
            labelBn="ডিপিএস (DPS) - আজ পর্যন্ত জমাকৃত আসল"
            labelEn="DPS (Deposited Principal)"
            value={state.dpsAmount}
            onChangeValue={(v) => onChangeField('dpsAmount', v)}
            tipKey="dps"
            onOpenTip={onOpenTip}
            locale={locale}
          />
          <ZakatNumericInput
            labelBn="এফডিআর (FDR) - জমাকৃত মূল আসল"
            labelEn="FDR (Principal Deposited)"
            value={state.fdrAmount}
            onChangeValue={(v) => onChangeField('fdrAmount', v)}
            tipKey="dps"
            onOpenTip={onOpenTip}
            locale={locale}
          />
          <ZakatNumericInput
            labelBn="মোবাইল ব্যাংকিং (বিকাশ / নগদ / রকেট)"
            labelEn="Mobile Banking (bKash/Nagad)"
            value={state.mobileBanking}
            onChangeValue={(v) => onChangeField('mobileBanking', v)}
            locale={locale}
          />
          <ZakatNumericInput
            labelBn="প্রবাসীদের প্রেরিত বা সঞ্চিত রেমিট্যান্স"
            labelEn="Foreign Remittance Savings"
            value={state.foreignRemittance}
            onChangeValue={(v) => onChangeField('foreignRemittance', v)}
            locale={locale}
          />
        </div>
      )}
    </div>
  );
}
