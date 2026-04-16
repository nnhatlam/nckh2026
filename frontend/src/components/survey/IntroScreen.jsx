import GlassCard from '../layout/GlassCard';
import Button from '../ui/Button';

export default function IntroScreen({ introCopy, estimatedTime, onStart }) {
  return (
    <GlassCard className="relative overflow-hidden border border-white/60 bg-white/65 shadow-glass">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(149,187,234,0.22),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(147,5,0,0.12),transparent_42%)]" />
      <div className="relative space-y-6">
        <div className="space-y-3">
          <span className="inline-flex rounded-full border border-brand-primary/20 bg-brand-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.3em] text-brand-primary">Khảo sát trực tuyến</span>
          <h2 className="text-3xl font-bold leading-tight text-brand-ink sm:text-4xl">Nghiên cứu ưu tiên thương hiệu xe điện tại Việt Nam</h2>
          <p className="max-w-3xl text-sm leading-7 text-brand-ink/80 sm:text-base">{introCopy}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/70 bg-white/55 p-4 text-sm text-brand-ink/80 backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-primary">Thời lượng</p>
            <p className="mt-2 text-lg font-semibold text-brand-ink">{estimatedTime}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button onClick={onStart} className="min-w-[180px]">Bắt đầu khảo sát</Button>
          <a href="#survey-preview" className="inline-flex items-center justify-center rounded-full border border-brand-secondary/60 bg-brand-secondary/20 px-5 py-3 text-sm font-semibold text-brand-ink transition hover:bg-brand-secondary/35">Xem cấu trúc khảo sát</a>
        </div>
      </div>
    </GlassCard>
  );
}
