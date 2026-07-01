import HistoryItem from './HistoryItem';

export default function HistoryList({ history, filters }) {
  const { priority, category, sentiment } = filters;

  const filtered = history.filter((entry) => {
    const a = entry.analysis;
    if (priority  && a.priority  !== priority)  return false;
    if (category  && a.category  !== category)  return false;
    if (sentiment && a.sentiment !== sentiment)  return false;
    return true;
  });

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">📭</div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          No results
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {history.length === 0
            ? 'Analyze some messages to build your history.'
            : 'No entries match the current filters.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filtered.map((entry, i) => (
        <div
          key={entry.triageId || i}
          className="animate-fade-in-up"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <HistoryItem entry={entry} />
        </div>
      ))}
    </div>
  );
}
