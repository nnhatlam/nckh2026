import GlassCard from '../layout/GlassCard';
import Button from '../ui/Button';

export default function ThankYouScreen({ sessionId, assignedBlock, submissionStatus, onRestart }) {
  const message = submissionStatus === 'sent'
    ? 'Dữ liệu của Anh/Chị đã được gửi thành công đến hệ thống lưu trữ.'
    : 'Dữ liệu đã được lưu tạm an toàn trong trình duyệt và sẽ được đồng bộ khi endpoint backend được cấu hình.';

  return (
    <GlassCard className="border border-white/60 bg-white/72 text-center shadow-glass">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-primary/10 text-3xl">✓</div>
      <h2 className="mt-5 text-3xl font-bold text-brand-ink">Xin chân thành cảm ơn</h2>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-brand-ink/80">{message}</p>

      <div className="mt-6 flex justify-center">
        <Button onClick={onRestart}>Làm lại khảo sát</Button>
      </div>
    </GlassCard>
  );
}
