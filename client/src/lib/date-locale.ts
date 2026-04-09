import { fr, enUS, es, pt, it, de, nl } from 'date-fns/locale';
import type { Language } from './i18n';

export function getDateLocale(language: Language) {
  const locales = {
    fr,
    en: enUS,
    es,
    pt,
    it,
    de,
    nl,
  };
  
  return locales[language] || enUS;
}
