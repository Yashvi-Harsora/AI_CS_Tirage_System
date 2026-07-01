import { SENTIMENT_CONFIG } from '../../utils/constants';
import { sentimentToPercent } from '../../utils/formatters';

export default function SentimentIndicator({ sentiment, sentimentScore }) {
  const cfg = SENTIMENT_CONFIG[sentiment] || SENTIMENT_CONFIG.neutral;
  const pct = sentimentToPercent(sentimentScore);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>Sentiment</span>
        <span className="text-xs flex items-center gap-1.5">
          <span>{cfg.icon}</span>
          <span style={{ color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>
          <span style={{ color: 'var(--color-text-muted)' }}>({sentimentScore > 0 ? '+' : ''}{sentimentScore?.toFixed(2)})</span>
        </span>
      </div>

      {/* Gradient bar */}
      <div className="relative h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-secondary)' }}>
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, #dc2626 0%, #f97316 25%, #94a3b8 50%, #22c55e 100%)',
          }}
        />
        {/* Marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-lg transition-all duration-700"
          style={{
            left:       `calc(${pct}% - 6px)`,
            background: cfg.color,
          }}
        />
      </div>

      <div className="flex justify-between text-xs" style={{ color: 'var(--color-text-muted)' }}>
        <span>Angry</span>
        <span>Neutral</span>
        <span>Positive</span>
      </div>
    </div>
  );
}
