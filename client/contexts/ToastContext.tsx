import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import ToastQueue, { ToastItem } from '@/components/toast-queue';
import { toastManager } from '@/utils/toast';

interface ToastOptions {
  message: string;
  title?: string;
  duration?: number;
}

interface ToastContextType {
  showSuccess: (options: ToastOptions | string) => void;
  showError: (options: ToastOptions | string) => void;
  showInfo: (options: ToastOptions | string) => void;
  showWarn: (options: ToastOptions | string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastIdCounter = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((type: ToastItem['type'], options: ToastOptions | string) => {
    const config = typeof options === 'string' 
      ? { message: options } 
      : options;
    
    const newToast: ToastItem = {
      id: `toast-${toastIdCounter++}`,
      type,
      title: config.title || (type === 'success' ? 'Success' : type === 'error' ? 'Error' : type === 'warning' ? 'Warning' : 'Info'),
      message: config.message,
      duration: config.duration || 3000,
    };

    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((options: ToastOptions | string) => {
    addToast('success', options);
  }, [addToast]);

  const showError = useCallback((options: ToastOptions | string) => {
    addToast('error', options);
  }, [addToast]);

  const showInfo = useCallback((options: ToastOptions | string) => {
    addToast('info', options);
  }, [addToast]);

  const showWarn = useCallback((options: ToastOptions | string) => {
    addToast('warning', options);
  }, [addToast]);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  // Subscribe to toast manager for thunk usage
  useEffect(() => {
    const unsubscribe = toastManager.subscribe((type, options) => {
      const config = typeof options === 'string' 
        ? { message: options } 
        : options;
      
      const newToast: ToastItem = {
        id: `toast-${toastIdCounter++}`,
        type,
        title: config.title || (type === 'success' ? 'Success' : type === 'error' ? 'Error' : type === 'warning' ? 'Warning' : 'Info'),
        message: config.message,
        duration: config.duration || 3000,
      };

      setToasts(prev => [...prev, newToast]);
    });

    return unsubscribe;
  }, []);

  return (
    <ToastContext.Provider
      value={{
        showSuccess,
        showError,
        showInfo,
        showWarn,
        clearAll,
      }}
    >
      {children}
      <ToastQueue toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

