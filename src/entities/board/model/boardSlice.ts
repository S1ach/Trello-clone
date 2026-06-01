import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BoardState, Card, ChecklistItem, Column } from './types';
import { t } from '@/shared/lib/i18n';

const initialState: BoardState = {
  title: t.defaultBoardTitle,
  searchQuery: '',
  columns: {
    'column-1': {
      id: 'column-1',
      title: t.columnTodo,
      cardIds: ['card-1', 'card-2'],
      sortBy: 'none',
    },
    'column-2': {
      id: 'column-2',
      title: t.columnInProgress,
      cardIds: ['card-3'],
      sortBy: 'none',
    },
    'column-3': {
      id: 'column-3',
      title: t.columnDone,
      cardIds: [],
      sortBy: 'none',
    },
  },
  cards: {
    'card-1': { id: 'card-1', content: t.cardDesignUI, description: '', labels: [], dueDate: null, checklist: [], priority: 'high', attachments: [], createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString() },
    'card-2': { id: 'card-2', content: t.cardSetupNextjs, description: '', labels: [], dueDate: null, checklist: [], priority: 'medium', attachments: [], createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString() },
    'card-3': { id: 'card-3', content: t.cardConfigureRedux, description: '', labels: ['blue'], dueDate: null, checklist: [], priority: 'low', attachments: [], createdAt: new Date(Date.now() - 3600000 * 24).toISOString() },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoardState: (state, action: PayloadAction<BoardState>) => {
      return {
        ...action.payload,
        searchQuery: state.searchQuery,
      };
    },
    updateBoardTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    resetBoard: () => {
      return initialState;
    },
    addCard: (state, action: PayloadAction<{ columnId: string; card: Card }>) => {
      const { columnId, card } = action.payload;
      state.cards[card.id] = card;
      state.columns[columnId].cardIds.push(card.id);
    },
    editCard: (state, action: PayloadAction<{ id: string; content: string }>) => {
      const { id, content } = action.payload;
      if (state.cards[id]) {
        state.cards[id].content = content;
      }
    },
    updateCard: (state, action: PayloadAction<{ id: string; changes: Partial<Omit<Card, 'id' | 'createdAt'>> }>) => {
      const { id, changes } = action.payload;
      if (state.cards[id]) {
        Object.assign(state.cards[id], changes);
      }
    },
    toggleChecklistItem: (state, action: PayloadAction<{ cardId: string; itemId: string }>) => {
      const { cardId, itemId } = action.payload;
      const card = state.cards[cardId];
      if (card) {
        const item = card.checklist.find(i => i.id === itemId);
        if (item) {
          item.completed = !item.completed;
        }
      }
    },
    deleteCard: (state, action: PayloadAction<{ columnId: string; cardId: string }>) => {
      const { columnId, cardId } = action.payload;
      state.columns[columnId].cardIds = state.columns[columnId].cardIds.filter(id => id !== cardId);
      delete state.cards[cardId];
    },
    addColumn: (state, action: PayloadAction<Column>) => {
      state.columns[action.payload.id] = action.payload;
      state.columnOrder.push(action.payload.id);
    },
    editColumnTitle: (state, action: PayloadAction<{ columnId: string; title: string }>) => {
      const { columnId, title } = action.payload;
      if (state.columns[columnId]) {
        state.columns[columnId].title = title;
      }
    },
    setColumnSort: (state, action: PayloadAction<{ columnId: string; sortBy: Column['sortBy'] }>) => {
      const { columnId, sortBy } = action.payload;
      if (state.columns[columnId]) {
        state.columns[columnId].sortBy = sortBy;
      }
    },
    deleteColumn: (state, action: PayloadAction<string>) => {
      const columnId = action.payload;
      const cardIds = state.columns[columnId].cardIds;
      cardIds.forEach(id => {
        delete state.cards[id];
      });
      delete state.columns[columnId];
      state.columnOrder = state.columnOrder.filter(id => id !== columnId);
    },
    moveCard: (state, action: PayloadAction<{
      sourceColumnId: string;
      destinationColumnId: string;
      sourceIndex: number;
      destinationIndex: number;
      cardId: string;
    }>) => {
      const { sourceColumnId, destinationColumnId, sourceIndex, destinationIndex, cardId } = action.payload;
      const sourceColumn = state.columns[sourceColumnId];
      const destColumn = state.columns[destinationColumnId];

      sourceColumn.cardIds.splice(sourceIndex, 1);
      destColumn.cardIds.splice(destinationIndex, 0, cardId);
    },
    moveColumn: (state, action: PayloadAction<{ sourceIndex: number; destinationIndex: number; columnId: string }>) => {
      const { sourceIndex, destinationIndex, columnId } = action.payload;
      state.columnOrder.splice(sourceIndex, 1);
      state.columnOrder.splice(destinationIndex, 0, columnId);
    }
  },
});

export const {
  setBoardState,
  updateBoardTitle,
  setSearchQuery,
  resetBoard,
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
  moveColumn
} = boardSlice.actions;

export default boardSlice.reducer;
