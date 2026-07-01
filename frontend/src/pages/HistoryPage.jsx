import { useState } from 'react';
import { useLocalHistory } from '../hooks/useLocalHistory';
import HistoryList from '../components/history/HistoryList';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';

const PRIORITY_OPTIONS  = ['', 'critical', 'high', 'medium', 'low'];
const CATEGORY_OPTIONS  = ['', 'billing', 'technical', 'account', 'shipping', 'general'];
const SENTIMENT_OPTIONS = ['', 'angry', 'frustrated', 'negative', 'neutral', 'positive'];

function FilterSelect({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm rounded-lg px-3 py-1.5"
        style={{
          background:  'var(--color-bg-card)',
          border:      '1px solid var(--color-border)',
          color:       'var(--color-text-primary)',
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o ? o.charAt(0).toUpperCase() + o.slice(1) : 'All'}</option>
        ))}
      </select>
    </div>
  );
}

export default function HistoryPage() {
  const { history, clearHistory } = useLocalHistory();
  const [filters, setFilters] = useState({ priority: '', category: '', sentiment: '' });

  const update = (key) => (val) => setFilters((f) => ({ ...f, [key]: val }));
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold mb-1">
            Session <span className="gradient-text">History</span>
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {history.length} triage result{history.length !== 1 ? 's' : ''} this session
          </p>
        </div>
        {history.length > 0 && (
          <Button variant="danger" size="sm" onClick={clearHistory}>
            Clear Session
          </Button>
        )}
      </div>

      {/* Filters */}
      {history.length > 0 && (
        <div
          className="glass-card mb-6 animate-fade-in"
          style={{ padding: '16px 20px' }}
        >
          <div className="flex flex-wrap gap-4 items-end">
            <FilterSelect label="Priority"  options={PRIORITY_OPTIONS}  value={filters.priority}  onChange={update('priority')} />
            <FilterSelect label="Category"  options={CATEGORY_OPTIONS}  value={filters.category}  onChange={update('category')} />
            <FilterSelect label="Sentiment" options={SENTIMENT_OPTIONS} value={filters.sentiment} onChange={update('sentiment')} />
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({ priority: '', category: '', sentiment: '' })}
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>
      )}

      {/* List or empty state */}
      {history.length === 0 ? (
        <div className="text-center py-24 animate-fade-in">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            No history yet
          </h3>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
            Analyze a message to see it appear here.
          </p>
          <Link to="/analyze">
            <Button>Go to Analyzer →</Button>
          </Link>
        </div>
      ) : (
        <div className="animate-fade-in">
          <HistoryList history={history} filters={filters} />
        </div>
      )}
    </div>
  );
}
