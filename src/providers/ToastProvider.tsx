'use client';

import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface WebToastItem {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (input: Omit<WebToastItem, 'id'>) => void;
  dismissToast: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<WebToastItem | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback(
    (input: Omit<WebToastItem, 'id'>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const duration = input.duration ?? 3200;
      setToast({ ...input, id });
      timerRef.current = setTimeout(() => {
        setToast(null);
        timerRef.current = null;
      }, duration);
    },
    [],
  );

  const type = toast?.type || 'info';

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-0 left-0 right-0 z-[9999] w-full rounded-none border-t border-[#e4e6eb] dark:border-[#393a3b] bg-white dark:bg-[#242526] text-[#050505] dark:text-[#e4e6eb] px-4 py-3 flex items-center gap-3 shadow-sm"
        >
          {type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : type === 'error' || type === 'warning' ? (
            <AlertCircle className="h-5 w-5 shrink-0" />
          ) : (
            <Info className="h-5 w-5 shrink-0" />
          )}

          <div className="flex-1 min-w-0">
            {toast.title ? (
              <p className="text-xs font-bold leading-4 truncate">{toast.title}</p>
            ) : null}
            <p className="text-sm font-medium leading-5">{toast.message}</p>
          </div>

          <button
            type="button"
            onClick={dismissToast}
            aria-label="Close"
            className="h-7 w-7 flex items-center justify-center opacity-70 hover:opacity-100 cursor-pointer shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      showToast: () => {},
      dismissToast: () => {},
    };
  }
  return ctx;
}
