import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '@/lib/socket';

export function useDataSocketUpdates() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();

    const handleDataUpdate = (event: any) => {
      console.log('[SOCKET] Data update received:', event);

      if (event.type === 'loan') {
        if (event.action === 'deleted') {
          queryClient.setQueryData(['/api/loans'], (oldData: any[] | undefined) => {
            if (!oldData) return oldData;
            return oldData.filter((loan: any) => loan.id !== event.entityId);
          });
          console.log(`[SOCKET] Loan ${event.entityId} removed from cache`);
        } else {
          queryClient.invalidateQueries({ queryKey: ['/api/loans'] });
          console.log(`[SOCKET] Loans cache invalidated due to action: ${event.action}`);
        }
      }

      if (event.type === 'transfer') {
        queryClient.invalidateQueries({ queryKey: ['/api/transfers'] });
        queryClient.invalidateQueries({ queryKey: ['/api/transfers/active'] });
      }

      if (event.type === 'dashboard') {
        queryClient.invalidateQueries({ queryKey: ['/api/user'] });
        queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      }
    };

    socket.on('data:update', handleDataUpdate);

    return () => {
      socket.off('data:update', handleDataUpdate);
    };
  }, [queryClient]);
}
