'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface AccordionItemProps {
  id: string;
  title: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export interface AccordionProps {
  items: AccordionItemProps[];
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({ items, allowMultiple = true, className }: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(() =>
    items.filter((i) => i.defaultOpen).map((i) => i.id),
  );

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn('rounded-xl border border-[#e4e6eb] bg-[#f0f2f5]/60 divide-y divide-[#e4e6eb] dark:border-[#393a3b] dark:bg-[#3a3b3c]/40 dark:divide-[#393a3b]', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className="transition-colors">
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs sm:text-sm font-semibold text-[#050505] hover:text-emerald-700 dark:text-[#e4e6eb] dark:hover:text-emerald-400 transition-colors"
            >
              <div className="flex items-center gap-2">
                {item.icon && <span className="text-[#65676b] dark:text-[#b0b3b8]">{item.icon}</span>}
                <span>{item.title}</span>
                {item.badge && <span className="ml-1">{item.badge}</span>}
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-[#65676b] dark:text-[#b0b3b8] transition-transform duration-200 ease-out',
                  isOpen && 'rotate-180 text-emerald-600 dark:text-emerald-400',
                )}
              />
            </button>
            {isOpen && (
              <div className="px-3.5 pb-3 pt-0.5 text-xs text-[#050505] dark:text-[#e4e6eb] leading-relaxed animate-in fade-in duration-150">
                {item.children}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
