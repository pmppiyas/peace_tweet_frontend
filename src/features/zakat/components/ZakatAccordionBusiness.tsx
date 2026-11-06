'use client';

import React from 'react';
import { Building, ChevronDown, ChevronUp } from 'lucide-react';
import { ZakatNumericInput } from './ZakatNumericInput';
import { ZakatState } from '../types/zakat.types';
import { ZAKAT_TIPS, FiqhTip } from '../constants/zakatConstants';
import { formatBangladeshiCurrency } from '../utils/zakatCalculator';

interface ZakatAccordionBusinessProps {
  state: ZakatState;
  onChangeField: (field: keyof ZakatState, val: number) => void;
  isOpen: boolean;
  onToggle: () => void;
  totalBusiness: number;
  onOpenTip: (tip: FiqhTip) => void;
  locale?: string;
}

export function ZakatAccordionBusiness({
  state,
  onChangeField,
  isOpen,
  onToggle,
  totalBusiness,
  onOpenTip,
  locale = 'bn',
}: ZakatAccordionBusinessProps) {
  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs mb-3 overflow-hidden">
      <div
        onClick={onToggle}
        className="p-4 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {locale === 'bn' ? '৪. ব্যবসা, শেয়ার ও বিনিয়োগ' : '4. Business & Investments'}
            </h3>
            <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
              {formatBangladeshiCurrency(totalBusiness, locale)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenTip(ZAKAT_TIPS.business);
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
            labelBn="দোকানের বিক্রয়যোগ্য পণ্যের পাইকারি বাজারদর"
            labelEn="Inventory / Stock for Sale (Wholesale)"
            value={state.businessStock}
            onChangeValue={(v) => onChangeField('businessStock', v)}
            tipKey="business"
            onOpenTip={onOpenTip}
            locale={locale}
          />
          <ZakatNumericInput
            labelBn="ব্যবসার চলতি ক্যাশ ও ব্যাংক ব্যালেন্স"
            labelEn="Business Cash & Bank"
            value={state.businessCash}
            onChangeValue={(v) => onChangeField('businessCash', v)}
            locale={locale}
          />
          <ZakatNumericInput
            labelBn="দেনাদারদের কাছে নিশ্চিত পাওনা (Good Receivables)"
            labelEn="Receivables (Confirmed Debt owed to you)"
            value={state.receivablesGood}
            onChangeValue={(v) => onChangeField('receivablesGood', v)}
            locale={locale}
          />
          <ZakatNumericInput
            labelBn="পুঁজিবাজার / শেয়ারের বর্তমান বাজারদর"
            labelEn="Stock Market Shares (Current value)"
            value={state.sharesTrading}
            onChangeValue={(v) => onChangeField('sharesTrading', v)}
            locale={locale}
          />
          <ZakatNumericInput
            labelBn="সঞ্চয়পত্রে আসল বিনিয়োগ"
            labelEn="Sanchayapatra Principal"
            value={state.sanchayapatraPrincipal}
            onChangeValue={(v) => onChangeField('sanchayapatraPrincipal', v)}
            locale={locale}
          />
          <ZakatNumericInput
            labelBn="পুনর্বিক্রয়ের উদ্দেশ্যে কেনা জমি বা প্লট"
            labelEn="Land / Flat purchased for Resale"
            value={state.landForResale}
            onChangeValue={(v) => onChangeField('landForResale', v)}
            locale={locale}
          />
        </div>
      )}
    </div>
  );
}
