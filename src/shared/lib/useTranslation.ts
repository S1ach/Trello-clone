import { useAppSelector } from '@/app/store/hooks';
import { getTranslations } from './i18n';

/** Reactive hook: returns translations based on current locale from Redux */
export function useTranslation() {
  const locale = useAppSelector((state) => state.settings.locale);
  return getTranslations(locale);
}
