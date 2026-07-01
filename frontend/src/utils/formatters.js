/**
 * Format an ISO timestamp to a human-readable string.
 */
export function formatTimestamp(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format a confidence score (0–1) to a percentage string.
 */
export function formatConfidence(score) {
  if (score === null || score === undefined) return '—';
  return `${Math.round(Number(score) * 100)}%`;
}

/**
 * Format a sentiment score (−1 to 1) to a position percentage (0–100%).
 * Used for the SentimentIndicator bar.
 */
export function sentimentToPercent(score) {
  return Math.round(((Number(score) + 1) / 2) * 100);
}

/**
 * Truncate a string to a maximum length, appending ellipsis.
 */
export function truncate(str, maxLen = 120) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}

/**
 * Convert a kebab-case tag to a Title Case label.
 */
export function tagToLabel(tag) {
  return tag
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
