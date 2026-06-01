import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { RootState } from './store';
import {
  addCard,
  editCard,
  updateCard,
  toggleChecklistItem,
  deleteCard,
  addColumn,
  editColumnTitle,
  setColumnSort,
  deleteColumn,
  moveCard,
  moveColumn,
  updateBoardTitle,
} from '@/entities/board/model/boardSlice';
import { setBackground, setCustomImage, setLocale } from '@/entities/settings/model/settingsSlice';

export const localStorageMiddleware = createListenerMiddleware();

// Debounce helper
let saveTimeout: ReturnType<typeof setTimeout> | null = null;

function debouncedSave(fn: () => void, delay = 300) {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(fn, delay);
}

// Sync board title to API
localStorageMiddleware.startListening({
  actionCreator: updateBoardTitle,
  effect: (action) => {
    debouncedSave(() => {
      fetch('/api/board', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: action.payload }),
      }).catch((e) => console.error('Failed to save board title:', e));
    });
  },
});

// Sync addColumn to API
localStorageMiddleware.startListening({
  actionCreator: addColumn,
  effect: (action) => {
    const column = action.payload;
    fetch('/api/board/columns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: column.id, title: column.title }),
    }).catch((e) => console.error('Failed to save column:', e));
  },
});

// Sync editColumnTitle to API
localStorageMiddleware.startListening({
  actionCreator: editColumnTitle,
  effect: (action) => {
    const { columnId, title } = action.payload;
    debouncedSave(() => {
      fetch(`/api/board/columns/${columnId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      }).catch((e) => console.error('Failed to rename column:', e));
    });
  },
});

// Sync setColumnSort to API
localStorageMiddleware.startListening({
  actionCreator: setColumnSort,
  effect: (action) => {
    const { columnId, sortBy } = action.payload;
    fetch(`/api/board/columns/${columnId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sortBy }),
    }).catch((e) => console.error('Failed to save column sort:', e));
  },
});

// Sync deleteColumn to API
localStorageMiddleware.startListening({
  actionCreator: deleteColumn,
  effect: (action) => {
    const columnId = action.payload;
    fetch('/api/board/columns', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ columnId }),
    }).catch((e) => console.error('Failed to delete column:', e));
  },
});

// Sync addCard to API
localStorageMiddleware.startListening({
  actionCreator: addCard,
  effect: (action) => {
    const { columnId, card } = action.payload;
    fetch('/api/board/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: card.id,
        content: card.content,
        description: card.description,
        labels: card.labels,
        dueDate: card.dueDate,
        checklist: card.checklist,
        priority: card.priority,
        attachments: card.attachments,
        columnId,
        createdAt: card.createdAt,
      }),
    }).catch((e) => console.error('Failed to save card:', e));
  },
});

// Sync editCard to API
localStorageMiddleware.startListening({
  actionCreator: editCard,
  effect: (action) => {
    const { id, content } = action.payload;
    debouncedSave(() => {
      fetch('/api/board/cards', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, content }),
      }).catch((e) => console.error('Failed to edit card:', e));
    });
  },
});

// Sync updateCard to API (description, labels, dueDate, checklist, priority, attachments)
localStorageMiddleware.startListening({
  actionCreator: updateCard,
  effect: (action) => {
    const { id, changes } = action.payload;
    debouncedSave(() => {
      fetch('/api/board/cards', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...changes }),
      }).catch((e) => console.error('Failed to update card:', e));
    });
  },
});

// Sync toggleChecklistItem to API
localStorageMiddleware.startListening({
  actionCreator: toggleChecklistItem,
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const { cardId } = _action.payload;
    const card = state.board.cards[cardId];
    if (card) {
      debouncedSave(() => {
        fetch('/api/board/cards', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: cardId, checklist: card.checklist }),
        }).catch((e) => console.error('Failed to sync checklist:', e));
      });
    }
  },
});

// Sync deleteCard to API
localStorageMiddleware.startListening({
  actionCreator: deleteCard,
  effect: (action) => {
    const { columnId, cardId } = action.payload;
    fetch('/api/board/cards', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId, columnId }),
    }).catch((e) => console.error('Failed to delete card:', e));
  },
});

// Sync moveCard to API
localStorageMiddleware.startListening({
  actionCreator: moveCard,
  effect: (action) => {
    fetch('/api/board/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action.payload),
    }).catch((e) => console.error('Failed to move card:', e));
  },
});

// Sync moveColumn to API (update columnOrder)
localStorageMiddleware.startListening({
  actionCreator: moveColumn,
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    fetch('/api/board', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ columnOrder: state.board.columnOrder }),
    }).catch((e) => console.error('Failed to save column order:', e));
  },
});

// Sync settings to API
localStorageMiddleware.startListening({
  matcher: isAnyOf(setBackground, setCustomImage, setLocale),
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        backgroundId: state.settings.backgroundId,
        customImage: state.settings.customImage,
        locale: state.settings.locale,
      }),
    }).catch((e) => console.error('Failed to save settings:', e));
  },
});
