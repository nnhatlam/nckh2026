export default function GlassCard({ children, className = '' }) {
  return (
    <div className={`glass-card rounded-[2rem] p-5 sm:p-7 ${className}`}>
      {children}
    </div>
  );
}
