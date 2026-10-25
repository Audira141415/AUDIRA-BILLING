import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export interface RealtimeNotification {
  id: string;
  type: 'payment' | 'ticket' | 'alert' | 'invoice' | 'system';
  title: string;
  message: string;
  timestamp: string;
  data?: any;
  read: boolean;
}

interface RealtimeContextType {
  isConnected: boolean;
  socket: Socket | null;
  notifications: RealtimeNotification[];
  lastEvent: any | null;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
  markAsRead: (id: string) => void;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [lastEvent, setLastEvent] = useState<any | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const addNotification = useCallback((notif: Omit<RealtimeNotification, 'id' | 'read'>) => {
    const newNotif: RealtimeNotification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3218';
    
    // Initialize socket connection
    const socket = io(backendUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      // Join admin room by default for Web Admin Dashboard
      socket.emit('join_room', { room: 'admin_room', role: 'ADMIN' });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connected', (payload) => {
      setLastEvent({ type: 'handshake', data: payload });
    });

    // Listen to real-time payments
    socket.on('payment_received', (data: any) => {
      setLastEvent({ type: 'payment_received', data });
      addNotification({
        type: 'payment',
        title: '💰 Pembayaran Diterima!',
        message: `${data.customerName || 'Pelanggan'} telah membayar tagihan ${data.invoiceNumber || ''} sebesar Rp ${(data.amount || 0).toLocaleString('id-ID')}`,
        timestamp: data.timestamp || new Date().toISOString(),
        data,
      });
    });

    // Listen to real-time trouble tickets
    socket.on('ticket_updated', (data: any) => {
      setLastEvent({ type: 'ticket_updated', data });
      addNotification({
        type: 'ticket',
        title: `🎫 Tiket ${data.ticketNumber || 'Update'} (${data.status})`,
        message: `${data.title || 'Pembaruan tiket'} - ${data.customerName || ''}`,
        timestamp: data.timestamp || new Date().toISOString(),
        data,
      });
    });

    // Listen to network alarms (MikroTik / OLT / GenieACS)
    socket.on('network_alert', (data: any) => {
      setLastEvent({ type: 'network_alert', data });
      addNotification({
        type: 'alert',
        title: `🚨 Alert Jaringan: ${data.device} [${data.status}]`,
        message: data.message,
        timestamp: data.timestamp || new Date().toISOString(),
        data,
      });
    });

    // Listen to invoice creation
    socket.on('invoice_created', (data: any) => {
      setLastEvent({ type: 'invoice_created', data });
      addNotification({
        type: 'invoice',
        title: '📄 Invoice Tagihan Baru Terbit',
        message: `Invoice ${data.invoiceNumber || ''} untuk ${data.customerName || 'Pelanggan'} sebesar Rp ${(data.amount || 0).toLocaleString('id-ID')}`,
        timestamp: data.timestamp || new Date().toISOString(),
        data,
      });
    });

    // Listen to general dashboard refresh
    socket.on('dashboard_refresh', (data: any) => {
      setLastEvent({ type: 'dashboard_refresh', data });
    });

    return () => {
      socket.disconnect();
    };
  }, [addNotification]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const joinRoom = useCallback((room: string) => {
    socketRef.current?.emit('join_room', { room });
  }, []);

  const leaveRoom = useCallback((room: string) => {
    socketRef.current?.emit('leave_room', room);
  }, []);

  return (
    <RealtimeContext.Provider
      value={{
        isConnected,
        socket: socketRef.current,
        notifications,
        lastEvent,
        dismissNotification,
        clearNotifications,
        markAsRead,
        joinRoom,
        leaveRoom,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};
