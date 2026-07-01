import { PRIORITY_CONFIG } from '../../utils/constants';

export default function PriorityBadge({ priority, score }) {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.low;

  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
        style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.color + '40' }}
      >
        <span>{cfg.icon}</span>
        {cfg.label} Priority
      </span>
      {score !== undefined && (
        <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
          {score}/100
        </span>
      )}
    </div>
  );
}
