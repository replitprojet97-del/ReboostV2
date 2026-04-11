import { useEffect, useRef } from 'react';
import { useUser } from '@/hooks/use-user';
import { useNotifications } from './NotificationBanner';
import { useLanguage, type Language } from '@/lib/i18n';
import { apiRequest } from '@/lib/queryClient';

const VALID_LANGS: Language[] = ['fr', 'en', 'es', 'pt', 'it', 'de', 'nl', 'hr'];

export default function UserSessionTracker() {
  const { data: user } = useUser();
  const { setCurrentUserId } = useNotifications();
  const { language, isAutoDetected, setLanguage } = useLanguage();
  const hasLoadedFromDB = useRef(false);
  const lastSyncedLang = useRef<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      setCurrentUserId(user.id);
    } else {
      setCurrentUserId(null);
      hasLoadedFromDB.current = false;
      lastSyncedLang.current = null;
    }
  }, [user?.id, setCurrentUserId]);

  // On first user load, adopt DB language if current UI language is auto-detected
  useEffect(() => {
    if (!user?.preferredLanguage || hasLoadedFromDB.current) return;
    hasLoadedFromDB.current = true;
    const dbLang = user.preferredLanguage as Language;
    if (VALID_LANGS.includes(dbLang)) {
      lastSyncedLang.current = dbLang;
      if (isAutoDetected && dbLang !== language) {
        setLanguage(dbLang);
      }
    }
  }, [user?.preferredLanguage]);

  // Sync explicit language changes to DB (debounced)
  useEffect(() => {
    if (!user?.id || !hasLoadedFromDB.current || isAutoDetected) return;
    if (lastSyncedLang.current === language) return;
    lastSyncedLang.current = language;

    const timer = setTimeout(() => {
      apiRequest('PATCH', '/api/user/profile', { preferredLanguage: language }).catch(() => {});
    }, 800);

    return () => clearTimeout(timer);
  }, [language, user?.id, isAutoDetected]);

  return null;
}
