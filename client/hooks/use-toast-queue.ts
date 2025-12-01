import { useState, useCallback } from 'react';
import { ToastItem } from '@/components/toast-queue';

let toastIdCounter = 0;

export interface ToastOptions {
  message: string;
  title?: string;
  duration?: number;
}

export const useToastQueue = () => {
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

  return {
    toasts,
    showSuccess,
    showError,
    showInfo,
    showWarn,
    removeToast,
    clearAll,
  };
};




