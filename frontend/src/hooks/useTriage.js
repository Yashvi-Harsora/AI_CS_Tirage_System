import { useState, useCallback } from 'react';
import { analyzeTriage } from '../api/triageApi';

/**
 * Custom hook encapsulating all triage submission state and logic.
 * Components stay thin — they only call `submit()` and read state.
 */
export function useTriage() {
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const submit = useCallback(async (message, metadata = {}) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeTriage(message, metadata);
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, loading, error, submit, reset };
}
