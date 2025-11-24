import { useCallback } from 'react';
import Toast from 'react-native-toast-message';

export interface ToastOptions {
  text1?: string;
  text2?: string;
  visibilityTime?: number;
  autoHide?: boolean;
  topOffset?: number;
  bottomOffset?: number;
  onShow?: () => void;
  onHide?: () => void;
  onPress?: () => void;
}

export function useToast() {
  const showSuccess = useCallback((message: string, options?: ToastOptions) => {
    Toast.show({
      type: 'success',
      text1: options?.text1 || 'Success',
      text2: message,
      visibilityTime: options?.visibilityTime || 3000,
      autoHide: options?.autoHide !== false,
      topOffset: options?.topOffset,
      bottomOffset: options?.bottomOffset,
      onShow: options?.onShow,
      onHide: options?.onHide,
      onPress: options?.onPress,
    });
  }, []);

  const showError = useCallback((message: string, options?: ToastOptions) => {
    Toast.show({
      type: 'error',
      text1: options?.text1 || 'Error',
      text2: message,
      visibilityTime: options?.visibilityTime || 4000,
      autoHide: options?.autoHide !== false,
      topOffset: options?.topOffset,
      bottomOffset: options?.bottomOffset,
      onShow: options?.onShow,
      onHide: options?.onHide,
      onPress: options?.onPress,
    });
  }, []);

  const showWarning = useCallback((message: string, options?: ToastOptions) => {
    Toast.show({
      type: 'warning',
      text1: options?.text1 || 'Warning',
      text2: message,
      visibilityTime: options?.visibilityTime || 3500,
      autoHide: options?.autoHide !== false,
      topOffset: options?.topOffset,
      bottomOffset: options?.bottomOffset,
      onShow: options?.onShow,
      onHide: options?.onHide,
      onPress: options?.onPress,
    });
  }, []);

  const showInfo = useCallback((message: string, options?: ToastOptions) => {
    Toast.show({
      type: 'info',
      text1: options?.text1 || 'Info',
      text2: message,
      visibilityTime: options?.visibilityTime || 3000,
      autoHide: options?.autoHide !== false,
      topOffset: options?.topOffset,
      bottomOffset: options?.bottomOffset,
      onShow: options?.onShow,
      onHide: options?.onHide,
      onPress: options?.onPress,
    });
  }, []);

  const hide = useCallback(() => {
    Toast.hide();
  }, []);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hide,
  };
}





