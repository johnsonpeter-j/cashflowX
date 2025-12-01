// Toast utility that can be used in thunks (outside React components)
// This uses a global toast manager that works with the ToastContext

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  message: string;
  title?: string;
  duration?: number;
}

// Global toast manager
class ToastManager {
  private listeners: Array<(type: ToastType, options: ToastOptions) => void> = [];

  subscribe(listener: (type: ToastType, options: ToastOptions) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(type: ToastType, options: ToastOptions) {
    this.listeners.forEach(listener => listener(type, options));
  }

  showSuccess(options: ToastOptions | string) {
    const config = typeof options === 'string' ? { message: options } : options;
    this.notify('success', config);
  }

  showError(options: ToastOptions | string) {
    const config = typeof options === 'string' ? { message: options } : options;
    this.notify('error', config);
  }

  showInfo(options: ToastOptions | string) {
    const config = typeof options === 'string' ? { message: options } : options;
    this.notify('info', config);
  }

  showWarn(options: ToastOptions | string) {
    const config = typeof options === 'string' ? { message: options } : options;
    this.notify('warning', config);
  }
}

// Export singleton instance
export const toastManager = new ToastManager();

// Convenience functions for use in thunks
export const showToast = {
  success: (options: ToastOptions | string) => toastManager.showSuccess(options),
  error: (options: ToastOptions | string) => toastManager.showError(options),
  info: (options: ToastOptions | string) => toastManager.showInfo(options),
  warn: (options: ToastOptions | string) => toastManager.showWarn(options),
};




