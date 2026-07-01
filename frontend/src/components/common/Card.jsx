export default function Card({ children, className = '', hover = true, ...props }) {
  return (
    <div
      className={`glass-card p-6 ${hover ? '' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
