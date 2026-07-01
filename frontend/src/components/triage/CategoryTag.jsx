import { CATEGORY_CONFIG } from '../../utils/constants';

export default function CategoryTag({ category, subCategory }) {
  const cfg = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.general;

  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
        style={{
          color:       'var(--color-accent-light)',
          background:  'var(--color-accent-glow)',
          borderColor: 'rgba(99,102,241,0.3)',
        }}
      >
        <span>{cfg.icon}</span>
        {cfg.label}
      </span>
      {subCategory && (
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          › {subCategory}
        </span>
      )}
    </div>
  );
}
