import GlassCard from '../layout/GlassCard';

export default function DeclinedScreen() {
  return (
    <GlassCard className="border border-white/60 bg-white/72 text-center shadow-glass">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-secondary/20 text-3xl">i</div>
      <h2 className="mt-5 text-3xl font-bold text-brand-ink">Anh/Chị đã chọn không tham gia</h2>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-brand-ink/80">
        Nhóm nghiên cứu tôn trọng quyết định của Anh/Chị và sẽ không tiếp tục các câu hỏi khảo sát.
      </p>
    </GlassCard>
  );
}
