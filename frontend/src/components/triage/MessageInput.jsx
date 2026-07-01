import { MAX_MESSAGE_LENGTH, MIN_MESSAGE_LENGTH, DEMO_MESSAGES } from '../../utils/constants';
import Button from '../common/Button';

export default function MessageInput({ value, onChange, onDemo }) {
  const count = value.length;
  const pct   = (count / MAX_MESSAGE_LENGTH) * 100;
  const countColor =
    count < MIN_MESSAGE_LENGTH  ? 'var(--color-text-muted)' :
    count > MAX_MESSAGE_LENGTH * 0.9 ? 'var(--color-high)' :
    'var(--color-text-muted)';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          Customer Message <span style={{ color: 'var(--color-critical)' }}>*</span>
        </label>
        <span className="text-xs" style={{ color: countColor }}>
          {count} / {MAX_MESSAGE_LENGTH}
        </span>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          id="message-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the customer's support message here…"
          rows={7}
          maxLength={MAX_MESSAGE_LENGTH}
          className="w-full resize-none rounded-xl text-sm leading-relaxed transition-all duration-200"
          style={{
            background:   'var(--color-bg-card)',
            border:       `1px solid ${count >= MIN_MESSAGE_LENGTH ? 'var(--color-border-active)' : 'var(--color-border)'}`,
            color:        'var(--color-text-primary)',
            padding:      '14px 16px',
            lineHeight:   '1.7',
          }}
        />
        {/* Progress bar */}
        <div
          className="absolute bottom-0 left-0 h-0.5 rounded-bl-xl transition-all duration-300"
          style={{
            width: `${Math.min(pct, 100)}%`,
            background: pct > 90 ? 'var(--color-high)' : 'var(--color-accent)',
          }}
        />
      </div>

      {count > 0 && count < MIN_MESSAGE_LENGTH && (
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          Minimum {MIN_MESSAGE_LENGTH} characters required.
        </p>
      )}

      {/* Demo Messages */}
      <div>
        <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
          Try a demo:
        </p>
        <div className="flex flex-wrap gap-2">
          {DEMO_MESSAGES.map((d) => (
            <button
              key={d.label}
              onClick={() => onDemo(d.message)}
              className="text-xs px-2.5 py-1 rounded-md border transition-all duration-200 cursor-pointer"
              style={{
                background:  'transparent',
                borderColor: 'var(--color-border)',
                color:       'var(--color-text-muted)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent)';
                e.currentTarget.style.color = 'var(--color-accent-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.color = 'var(--color-text-muted)';
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
