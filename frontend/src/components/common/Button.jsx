import LoadingSpinner from './LoadingSpinner';

const VARIANTS = {
  primary: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff',
    border: 'none',
    hoverOpacity: '0.9',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--color-text-secondary)',
    border: '1px solid var(--color-border)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-accent-light)',
    border: 'none',
  },
  danger: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#f87171',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  },
};

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  size = 'md',
  ...props
}) {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'lg' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm';

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 cursor-pointer ${sizeClass} ${className}`}
      style={{
        background:  v.background,
        color:       v.color,
        border:      v.border || 'none',
        opacity:     disabled || loading ? 0.5 : 1,
        transform:   'translateY(0)',
      }}
      onMouseEnter={(e) => { if (!disabled && !loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
      {...props}
    >
      {loading && <LoadingSpinner size={16} />}
      {children}
    </button>
  );
}
