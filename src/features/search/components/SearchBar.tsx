'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function SearchBar({ defaultValue = '' }: { defaultValue?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Duas by title, meaning, pronunciation, or virtue..."
        className="h-10 w-full rounded-xl border border-[#e4e6eb] bg-[#f0f2f5] pl-10 pr-24 text-xs sm:text-sm text-[#050505] placeholder:text-[#65676b] focus:border-emerald-600 focus:bg-white focus:outline-hidden dark:border-[#393a3b] dark:bg-[#3a3b3c] dark:text-[#e4e6eb] dark:placeholder:text-[#b0b3b8] dark:focus:bg-[#242526]"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
      >
        Search
      </button>
    </form>
  );
}
