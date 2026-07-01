export default function Badge({ children, color = 'indigo', className = '' }) {
  const colorMap = {
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    green:  'text-green-400 bg-green-500/10 border-green-500/30',
    red:    'text-red-400 bg-red-500/10 border-red-500/30',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    slate:  'text-slate-400 bg-slate-500/10 border-slate-500/30',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${colorMap[color] || colorMap.indigo} ${className}`}
    >
      {children}
    </span>
  );
}
