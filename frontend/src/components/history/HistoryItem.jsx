import { useState } from 'react';
import { PRIORITY_CONFIG, CATEGORY_CONFIG, SENTIMENT_CONFIG } from '../../utils/constants';
import { formatTimestamp, truncate } from '../../utils/formatters';

export default function HistoryItem({ entry }) {
  const [expanded, setExpanded] = useState(false);
  const a = entry.analysis;
  const pri = PRIORITY_CONFIG[a?.priority] || PRIORITY_CONFIG.low;
  const cat = CATEGORY_CONFIG[a?.category] || CATEGORY_CONFIG.general;
  const sen = SENTIMENT_CONFIG[a?.sentiment] || SENTIMENT_CONFIG.neutral;

  return (
    <div
      className="glass-card transition-all duration-300 cursor-pointer"
      style={{ padding: '16px 20px' }}
      onClick={() => setExpanded((e) => !e)}
    >
      {/* Collapsed row */}
      <div className="flex items-start gap-3">
        {/* Priority stripe */}
        <div
          className="w-1 self-stretch rounded-full flex-shrink-0"
          style={{ background: pri.color, minHeight: '20px' }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ color: pri.color, background: pri.bg }}>
              {pri.icon} {pri.label}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {cat.icon} {cat.label}
            </span>
            <span className="text-xs" style={{ color: sen.color }}>{sen.icon} {sen.label}</span>
            {a.escalate && <span className="text-xs text-red-400 font-bold">🚨 Escalate</span>}
          </div>
          <p className="text-sm mt-1.5 leading-snug" style={{ color: 'var(--color-text-primary)' }}>
            {truncate(a.summary, 100)}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {formatTimestamp(entry.timestamp)}
          </p>
        </div>

        <span style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>
          {expanded ? '▲' : '▼'}
        </span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="mt-4 pt-4 space-y-3 animate-fade-in" style={{ borderTop: '1px solid var(--color-border)' }}>
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>Original Message</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {truncate(entry.input?.message, 300)}
            </p>
          </div>
          {a.suggestedActions?.length > 0 && (
            <div>
              <p className="text-xs mb-1.5" style={{ color: 'var(--color-text-muted)' }}>Actions</p>
              <ol className="text-xs space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
                {a.suggestedActions.map((act, i) => (
                  <li key={i}>{i + 1}. {act}</li>
                ))}
              </ol>
            </div>
          )}
          {a.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {a.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--color-accent-glow)', color: 'var(--color-accent-light)' }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <p className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>{entry.triageId}</p>
        </div>
      )}
    </div>
  );
}
