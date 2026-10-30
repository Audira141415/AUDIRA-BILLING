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
  addToast: (
    typeOrOpts: ToastType | { type?: ToastType; title: string; message?: string },
    message?: string,
    title?: string
  ) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const sanitizeToastText = (input?: string) => {
  if (!input) return '';
  return input
    .replace(/[\u2600-\u27BF]|[\uD83C-\uDBFF][\uDC00-\uDFFF]/g, '')
    .replace(/\u2014/g, '-')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string, title?: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const cleanTitle = sanitizeToastText(
      title || (type === 'success' ? 'Berhasil' : type === 'error' ? 'Kesalahan' : type === 'warning' ? 'Perhatian' : 'Informasi')
    );
    const cleanMsg = sanitizeToastText(message);
    const newToast: ToastItem = {
      id,
      type,
      title: cleanTitle,
      message: cleanMsg,
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

      const originalAlert = window.alert;
      window.alert = (msg?: any) => {
        const text = String(msg || '');
        const lower = text.toLowerCase();
        if (lower.includes('berhasil') || lower.includes('success') || lower.includes('tersimpan') || lower.includes('aktif')) {
          toastMethods.success(text);
        } else if (lower.includes('gagal') || lower.includes('error') || lower.includes('failed') || lower.includes('wajib')) {
          toastMethods.error(text);
        } else if (lower.includes('perhatian') || lower.includes('warning') || lower.includes('peringatan')) {
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

  const flexibleAddToast = useCallback(
    (
      typeOrOpts: ToastType | { type?: ToastType; title: string; message?: string },
      message?: string,
      title?: string
    ) => {
      if (typeof typeOrOpts === 'object' && typeOrOpts !== null) {
        addToast(
          typeOrOpts.type || 'info',
          typeOrOpts.message || typeOrOpts.title,
          typeOrOpts.message ? typeOrOpts.title : undefined
        );
      } else {
        addToast(typeOrOpts, message || '', title);
      }
    },
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toast: toastMethods, addToast: flexibleAddToast, removeToast }}>
      {children}

      {/* Enterprise Semantic Toast Stack (Top Right) */}
      <div
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-2"
        role="region"
        aria-label="Notifikasi sistem"
      >
        {toasts.map((t) => {
          const isSuccess = t.type === 'success';
          const isError = t.type === 'error';
          const isWarning = t.type === 'warning';

          const borderTone = isSuccess
            ? 'border-emerald-500/40'
            : isError
            ? 'border-rose-500/40'
            : isWarning
            ? 'border-amber-500/40'
            : 'border-blue-500/40';

          const badgeTone = isSuccess
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
            : isError
            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
            : isWarning
            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';

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
              role="status"
              aria-live="polite"
              className={`pointer-events-auto transition-all duration-150 ease-out bg-[var(--app-card)] text-[var(--app-text)] border ${borderTone} rounded-lg p-3.5 shadow-lg flex items-start gap-3`}
            >
              <div className={`p-1.5 rounded-md border ${badgeTone} flex-shrink-0 mt-0.5`}>
                <Icon size={16} />
              </div>

              <div className="flex-1 min-w-0 pr-2">
                <h4 className="text-xs font-bold tracking-tight text-[var(--app-text)]">
                  {t.title}
                </h4>
                {t.message && (
                  <p className="text-[11px] text-[var(--app-text-muted)] mt-0.5 leading-snug break-words">
                    {t.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeToast(t.id)}
                aria-label="Tutup notifikasi"
                className="text-[var(--app-text-muted)] hover:text-[var(--app-text)] transition-colors p-1 rounded-md hover:bg-[var(--app-card-subtle)] cursor-pointer"
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
    return {
      toast: {
        success: (msg: string) => {
          if (typeof window !== 'undefined' && (window as any).audiraToast) {
            (window as any).audiraToast.success(msg);
          }
        },
        error: (msg: string) => {
          if (typeof window !== 'undefined' && (window as any).audiraToast) {
            (window as any).audiraToast.error(msg);
          }
        },
        info: (msg: string) => {
          if (typeof window !== 'undefined' && (window as any).audiraToast) {
            (window as any).audiraToast.info(msg);
          }
        },
        warning: (msg: string) => {
          if (typeof window !== 'undefined' && (window as any).audiraToast) {
            (window as any).audiraToast.warning(msg);
          }
        },
      },
      addToast: (
        typeOrOpts: ToastType | { type?: ToastType; title: string; message?: string },
        message?: string,
        title?: string
      ) => {
        if (typeof window !== 'undefined' && (window as any).audiraToast) {
          if (typeof typeOrOpts === 'object' && typeOrOpts !== null) {
            const t = typeOrOpts.type || 'info';
            (window as any).audiraToast[t]?.(typeOrOpts.message || typeOrOpts.title, typeOrOpts.title);
          } else {
            (window as any).audiraToast[typeOrOpts]?.(message || '', title);
          }
        }
      },
      removeToast: () => {},
    };
  }
  return context;
};

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
