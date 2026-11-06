'use client';

import React from 'react';
import { MinusCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { ZakatNumericInput } from './ZakatNumericInput';
import { ZakatState } from '../types/zakat.types';
import { ZAKAT_TIPS, FiqhTip } from '../constants/zakatConstants';
import { formatBangladeshiCurrency } from '../utils/zakatCalculator';

interface ZakatAccordionDebtsProps {
  state: ZakatState;
  onChangeField: (field: keyof ZakatState, val: number) => void;
  isOpen: boolean;
  onToggle: () => void;
  totalDebts: number;
  onOpenTip: (tip: FiqhTip) => void;
  locale?: string;
}

export function ZakatAccordionDebts({
  state,
  onChangeField,
  isOpen,
  onToggle,
  totalDebts,
  onOpenTip,
  locale = 'bn',
}: ZakatAccordionDebtsProps) {
  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs mb-3 overflow-hidden">
      <div
        onClick={onToggle}
        className="p-4 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600">
            <MinusCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {locale === 'bn' ? '৫. বাদযোগ্য ঋণ ও বকেয়া দেনা' : '5. Deductible Debts & Due Bills'}
            </h3>
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
              - {formatBangladeshiCurrency(totalDebts, locale)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenTip(ZAKAT_TIPS.debts);
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
          <p className="text-xs text-rose-500 mb-3">
            {locale === 'bn'
              ? 'এই দেনাগুলো আপনার মোট যাকাতযোগ্য সম্পদ থেকে স্বয়ংক্রিয়ভাবে বিয়োগ হবে।'
              : 'These liabilities will be subtracted from your total zakatable wealth.'}
          </p>

          <ZakatNumericInput
            labelBn="তাৎক্ষণিক প্রদেয় ব্যক্তিগত বা ব্যাংক ঋণ"
            labelEn="Immediate Due Loans (Bank or Personal)"
            value={state.immediateDebts}
            onChangeValue={(v) => onChangeField('immediateDebts', v)}
            tipKey="debts"
            onOpenTip={onOpenTip}
            locale={locale}
          />
          <ZakatNumericInput
            labelBn="চলতি মাসের বকেয়া বাড়িভাড়া ও ইউটিলিটি বিল"
            labelEn="Due Rent and Utility Bills"
            value={state.dueBillsAndRent}
            onChangeValue={(v) => onChangeField('dueBillsAndRent', v)}
            locale={locale}
          />
          <ZakatNumericInput
            labelBn="কর্মচারীদের বকেয়া বেতন"
            labelEn="Staff / Employee Due Salaries"
            value={state.staffSalaryDue}
            onChangeValue={(v) => onChangeField('staffSalaryDue', v)}
            locale={locale}
          />
          <ZakatNumericInput
            labelBn="দোকানের সাপ্লায়ার বা মহাজনের বকেয়া দেনা"
            labelEn="Trade Payables / Suppliers Due"
            value={state.suppliersDue}
            onChangeValue={(v) => onChangeField('suppliersDue', v)}
            locale={locale}
          />
          <ZakatNumericInput
            labelBn="দীর্ঘমেয়াদী লোনের চলতি বছরের প্রদেয় কিস্তি"
            labelEn="Long-term Loan Current Year Installment"
            value={state.currentInstallmentDue}
            onChangeValue={(v) => onChangeField('currentInstallmentDue', v)}
            tipKey="debts"
            onOpenTip={onOpenTip}
            locale={locale}
          />
        </div>
      )}
    </div>
  );
}
