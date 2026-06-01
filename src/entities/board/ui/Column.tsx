'use client';

import React, { forwardRef, ReactNode, useState } from 'react';
import { Column as ColumnType } from '../model/types';
import { cn } from '@/shared/lib/utils';
import { useTranslation } from '@/shared/lib/useTranslation';
import { useAppDispatch } from '@/app/store/hooks';
import { editColumnTitle, setColumnSort } from '../model/boardSlice';
import { GripHorizontal, MoreHorizontal, Plus, Pencil, ArrowUpDown, Check } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export interface ColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  column: ColumnType;
  children: ReactNode;
  isDragging?: boolean;
  onAddCard?: () => void;
  onDeleteColumn?: () => void;
  dragHandleProps?: Record<string, any> | null;
  cardCount?: number;
}

export const ColumnItem = forwardRef<HTMLDivElement, ColumnProps>(
  (
    { column, children, isDragging, onAddCard, onDeleteColumn, dragHandleProps, cardCount, className, style, ...props },
    ref
  ) => {
    const t = useTranslation();
    const dispatch = useAppDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [tempTitle, setTempTitle] = useState(column.title);

    const handleTitleSave = () => {
      if (tempTitle.trim() && tempTitle.trim() !== column.title) {
        dispatch(editColumnTitle({ columnId: column.id, title: tempTitle.trim() }));
      } else {
        setTempTitle(column.title);
      }
      setIsEditing(false);
    };

    const sortBy = column.sortBy || 'none';

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col rounded-2xl glass-column w-80 shrink-0',
          isDragging && 'ring-1 ring-indigo-500/50 opacity-90',
          className
        )}
        style={style}
        {...props}
      >
        <div
          {...dragHandleProps}
          className="flex items-center justify-between p-4 pb-2 cursor-grab active:cursor-grabbing"
        >
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <GripHorizontal size={14} className="text-gray-300 dark:text-white/20 shrink-0" />
            {isEditing ? (
              <Input
                autoFocus
                className="h-7 px-1.5 py-0.5 text-lg font-bold bg-white/50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-800 dark:text-white/90 rounded-lg"
                value={tempTitle}
                onChange={e => setTempTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleTitleSave();
                  if (e.key === 'Escape') { setTempTitle(column.title); setIsEditing(false); }
                }}
              />
            ) : (
              <h3
                className="font-bold text-xl text-gray-800 dark:text-white/90 tracking-tight truncate cursor-text"
                onDoubleClick={() => { setTempTitle(column.title); setIsEditing(true); }}
              >
                {column.title}
              </h3>
            )}
            {cardCount !== undefined && (
              <span className="text-xs text-gray-400 dark:text-white/25 bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded-md font-medium shrink-0">
                {cardCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {/* Sorting Dropdown trigger */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="rounded-lg p-1.5 text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5 transition-all cursor-pointer">
                  <ArrowUpDown size={14} className={sortBy !== 'none' ? 'text-indigo-500' : ''} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="min-w-[160px] rounded-xl bg-white/95 dark:bg-[#0a0a0c]/95 border border-black/10 dark:border-white/8 backdrop-blur-xl p-1.5 shadow-2xl z-50 outline-none animate-in fade-in">
                  {[
                    { id: 'none', label: t.sortNone },
                    { id: 'alphabetical', label: t.sortAlphabetical },
                    { id: 'dueDate', label: t.sortDueDate },
                    { id: 'createdAt', label: t.sortCreatedAt },
                  ].map(opt => (
                    <DropdownMenu.Item
                      key={opt.id}
                      onClick={() => dispatch(setColumnSort({ columnId: column.id, sortBy: opt.id as any }))}
                      className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-600 dark:text-white/60 outline-none hover:bg-gray-50 dark:hover:bg-white/5 focus:bg-gray-50 dark:focus:bg-white/5 transition-colors"
                    >
                      {opt.label}
                      {sortBy === opt.id && <Check size={14} className="text-indigo-500" />}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="rounded-lg p-1.5 text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5 transition-all cursor-pointer">
                  <MoreHorizontal size={16} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="min-w-[160px] rounded-xl bg-white/95 dark:bg-[#0a0a0c]/95 border border-black/10 dark:border-white/8 backdrop-blur-xl p-1.5 shadow-2xl z-50 outline-none animate-in fade-in">
                  <DropdownMenu.Item 
                    onClick={() => { setTempTitle(column.title); setIsEditing(true); }}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 dark:text-white/60 outline-none hover:bg-gray-50 dark:hover:bg-white/5 focus:bg-gray-50 dark:focus:bg-white/5 transition-colors"
                  >
                    <Pencil size={14} />
                    {t.renameColumn}
                  </DropdownMenu.Item>
                  <DropdownMenu.Item 
                    onClick={onDeleteColumn}
                    className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-red-500 dark:text-red-400 outline-none hover:bg-red-50 dark:hover:bg-red-500/10 focus:bg-red-50 dark:focus:bg-red-500/10 transition-colors"
                  >
                    {t.deleteColumn}
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto px-3 pb-2">
          {children}
        </div>

        <div className="p-3 pt-1">
          <button
            onClick={onAddCard}
            className="flex w-full items-center gap-2 rounded-xl p-2.5 text-sm font-medium text-gray-400 dark:text-white/30 add-btn-glow hover:text-gray-600 dark:hover:text-white/60 transition-all cursor-pointer"
          >
            <Plus size={16} />
            {t.addACard}
          </button>
        </div>
      </div>
    );
  }
);
ColumnItem.displayName = 'ColumnItem';
