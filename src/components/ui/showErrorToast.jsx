import toast, { Toaster } from 'react-hot-toast';

export function showErrorToast(message) {
  toast.custom((t) => (
    <div
      style={{
        minWidth: '320px',
        maxWidth: '420px',
        padding: '18px 20px',
        background: '#fff',
        border: '1px solid #E6E9F2',
        borderRadius: '12px',
        boxShadow: '0px 6px 24px rgba(0,0,0,0.15)',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        fontSize: '1rem',
        color: '#3B3B3B',
      }}
    >
      <span style={{ color: '#ff4a4a', fontSize: '1.6rem' }}>⚠️</span>
      
      <div style={{ flex: 1 }}>
        {message}
      </div>

      <button
        onClick={() => toast.dismiss(t.id)}
        style={{
          background: '#3B56F6',
          color: '#fff',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
        }}
      >
        Aceptar
      </button>
    </div>
  ), { duration: Infinity });
}
