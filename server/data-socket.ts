import { Server as SocketIOServer } from 'socket.io';

export interface DataUpdateEvent {
  type: 'loan' | 'transfer' | 'user' | 'dashboard' | 'notification' | 'fee' | 'contract' | 'admin_dashboard';
  action: 'created' | 'updated' | 'deleted' | 'approved' | 'rejected' | 'confirmed';
  entityId?: string;
  data?: any;
}

let ioInstance: SocketIOServer | null = null;

export function setSocketInstance(io: SocketIOServer) {
  ioInstance = io;
  console.log('[DATA WS] Socket instance configured for real-time data updates');
}

export function getSocketInstance(): SocketIOServer | null {
  return ioInstance;
}

export function emitDataUpdate(userId: string, event: DataUpdateEvent) {
  if (!ioInstance) {
    console.warn('[DATA WS] Socket instance not initialized, cannot emit data update');
    return;
  }

  console.log(`[DATA WS] Emitting data update to user ${userId}:`, event);
  ioInstance.to(`user:${userId}`).emit('data:update', event);
}

export function emitDataUpdateToAll(event: DataUpdateEvent) {
  if (!ioInstance) {
    console.warn('[DATA WS] Socket instance not initialized, cannot emit data update');
    return;
  }

  console.log('[DATA WS] Emitting data update to all users:', event);
  ioInstance.emit('data:update', event);
}

export function emitLoanUpdate(userId: string, action: DataUpdateEvent['action'], loanId?: string, data?: any) {
  emitDataUpdate(userId, {
    type: 'loan',
    action,
    entityId: loanId,
    data,
  });
}

export function emitTransferUpdate(userId: string, action: DataUpdateEvent['action'], transferId?: string, data?: any) {
  emitDataUpdate(userId, {
    type: 'transfer',
    action,
    entityId: transferId,
    data,
  });
}

export function emitUserUpdate(userId: string, action: DataUpdateEvent['action'], data?: any) {
  emitDataUpdate(userId, {
    type: 'user',
    action,
    entityId: userId,
    data,
  });
}

export function emitDashboardUpdate(userId: string) {
  emitDataUpdate(userId, {
    type: 'dashboard',
    action: 'updated',
  });
}

export function emitNotificationUpdate(userId: string, action: DataUpdateEvent['action'], notificationId?: string, data?: any) {
  emitDataUpdate(userId, {
    type: 'notification',
    action,
    entityId: notificationId,
    data,
  });
}

export function emitFeeUpdate(userId: string, action: DataUpdateEvent['action'], feeId?: string, data?: any) {
  emitDataUpdate(userId, {
    type: 'fee',
    action,
    entityId: feeId,
    data,
  });
}

export function emitContractUpdate(userId: string, action: DataUpdateEvent['action'], loanId?: string, data?: any) {
  emitDataUpdate(userId, {
    type: 'contract',
    action,
    entityId: loanId,
    data,
  });
}

// Emit update to all connected clients for admin dashboard refresh
// This is used when events happen that admins need to see immediately
// (e.g., user signs contract, new loan request, etc.)
export function emitAdminDashboardUpdate(action: DataUpdateEvent['action'] = 'updated', data?: any) {
  emitDataUpdateToAll({
    type: 'admin_dashboard',
    action,
    data,
  });
}
