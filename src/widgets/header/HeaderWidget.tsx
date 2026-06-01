'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { setSearchQuery, resetBoard } from '@/entities/board/model/boardSlice';
import { setBackground, setCustomImage, setLocale } from '@/entities/settings/model/settingsSlice';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { DashboardOverlay } from '@/widgets/dashboard/DashboardOverlay';
import {
  RotateCcw, Image, Sun, Moon, Search, Sliders, ChevronDown, Check, Upload, BarChart3, Bell
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useTheme } from 'next-themes';
import { useTranslation } from '@/shared/lib/useTranslation';
import { BOARD_BACKGROUNDS } from '@/entities/settings/model/settingsSlice';

export function HeaderWidget() {
  const dispatch = useAppDispatch();
  const searchVal = useAppSelector((state) => state.board.searchQuery);
  const settings = useAppSelector((state) => state.settings);
  const { theme, setTheme } = useTheme();
  const t = useTranslation();

  // Dialog / Popover states
  const [isBgOpen, setIsBgOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const handleResetBoard = () => {
    if (confirm(t.resetBoardConfirm)) {
      dispatch(resetBoard());
    }
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        setSizeError(t.imageSizeError);
        return;
      }
      setSizeError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        dispatch(setCustomImage(base64));
        dispatch(setBackground('custom'));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <header className="flex h-16 w-full items-center justify-between border-b border-gray-100 dark:border-white/5 bg-white/40 dark:bg-[#0c0c0e]/40 backdrop-blur-xl px-6 transition-colors duration-300">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <rect x="7" y="7" width="3" height="9" rx="1" />
              <rect x="14" y="7" width="3" height="5" rx="1" />
            </svg>
          </div>
          <span className="text-lg font-extrabold text-gray-800 dark:text-white/90 tracking-tight">{t.defaultBoardTitle}</span>
        </div>

        {/* Search */}
        <div className="hidden md:flex relative w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-white/20 pointer-events-none" />
          <Input
            placeholder={t.searchCards}
            value={searchVal}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="pl-9 pr-4 h-9 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-indigo-500/50 rounded-xl"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Dashboard Trigger */}
          <button
            onClick={() => setIsDashboardOpen(true)}
            className="rounded-xl p-2.5 text-gray-500 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-700 dark:hover:text-white/70 transition-all cursor-pointer"
            title={t.dashboard}
          >
            <BarChart3 size={20} />
          </button>


          {/* Background Dropdown */}
          <DropdownMenu.Root open={isBgOpen} onOpenChange={setIsBgOpen}>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-white/80 transition-all cursor-pointer">
                <Image size={16} />
                <span className="hidden sm:inline">{t.changeBackground}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isBgOpen ? 'rotate-180' : ''}`} />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="w-80 rounded-2xl bg-white/95 dark:bg-[#0a0a0c]/95 border border-black/10 dark:border-white/8 backdrop-blur-xl p-4 shadow-2xl z-50 outline-none animate-in fade-in">
                <DropdownMenu.Label className="text-xs font-bold text-gray-400 dark:text-white/30 uppercase tracking-widest mb-3">
                  {t.auroraThemes}
                </DropdownMenu.Label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {BOARD_BACKGROUNDS.map((bg) => {
                    const isSelected = settings.backgroundId === bg.id;
                    return (
                      <button
                        key={bg.id}
                        onClick={() => dispatch(setBackground(bg.id))}
                        className={`group relative flex h-14 items-center justify-center rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden transition-all shadow-sm cursor-pointer ${
                          isSelected ? 'ring-2 ring-indigo-500/50' : 'hover:scale-[1.02]'
                        }`}
                      >
                        <div className="absolute inset-0 transition-opacity group-hover:opacity-90" style={{ background: bg.preview }} />
                        <span className="relative z-10 text-xs font-extrabold text-white drop-shadow-sm">
                          {t[bg.labelKey as keyof typeof t] as string}
                        </span>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 z-20 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white/95 text-indigo-600 shadow-sm">
                            <Check size={11} className="stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <DropdownMenu.Label className="text-xs font-bold text-gray-400 dark:text-white/30 uppercase tracking-widest mb-3">
                  {t.custom}
                </DropdownMenu.Label>

                {/* Local Upload */}
                <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 dark:border-white/10 text-xs font-bold text-gray-500 dark:text-white/40 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-700 dark:hover:text-white/60 hover:border-gray-300 dark:hover:border-white/20 transition-all select-none">
                  <Upload size={14} />
                  {t.uploadImage}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
                {sizeError && <p className="text-[10px] text-red-500 font-medium mt-1.5">{sizeError}</p>}
                <p className="text-[9px] text-gray-400 dark:text-white/20 mt-1.5">{t.maxSizeNote}</p>

                {settings.customImage && (
                  <button
                    onClick={() => dispatch(setBackground('custom'))}
                    className={`mt-2 flex w-full items-center gap-2 rounded-xl p-2 text-xs font-bold border border-gray-100 dark:border-white/5 transition-all cursor-pointer ${
                      settings.backgroundId === 'custom'
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-600 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="h-6 w-9 rounded bg-cover bg-center shrink-0 border border-black/5 dark:border-white/5" style={{ backgroundImage: `url(${settings.customImage})` }} />
                    <span className="truncate flex-1 text-left">{t.useUploadedImage}</span>
                    {settings.backgroundId === 'custom' && <Check size={14} className="stroke-[3]" />}
                  </button>
                )}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {/* Reset button */}
          <button
            onClick={handleResetBoard}
            className="rounded-xl p-2.5 text-gray-500 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-700 dark:hover:text-white/70 transition-all cursor-pointer"
            title={t.resetBoard}
          >
            <RotateCcw size={18} />
          </button>

          {/* Darkmode toggle */}
          <button
            onClick={handleThemeToggle}
            className="rounded-xl p-2.5 text-gray-500 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-700 dark:hover:text-white/70 transition-all cursor-pointer"
            title={t.toggleTheme}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

        </div>
      </header>

      {/* Analytics Dashboard modal portal overlay */}
      <DashboardOverlay open={isDashboardOpen} onOpenChange={setIsDashboardOpen} />
    </>
  );
}
