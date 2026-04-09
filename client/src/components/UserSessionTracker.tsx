import { useEffect } from 'react';
import { useUser } from '@/hooks/use-user';
import { useNotifications } from './NotificationBanner';

export default function UserSessionTracker() {
  const { data: user } = useUser();
  const { setCurrentUserId } = useNotifications();

  useEffect(() => {
    if (user?.id) {
      setCurrentUserId(user.id);
    } else {
      setCurrentUserId(null);
    }
  }, [user?.id, setCurrentUserId]);

  return null;
}
