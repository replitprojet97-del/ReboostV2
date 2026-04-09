import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { isProtectedRoute } from '@/lib/route-utils';

const SESSION_CHECK_INTERVAL = 60000;
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

export default function SessionMonitor() {
  const [location] = useLocation();
  const lastActivityRef = useRef<number>(Date.now());
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [pollingEnabled, setPollingEnabled] = useState(false);

  useEffect(() => {
    setPollingEnabled(isProtectedRoute(location));
  }, [location]);

  useQuery<any>({
    queryKey: ['/api/user'],
    enabled: pollingEnabled,
    refetchInterval: pollingEnabled ? SESSION_CHECK_INTERVAL : false,
    retry: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (!isProtectedRoute(location)) return;

    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    const checkInactivity = () => {
      const inactiveTime = Date.now() - lastActivityRef.current;
      
      if (inactiveTime >= INACTIVITY_TIMEOUT) {
        window.location.href = '/login';
        sessionStorage.setItem('auth_redirect_message', 'Vous avez été déconnecté pour inactivité.');
      }
    };

    inactivityTimerRef.current = setInterval(checkInactivity, 60000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current);
      }
    };
  }, [location]);

  return null;
}
