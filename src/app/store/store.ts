import { configureStore } from '@reduxjs/toolkit';
import boardReducer from '@/entities/board/model/boardSlice';
import settingsReducer from '@/entities/settings/model/settingsSlice';
import { localStorageMiddleware } from './middleware';

export const store = configureStore({
  reducer: {
    board: boardReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(localStorageMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
