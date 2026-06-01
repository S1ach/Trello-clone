'use client';

import React, { useState, useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { useAppSelector } from '@/app/store/hooks';
import { useTranslation } from '@/shared/lib/useTranslation';
import { Bell, AlertCircle, Clock, Check, X } from 'lucide-react';

interface Notification {
  id: string;
  cardId: string;
  title: string;
  type: 'approaching' | 'overdue';
  message: string;
  timestamp: number;
  read: boolean;
}

export function NotificationCenter() {
  const t = useTranslation();
  const board = useAppSelector(state => state.board);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toast, setToast] = useState<{ id: string; title: string; message: string } | null>(null);

  // Poll deadlines every 10 seconds to generate warnings
  useEffect(() => {
    const cards = Object.values(board.cards);
    const columns = Object.values(board.columns);

    // Done columns list
    const doneColumnIds = columns
      .filter(col => {
        const title = col.title.toLowerCase();
        return title.includes('done') || title.includes('готово') || col.id === 'column-3';
      })
      .map(col => col.id);

    const now = Date.now();
    const newNotifications: Notification[] = [];

    cards.forEach(card => {
      if (!card.dueDate) return;

      // Skip completed tasks
      const column = columns.find(col => col.cardIds.includes(card.id));
      const isCompleted = column ? doneColumnIds.includes(column.id) : false;
      if (isCompleted) return;

      const dueTime = new Date(card.dueDate).getTime();
      const diffMs = dueTime - now;
      const diffHrs = diffMs / (1000 * 60 * 60);

      // Warning types
      if (diffHrs < 0) {
        // Overdue!
        const notifId = `overdue-${card.id}`;
        newNotifications.push({
          id: notifId,
          cardId: card.id,
          title: card.content,
          type: 'overdue',
          message: t.cardIsOverdue,
          timestamp: now,
          read: false,
        });
      } else if (diffHrs <= 24) {
        // Approaching deadline (less than 24 hours left)
        const notifId = `approaching-${card.id}`;
        newNotifications.push({
          id: notifId,
          cardId: card.id,
          title: card.content,
          type: 'approaching',
          message: t.approachingDeadline,
          timestamp: now,
          read: false,
        });
      }
    });

    // Merge with current notifications, keeping read state
    setNotifications(prev => {
      const merged = [...prev];
      newNotifications.forEach(n => {
        const exists = merged.find(item => item.id === n.id);
        if (!exists) {
          merged.unshift(n);
          // Show Toast notification for new items
          setToast({
            id: n.id,
            title: n.type === 'overdue' ? t.cardIsOverdue : t.approachingDeadline,
            message: n.title,
          });
        }
      });
      return merged;
    });
  }, [board.cards, board.columns, t]);

  // Dismiss toast after 5s
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? ({ ...n, read: true }) : n));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <>
      <Popover.Root>
        <Popover.Trigger asChild>
          <button className="relative rounded-xl p-2.5 text-gray-500 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-700 dark:hover:text-white/70 transition-all cursor-pointer">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-extrabold text-white ring-2 ring-white dark:ring-[#0a0a0c]">
                {unreadCount}
              </span>
            )}
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="w-80 rounded-2xl bg-white/95 dark:bg-[#0a0a0c]/95 border border-black/10 dark:border-white/8 backdrop-blur-xl p-0 shadow-2xl z-50 overflow-hidden outline-none animate-in fade-in"
            align="end"
            sideOffset={8}
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 p-4">
              <h3 className="font-bold text-gray-800 dark:text-white/90 text-sm">{t.notifications}</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  <Check size={14} className="inline mr-0.5" />
                  {t.close}
                </button>
              )}
            </div>

            <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100 dark:divide-white/5">
              {notifications.length > 0 ? (
                notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`flex items-start gap-3 p-3.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${!n.read ? 'bg-indigo-500/5' : ''}`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {n.type === 'overdue' ? (
                        <AlertCircle className="text-red-500" size={16} />
                      ) : (
                        <Clock className="text-amber-500" size={16} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-gray-800 dark:text-white/80 truncate">{n.title}</div>
                      <div className="text-[11px] font-semibold text-gray-400 dark:text-white/30 mt-0.5">{n.message}</div>
                    </div>
                    {!n.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-gray-400 dark:text-white/20 font-medium">
                  {t.noNotifications}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="border-t border-gray-100 dark:border-white/5 p-3 text-center">
                <button onClick={clearAll} className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">
                  {t.deleteCard}
                </button>
              </div>
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {/* Popover Toast notification */}
      {toast && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center justify-between gap-4 w-80 p-4 rounded-2xl bg-white/98 dark:bg-[#0a0a0c]/98 backdrop-blur-xl border border-indigo-100 dark:border-white/10 shadow-2xl animate-in fade-in transition-all">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-500 shrink-0">
              <Bell size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-800 dark:text-white/80">{toast.title}</div>
              <div className="text-[11px] font-medium text-gray-500 dark:text-white/40 mt-0.5">{toast.message}</div>
            </div>
          </div>
          <button onClick={() => setToast(null)} className="text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60">
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}
