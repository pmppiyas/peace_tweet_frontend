'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface PostContentProps {
  content: string;
  className?: string;
  maxChars?: number;
}

// Helper to format text with clickable hashtags, mentions, and URLs
function formatTextSegment(text: string): React.ReactNode[] {
  // Regex matches URLs, hashtags (#tag), and mentions (@username)
  const regex = /((?:https?:\/\/[^\s]+)|(?:#[a-zA-Z0-9_\u0980-\u09FF]+)|(?:@[a-zA-Z0-9_]+))/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // URL link
    if (part.startsWith('http://') || part.startsWith('https://')) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 dark:text-primary-400 hover:underline break-all"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }

    // Hashtag
    if (part.startsWith('#')) {
      return (
        <Link
          key={index}
          href={`/search?q=${encodeURIComponent(part)}`}
          className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </Link>
      );
    }

    // Mention
    if (part.startsWith('@')) {
      const username = part.slice(1);
      return (
        <Link
          key={index}
          href={`/${username}`}
          className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </Link>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

export function PostContent({
  content,
  className,
  maxChars = 320,
}: PostContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const trimmed = content?.trim() || '';
  const isLong = trimmed.length > maxChars;

  // Decide display text based on expansion state
  const displayText = useMemo(() => {
    if (!isLong || isExpanded) return trimmed;
    return trimmed.slice(0, maxChars).trim();
  }, [trimmed, isLong, isExpanded, maxChars]);

  // Split into paragraphs on 2 or more newlines (collapses excessive blanks to Facebook standard gap)
  const paragraphs = useMemo(() => {
    return displayText.split(/\n{2,}/);
  }, [displayText]);

  if (!content) return null;

  return (
    <div
      className={cn(
        'text-[15px] sm:text-[15px] font-normal text-[#050505] dark:text-[#e4e6eb] leading-[1.52] sm:leading-[1.55] break-words space-y-3 sm:space-y-3.5',
        className
      )}
    >
      {paragraphs.map((paragraph, pIdx) => {
        const isLastParagraph = pIdx === paragraphs.length - 1;

        return (
          <p key={pIdx} className="whitespace-pre-line">
            {formatTextSegment(paragraph)}
            {/* Show inline "... See more" on last paragraph when truncated */}
            {isLong && !isExpanded && isLastParagraph && (
              <>
                <span className="text-[#65676b] dark:text-[#b0b3b8]">... </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(true);
                  }}
                  className="font-semibold text-[#050505] dark:text-[#e4e6eb] hover:underline cursor-pointer inline"
                >
                  See more
                </button>
              </>
            )}
          </p>
        );
      })}

      {/* Show "See less" button when expanded */}
      {isLong && isExpanded && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(false);
          }}
          className="font-semibold text-[#65676b] dark:text-[#b0b3b8] hover:underline cursor-pointer text-xs block pt-0.5"
        >
          See less
        </button>
      )}
    </div>
  );
}
