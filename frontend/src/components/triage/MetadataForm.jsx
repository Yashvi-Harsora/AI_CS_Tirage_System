import { useState } from 'react';

const CHANNELS = [
  { value: '',       label: 'Select channel (optional)' },
  { value: 'email',  label: '📧  Email' },
  { value: 'chat',   label: '💬  Chat' },
  { value: 'phone',  label: '📞  Phone' },
  { value: 'social', label: '🐦  Social Media' },
];

export default function MetadataForm({ metadata, onChange }) {
  const [open, setOpen] = useState(false);

  const update = (key, val) => onChange({ ...metadata, [key]: val || undefined });

  const fieldStyle = {
    background:  'var(--color-bg-card)',
    border:      '1px solid var(--color-border)',
    color:       'var(--color-text-primary)',
    borderRadius: '8px',
    padding:     '9px 12px',
    fontSize:    '13px',
    width:       '100%',
    transition:  'border-color 0.2s',
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm transition-colors duration-200 cursor-pointer"
        style={{ color: open ? 'var(--color-accent-light)' : 'var(--color-text-muted)' }}
      >
        <span
          className="transition-transform duration-200"
          style={{ display: 'inline-block', transform: open ? 'rotate(90deg)' : 'none' }}
        >
          ▶
        </span>
        Optional metadata
      </button>

      {open && (
        <div className="mt-3 grid grid-cols-1 gap-3 animate-fade-in">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--color-text-muted)' }}>Channel</label>
            <select
              value={metadata.channel || ''}
              onChange={(e) => update('channel', e.target.value)}
              style={fieldStyle}
            >
              {CHANNELS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--color-text-muted)' }}>Customer ID</label>
            <input
              type="text"
              placeholder="e.g. CUS-12345"
              value={metadata.customerId || ''}
              onChange={(e) => update('customerId', e.target.value)}
              style={fieldStyle}
            />
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--color-text-muted)' }}>Language</label>
            <input
              type="text"
              placeholder="e.g. en, fr, de"
              maxLength={10}
              value={metadata.language || ''}
              onChange={(e) => update('language', e.target.value)}
              style={fieldStyle}
            />
          </div>
        </div>
      )}
    </div>
  );
}
