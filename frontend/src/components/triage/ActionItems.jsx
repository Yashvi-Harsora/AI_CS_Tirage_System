export default function ActionItems({ actions = [] }) {
  if (!actions.length) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
        Recommended Actions
      </p>
      <ol className="space-y-2">
        {actions.map((action, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-sm"
            style={{ color: 'var(--color-text-primary)' }}
          >
            <span
              className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
              style={{ background: 'var(--color-accent-glow)', color: 'var(--color-accent-light)' }}
            >
              {i + 1}
            </span>
            <span className="leading-relaxed">{action}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
