import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text, Platform } from 'react-native';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

interface ToastQueueProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

const ToastQueue: React.FC<ToastQueueProps> = ({ toasts, onRemove }) => {
  return (
    <View style={styles.container}>
      {toasts.map((toast, index) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          index={index}
          onRemove={onRemove}
        />
      ))}
    </View>
  );
};

interface ToastItemProps {
  toast: ToastItem;
  index: number;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, index, onRemove }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto remove after duration
    const timer = setTimeout(() => {
      handleRemove();
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onRemove(toast.id);
    });
  };

  const getToastStyle = () => {
    switch (toast.type) {
      case 'success':
        return { backgroundColor: '#4CAF50' };
      case 'error':
        return { backgroundColor: '#F44336' };
      case 'info':
        return { backgroundColor: '#2196F3' };
      case 'warning':
        return { backgroundColor: '#FF9800' };
      default:
        return { backgroundColor: '#4CAF50' };
    }
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        getToastStyle(),
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
          top: 60 + index * 80, // Stack toasts vertically
        },
      ]}
    >
      <TouchableOpacity
        style={styles.toastContent}
        onPress={handleRemove}
        activeOpacity={0.8}
      >
        <Text style={styles.toastTitle}>{toast.title}</Text>
        <Text style={styles.toastMessage}>{toast.message}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: 9999,
    pointerEvents: 'box-none',
  },
  toast: {
    position: 'absolute',
    right: 16,
    minWidth: 200,
    maxWidth: '85%',
    borderRadius: 8,
    padding: 15,
    // Use boxShadow for web, shadow* props for native
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }),
  },
  toastContent: {
    flex: 1,
  },
  toastTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  toastMessage: {
    color: '#FFFFFF',
    fontSize: 13,
  },
});

export default ToastQueue;


