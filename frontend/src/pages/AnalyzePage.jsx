import { useState } from 'react';
import { useTriage } from '../hooks/useTriage';
import { useLocalHistory } from '../hooks/useLocalHistory';
import MessageInput from '../components/triage/MessageInput';
import MetadataForm from '../components/triage/MetadataForm';
import TriageResultCard from '../components/triage/TriageResultCard';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { MIN_MESSAGE_LENGTH } from '../utils/constants';

export default function AnalyzePage() {
  const [message,  setMessage]  = useState('');
  const [metadata, setMetadata] = useState({});
  const [toast,    setToast]    = useState(null);

  const { result, loading, error, submit, reset } = useTriage();
  const { addEntry } = useLocalHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim().length < MIN_MESSAGE_LENGTH) {
      setToast({ message: `Message must be at least ${MIN_MESSAGE_LENGTH} characters.`, type: 'warning' });
      return;
    }
    const data = await submit(message.trim(), metadata);
    if (data) addEntry(data);
  };

  const handleDemo = (demoMessage) => {
    setMessage(demoMessage);
    reset();
  };

  const handleClear = () => {
    setMessage('');
    setMetadata({});
    reset();
  };

  // Show error toast when hook error changes
  if (error && !toast) {
    setToast({ message: error, type: 'error' });
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-1">
          Message <span className="gradient-text">Analyzer</span>
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Paste a customer support message and get a full AI triage report in seconds.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Left: Form ─────────────────────────────────────────────── */}
        <div className="space-y-5 animate-fade-in-up">
          <form onSubmit={handleSubmit} className="glass-card space-y-5" style={{ padding: '24px' }}>
            <MessageInput
              value={message}
              onChange={setMessage}
              onDemo={handleDemo}
            />

            <MetadataForm metadata={metadata} onChange={setMetadata} />

            <div className="flex gap-3 pt-1">
              <Button
                type="submit"
                loading={loading}
                disabled={message.trim().length < MIN_MESSAGE_LENGTH}
                className="flex-1"
                size="lg"
              >
                {loading ? 'Analyzing…' : '⚡ Analyze Message'}
              </Button>
              {(message || result) && (
                <Button type="button" variant="ghost" onClick={handleClear}>
                  Clear
                </Button>
              )}
            </div>
          </form>

          {/* API info callout */}
          <div
            className="rounded-xl p-4 text-xs space-y-1"
            style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
          >
            <p className="font-semibold" style={{ color: 'var(--color-text-secondary)' }}>REST API endpoint</p>
            <p className="font-mono" style={{ color: 'var(--color-accent-light)' }}>
              POST {import.meta.env.VITE_API_BASE_URL}/triage
            </p>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Message passes through 7 independent pipeline stages before the response is returned.
            </p>
          </div>
        </div>

        {/* ── Right: Result ───────────────────────────────────────────── */}
        <div className="min-h-[400px]">
          {loading && (
            <div className="glass-card h-full flex flex-col items-center justify-center gap-4 text-center" style={{ padding: '48px', minHeight: '400px' }}>
              <LoadingSpinner size={40} color="var(--color-accent)" />
              <div>
                <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Processing pipeline…</p>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                  Validating → Normalizing → Analyzing → Applying rules
                </p>
              </div>
            </div>
          )}

          {!loading && result && (
            <TriageResultCard result={result} />
          )}

          {!loading && !result && (
            <div
              className="glass-card flex flex-col items-center justify-center text-center"
              style={{ padding: '48px', minHeight: '400px' }}
            >
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Ready to analyze
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Submit a message to see the full triage report, including priority, sentiment, routing, and suggested actions.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}
