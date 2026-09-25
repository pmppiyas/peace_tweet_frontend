import React from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-[#e4e6eb] bg-white py-8 dark:border-[#393a3b] dark:bg-[#242526] pb-20 md:pb-8">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm shadow-xs">
              🕊️
            </div>
            <div>
              <p className="font-bold text-[#050505] dark:text-[#e4e6eb] text-sm">PeaceTweet</p>
              <p className="text-xs text-[#65676b] dark:text-[#b0b3b8]">
                Authentic Islamic Social Media & Dua Platform
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-[#65676b] dark:text-[#b0b3b8]">
            <Link href="/duas" className="hover:text-emerald-600 transition-colors">
              All Duas
            </Link>
            <Link href="/categories" className="hover:text-emerald-600 transition-colors">
              Categories
            </Link>
            <Link href="/search" className="hover:text-emerald-600 transition-colors">
              Search
            </Link>
            <Link href="/saved" className="hover:text-emerald-600 transition-colors">
              Bookmarks
            </Link>
          </div>

          <p className="flex items-center gap-1 text-xs text-[#65676b] dark:text-[#b0b3b8]">
            Built as Sadaqah Jariyah <Heart className="h-3.5 w-3.5 text-rose-500 fill-current" />
          </p>
        </div>
      </Container>
    </footer>
  );
}
