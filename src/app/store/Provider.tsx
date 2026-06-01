'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { setBoardState } from '@/entities/board/model/boardSlice';
import { setSettingsState } from '@/entities/settings/model/settingsSlice';

export function StoreProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load state from PostgreSQL via API
    async function loadState() {
      try {
        const [boardRes, settingsRes] = await Promise.all([
          fetch('/api/board'),
          fetch('/api/settings'),
        ]);

        if (boardRes.ok) {
          const boardData = await boardRes.json();
          store.dispatch(setBoardState(boardData));
        }

        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          store.dispatch(setSettingsState(settingsData));
        }
      } catch (e) {
        console.error('Could not load state from API:', e);
      } finally {
        setIsLoaded(true);
      }
    }

    loadState();
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
          <span className="text-foreground/60 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  return <Provider store={store}>{children}</Provider>;
}
