import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getTranslations, Locale } from '@/shared/lib/i18n';

export interface BoardBackground {
  id: string;
  /** Label keys for i18n lookup */
  labelKey: string;
  /** CSS for the aurora glow pseudo-element */
  aurora: string;
  /** Preview gradient for the picker UI */
  preview: string;
}

export const BOARD_BACKGROUNDS: BoardBackground[] = [
  {
    id: 'ocean',
    labelKey: 'bgOcean',
    aurora: 'radial-gradient(ellipse at 20% 80%, rgba(0,124,190,0.9) 0%, transparent 50%), radial-gradient(ellipse at 60% 90%, rgba(168,130,221,0.7) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(255,247,174,0.6) 0%, transparent 50%)',
    preview: 'linear-gradient(135deg, #007CBE, #A882DD, #FFF7AE)',
  },
  {
    id: 'sunset',
    labelKey: 'bgSunset',
    aurora: 'radial-gradient(ellipse at 30% 85%, rgba(229,122,68,0.9) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(219,83,117,0.7) 0%, transparent 50%), radial-gradient(ellipse at 50% 95%, rgba(255,193,69,0.5) 0%, transparent 50%)',
    preview: 'linear-gradient(135deg, #E57A44, #DB5375, #FFC145)',
  },
  {
    id: 'lavender',
    labelKey: 'bgLavender',
    aurora: 'radial-gradient(ellipse at 25% 85%, rgba(168,130,221,0.9) 0%, transparent 50%), radial-gradient(ellipse at 65% 80%, rgba(241,254,198,0.7) 0%, transparent 50%), radial-gradient(ellipse at 50% 95%, rgba(179,255,179,0.5) 0%, transparent 50%)',
    preview: 'linear-gradient(135deg, #A882DD, #F1FEC6, #B3FFB3)',
  },
  {
    id: 'blossom',
    labelKey: 'bgBlossom',
    aurora: 'radial-gradient(ellipse at 30% 80%, rgba(219,83,117,0.9) 0%, transparent 50%), radial-gradient(ellipse at 70% 90%, rgba(179,255,179,0.7) 0%, transparent 50%), radial-gradient(ellipse at 50% 85%, rgba(255,193,69,0.5) 0%, transparent 50%)',
    preview: 'linear-gradient(135deg, #DB5375, #B3FFB3, #FFC145)',
  },
  {
    id: 'deep-blue',
    labelKey: 'bgDeepBlue',
    aurora: 'radial-gradient(ellipse at 25% 85%, rgba(2,195,189,0.9) 0%, transparent 50%), radial-gradient(ellipse at 65% 80%, rgba(78,20,140,0.8) 0%, transparent 50%), radial-gradient(ellipse at 45% 95%, rgba(99,102,241,0.6) 0%, transparent 50%)',
    preview: 'linear-gradient(135deg, #02C3BD, #4E148C, #6366F1)',
  },
  {
    id: 'lime',
    labelKey: 'bgLime',
    aurora: 'radial-gradient(ellipse at 30% 85%, rgba(98,148,96,0.9) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(244,211,94,0.8) 0%, transparent 50%), radial-gradient(ellipse at 50% 95%, rgba(176,219,67,0.6) 0%, transparent 50%)',
    preview: 'linear-gradient(135deg, #629460, #F4D35E, #B0DB43)',
  },
  {
    id: 'forest',
    labelKey: 'bgForest',
    aurora: 'radial-gradient(ellipse at 25% 80%, rgba(65,66,136,0.9) 0%, transparent 50%), radial-gradient(ellipse at 65% 90%, rgba(176,219,67,0.8) 0%, transparent 50%), radial-gradient(ellipse at 45% 85%, rgba(98,148,96,0.5) 0%, transparent 50%)',
    preview: 'linear-gradient(135deg, #414288, #B0DB43, #629460)',
  },
  {
    id: 'coral',
    labelKey: 'bgCoral',
    aurora: 'radial-gradient(ellipse at 30% 85%, rgba(255,193,69,0.9) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(236,54,141,0.8) 0%, transparent 50%), radial-gradient(ellipse at 50% 95%, rgba(219,83,117,0.5) 0%, transparent 50%)',
    preview: 'linear-gradient(135deg, #FFC145, #EC368D, #DB5375)',
  },
];


interface SettingsState {
  backgroundId: string;
  customImage: string | null;
  locale: Locale;
}

const initialState: SettingsState = {
  backgroundId: 'ocean',
  customImage: null,
  locale: 'ru',
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setBackground: (state, action: PayloadAction<string>) => {
      state.backgroundId = action.payload;
    },
    setCustomImage: (state, action: PayloadAction<string | null>) => {
      state.customImage = action.payload;
      state.backgroundId = 'custom';
    },
    setLocale: (state, action: PayloadAction<Locale>) => {
      state.locale = action.payload;
    },
    setSettingsState: (state, action: PayloadAction<SettingsState>) => {
      return action.payload;
    },
  },
});

export const { setBackground, setCustomImage, setLocale, setSettingsState } = settingsSlice.actions;
export default settingsSlice.reducer;
