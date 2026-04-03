import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { removeToast, Toast } from './toastSlice';

const AUTO_DISMISS_MS = 5000;

const toastStyle = (type: Toast['type']): React.CSSProperties => {
  const colors: Record<Toast['type'], string> = {
    error: '#dc3545',
    success: '#28a745',
    info: '#17a2b8',
    warning: '#ffc107',
  };
  return {
    backgroundColor: colors[type],
    color: type === 'warning' ? '#212529' : '#fff',
    padding: '0.75rem 1rem',
    borderRadius: '4px',
    marginBottom: '0.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: '260px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  };
};

const ToastItem = ({ toast }: { toast: Toast }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast.id, dispatch]);

  return (
    <div style={toastStyle(toast.type)}>
      <span>{toast.message}</span>
      {toast.dismissible && (
        <button
          onClick={() => dispatch(removeToast(toast.id))}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            marginLeft: '1rem',
            fontSize: '1.2rem',
            lineHeight: 1,
          }}
          aria-label="Dismiss notification"
        >
          ×
        </button>
      )}
    </div>
  );
};

export const ToastContainer = () => {
  const toasts = useAppSelector((state) => (state as any).toast?.toasts ?? []);

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        zIndex: 9999,
      }}
      role="alert"
      aria-live="polite"
    >
      {toasts.map((toast: Toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
