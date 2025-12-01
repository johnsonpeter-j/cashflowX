import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import Toast from 'react-native-toast-message';
import { toastConfig } from './toast-config';

const { width } = Dimensions.get('window');

interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  text1?: string;
  text2?: string;
  visibilityTime?: number;
}

let toastQueue: ToastItem[] = [];
let toastListeners: Array<() => void> = [];

const addToast = (toast: ToastItem) => {
  toastQueue.push(toast);
  toastListeners.forEach(listener => listener());
};

const removeToast = (id: string) => {
  toastQueue = toastQueue.filter(t => t.id !== id);
  toastListeners.forEach(listener => listener());
};

export const showToast = (toast: Omit<ToastItem, 'id'>) => {
  const id = Date.now().toString() + Math.random().toString();
  addToast({ ...toast, id });
  
  // Auto remove after visibility time
  if (toast.visibilityTime) {
    setTimeout(() => {
      removeToast(id);
    }, toast.visibilityTime);
  }
  
  return id;
};

export const hideToast = (id: string) => {
  removeToast(id);
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const updateToasts = () => {
      setToasts([...toastQueue]);
    };
    
    toastListeners.push(updateToasts);
    updateToasts();
    
    return () => {
      toastListeners = toastListeners.filter(l => l !== updateToasts);
    };
  }, []);

  return (
    <View style={styles.container}>
      {toasts.map((toast, index) => (
        <View
          key={toast.id}
          style={[
            styles.toastWrapper,
            {
              top: 60 + index * 70, // Stack toasts vertically
            },
          ]}
        >
          <Toast
            ref={(ref) => {
              if (ref) {
                // Show the toast immediately
                setTimeout(() => {
                  Toast.show({
                    type: toast.type,
                    text1: toast.text1,
                    text2: toast.text2,
                    visibilityTime: toast.visibilityTime || 3000,
                    position: 'top',
                    topOffset: 60 + index * 70,
                  });
                }, 0);
              }
            }}
            config={toastConfig}
            position="top"
            topOffset={60 + index * 70}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    pointerEvents: 'box-none',
  },
  toastWrapper: {
    position: 'absolute',
    right: 16,
    alignSelf: 'flex-end',
    width: width * 0.85,
    pointerEvents: 'box-none',
  },
});

