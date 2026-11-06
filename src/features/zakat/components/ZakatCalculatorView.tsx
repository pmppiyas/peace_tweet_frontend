'use client';

import React, { useState, useMemo } from 'react';
import { CheckCircle2, BookOpen, X } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { ZakatState } from '../types/zakat.types';
import {
  DEFAULT_ZAKAT_STATE,
  FiqhTip,
} from '../constants/zakatConstants';
import { calculateZakat } from '../utils/zakatCalculator';

// Modular Accordion & Overview Components (Identical to Mobile)
import { ZakatOverviewChips } from './ZakatOverviewChips';
import { ZakatAccordionNisab } from './ZakatAccordionNisab';
import { ZakatAccordionCash } from './ZakatAccordionCash';
import { ZakatAccordionGold } from './ZakatAccordionGold';
import { ZakatAccordionBusiness } from './ZakatAccordionBusiness';
import { ZakatAccordionDebts } from './ZakatAccordionDebts';
import { ZakatFinalSummaryCard } from './ZakatFinalSummaryCard';

const ZAKAT_STORAGE_KEY = 'peacetweet_frontend_zakat_saved';

type SectionKey = 'nisab' | 'cash' | 'gold' | 'business' | 'debts';

export function ZakatCalculatorView() {
  const { locale } = useLanguage();
  const [pageLocale, setPageLocale] = useState<'bn' | 'en'>(() =>
    locale === 'en' ? 'en' : 'bn'
  );
  const [activeTip, setActiveTip] = useState<FiqhTip | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Accordion state: by default all open so everything calculates together on the same page
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    nisab: true,
    cash: true,
    gold: true,
    business: true,
    debts: true,
  });

  const toggleSection = (key: SectionKey) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAll = (expand: boolean) => {
    setOpenSections({
      nisab: expand,
      cash: expand,
      gold: expand,
      business: expand,
      debts: expand,
    });
  };

  const isAllOpen = Object.values(openSections).every(Boolean);

  const [state, setState] = useState<ZakatState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(ZAKAT_STORAGE_KEY);
        if (saved) {
          return { ...DEFAULT_ZAKAT_STATE, ...JSON.parse(saved) };
        }
      } catch {}
    }
    return DEFAULT_ZAKAT_STATE;
  });

  const results = useMemo(() => calculateZakat(state), [state]);

  const handleChangeField = (field: keyof ZakatState, val: any) => {
    setState((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(ZAKAT_STORAGE_KEY, JSON.stringify(state));
        setSaveToast(
          pageLocale === 'bn'
            ? 'যাকাতের হিসাব সফলভাবে সংরক্ষিত হয়েছে!'
            : 'Zakat calculation saved in your browser!'
        );
        setTimeout(() => setSaveToast(null), 3500);
      } catch {}
    }
  };

  const handleReset = () => {
    setState(DEFAULT_ZAKAT_STATE);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ZAKAT_STORAGE_KEY, JSON.stringify(DEFAULT_ZAKAT_STATE));
    }
    setSaveToast(
      pageLocale === 'bn' ? 'যাকাতের হিসাব রিসেট করা হয়েছে।' : 'Calculation reset.'
    );
    setTimeout(() => setSaveToast(null), 2500);
  };

  const handleShareInspiration = async () => {
    const text =
      pageLocale === 'bn'
        ? 'পবিত্র কুরআনের নির্দেশ অনুযায়ী আপনার বার্ষিক যাকাত হিসাব করুন PeaceTweet যাকাত ক্যালকুলেটরে: https://peacetweet.com/zakat'
        : 'Calculate your annual Zakat easily with PeaceTweet Zakat Calculator: https://peacetweet.com/zakat';

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title:
            pageLocale === 'bn'
              ? 'যাকাত ক্যালকুলেটর | PeaceTweet'
              : 'Zakat Calculator | PeaceTweet',
          text,
          url: 'https://peacetweet.com/zakat',
        });
        return;
      } catch {}
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        setSaveToast(
          pageLocale === 'bn'
            ? 'যাকাত আহবানের বার্তা কপি করা হয়েছে!'
            : 'Zakat invitation message copied to clipboard!'
        );
        setTimeout(() => setSaveToast(null), 3000);
      } catch {}
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Toast Alert */}
      {saveToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Quick Overview Chips with Reset, Save, Collapse & Language Toggle */}
      <ZakatOverviewChips
        results={results}
        isAllOpen={isAllOpen}
        onToggleAll={toggleAll}
        onReset={handleReset}
        onSave={handleSave}
        onToggleLanguage={() => setPageLocale((prev) => (prev === 'bn' ? 'en' : 'bn'))}
        locale={pageLocale}
      />

      {/* All Sections in Flow (Same as Mobile App) */}
      <div className="space-y-3">
        {/* 1. Nisab & Rates Accordion */}
        <ZakatAccordionNisab
          state={state}
          onChangeField={handleChangeField}
          isOpen={openSections.nisab}
          onToggle={() => toggleSection('nisab')}
          nisabThreshold={results.nisabThreshold}
          onOpenTip={setActiveTip}
          locale={pageLocale}
        />

        {/* 2. Cash & Bank Accordion */}
        <ZakatAccordionCash
          state={state}
          onChangeField={handleChangeField}
          isOpen={openSections.cash}
          onToggle={() => toggleSection('cash')}
          totalCash={results.totalCashAssets}
          onOpenTip={setActiveTip}
          locale={pageLocale}
        />

        {/* 3. Gold & Silver Accordion */}
        <ZakatAccordionGold
          state={state}
          onChangeField={handleChangeField}
          isOpen={openSections.gold}
          onToggle={() => toggleSection('gold')}
          totalGoldSilver={results.totalGoldSilverAssets}
          onOpenTip={setActiveTip}
          locale={pageLocale}
        />

        {/* 4. Business & Investments Accordion */}
        <ZakatAccordionBusiness
          state={state}
          onChangeField={handleChangeField}
          isOpen={openSections.business}
          onToggle={() => toggleSection('business')}
          totalBusiness={results.totalBusinessAssets}
          onOpenTip={setActiveTip}
          locale={pageLocale}
        />

        {/* 5. Deductible Debts Accordion */}
        <ZakatAccordionDebts
          state={state}
          onChangeField={handleChangeField}
          isOpen={openSections.debts}
          onToggle={() => toggleSection('debts')}
          totalDebts={results.totalLiabilities}
          onOpenTip={setActiveTip}
          locale={pageLocale}
        />

        {/* 6. Final Calculation Summary Card (Category Box style at bottom) */}
        <ZakatFinalSummaryCard
          results={results}
          yearStandard={state.yearStandard}
          onShare={handleShareInspiration}
          onSave={handleSave}
          onReset={handleReset}
          locale={pageLocale}
        />
      </div>

      {/* FIQH TIP MODAL */}
      {activeTip && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {pageLocale === 'bn' ? activeTip.titleBn : activeTip.titleEn}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTip(null)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs leading-6 text-slate-600 dark:text-slate-300 mb-5">
              {pageLocale === 'bn' ? activeTip.descBn : activeTip.descEn}
            </p>
            <button
              type="button"
              onClick={() => setActiveTip(null)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all">
              {pageLocale === 'bn' ? 'বুঝতে পেরেছি' : 'Understood'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
