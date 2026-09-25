import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center text-xs font-semibold text-[#65676b] dark:text-[#b0b3b8]', className)}
    >
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
        <span className="sr-only">Home</span>
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-3 w-3 mx-1.5 text-[#65676b] dark:text-[#b0b3b8]" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-emerald-600 transition-colors truncate max-w-[150px] sm:max-w-xs"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#050505] dark:text-[#e4e6eb] font-bold truncate max-w-[150px] sm:max-w-xs">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
