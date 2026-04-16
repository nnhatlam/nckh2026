export default function SiteHeader({ sessionId, assignedBlock }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/40 bg-brand-surface/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-primary/80">FTU Research Group 2026</p>
          <h1 className="text-base font-semibold text-brand-ink sm:text-lg">Khảo sát DCE xe điện Việt Nam</h1>
        </div>
      </div>
    </header>
  );
}
