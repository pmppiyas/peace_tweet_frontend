'use client';

import React from 'react';
import { formatBangladeshiCurrency } from '../utils/zakatCalculator';
import { ZAKAT_TIPS, FiqhTip } from '../constants/zakatConstants';

interface ZakatNumericInputProps {
  labelBn: string;
  labelEn: string;
  value: number;
  onChangeValue: (val: number) => void;
  tipKey?: string;
  onOpenTip?: (tip: FiqhTip) => void;
  locale?: string;
  isFloat?: boolean;
  unitText?: string;
  placeholder?: string;
}

export function ZakatNumericInput({
  labelBn,
  labelEn,
  value,
  onChangeValue,
  tipKey,
  onOpenTip,
  locale = 'bn',
  isFloat = false,
  unitText,
  placeholder = '0',
}: ZakatNumericInputProps) {
  const displayVal = value === 0 ? '' : String(value);

  const handleChange = (text: string) => {
    let sanitized = text.replace(/[^0-9.]/g, '');
    if (isFloat) {
      const parts = sanitized.split('.');
      if (parts.length > 2) {
        sanitized = `${parts[0]}.${parts.slice(1).join('')}`;
      }
    } else {
      sanitized = sanitized.replace(/\./g, '');
    }
    const num = isFloat ? parseFloat(sanitized) || 0 : parseInt(sanitized, 10) || 0;
    onChangeValue(num);
  };

  return (
    <div className="mb-3.5">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <label className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
            {locale === 'bn' ? labelBn : labelEn}
          </label>
          {tipKey && ZAKAT_TIPS[tipKey] && onOpenTip ? (
            <button
              type="button"
              onClick={() => onOpenTip(ZAKAT_TIPS[tipKey])}
              className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold hover:opacity-80">
              ?
            </button>
          ) : null}
        </div>
        {!unitText && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {formatBangladeshiCurrency(value, locale)}
          </span>
        )}
      </div>

      <div className="relative flex items-center">
        {!unitText && <span className="absolute left-3 text-slate-400 font-bold text-xs">৳</span>}
        <input
          type="text"
          inputMode="numeric"
          value={displayVal}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${
            unitText ? 'px-3' : 'pl-7 pr-3'
          } py-1.5 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all`}
        />
        {unitText && (
          <span className="absolute right-3 text-xs font-semibold text-slate-400">
            {unitText}
          </span>
        )}
      </div>
    </div>
  );
}
