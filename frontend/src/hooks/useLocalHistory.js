import { useState, useCallback } from 'react';

const SESSION_KEY = 'triageai_history';

function readSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || '[]');
  } catch {
    return [];
  }
}

/**
 * Custom hook managing an in-session history of triage results.
 * Persists to sessionStorage — cleared when the tab is closed.
 * No backend or database required.
 */
export function useLocalHistory() {
  const [history, setHistory] = useState(readSession);

  const addEntry = useCallback((triageResult) => {
    setHistory((prev) => {
      const next = [triageResult, ...prev].slice(0, 50); // cap at 50 entries
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
  }, []);

  return { history, addEntry, clearHistory };
}
