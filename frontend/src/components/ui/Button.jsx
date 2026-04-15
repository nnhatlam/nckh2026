export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25 hover:bg-[#7f0400]',
    secondary: 'bg-brand-secondary text-brand-ink shadow-lg shadow-brand-secondary/30 hover:bg-[#7ca7d9]',
    ghost: 'border border-white/60 bg-white/50 text-brand-ink hover:bg-white/75'
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
