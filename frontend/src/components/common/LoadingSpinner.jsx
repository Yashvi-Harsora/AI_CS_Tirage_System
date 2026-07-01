export default function LoadingSpinner({ size = 24, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: 'spin 0.7s linear infinite', flexShrink: 0 }}
      aria-label="Loading"
    >
      <circle
        cx="12" cy="12" r="10"
        stroke={color}
        strokeWidth="3"
        strokeOpacity="0.25"
      />
      <path
        d="M12 2 a10 10 0 0 1 10 10"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
