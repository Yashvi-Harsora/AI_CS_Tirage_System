import PriorityBadge from './PriorityBadge';
import CategoryTag from './CategoryTag';
import SentimentIndicator from './SentimentIndicator';
import ActionItems from './ActionItems';
import { formatTimestamp, formatConfidence, tagToLabel } from '../../utils/formatters';

function Section({ title, children }) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
        {title}
      </h4>
      {children}
    </div>
  );
}

function Divider() {
  return <hr style={{ borderColor: 'var(--color-border)', margin: '0' }} />;
}

export default function TriageResultCard({ result }) {
  if (!result) return null;

  const { analysis: a, triageId, timestamp, pipeline } = result;

  return (
    <div className="glass-card animate-slide-in space-y-5" style={{ padding: '24px' }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-base" style={{ color: 'var(--color-text-primary)' }}>
            Triage Report
          </h3>
          <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--color-text-muted)' }}>
            {triageId}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {formatTimestamp(timestamp)}
          </p>
          {a.escalate && (
            <span
              className="inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded animate-pulse-glow"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.4)' }}
            >
              🚨 ESCALATE
            </span>
          )}
        </div>
      </div>

      <Divider />

      {/* Summary */}
      <Section title="Summary">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>{a.summary}</p>
      </Section>

      {/* Priority + Category row */}
      <div className="flex flex-wrap gap-3">
        <PriorityBadge priority={a.priority} score={a.priorityScore} />
        <CategoryTag category={a.category} subCategory={a.subCategory} />
      </div>

      <Divider />

      {/* Sentiment */}
      <SentimentIndicator sentiment={a.sentiment} sentimentScore={a.sentimentScore} />

      <Divider />

      {/* Routing */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>Department</p>
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{a.suggestedDepartment}</p>
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>SLA Target</p>
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            {a.slaTarget || a.estimatedResolutionTime}
          </p>
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>Confidence</p>
          <p className="text-sm font-medium" style={{ color: a.confidence < 0.5 ? 'var(--color-high)' : 'var(--color-low)' }}>
            {formatConfidence(a.confidence)}
          </p>
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>Est. Resolution</p>
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{a.estimatedResolutionTime}</p>
        </div>
      </div>

      <Divider />

      {/* Actions */}
      <ActionItems actions={a.suggestedActions} />

      {/* Urgency indicators */}
      {a.urgencyIndicators?.length > 0 && (
        <>
          <Divider />
          <Section title="Urgency Signals">
            <div className="flex flex-wrap gap-1.5">
              {a.urgencyIndicators.map((u, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  {u}
                </span>
              ))}
            </div>
          </Section>
        </>
      )}

      {/* Key entities */}
      {Object.values(a.keyEntities || {}).some((v) => v?.length > 0) && (
        <>
          <Divider />
          <Section title="Extracted Entities">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(a.keyEntities).map(([key, vals]) =>
                vals?.length > 0 ? (
                  <div key={key}>
                    <span style={{ color: 'var(--color-text-muted)' }} className="capitalize">{key}: </span>
                    <span style={{ color: 'var(--color-text-primary)' }}>{vals.join(', ')}</span>
                  </div>
                ) : null
              )}
            </div>
          </Section>
        </>
      )}

      {/* Tags */}
      {a.tags?.length > 0 && (
        <>
          <Divider />
          <div className="flex flex-wrap gap-1.5">
            {a.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background:  'var(--color-accent-glow)',
                  color:       'var(--color-accent-light)',
                  border:      '1px solid rgba(99,102,241,0.25)',
                }}
              >
                #{tagToLabel(tag)}
              </span>
            ))}
          </div>
        </>
      )}

      {/* Pipeline trace */}
      {pipeline && (
        <>
          <Divider />
          <Section title="Pipeline Trace">
            <div className="flex items-center gap-1 flex-wrap">
              {pipeline.stages.map((stage, i) => (
                <span key={stage} className="flex items-center gap-1">
                  <span
                    className="text-xs px-2 py-0.5 rounded font-mono"
                    style={{ background: 'rgba(99,102,241,0.06)', color: 'var(--color-text-muted)' }}
                  >
                    {stage}
                  </span>
                  {i < pipeline.stages.length - 1 && (
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>→</span>
                  )}
                </span>
              ))}
              <span className="ml-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {pipeline.durationMs}ms
              </span>
            </div>
          </Section>
        </>
      )}
    </div>
  );
}
