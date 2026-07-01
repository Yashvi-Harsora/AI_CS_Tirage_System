import { useState } from 'react';

// ── Code snippet component ────────────────────────────────────────────────────
function CodeBlock({ code, lang = 'bash' }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative rounded-xl overflow-hidden" style={{ background: '#0a0f1e', border: '1px solid var(--color-border)' }}>
      <div className="flex items-center justify-between px-4 py-2" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--color-border)' }}>
        <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>{lang}</span>
        <button
          onClick={copy}
          className="text-xs px-2.5 py-1 rounded transition-all duration-200 cursor-pointer"
          style={{
            color: copied ? 'var(--color-low)' : 'var(--color-text-muted)',
            background: copied ? 'rgba(34,197,94,0.08)' : 'transparent',
            border: '1px solid ' + (copied ? 'rgba(34,197,94,0.3)' : 'var(--color-border)'),
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre
        className="overflow-x-auto font-mono text-sm leading-relaxed"
        style={{ padding: '16px 20px', color: '#e2e8f0', margin: 0 }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ── Badge helpers ─────────────────────────────────────────────────────────────
function MethodBadge({ method }) {
  const colors = {
    POST: { bg: 'rgba(99,102,241,0.15)', color: '#818cf8', border: 'rgba(99,102,241,0.4)' },
    GET:  { bg: 'rgba(34,197,94,0.12)',  color: '#4ade80', border: 'rgba(34,197,94,0.4)' },
  };
  const c = colors[method] || colors.GET;
  return (
    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded"
      style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
      {method}
    </span>
  );
}

function FieldRow({ name, type, required, description }) {
  return (
    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
      <td className="py-2 pr-4 font-mono text-xs" style={{ color: 'var(--color-accent-light)', whiteSpace: 'nowrap' }}>{name}</td>
      <td className="py-2 pr-4 text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>{type}</td>
      <td className="py-2 pr-4 text-xs" style={{ color: required ? 'var(--color-critical)' : 'var(--color-low)' }}>
        {required ? 'required' : 'optional'}
      </td>
      <td className="py-2 text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{description}</td>
    </tr>
  );
}

// ── Section anchor ────────────────────────────────────────────────────────────
function EndpointSection({ id, method, path, description, request, response, fields, children }) {
  return (
    <section id={id} className="glass-card animate-fade-in-up space-y-5" style={{ padding: '28px' }}>
      {/* Endpoint header */}
      <div className="flex flex-wrap items-center gap-3">
        <MethodBadge method={method} />
        <code className="text-base font-mono font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          {path}
        </code>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{description}</p>

      {/* Fields table */}
      {fields && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>
            Request Body
          </p>
          <div className="overflow-x-auto rounded-lg" style={{ border: '1px solid var(--color-border)' }}>
            <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--color-border)' }}>
                  {['Field', 'Type', 'Required', 'Description'].map(h => (
                    <th key={h} className="py-2 px-3 text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ color: 'var(--color-text-primary)' }}>
                {fields.map(f => <FieldRow key={f.name} {...f} />)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Code snippets */}
      {request && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>
            Example Request
          </p>
          {request}
        </div>
      )}
      {response && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>
            Example Response
          </p>
          {response}
        </div>
      )}
      {children}
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const ANALYZE_CURL = `curl -X POST ${BASE}/analyze \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "I was charged twice for my Pro subscription — $149 twice!",
    "metadata": {
      "channel": "email",
      "language": "en",
      "customerId": "CUS-12345"
    }
  }'`;

const ANALYZE_JS = `const response = await fetch('${BASE}/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "I was charged twice for my Pro subscription — $149 twice!",
    metadata: { channel: "email", language: "en", customerId: "CUS-12345" }
  })
});
const { data } = await response.json();
console.log(data.analysis.priority);  // "high"
console.log(data.analysis.category);  // "billing"`;

const ANALYZE_RESPONSE = `{
  "success": true,
  "data": {
    "triageId": "a1b2c3d4-...",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "input": {
      "message": "I was charged twice...",
      "metadata": { "channel": "email", "language": "en", "customerId": "CUS-12345" }
    },
    "analysis": {
      "category": "billing",
      "subCategory": "duplicate charge",
      "priority": "high",
      "priorityScore": 78,
      "sentiment": "frustrated",
      "sentimentScore": -0.72,
      "summary": "Customer reports being charged twice for a Pro subscription at $149 each.",
      "suggestedActions": [
        "Verify billing history for account CUS-12345",
        "Issue an immediate refund for the duplicate charge",
        "Send a confirmation email to the customer"
      ],
      "suggestedDepartment": "Billing & Payments Team",
      "slaTarget": "4 hours",
      "estimatedResolutionTime": "1-2 hours",
      "urgencyIndicators": ["charged twice", "$149 twice"],
      "keyEntities": { "amounts": ["$149"], "orderIds": [], "products": ["Pro subscription"], "dates": [] },
      "tags": ["duplicate-charge", "billing-dispute"],
      "confidence": 0.95,
      "escalate": false
    },
    "pipeline": { "stages": ["receiveInput", "validateInput", "..."], "durationMs": 1432 }
  }
}`;

const BULK_CURL = `curl -X POST ${BASE}/analyze/bulk \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [
      { "message": "My order hasn't arrived after 10 days.", "metadata": { "channel": "email" } },
      { "message": "The API keeps returning 500 errors — our production is down!" },
      { "message": "How do I export my data as CSV?" }
    ]
  }'`;

const BULK_RESPONSE = `{
  "success": true,
  "summary": { "total": 3, "succeeded": 3, "failed": 0 },
  "results": [
    {
      "index": 0,
      "inputMessage": "My order hasn't arrived after 10 days.",
      "success": true,
      "data": { "triageId": "...", "analysis": { "priority": "medium", "category": "shipping", ... } }
    },
    {
      "index": 1,
      "inputMessage": "The API keeps returning 500 errors...",
      "success": true,
      "data": { "triageId": "...", "analysis": { "priority": "critical", "category": "technical", ... } }
    },
    {
      "index": 2,
      "inputMessage": "How do I export my data as CSV?",
      "success": true,
      "data": { "triageId": "...", "analysis": { "priority": "low", "category": "general", ... } }
    }
  ]
}`;

const HEALTH_CURL = `curl ${BASE}/health`;
const HEALTH_RESPONSE = `{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 3600,
  "gemini": {
    "model": "gemini-2.5-flash",
    "connected": true
  }
}`;

const NAV_SECTIONS = [
  { id: 'analyze',       label: 'POST /analyze'      },
  { id: 'analyze-bulk',  label: 'POST /analyze/bulk' },
  { id: 'health',        label: 'GET  /health'       },
  { id: 'schema',        label: 'Response Schema'    },
];

export default function ApiDocsPage() {
  const [activeTab, setActiveTab] = useState({});

  const tab = (id) => activeTab[id] || 'curl';
  const setTab = (id, val) => setActiveTab(prev => ({ ...prev, [id]: val }));

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="animate-fade-in-up mb-10">
        <div
          className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border mb-3"
          style={{ background: 'var(--color-accent-glow)', borderColor: 'rgba(99,102,241,0.3)', color: 'var(--color-accent-light)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          REST API · v1.0
        </div>
        <h1 className="text-4xl font-extrabold mb-2">
          API <span className="gradient-text">Documentation</span>
        </h1>
        <p className="text-base leading-relaxed max-w-2xl" style={{ color: 'var(--color-text-secondary)' }}>
          A stateless JSON REST API for AI-powered customer support triage. Drop it in front of any CRM
          or ticketing system with a single HTTP POST. No database required.
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-low)' }} />
            Base URL: <code className="font-mono ml-1" style={{ color: 'var(--color-accent-light)' }}>{BASE}</code>
          </div>
        </div>
      </div>

      <div className="lg:flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-48 flex-shrink-0">
          <div className="sticky top-24 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>
              Endpoints
            </p>
            {NAV_SECTIONS.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block text-xs font-mono px-3 py-2 rounded-lg transition-all duration-200"
                style={{ color: 'var(--color-text-secondary)' }}
                onMouseEnter={e => { e.target.style.color = 'var(--color-accent-light)'; e.target.style.background = 'var(--color-accent-glow)'; }}
                onMouseLeave={e => { e.target.style.color = 'var(--color-text-secondary)'; e.target.style.background = 'transparent'; }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 space-y-8">

          {/* POST /analyze */}
          <EndpointSection
            id="analyze"
            method="POST"
            path="/analyze"
            description="Analyze a single customer support message through the 7-stage AI triage pipeline. Returns structured priority, category, sentiment, routing, and suggested actions in JSON."
            fields={[
              { name: 'message',           type: 'string', required: true,  description: 'The raw customer support message. Min 10, max 2000 characters.' },
              { name: 'metadata',          type: 'object', required: false, description: 'Optional context object.' },
              { name: 'metadata.channel',  type: 'string', required: false, description: 'Communication channel: email | chat | phone | social.' },
              { name: 'metadata.language', type: 'string', required: false, description: 'ISO 639-1 language code, e.g. "en", "fr". Default: "en".' },
              { name: 'metadata.customerId', type: 'string', required: false, description: 'Your internal customer identifier. Passed through in the response.' },
            ]}
            request={
              <div className="space-y-2">
                <div className="flex gap-2 mb-2">
                  {['curl', 'javascript'].map(t => (
                    <button key={t} onClick={() => setTab('analyze', t)}
                      className="text-xs px-3 py-1 rounded-md cursor-pointer transition-all duration-200"
                      style={{
                        background: tab('analyze') === t ? 'var(--color-accent-glow)' : 'transparent',
                        color: tab('analyze') === t ? 'var(--color-accent-light)' : 'var(--color-text-muted)',
                        border: `1px solid ${tab('analyze') === t ? 'rgba(99,102,241,0.4)' : 'var(--color-border)'}`,
                      }}>
                      {t}
                    </button>
                  ))}
                </div>
                {tab('analyze') === 'curl' ? <CodeBlock code={ANALYZE_CURL} lang="bash" /> : <CodeBlock code={ANALYZE_JS} lang="javascript" />}
              </div>
            }
            response={<CodeBlock code={ANALYZE_RESPONSE} lang="json" />}
          />

          {/* POST /analyze/bulk */}
          <EndpointSection
            id="analyze-bulk"
            method="POST"
            path="/analyze/bulk"
            description="Analyze up to 20 customer messages in a single batch request. Messages are processed concurrently (up to 5 at a time) using the same 7-stage pipeline. Each result is individually marked as succeeded or failed — partial failures never abort the whole batch."
            fields={[
              { name: 'messages',             type: 'array',  required: true,  description: 'Array of message objects. Max 20 items.' },
              { name: 'messages[].message',   type: 'string', required: true,  description: 'Customer message text. Min 10, max 2000 characters.' },
              { name: 'messages[].metadata',  type: 'object', required: false, description: 'Same channel/language/customerId options as the single endpoint.' },
            ]}
            request={<CodeBlock code={BULK_CURL} lang="bash" />}
            response={<CodeBlock code={BULK_RESPONSE} lang="json" />}
          />

          {/* GET /health */}
          <EndpointSection
            id="health"
            method="GET"
            path="/health"
            description="Returns the current health status of the API and confirms Gemini connectivity. Useful for uptime monitoring and readiness checks. Responds within 3 seconds regardless of Gemini connectivity."
            request={<CodeBlock code={HEALTH_CURL} lang="bash" />}
            response={<CodeBlock code={HEALTH_RESPONSE} lang="json" />}
          />

          {/* Schema reference */}
          <section id="schema" className="glass-card animate-fade-in-up space-y-5" style={{ padding: '28px' }}>
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Response Schema Reference
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              The <code className="font-mono text-xs" style={{ color: 'var(--color-accent-light)' }}>analysis</code> object is identical in both the single and bulk endpoints.
            </p>

            <div className="overflow-x-auto rounded-lg" style={{ border: '1px solid var(--color-border)' }}>
              <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--color-border)' }}>
                    {['Field', 'Type', 'Values / Range', 'Description'].map(h => (
                      <th key={h} className="py-2 px-3 text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'category',             type: 'string',   range: 'billing | technical | account | shipping | general', desc: 'Primary support category.' },
                    { name: 'subCategory',           type: 'string',   range: 'free text',       desc: 'More specific sub-category.' },
                    { name: 'priority',              type: 'string',   range: 'critical | high | medium | low', desc: 'Urgency level of the issue.' },
                    { name: 'priorityScore',         type: 'number',   range: '0 – 100',         desc: '100 = most urgent.' },
                    { name: 'sentiment',             type: 'string',   range: 'positive | neutral | negative | frustrated | angry', desc: 'Emotional tone.' },
                    { name: 'sentimentScore',        type: 'number',   range: '-1.0 – 1.0',      desc: '-1 = very negative, 1 = very positive.' },
                    { name: 'summary',               type: 'string',   range: '—',               desc: 'One-sentence summary of the customer issue.' },
                    { name: 'suggestedActions',      type: 'string[]', range: '2 – 5 items',     desc: 'Ordered list of recommended agent actions.' },
                    { name: 'suggestedDepartment',   type: 'string',   range: '—',               desc: 'Best department to handle this ticket.' },
                    { name: 'slaTarget',             type: 'string',   range: '1h | 4h | 24h | 72h', desc: 'Business-rule-assigned SLA deadline.' },
                    { name: 'estimatedResolutionTime', type: 'string', range: '—',               desc: 'AI estimate for resolution time.' },
                    { name: 'urgencyIndicators',     type: 'string[]', range: '—',               desc: 'Phrases from the message that signal urgency.' },
                    { name: 'keyEntities',           type: 'object',   range: '—',               desc: 'Extracted products, orderIds, amounts, dates.' },
                    { name: 'tags',                  type: 'string[]', range: 'kebab-case',      desc: 'Short classification labels.' },
                    { name: 'confidence',            type: 'number',   range: '0.0 – 1.0',       desc: 'AI confidence in the analysis.' },
                    { name: 'escalate',              type: 'boolean',  range: '—',               desc: 'true if business rules triggered auto-escalation (critical priority).' },
                  ].map(row => (
                    <tr key={row.name} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td className="py-2 px-3 font-mono text-xs" style={{ color: 'var(--color-accent-light)', whiteSpace: 'nowrap' }}>{row.name}</td>
                      <td className="py-2 px-3 text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>{row.type}</td>
                      <td className="py-2 px-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>{row.range}</td>
                      <td className="py-2 px-3 text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-2">
              <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
                Fetch the machine-readable schema directly from the API:
              </p>
              <CodeBlock code={`curl ${BASE}/analyze/schema`} lang="bash" />
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
