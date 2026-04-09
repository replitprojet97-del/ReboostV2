import { useEffect, useCallback } from "react";
import { useSocket } from "./useSocket";
import { queryClient } from "@/lib/queryClient";

export interface DataUpdateEvent {
  type: 'loan' | 'transfer' | 'user' | 'dashboard' | 'notification' | 'fee' | 'contract' | 'admin_dashboard';
  action: 'created' | 'updated' | 'deleted' | 'approved' | 'rejected' | 'confirmed';
  entityId?: string;
  data?: any;
}

export function useDataSocket() {
  const { socket, connected } = useSocket();

  const handleDataUpdate = useCallback((event: DataUpdateEvent) => {
    console.log('[DATA WS] Received real-time update:', event);

    switch (event.type) {
      case 'loan':
        queryClient.invalidateQueries({ queryKey: ['/api/loans'] });
        if (event.entityId) {
          queryClient.invalidateQueries({ queryKey: ['/api/loans', event.entityId] });
        }
        queryClient.invalidateQueries({ queryKey: ['/api/loans/available-for-transfer'] });
        break;

      case 'transfer':
        queryClient.invalidateQueries({ queryKey: ['/api/transfers'] });
        queryClient.invalidateQueries({ queryKey: ['/api/transfers/active'] });
        if (event.entityId) {
          queryClient.invalidateQueries({ queryKey: ['/api/transfers', event.entityId] });
        }
        break;

      case 'user':
        queryClient.invalidateQueries({ queryKey: ['/api/user'] });
        break;

      case 'dashboard':
        queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
        queryClient.invalidateQueries({ queryKey: ['/api/loans'] });
        queryClient.invalidateQueries({ queryKey: ['/api/transfers'] });
        queryClient.invalidateQueries({ queryKey: ['/api/fees'] });
        queryClient.invalidateQueries({ queryKey: ['/api/charts/available-funds'] });
        queryClient.invalidateQueries({ queryKey: ['/api/charts/upcoming-repayments'] });
        break;

      case 'notification':
        queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
        queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
        break;

      case 'fee':
        queryClient.invalidateQueries({ queryKey: ['/api/fees'] });
        queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
        break;

      case 'contract':
        queryClient.invalidateQueries({ queryKey: ['/api/loans'] });
        if (event.entityId) {
          queryClient.invalidateQueries({ queryKey: ['/api/loans', event.entityId] });
          queryClient.invalidateQueries({ queryKey: ['/api/contracts', event.entityId] });
        }
        break;

      case 'admin_dashboard':
        // Refresh all admin-related queries when admin dashboard updates are received
        queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications'] });
        queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications-count'] });
        queryClient.invalidateQueries({ queryKey: ['/api/admin/loans'] });
        queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
        queryClient.invalidateQueries({ queryKey: ['/api/admin/transfers'] });
        queryClient.invalidateQueries({ queryKey: ['/api/admin/messages'] });
        break;

      default:
        queryClient.invalidateQueries();
        break;
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('data:update', handleDataUpdate);

    return () => {
      socket.off('data:update', handleDataUpdate);
    };
  }, [socket, handleDataUpdate]);

  return { connected };
}
