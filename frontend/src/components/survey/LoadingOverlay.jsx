export default function LoadingOverlay({ message }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-ink/35 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] border border-white/50 bg-white/90 p-6 text-center shadow-glass">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-brand-secondary/30 border-t-brand-primary" />
        <p className="mt-4 text-lg font-bold text-brand-ink">Đang gửi dữ liệu</p>
        <p className="mt-2 text-sm leading-6 text-brand-ink/70">{message}</p>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-brand-secondary/20">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary" />
        </div>
      </div>
    </div>
  );
}
