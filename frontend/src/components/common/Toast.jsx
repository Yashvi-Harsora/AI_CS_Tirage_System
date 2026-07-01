import { useEffect, useState } from 'react';

const TYPE_CONFIG = {
  success: { icon: '✓', border: 'rgba(34,197,94,0.4)',  bg: 'rgba(34,197,94,0.08)',  text: '#4ade80' },
  error:   { icon: '✕', border: 'rgba(239,68,68,0.4)',  bg: 'rgba(239,68,68,0.08)',  text: '#f87171' },
  warning: { icon: '⚠', border: 'rgba(234,179,8,0.4)',  bg: 'rgba(234,179,8,0.08)',  text: '#facc15' },
  info:    { icon: 'ℹ', border: 'rgba(99,102,241,0.4)', bg: 'rgba(99,102,241,0.08)', text: '#818cf8' },
};

export default function Toast({ message, type = 'error', onDismiss, duration = 5000 }) {
  const [visible, setVisible] = useState(true);
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.error;

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onDismiss, 300); }, duration);
    return () => clearTimeout(t);
  }, [duration, onDismiss]);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 max-w-sm flex items-start gap-3 p-4 rounded-xl border text-sm"
      style={{
        background:   cfg.bg,
        borderColor:  cfg.border,
        backdropFilter: 'blur(16px)',
        boxShadow:    '0 8px 32px rgba(0,0,0,0.4)',
        animation:    visible ? 'slideInRight 0.3s ease' : 'fadeIn 0.3s ease reverse',
      }}
    >
      <span style={{ color: cfg.text, fontSize: '16px', flexShrink: 0 }}>{cfg.icon}</span>
      <p style={{ color: 'var(--color-text-primary)' }} className="flex-1 leading-relaxed">{message}</p>
      <button
        onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}
        style={{ color: 'var(--color-text-muted)' }}
        className="hover:opacity-70 transition-opacity text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}
