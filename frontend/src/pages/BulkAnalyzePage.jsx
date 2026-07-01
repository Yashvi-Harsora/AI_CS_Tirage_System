import { useState, useCallback } from 'react';
import { analyzeBulkTriage } from '../api/triageApi';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Toast from '../components/common/Toast';
import { PRIORITY_CONFIG, CATEGORY_CONFIG, SENTIMENT_CONFIG, MAX_MESSAGE_LENGTH } from '../utils/constants';
import { formatConfidence } from '../utils/formatters';

const MAX_BULK = 20;

// ── Tiny helpers ──────────────────────────────────────────────────────────────
function PriorityDot({ priority }) {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.low;
  return (
    <span
      className="inline-block w-2 h-2 rounded-full flex-shrink-0"
      style={{ background: cfg.color }}
    />
  );
}

function StatCard({ label, value, color }) {
  return (
    <div
      className="glass-card text-center space-y-1"
      style={{ padding: '20px 16px' }}
    >
      <p className="text-3xl font-extrabold" style={{ color: color || 'var(--color-accent-light)' }}>
        {value}
      </p>
      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
    </div>
  );
}

function ResultRow({ item, index }) {
  const [open, setOpen] = useState(false);
  const a = item.data?.analysis;
  const pri = a ? (PRIORITY_CONFIG[a.priority] || PRIORITY_CONFIG.low) : null;
  const cat = a ? (CATEGORY_CONFIG[a.category] || CATEGORY_CONFIG.general) : null;
  const sen = a ? (SENTIMENT_CONFIG[a.sentiment] || SENTIMENT_CONFIG.neutral) : null;

  return (
    <div
      className="glass-card transition-all duration-200 cursor-pointer"
      style={{ padding: '14px 18px' }}
      onClick={() => setOpen(o => !o)}
    >
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono w-5 text-center flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>
          {index + 1}
        </span>

        {item.success && a ? (
          <>
            <PriorityDot priority={a.priority} />
            <span className="text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0"
              style={{ color: pri.color, background: pri.bg }}>
              {pri.icon} {pri.label}
            </span>
            <span className="text-xs flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>
              {cat.icon} {cat.label}
            </span>
            <span className="text-xs flex-1 truncate" style={{ color: 'var(--color-text-primary)' }}>
              {a.summary}
            </span>
            <span className="text-xs flex-shrink-0" style={{ color: sen.color }}>
              {sen.icon}
            </span>
            <span className="text-xs flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>
              {formatConfidence(a.confidence)}
            </span>
          </>
        ) : (
          <>
            <span className="text-xs text-red-400">✕ Failed</span>
            <span className="text-xs flex-1 truncate" style={{ color: 'var(--color-text-muted)' }}>
              {item.error}
            </span>
          </>
        )}

        <span style={{ color: 'var(--color-text-muted)', fontSize: '11px', flexShrink: 0 }}>
          {open ? '▲' : '▼'}
        </span>
      </div>

      {open && (
        <div className="mt-3 pt-3 space-y-3 animate-fade-in" style={{ borderTop: '1px solid var(--color-border)' }}>
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>Input Message</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {item.inputMessage}
            </p>
          </div>
          {item.success && a && (
            <>
              {a.suggestedActions?.length > 0 && (
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>Suggested Actions</p>
                  <ol className="text-xs space-y-1 list-decimal list-inside" style={{ color: 'var(--color-text-secondary)' }}>
                    {a.suggestedActions.map((act, i) => <li key={i}>{act}</li>)}
                  </ol>
                </div>
              )}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <p style={{ color: 'var(--color-text-muted)' }}>Department</p>
                  <p style={{ color: 'var(--color-text-primary)' }}>{a.suggestedDepartment}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--color-text-muted)' }}>SLA Target</p>
                  <p style={{ color: 'var(--color-text-primary)' }}>{a.slaTarget || a.estimatedResolutionTime}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--color-text-muted)' }}>Triage ID</p>
                  <p className="font-mono" style={{ color: 'var(--color-text-muted)' }}>
                    {item.data?.triageId?.slice(0, 8)}…
                  </p>
                </div>
              </div>
              {a.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {a.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--color-accent-glow)', color: 'var(--color-accent-light)', border: '1px solid rgba(99,102,241,0.25)' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── CSV export ────────────────────────────────────────────────────────────────
function exportCsv(results) {
  const headers = ['#', 'Success', 'Priority', 'Category', 'Sentiment', 'Confidence', 'SLA Target', 'Department', 'Summary', 'Tags', 'Input Message'];
  const rows = results.map((r, i) => {
    const a = r.data?.analysis;
    if (!r.success || !a) {
      return [i + 1, 'false', '', '', '', '', '', '', r.error || '', '', r.inputMessage];
    }
    return [
      i + 1,
      'true',
      a.priority,
      a.category,
      a.sentiment,
      Math.round((a.confidence || 0) * 100) + '%',
      a.slaTarget || a.estimatedResolutionTime,
      a.suggestedDepartment,
      (a.summary || '').replace(/"/g, '""'),
      (a.tags || []).join('; '),
      (r.inputMessage || '').replace(/"/g, '""'),
    ];
  });

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = `triage_bulk_${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// ── Page ──────────────────────────────────────────────────────────────────────
const PLACEHOLDER = `My order ORD-11111 hasn't arrived after 10 days. Please help.
I was charged twice for my subscription this month — $149 twice!
The API keeps returning 500 errors, our production pipeline is down.`;

export default function BulkAnalyzePage() {
  const [raw,     setRaw]     = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [summary, setSummary] = useState(null);
  const [toast,   setToast]   = useState(null);

  const lines = raw.split('\n').map(l => l.trim()).filter(l => l.length >= 10);

  const handleSubmit = useCallback(async () => {
    if (lines.length === 0) {
      setToast({ message: 'Enter at least one message (min 10 characters per line).', type: 'warning' });
      return;
    }
    if (lines.length > MAX_BULK) {
      setToast({ message: `Maximum ${MAX_BULK} messages per batch. You have ${lines.length}.`, type: 'warning' });
      return;
    }

    setLoading(true);
    setResults(null);
    setSummary(null);

    try {
      const payload = lines.map(msg => ({ message: msg }));
      const res = await analyzeBulkTriage(payload);
      setResults(res.results);
      setSummary(res.summary);
    } catch (err) {
      setToast({ message: err.message || 'Bulk analysis failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [lines]);

  // ── Priority distribution ─────────────────────────────────────────────────
  function buildPriorityBreakdown() {
    if (!results) return {};
    const counts = { critical: 0, high: 0, medium: 0, low: 0, failed: 0 };
    results.forEach(r => {
      if (!r.success) { counts.failed++; return; }
      const p = r.data?.analysis?.priority;
      if (counts[p] !== undefined) counts[p]++;
    });
    return counts;
  }

  const breakdown = buildPriorityBreakdown();
  const escalated = results?.filter(r => r.success && r.data?.analysis?.escalate).length ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-1">
          Bulk <span className="gradient-text">Analysis</span>
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Paste up to {MAX_BULK} customer messages (one per line) and analyze them all at once.
        </p>
      </div>

      {/* Input card */}
      <div className="glass-card animate-fade-in-up" style={{ padding: '24px' }}>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Customer Messages <span style={{ color: 'var(--color-critical)' }}>*</span>
          </label>
          <span className="text-xs" style={{ color: lines.length > MAX_BULK ? 'var(--color-critical)' : 'var(--color-text-muted)' }}>
            {lines.length} / {MAX_BULK} messages
          </span>
        </div>

        <textarea
          id="bulk-input"
          value={raw}
          onChange={e => setRaw(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={10}
          className="w-full resize-y rounded-xl text-sm leading-relaxed transition-all duration-200"
          style={{
            background:   'var(--color-bg-card)',
            border:       `1px solid ${lines.length > 0 ? 'var(--color-border-active)' : 'var(--color-border)'}`,
            color:        'var(--color-text-primary)',
            padding:      '14px 16px',
            lineHeight:   '1.7',
            minHeight:    '220px',
          }}
        />

        <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
          One message per line. Lines shorter than 10 characters are ignored.
        </p>

        <div className="flex gap-3 mt-4">
          <Button
            id="bulk-analyze-btn"
            onClick={handleSubmit}
            loading={loading}
            disabled={lines.length === 0 || lines.length > MAX_BULK}
            size="lg"
            className="flex-1"
          >
            {loading ? 'Analyzing…' : `⚡ Analyze ${lines.length > 0 ? lines.length : ''} Messages`}
          </Button>
          {(raw || results) && (
            <Button variant="ghost" onClick={() => { setRaw(''); setResults(null); setSummary(null); }}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="glass-card flex flex-col items-center justify-center gap-4 text-center animate-fade-in"
          style={{ padding: '48px', minHeight: '200px' }}>
          <LoadingSpinner size={40} color="var(--color-accent)" />
          <div>
            <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Running batch triage pipeline…
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Processing {lines.length} messages concurrently via Gemini 2.5 Flash
            </p>
          </div>
        </div>
      )}

      {/* Summary stats */}
      {!loading && summary && (
        <div className="animate-fade-in-up">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Batch Summary
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <StatCard label="Total"     value={summary.total}     />
            <StatCard label="Succeeded" value={summary.succeeded} color="var(--color-low)"      />
            {summary.failed > 0 && <StatCard label="Failed" value={summary.failed} color="var(--color-critical)" />}
            {escalated > 0       && <StatCard label="Escalated" value={escalated} color="var(--color-critical)" />}
            {breakdown.critical > 0 && <StatCard label="Critical" value={breakdown.critical} color="var(--color-critical)" />}
            {breakdown.high     > 0 && <StatCard label="High"     value={breakdown.high}     color="var(--color-high)"     />}
          </div>

          {/* Priority bar */}
          {summary.succeeded > 0 && (
            <div className="mt-4 glass-card" style={{ padding: '16px 20px' }}>
              <p className="text-xs mb-3 font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Priority Distribution
              </p>
              <div className="flex rounded-full overflow-hidden h-4" style={{ gap: '2px' }}>
                {Object.entries(breakdown).filter(([k, v]) => k !== 'failed' && v > 0).map(([key, count]) => {
                  const cfg = PRIORITY_CONFIG[key];
                  const pct = Math.round((count / summary.succeeded) * 100);
                  return (
                    <div
                      key={key}
                      style={{ width: `${pct}%`, background: cfg.color }}
                      title={`${cfg.label}: ${count} (${pct}%)`}
                    />
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-3 mt-2">
                {Object.entries(breakdown).filter(([k, v]) => k !== 'failed' && v > 0).map(([key, count]) => {
                  const cfg = PRIORITY_CONFIG[key];
                  return (
                    <span key={key} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
                      {cfg.label}: {count}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Export */}
          <div className="flex justify-end mt-3">
            <Button variant="secondary" size="sm" onClick={() => exportCsv(results)}>
              ⬇ Download CSV Report
            </Button>
          </div>
        </div>
      )}

      {/* Results list */}
      {!loading && results && results.length > 0 && (
        <div className="space-y-3 animate-fade-in-up">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Results
            <span className="ml-2 text-sm font-normal" style={{ color: 'var(--color-text-muted)' }}>
              — click any row to expand
            </span>
          </h2>
          {/* Column headers */}
          <div className="hidden sm:flex items-center gap-3 text-xs px-2" style={{ color: 'var(--color-text-muted)' }}>
            <span className="w-5 text-center">#</span>
            <span className="w-2" />
            <span className="w-16">Priority</span>
            <span className="w-16">Category</span>
            <span className="flex-1">Summary</span>
            <span className="w-6">😊</span>
            <span className="w-10">Conf.</span>
            <span className="w-4" />
          </div>
          {results.map((item, i) => (
            <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 30}ms` }}>
              <ResultRow item={item} index={i} />
            </div>
          ))}
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </div>
  );
}
