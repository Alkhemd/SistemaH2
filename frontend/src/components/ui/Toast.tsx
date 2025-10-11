'use client';

import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

export const ToastProvider: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: '',
        duration: 4000,
        style: {
          background: '#ffffff',
          color: '#1D1D1F',
          border: '1px solid #E5E5E7',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          fontSize: '14px',
          fontWeight: '500',
          padding: '16px',
          maxWidth: '400px',
        },

        // Default options for specific types
        success: {
          duration: 3000,
          style: {
            background: '#F0FDF4',
            color: '#166534',
            border: '1px solid #BBF7D0',
          },
          iconTheme: {
            primary: '#22C55E',
            secondary: '#F0FDF4',
          },
        },
        error: {
          duration: 5000,
          style: {
            background: '#FEF2F2',
            color: '#991B1B',
            border: '1px solid #FECACA',
          },
          iconTheme: {
            primary: '#EF4444',
            secondary: '#FEF2F2',
          },
        },
        loading: {
          style: {
            background: '#F8FAFC',
            color: '#475569',
            border: '1px solid #E2E8F0',
          },
          iconTheme: {
            primary: '#0071E3',
            secondary: '#F8FAFC',
          },
        },
      }}
    />
  );
};

// Custom toast functions with better UX
export const showToast = {
  success: (message: string, options?: any) => {
    return toast.success(message, {
      ...options,
      style: {
        background: '#F0FDF4',
        color: '#166534',
        border: '1px solid #BBF7D0',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(34, 197, 94, 0.1)',
        ...options?.style,
      },
    });
  },

  error: (message: string, options?: any) => {
    return toast.error(message, {
      ...options,
      style: {
        background: '#FEF2F2',
        color: '#991B1B',
        border: '1px solid #FECACA',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(239, 68, 68, 0.1)',
        ...options?.style,
      },
    });
  },

  loading: (message: string, options?: any) => {
    return toast.loading(message, {
      ...options,
      style: {
        background: '#F8FAFC',
        color: '#475569',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(71, 85, 105, 0.1)',
        ...options?.style,
      },
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    msgs: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: any
  ) => {
    return toast.promise(promise, msgs, {
      style: {
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      },
      success: {
        style: {
          background: '#F0FDF4',
          color: '#166534',
          border: '1px solid #BBF7D0',
        },
      },
      error: {
        style: {
          background: '#FEF2F2',
          color: '#991B1B',
          border: '1px solid #FECACA',
        },
      },
      loading: {
        style: {
          background: '#F8FAFC',
          color: '#475569',
          border: '1px solid #E2E8F0',
        },
      },
      ...options,
    });
  },

  custom: (message: string, options?: any) => {
    return toast.custom(message, {
      duration: 4000,
      ...options,
    });
  },
};
