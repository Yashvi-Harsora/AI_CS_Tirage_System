import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 px-3 py-1.5 rounded-md ${
      isActive
        ? 'text-indigo-400 bg-indigo-500/10'
        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
    }`;

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(7, 11, 20, 0.85)',
        backdropFilter: 'blur(20px)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
          >
            T
          </div>
          <span className="font-bold text-lg tracking-tight">
            Triage<span className="gradient-text">AI</span>
          </span>
        </NavLink>

        {/* Links */}
        <div className="flex items-center gap-1">
          <NavLink to="/"        className={linkClass}>Home</NavLink>
          <NavLink to="/analyze" className={linkClass}>Analyze</NavLink>
          <NavLink to="/bulk"    className={linkClass}>Bulk</NavLink>
          <NavLink to="/docs"    className={linkClass}>API Docs</NavLink>
          <NavLink to="/history" className={linkClass}>History</NavLink>
        </div>
      </div>
    </nav>
  );
}
