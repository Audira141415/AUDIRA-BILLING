import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toast: {
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
  };
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string, title?: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastItem = {
      id,
      type,
      title: title || (type === 'success' ? 'Berhasil' : type === 'error' ? 'Kesalahan' : type === 'warning' ? 'Perhatian' : 'Informasi'),
      message,
      duration: 4000,
    };

    setToasts((prev) => [...prev.slice(-4), newToast]);

    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  }, [removeToast]);

  const toastMethods = {
    success: (msg: string, title?: string) => addToast('success', msg, title),
    error: (msg: string, title?: string) => addToast('error', msg, title),
    info: (msg: string, title?: string) => addToast('info', msg, title),
    warning: (msg: string, title?: string) => addToast('warning', msg, title),
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).audiraToast = toastMethods;

      // Non-blocking Cyberpunk Toast Bridge for window.alert
      const originalAlert = window.alert;
      window.alert = (msg?: any) => {
        const text = String(msg || '');
        const lower = text.toLowerCase();
        if (text.includes('✅') || lower.includes('berhasil') || lower.includes('success')) {
          toastMethods.success(text);
        } else if (text.includes('❌') || lower.includes('gagal') || lower.includes('error') || lower.includes('failed')) {
          toastMethods.error(text);
        } else if (text.includes('⚠️') || lower.includes('perhatian') || lower.includes('warning') || lower.includes('peringatan')) {
          toastMethods.warning(text);
        } else {
          toastMethods.info(text);
        }
      };

      return () => {
        window.alert = originalAlert;
      };
    }
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toast: toastMethods, removeToast }}>
      {children}

      {/* Floating Neo-Brutalist Toast Container (Top Right) */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none p-2">
        {toasts.map((t) => {
          const isSuccess = t.type === 'success';
          const isError = t.type === 'error';
          const isWarning = t.type === 'warning';

          const accentBg = isSuccess
            ? 'bg-emerald-500'
            : isError
            ? 'bg-rose-500'
            : isWarning
            ? 'bg-amber-500'
            : 'bg-[#0070f3]';

          const accentBorder = isSuccess
            ? 'border-emerald-500/80'
            : isError
            ? 'border-rose-500/80'
            : isWarning
            ? 'border-amber-500/80'
            : 'border-[#0070f3]/80';

          const Icon = isSuccess
            ? CheckCircle2
            : isError
            ? AlertCircle
            : isWarning
            ? AlertTriangle
            : Info;

          return (
            <div
              key={t.id}
              className={`pointer-events-auto transform transition-all duration-300 ease-out translate-y-0 opacity-100 bg-[#0a0e1a] text-white border-2 ${accentBorder} rounded-xl p-4 shadow-[6px_6px_0px_#05070d] dark:shadow-[6px_6px_0px_rgba(0,112,243,0.35)] flex items-start gap-3 relative overflow-hidden`}
            >
              {/* Neon color bar indicator */}
              <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${accentBg}`} />

              <div className={`p-2 rounded-lg ${accentBg}/15 text-white flex-shrink-0 mt-0.5`}>
                <Icon size={18} className={isSuccess ? 'text-emerald-400' : isError ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-[#0070f3]'} />
              </div>

              <div className="flex-1 min-w-0 pr-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-white">
                  {t.title}
                </h4>
                {t.message && (
                  <p className="text-[11px] text-slate-300 mt-1 leading-snug break-words">
                    {t.message}
                  </p>
                )}
              </div>

              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback for components outside of provider
    return {
      toast: {
        success: (msg: string) => {
          if (typeof window !== 'undefined' && (window as any).audiraToast) {
            (window as any).audiraToast.success(msg);
          } else {
            console.log('[SUCCESS]', msg);
          }
        },
        error: (msg: string) => {
          if (typeof window !== 'undefined' && (window as any).audiraToast) {
            (window as any).audiraToast.error(msg);
          } else {
            console.error('[ERROR]', msg);
          }
        },
        info: (msg: string) => {
          if (typeof window !== 'undefined' && (window as any).audiraToast) {
            (window as any).audiraToast.info(msg);
          } else {
            console.info('[INFO]', msg);
          }
        },
        warning: (msg: string) => {
          if (typeof window !== 'undefined' && (window as any).audiraToast) {
            (window as any).audiraToast.warning(msg);
          } else {
            console.warn('[WARNING]', msg);
          }
        },
      },
    };
  }
  return context;
};

// Standalone global trigger helper (callable directly or via .success / .error)
type ToastTrigger = {
  (type: ToastType, msg: string, title?: string): void;
  success: (msg: string, title?: string) => void;
  error: (msg: string, title?: string) => void;
  info: (msg: string, title?: string) => void;
  warning: (msg: string, title?: string) => void;
};

const trigger: any = (type: ToastType, msg: string, title?: string) => {
  if (typeof window !== 'undefined' && (window as any).audiraToast) {
    if (type === 'success') (window as any).audiraToast.success(msg, title);
    else if (type === 'error') (window as any).audiraToast.error(msg, title);
    else if (type === 'warning') (window as any).audiraToast.warning(msg, title);
    else (window as any).audiraToast.info(msg, title);
  }
};
trigger.success = (msg: string, title?: string) => trigger('success', msg, title);
trigger.error = (msg: string, title?: string) => trigger('error', msg, title);
trigger.info = (msg: string, title?: string) => trigger('info', msg, title);
trigger.warning = (msg: string, title?: string) => trigger('warning', msg, title);

export const showAudiraToast: ToastTrigger = trigger;
