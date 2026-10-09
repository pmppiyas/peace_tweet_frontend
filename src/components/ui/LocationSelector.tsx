'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Country,
  State,
  City,
  ICountry,
  IState,
  ICity,
} from 'country-state-city';
import {
  getDivisions,
  getDistrictsByDivision,
  getUpazilasByDistrict,
  Division,
  District,
  Upazila,
} from '@/constants/bangladeshGeo';
import { cn } from '@/lib/utils/cn';
import {
  MapPin,
  ChevronDown,
  Search,
  Check,
  X,
  Globe,
  Building2,
} from 'lucide-react';

export interface LocationValue {
  country: string;
  countryCode: string;
  state: string;
  city: string;
  location: string;
}

interface LocationSelectorProps {
  value?: Partial<LocationValue>;
  onChange: (val: LocationValue) => void;
  locale?: string;
  compact?: boolean;
  className?: string;
}

interface CustomSelectOption {
  value: string;
  label: string;
  subLabel?: string;
  flag?: string;
  group?: string;
}

interface CustomSelectProps {
  label?: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  options: CustomSelectOption[];
  disabled?: boolean;
  disabledPlaceholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  icon?: React.ReactNode;
}

// ─────────────────────────────────────────────────────────────
// Reusable Custom Dropdown Component matching PeaceTweet Design
// ─────────────────────────────────────────────────────────────
function CustomSelect({
  label,
  placeholder,
  value,
  onChange,
  options,
  disabled = false,
  disabledPlaceholder,
  searchable = true,
  searchPlaceholder = 'অনুসন্ধান করুন...',
  emptyText = 'কিছু পাওয়া যায়নি',
  className,
  icon,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Auto-focus search input
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Selected Option Object
  const selectedOption = useMemo(() => {
    return options.find((o) => o.value === value);
  }, [options, value]);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase().trim();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.subLabel && o.subLabel.toLowerCase().includes(q)) ||
        o.value.toLowerCase().includes(q)
    );
  }, [options, search]);

  // Grouped options if any
  const groups = useMemo(() => {
    const map = new Map<string, CustomSelectOption[]>();
    let hasGroups = false;
    filteredOptions.forEach((opt) => {
      const g = opt.group || '';
      if (opt.group) hasGroups = true;
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(opt);
    });
    return { map, hasGroups };
  }, [filteredOptions]);

  return (
    <div
      className={cn('relative w-full space-y-1', className)}
      ref={containerRef}
    >
      {label && (
        <label className="block text-[11px] font-bold text-[#65676b] dark:text-[#b0b3b8]">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setSearch('');
          }
        }}
        className={cn(
          'w-full h-9 sm:h-9.5 px-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all select-none',
          'bg-[#f0f2f5] dark:bg-[#3a3b3c] border-[#e4e6eb] dark:border-[#393a3b]',
          disabled
            ? 'opacity-50 cursor-not-allowed text-[#8e8e93] dark:text-[#636466]'
            : 'hover:border-primary-400 dark:hover:border-primary-500 cursor-pointer text-[#050505] dark:text-[#e4e6eb]',
          isOpen &&
            'border-primary-500 ring-2 ring-primary-500/20 bg-white dark:bg-[#242526]'
        )}
      >
        <div className="flex items-center gap-2 truncate pr-2">
          {selectedOption?.flag && (
            <span className="text-sm shrink-0">{selectedOption.flag}</span>
          )}
          {!selectedOption?.flag && icon && (
            <span className="text-[#65676b] dark:text-[#b0b3b8] shrink-0">
              {icon}
            </span>
          )}
          <span
            className={cn(
              'truncate',
              !selectedOption && 'text-[#8e8e93] dark:text-[#8e8e93]'
            )}
          >
            {disabled
              ? disabledPlaceholder || placeholder
              : selectedOption
                ? selectedOption.label
                : placeholder}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 text-[#65676b] dark:text-[#b0b3b8] transition-transform duration-200',
            isOpen && 'transform rotate-180 text-primary-500'
          )}
        />
      </button>

      {/* Floating Popover Menu */}
      {isOpen && !disabled && (
        <div className="absolute left-0 top-full mt-1.5 w-full min-w-[200px] z-50 rounded-xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] shadow-2xl p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
          {/* Search Box if Searchable */}
          {searchable && options.length > 6 && (
            <div className="relative mb-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full h-8 pl-8 pr-7 text-xs rounded-lg border border-[#e4e6eb] dark:border-[#393a3b] bg-[#f0f2f5] dark:bg-[#3a3b3c] text-[#050505] dark:text-[#e4e6eb] placeholder:text-gray-400 focus:outline-hidden focus:border-primary-500"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Options Scrollable List */}
          <div className="max-h-48 overflow-y-auto overscroll-contain space-y-0.5 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs text-[#65676b] dark:text-[#b0b3b8]">
                {emptyText}
              </div>
            ) : groups.hasGroups ? (
              Array.from(groups.map.entries()).map(([grpName, grpOptions]) => (
                <div key={grpName} className="space-y-0.5">
                  {grpName && (
                    <div className="px-2 py-1 text-[10px] font-bold text-[#65676b] dark:text-[#b0b3b8] uppercase tracking-wider bg-gray-50 dark:bg-[#1f2022] rounded">
                      {grpName}
                    </div>
                  )}
                  {grpOptions.map((opt) => (
                    <OptionItem
                      key={opt.value}
                      option={opt}
                      isSelected={opt.value === value}
                      onSelect={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                      }}
                    />
                  ))}
                </div>
              ))
            ) : (
              filteredOptions.map((opt) => (
                <OptionItem
                  key={opt.value}
                  option={opt}
                  isSelected={opt.value === value}
                  onSelect={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function OptionItem({
  option,
  isSelected,
  onSelect,
}: {
  option: CustomSelectOption;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors text-left cursor-pointer select-none',
        isSelected
          ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 font-bold'
          : 'text-[#050505] dark:text-[#e4e6eb] hover:bg-[#f0f2f5] dark:hover:bg-[#3a3b3c]'
      )}
    >
      <div className="flex items-center gap-2 truncate pr-2">
        {option.flag && <span className="text-sm shrink-0">{option.flag}</span>}
        <span className="truncate">{option.label}</span>
        {option.subLabel && (
          <span className="text-[10px] text-[#65676b] dark:text-[#b0b3b8] shrink-0 font-normal">
            ({option.subLabel})
          </span>
        )}
      </div>
      {isSelected && (
        <Check className="h-3.5 w-3.5 shrink-0 text-primary-600 dark:text-primary-400" />
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Priority Countries List
// ─────────────────────────────────────────────────────────────
const PRIORITY_COUNTRY_CODES = [
  'BD', // Bangladesh
  'SA', // Saudi Arabia
  'AE', // UAE
  'MY', // Malaysia
  'VN', // Vietnam
  'US', // United States
  'GB', // United Kingdom
  'CA', // Canada
  'IN', // India
  'PK', // Pakistan
  'QA', // Qatar
  'OM', // Oman
  'KW', // Kuwait
  'TR', // Turkey
  'SG', // Singapore
  'ID', // Indonesia
];

// ─────────────────────────────────────────────────────────────
// Main LocationSelector
// ─────────────────────────────────────────────────────────────
export const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onChange,
  locale = 'bn',
  compact = true,
  className,
}) => {
  // Selected Country Code (Default 'BD')
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(
    value?.countryCode || 'BD'
  );

  // For Bangladesh: ID-based cascading
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [selectedUpazilaId, setSelectedUpazilaId] = useState<string>('');

  // For Global: ISO/Name based cascading
  const [selectedStateCode, setSelectedStateCode] = useState<string>('');
  const [selectedCityName, setSelectedCityName] = useState<string>(
    value?.city || ''
  );
  const [customCityText, setCustomCityText] = useState<string>('');

  // All countries list with priority list on top
  const { countryOptions, allCountriesMap } = useMemo(() => {
    const all = Country.getAllCountries();
    const map = new Map<string, ICountry>();
    all.forEach((c) => map.set(c.isoCode, c));

    const options: CustomSelectOption[] = [];

    // 1. Priority countries
    PRIORITY_COUNTRY_CODES.forEach((code) => {
      const found = map.get(code);
      if (found) {
        options.push({
          value: found.isoCode,
          label: found.name,
          flag: found.flag,
          group:
            locale === 'bn' ? '⭐ জনপ্রিয় দেশসমূহ' : '⭐ Popular Countries',
        });
      }
    });

    // 2. All other countries
    const others = all
      .filter((c) => !PRIORITY_COUNTRY_CODES.includes(c.isoCode))
      .sort((a, b) => a.name.localeCompare(b.name));

    others.forEach((c) => {
      options.push({
        value: c.isoCode,
        label: c.name,
        flag: c.flag,
        group: locale === 'bn' ? '🌐 বিশ্বের সকল দেশ' : '🌐 All Countries',
      });
    });

    return { countryOptions: options, allCountriesMap: map };
  }, [locale]);

  const isBD = selectedCountryCode === 'BD';

  // ─────────────────────────────────────────────────────────────
  // Bangladesh Data (Divisions, Districts, Upazilas)
  // ─────────────────────────────────────────────────────────────
  const divisionOptions = useMemo<CustomSelectOption[]>(() => {
    if (!isBD) return [];
    return getDivisions().map((d) => ({
      value: d.id,
      label: locale === 'bn' ? d.bn_name : d.name,
      subLabel: locale === 'bn' ? d.name : d.bn_name,
    }));
  }, [isBD, locale]);

  const districtOptions = useMemo<CustomSelectOption[]>(() => {
    if (!isBD || !selectedDivisionId) return [];
    return getDistrictsByDivision(selectedDivisionId).map((d) => ({
      value: d.id,
      label: locale === 'bn' ? d.bn_name : d.name,
      subLabel: locale === 'bn' ? d.name : d.bn_name,
    }));
  }, [isBD, selectedDivisionId, locale]);

  const upazilaOptions = useMemo<CustomSelectOption[]>(() => {
    if (!isBD || !selectedDistrictId) return [];
    return getUpazilasByDistrict(selectedDistrictId).map((u) => ({
      value: u.id,
      label: locale === 'bn' ? u.bn_name : u.name,
      subLabel: locale === 'bn' ? u.name : u.bn_name,
    }));
  }, [isBD, selectedDistrictId, locale]);

  // ─────────────────────────────────────────────────────────────
  // Global Country-State-City Data
  // ─────────────────────────────────────────────────────────────
  const stateOptions = useMemo<CustomSelectOption[]>(() => {
    if (isBD || !selectedCountryCode) return [];
    return State.getStatesOfCountry(selectedCountryCode).map((s) => ({
      value: s.isoCode,
      label: s.name,
    }));
  }, [isBD, selectedCountryCode]);

  const cityOptions = useMemo<CustomSelectOption[]>(() => {
    if (isBD || !selectedCountryCode || !selectedStateCode) return [];
    return City.getCitiesOfState(selectedCountryCode, selectedStateCode).map(
      (c) => ({
        value: c.name,
        label: c.name,
      })
    );
  }, [isBD, selectedCountryCode, selectedStateCode]);

  // ─────────────────────────────────────────────────────────────
  // Sync Initial Value if provided or updated
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!value) return;

    const targetCountryCode =
      value.countryCode ||
      (value.country && value.country !== 'Bangladesh'
        ? allCountriesMap.get(value.country)?.isoCode || 'BD'
        : 'BD');

    setSelectedCountryCode(targetCountryCode);

    if (targetCountryCode === 'BD') {
      const allDivisions = getDivisions();
      let matchedDivId = '';

      if (value.state) {
        const foundDiv = allDivisions.find(
          (d) =>
            d.name.toLowerCase() === value.state?.toLowerCase() ||
            d.bn_name === value.state
        );
        if (foundDiv) matchedDivId = foundDiv.id;
      }

      // If state didn't match directly, try finding division name inside location text
      if (!matchedDivId && value.location) {
        const locLower = value.location.toLowerCase();
        const foundDiv = allDivisions.find(
          (d) =>
            locLower.includes(d.name.toLowerCase()) ||
            (d.bn_name && value.location?.includes(d.bn_name))
        );
        if (foundDiv) matchedDivId = foundDiv.id;
      }

      if (matchedDivId) {
        setSelectedDivisionId(matchedDivId);
        const districtsInDiv = getDistrictsByDivision(matchedDivId);

        let matchedDistId = '';
        if (value.city) {
          const foundDist = districtsInDiv.find(
            (d) =>
              d.name.toLowerCase() === value.city?.toLowerCase() ||
              d.bn_name === value.city ||
              value.city?.toLowerCase().includes(d.name.toLowerCase()) ||
              (d.bn_name && value.city?.includes(d.bn_name))
          );
          if (foundDist) matchedDistId = foundDist.id;
        }

        if (!matchedDistId && value.location) {
          const locLower = value.location.toLowerCase();
          const foundDist = districtsInDiv.find(
            (d) =>
              locLower.includes(d.name.toLowerCase()) ||
              (d.bn_name && value.location?.includes(d.bn_name))
          );
          if (foundDist) matchedDistId = foundDist.id;
        }

        if (matchedDistId) {
          setSelectedDistrictId(matchedDistId);
          const upazilasInDist = getUpazilasByDistrict(matchedDistId);

          if (value.city || value.location) {
            const combinedText =
              `${value.city || ''} ${value.location || ''}`.toLowerCase();
            const foundUpa = upazilasInDist.find(
              (u) =>
                combinedText.includes(u.name.toLowerCase()) ||
                (u.bn_name &&
                  (value.city?.includes(u.bn_name) ||
                    value.location?.includes(u.bn_name)))
            );
            if (foundUpa) setSelectedUpazilaId(foundUpa.id);
          }
        }
      }
    } else {
      // Global Country
      if (value.state) {
        const countryStates = State.getStatesOfCountry(targetCountryCode);
        const foundState = countryStates.find(
          (s) =>
            s.isoCode.toLowerCase() === value.state?.toLowerCase() ||
            s.name.toLowerCase() === value.state?.toLowerCase()
        );
        if (foundState) {
          setSelectedStateCode(foundState.isoCode);
        }
      }
      if (value.city) {
        setSelectedCityName(value.city);
      }
    }
  }, [
    value?.countryCode,
    value?.country,
    value?.state,
    value?.city,
    value?.location,
  ]);

  // ─────────────────────────────────────────────────────────────
  // Emit changes to parent
  // ─────────────────────────────────────────────────────────────
  const emitChange = (updates: {
    countryCode?: string;
    divisionId?: string;
    districtId?: string;
    upazilaId?: string;
    stateCode?: string;
    cityName?: string;
  }) => {
    const cCode = updates.countryCode ?? selectedCountryCode;
    const currentCountry = allCountriesMap.get(cCode);
    const countryName = currentCountry?.name || 'Bangladesh';

    if (cCode === 'BD') {
      const divId =
        updates.divisionId !== undefined
          ? updates.divisionId
          : selectedDivisionId;
      const distId =
        updates.districtId !== undefined
          ? updates.districtId
          : selectedDistrictId;
      const upaId =
        updates.upazilaId !== undefined ? updates.upazilaId : selectedUpazilaId;

      const currentDiv = getDivisions().find((d) => d.id === divId);
      const currentDist = getDistrictsByDivision(divId).find(
        (d) => d.id === distId
      );
      const currentUpa = getUpazilasByDistrict(distId).find(
        (u) => u.id === upaId
      );

      const divName = locale === 'bn' ? currentDiv?.bn_name : currentDiv?.name;
      const distName =
        locale === 'bn' ? currentDist?.bn_name : currentDist?.name;
      const upaName = locale === 'bn' ? currentUpa?.bn_name : currentUpa?.name;

      const parts: string[] = [];
      if (upaName) parts.push(upaName);
      if (distName) parts.push(distName);
      if (divName) parts.push(divName);
      parts.push(locale === 'bn' ? 'বাংলাদেশ' : 'Bangladesh');

      onChange({
        country: 'Bangladesh',
        countryCode: 'BD',
        state: currentDiv?.name || '',
        city: currentDist
          ? currentUpa
            ? `${currentUpa.name}, ${currentDist.name}`
            : currentDist.name
          : '',
        location: parts.join(', '),
      });
    } else {
      const sCode =
        updates.stateCode !== undefined ? updates.stateCode : selectedStateCode;
      const cName =
        updates.cityName !== undefined
          ? updates.cityName
          : selectedCityName || customCityText;

      const states = State.getStatesOfCountry(cCode);
      const currentState = states.find((s) => s.isoCode === sCode);
      const stateName = currentState?.name || '';

      const parts: string[] = [];
      if (cName) parts.push(cName);
      if (stateName) parts.push(stateName);
      if (countryName) parts.push(countryName);

      onChange({
        country: countryName,
        countryCode: cCode,
        state: stateName,
        city: cName,
        location: parts.join(', '),
      });
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Event Handlers
  // ─────────────────────────────────────────────────────────────
  const handleCountryChange = (newCode: string) => {
    setSelectedCountryCode(newCode);
    setSelectedDivisionId('');
    setSelectedDistrictId('');
    setSelectedUpazilaId('');
    setSelectedStateCode('');
    setSelectedCityName('');
    setCustomCityText('');

    emitChange({
      countryCode: newCode,
      divisionId: '',
      districtId: '',
      upazilaId: '',
      stateCode: '',
      cityName: '',
    });
  };

  // BD Division change
  const handleDivisionChange = (divId: string) => {
    setSelectedDivisionId(divId);
    setSelectedDistrictId('');
    setSelectedUpazilaId('');
    emitChange({ divisionId: divId, districtId: '', upazilaId: '' });
  };

  // BD District change
  const handleDistrictChange = (distId: string) => {
    setSelectedDistrictId(distId);
    setSelectedUpazilaId('');
    emitChange({ districtId: distId, upazilaId: '' });
  };

  // BD Upazila change
  const handleUpazilaChange = (upaId: string) => {
    setSelectedUpazilaId(upaId);
    emitChange({ upazilaId: upaId });
  };

  // Global State change
  const handleStateChange = (stCode: string) => {
    setSelectedStateCode(stCode);
    setSelectedCityName('');
    setCustomCityText('');
    emitChange({ stateCode: stCode, cityName: '' });
  };

  // Global City change
  const handleCityChange = (cityName: string) => {
    setSelectedCityName(cityName);
    emitChange({ cityName });
  };

  return (
    <div className={cn('w-full space-y-2.5', className)}>
      {/* ── Country Selector ── */}
      <CustomSelect
        label={locale === 'bn' ? 'দেশ / Country' : 'Country'}
        placeholder={locale === 'bn' ? 'দেশ নির্বাচন করুন' : 'Select Country'}
        value={selectedCountryCode}
        onChange={handleCountryChange}
        options={countryOptions}
        searchPlaceholder={
          locale === 'bn' ? 'দেশ খুঁজুন...' : 'Search country...'
        }
        emptyText={locale === 'bn' ? 'কোন দেশ পাওয়া যায়নি' : 'No country found'}
        icon={<Globe className="h-4 w-4" />}
      />

      {/* ── Bangladesh Specific Flow: Division ➡️ District ➡️ Upazila ── */}
      {isBD && (
        <div className="grid grid-cols-2 gap-2">
          {/* Division */}
          <CustomSelect
            label={locale === 'bn' ? 'বিভাগ (Division)' : 'Division'}
            placeholder={locale === 'bn' ? 'বিভাগ নির্বাচন' : 'Select Division'}
            value={selectedDivisionId}
            onChange={handleDivisionChange}
            options={divisionOptions}
            searchPlaceholder={
              locale === 'bn' ? 'বিভাগ খুঁজুন...' : 'Search division...'
            }
            emptyText={
              locale === 'bn' ? 'বিভাগ পাওয়া যায়নি' : 'No division found'
            }
          />

          {/* District */}
          <CustomSelect
            label={locale === 'bn' ? 'জেলা (District)' : 'District'}
            placeholder={locale === 'bn' ? 'জেলা নির্বাচন' : 'Select District'}
            disabledPlaceholder={
              locale === 'bn' ? 'আগে বিভাগ বাছুন' : 'Select division first'
            }
            disabled={!selectedDivisionId}
            value={selectedDistrictId}
            onChange={handleDistrictChange}
            options={districtOptions}
            searchPlaceholder={
              locale === 'bn' ? 'জেলা খুঁজুন...' : 'Search district...'
            }
            emptyText={
              locale === 'bn' ? 'জেলা পাওয়া যায়নি' : 'No district found'
            }
          />

          {/* Upazila (Optional / Extra precision) */}
          <div className="col-span-2">
            <CustomSelect
              label={
                locale === 'bn'
                  ? 'উপজেলা / থানা (ঐচ্ছিক)'
                  : 'Upazila / Thana (Optional)'
              }
              placeholder={
                locale === 'bn'
                  ? 'উপজেলা নির্বাচন করুন (ঐচ্ছিক)'
                  : 'Select Upazila (Optional)'
              }
              disabledPlaceholder={
                locale === 'bn' ? 'আগে জেলা বাছুন' : 'Select district first'
              }
              disabled={!selectedDistrictId || upazilaOptions.length === 0}
              value={selectedUpazilaId}
              onChange={handleUpazilaChange}
              options={upazilaOptions}
              searchPlaceholder={
                locale === 'bn' ? 'উপজেলা খুঁজুন...' : 'Search upazila...'
              }
              emptyText={
                locale === 'bn' ? 'উপজেলা পাওয়া যায়নি' : 'No upazila found'
              }
            />
          </div>
        </div>
      )}

      {/* ── Global Specific Flow (Vietnam, Saudi Arabia, USA, etc.): State ➡️ City ── */}
      {!isBD && (
        <div className="grid grid-cols-2 gap-2">
          {/* State / Province */}
          <CustomSelect
            label={
              locale === 'bn' ? 'রাজ্য / প্রদেশ (State)' : 'State / Province'
            }
            placeholder={locale === 'bn' ? 'প্রদেশ নির্বাচন' : 'Select State'}
            disabledPlaceholder={
              stateOptions.length === 0
                ? locale === 'bn'
                  ? 'প্রদেশ প্রযোজ্য নয়'
                  : 'N/A'
                : locale === 'bn'
                  ? 'প্রদেশ বাছুন'
                  : 'Select State'
            }
            disabled={stateOptions.length === 0}
            value={selectedStateCode}
            onChange={handleStateChange}
            options={stateOptions}
            searchPlaceholder={
              locale === 'bn' ? 'প্রদেশ খুঁজুন...' : 'Search state...'
            }
            emptyText={
              locale === 'bn' ? 'প্রদেশ পাওয়া যায়নি' : 'No state found'
            }
          />

          {/* City */}
          {cityOptions.length > 0 ? (
            <CustomSelect
              label={
                locale === 'bn' ? 'শহর / ডিস্ট্রিক্ট (City)' : 'City / District'
              }
              placeholder={locale === 'bn' ? 'শহর নির্বাচন' : 'Select City'}
              value={selectedCityName}
              onChange={handleCityChange}
              options={cityOptions}
              searchPlaceholder={
                locale === 'bn' ? 'শহর খুঁজুন...' : 'Search city...'
              }
              emptyText={locale === 'bn' ? 'শহর পাওয়া যায়নি' : 'No city found'}
            />
          ) : (
            <div className="w-full space-y-1">
              <label className="block text-[11px] font-bold text-[#65676b] dark:text-[#b0b3b8]">
                {locale === 'bn' ? 'শহর / ডিস্ট্রিক্ট' : 'City / District'}
              </label>
              <input
                type="text"
                value={customCityText}
                onChange={(e) => {
                  setCustomCityText(e.target.value);
                  emitChange({ cityName: e.target.value });
                }}
                placeholder={
                  locale === 'bn' ? 'শহরের নাম লিখুন' : 'Enter city name'
                }
                className="w-full h-9 sm:h-9.5 px-3 rounded-xl border text-xs font-medium bg-[#f0f2f5] dark:bg-[#3a3b3c] border-[#e4e6eb] dark:border-[#393a3b] text-[#050505] dark:text-[#e4e6eb] focus:border-primary-500 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
