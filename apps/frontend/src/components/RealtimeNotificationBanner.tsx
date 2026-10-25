import React, { useState } from 'react';
import { useRealtime, RealtimeNotification } from '@/contexts/RealtimeContext';
import { Wifi, WifiOff, X, Bell, CheckCircle2, AlertTriangle, AlertCircle, FileText, ChevronRight } from 'lucide-react';

export const RealtimeNotificationBanner: React.FC = () => {
  const { isConnected, notifications, dismissNotification, clearNotifications } = useRealtime();
  const [isOpen, setIsOpen] = useState(false);

  // Latest unread notification for toast popups
  const activeToasts = notifications.slice(0, 3);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: RealtimeNotification['type']) => {
    switch (type) {
      case 'payment':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'ticket':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-rose-500" />;
      case 'invoice':
        return <FileText className="w-5 h-5 text-cyan-400" />;
      default:
        return <Bell className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBorderColor = (type: RealtimeNotification['type']) => {
    switch (type) {
      case 'payment':
        return 'border-emerald-500/50 shadow-emerald-500/20';
      case 'ticket':
        return 'border-amber-500/50 shadow-amber-500/20';
      case 'alert':
        return 'border-rose-500/60 shadow-rose-500/30';
      case 'invoice':
        return 'border-cyan-500/50 shadow-cyan-500/20';
      default:
        return 'border-blue-500/40 shadow-blue-500/20';
    }
  };

  return (
    <>
      {/* Realtime Floating Status Pill (Fixed Bottom Right) */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border shadow-lg transition-all duration-300 ${
            isConnected
              ? 'bg-slate-900/90 text-emerald-400 border-emerald-500/30 hover:border-emerald-400 shadow-emerald-950/40'
              : 'bg-slate-900/90 text-rose-400 border-rose-500/30 hover:border-rose-400 shadow-rose-950/40 animate-pulse'
          }`}
          title={isConnected ? 'Realtime Gateway Terhubung' : 'Terputus dari Realtime Gateway'}
        >
          {isConnected ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Wifi className="w-3.5 h-3.5" />
              <span>Live Sync</span>
            </>
          ) : (
            <>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline Sync</span>
            </>
          )}

          {unreadCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Floating Active Toast Notifications (Top Right) */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {activeToasts.map((notif) => (
          <div
            key={notif.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/95 border backdrop-blur-lg shadow-xl transition-all duration-300 transform translate-y-0 opacity-100 ${getBorderColor(
              notif.type
            )}`}
          >
            <div className="mt-0.5 flex-shrink-0">{getIcon(notif.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs font-bold text-slate-100 truncate">{notif.title}</p>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {new Date(notif.timestamp).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-300 leading-snug">{notif.message}</p>
            </div>
            <button
              onClick={() => dismissNotification(notif.id)}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Notification Center Slide-over Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-slate-100 text-sm">Pusat Notifikasi Real-time</h3>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 rounded-full">
                  {notifications.length} Event
                </span>
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    Bersihkan
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {notifications.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500 mb-3">
                    <Bell className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-slate-300">Belum ada aktivitas baru</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Event pembayaran pelanggan, tiket trouble, dan alert MikroTik/OLT akan muncul secara live di sini.
                  </p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-xl border bg-slate-800/60 hover:bg-slate-800 transition-all ${getBorderColor(
                      n.type
                    )}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5">{getIcon(n.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-100">{n.title}</p>
                          <span className="text-[10px] text-slate-500">
                            {new Date(n.timestamp).toLocaleTimeString('id-ID')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{n.message}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer with Gateway Status */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-emerald-400' : 'bg-rose-500'
                  }`}
                />
                Gateway: {isConnected ? 'Active (Port 3218)' : 'Connecting...'}
              </span>
              <span className="text-[11px] text-slate-500">AUDIRA Realtime Engine</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
