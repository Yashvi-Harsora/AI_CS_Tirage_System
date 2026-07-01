import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const FEATURES = [
  {
    icon: '⚡',
    title: 'Instant Triage',
    desc: 'Gemini 2.5 Flash analyzes messages in under 2 seconds, returning structured JSON ready for any CRM.',
  },
  {
    icon: '🏗️',
    title: 'Pipe & Filter Pipeline',
    desc: '7 independent processing stages — validate, normalize, analyze, apply business rules — all independently testable.',
  },
  {
    icon: '🎯',
    title: 'Priority Scoring',
    desc: 'Critical, High, Medium, Low with a 0–100 score. Business rules auto-escalate critical issues.',
  },
  {
    icon: '💡',
    title: 'Sentiment Analysis',
    desc: 'Detect angry, frustrated, neutral, or positive customers with a continuous sentiment score.',
  },
  {
    icon: '🔀',
    title: 'Smart Routing',
    desc: 'Automatically route to the right department — Billing, Engineering, Logistics, and more.',
  },
  {
    icon: '🔌',
    title: 'Zero Database',
    desc: 'Fully stateless REST API. Drop it in front of any CRM or ticketing system with a single POST.',
  },
];

const STATS = [
  { value: '< 2s',  label: 'Avg response time' },
  { value: '7',     label: 'Pipeline stages'    },
  { value: '5',     label: 'Business rule tiers' },
  { value: '94%',   label: 'Avg AI confidence'  },
];

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-24">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="text-center space-y-8 animate-fade-in-up">
        <div
          className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border mb-2"
          style={{
            background:   'var(--color-accent-glow)',
            borderColor:  'rgba(99,102,241,0.3)',
            color:        'var(--color-accent-light)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          Powered by Gemini 2.5 Flash · Pipe & Filter Architecture
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          Triage Customer Issues
          <br />
          <span className="gradient-text">in Under 2 Seconds</span>
        </h1>

        <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          A stateless AI-powered REST API that transforms raw support messages into structured,
          actionable triage reports — priority, sentiment, routing, and suggested actions, all in one call.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/analyze">
            <Button size="lg">
              Start Analyzing →
            </Button>
          </Link>
          <Link to="/history">
            <Button variant="secondary" size="lg">
              View History
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────────── */}
      <section
        className="grid grid-cols-2 sm:grid-cols-4 gap-px animate-fade-in delay-200"
        style={{ background: 'var(--color-border)', borderRadius: '16px', overflow: 'hidden' }}
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center py-8 gap-1"
            style={{ background: 'var(--color-bg-card)' }}
          >
            <span className="text-3xl font-extrabold gradient-text">{s.value}</span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── Pipeline diagram ─────────────────────────────────────────── */}
      <section className="space-y-6 animate-fade-in-up delay-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">7-Stage Processing Pipeline</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Each stage is independent, reusable, and fails fast
          </p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-2">
          {[
            'Receive Input',
            'Validate Input',
            'Normalize Text',
            'AI Analysis',
            'Validate JSON',
            'Business Rules',
            'Format Response',
          ].map((stage, i) => (
            <div key={stage} className="flex items-center gap-2">
              <div
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-center"
                style={{
                  background:  i === 3 ? 'var(--color-accent-glow)' : 'var(--color-bg-card)',
                  border:      `1px solid ${i === 3 ? 'rgba(99,102,241,0.4)' : 'var(--color-border)'}`,
                  minWidth:    '90px',
                }}
              >
                <span className="text-lg">{['📥','✅','🔧','🤖','🔍','⚖️','📤'][i]}</span>
                <span className="text-xs font-medium" style={{ color: i === 3 ? 'var(--color-accent-light)' : 'var(--color-text-secondary)' }}>
                  {i + 1}. {stage}
                </span>
              </div>
              {i < 6 && <span style={{ color: 'var(--color-text-muted)', fontSize: '18px' }}>→</span>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature grid ─────────────────────────────────────────────── */}
      <section className="space-y-6 animate-fade-in-up delay-300">
        <h2 className="text-2xl font-bold text-center">Everything You Need</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="glass-card p-5 space-y-2 animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="text-2xl">{f.icon}</div>
              <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="text-center animate-fade-in-up delay-400">
        <div
          className="rounded-2xl p-12 space-y-5"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))',
            border:     '1px solid rgba(99,102,241,0.25)',
          }}
        >
          <h2 className="text-3xl font-bold">Ready to triage smarter?</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Paste any customer message and get a full analysis in seconds.
          </p>
          <Link to="/analyze">
            <Button size="lg">Open the Analyzer →</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
