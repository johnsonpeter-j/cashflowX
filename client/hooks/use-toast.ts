// Re-export from ToastContext for backward compatibility
export { useToast } from '@/contexts/ToastContext';

export interface ToastOptions {
  message: string;
  title?: string;
  duration?: number;
}
