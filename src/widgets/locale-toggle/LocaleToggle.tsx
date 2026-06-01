'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { setLocale } from '@/entities/settings/model/settingsSlice';
import { Languages } from 'lucide-react';
import type { Locale } from '@/shared/lib/i18n';

const LABEL: Record<Locale, string> = {
  ru: 'RU',
  en: 'EN',
};

export function LocaleToggle() {
  const dispatch = useAppDispatch();
  const locale = useAppSelector((state) => state.settings.locale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const nextLocale: Locale = locale === 'ru' ? 'en' : 'ru';

  return (
    <button
      id="locale-toggle"
      onClick={() => dispatch(setLocale(nextLocale))}
      title={locale === 'ru' ? 'Switch to English' : 'Переключить на русский'}
      className="
        fixed bottom-6 right-6 z-50
        flex items-center gap-2
        h-11 px-4
        rounded-full
        bg-white/80 dark:bg-white/10
        backdrop-blur-xl
        border border-gray-200/60 dark:border-white/10
        shadow-lg shadow-black/5 dark:shadow-black/30
        text-sm font-semibold
        text-gray-700 dark:text-white/80
        hover:bg-white dark:hover:bg-white/15
        hover:shadow-xl hover:scale-105
        active:scale-95
        transition-all duration-200
        cursor-pointer
        select-none
      "
    >
      <Languages size={16} className="text-indigo-500 dark:text-indigo-400" />
      <span className="tracking-wide">{LABEL[nextLocale]}</span>
    </button>
  );
}
