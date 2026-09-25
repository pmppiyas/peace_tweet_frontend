'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  type?: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
  className?: string;
}

export function Toast({
  type = 'success',
  message,
  onClose,
  className,
}: ToastProps) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-600" />,
    error: <AlertCircle className="h-5 w-5 text-red-600" />,
    info: <Info className="h-5 w-5 text-blue-600" />,
  };

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/80 dark:border-emerald-800 dark:text-emerald-200',
    error: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/80 dark:border-red-800 dark:text-red-200',
    info: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/80 dark:border-blue-800 dark:text-blue-200',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl border p-4 shadow-lg transition-all animate-in slide-in-from-bottom-5',
        bgStyles[type],
        className,
      )}
    >
      {icons[type]}
      <p className="text-sm font-medium flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-lg p-1 opacity-70 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
