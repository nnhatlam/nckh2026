import GlassCard from '../layout/GlassCard';
import Button from '../ui/Button';
import { formatChoiceDetails } from '../../utils/survey';

function ChoiceCard({ title, side, selected, onSelect }) {
  const details = formatChoiceDetails(side);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group h-full rounded-[2rem] border p-5 text-left transition-all duration-200 ${selected ? 'border-brand-primary bg-brand-primary/10 shadow-lg shadow-brand-primary/10' : 'border-white/70 bg-white/60 hover:-translate-y-1 hover:bg-white/75 hover:shadow-lg hover:shadow-black/5'}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-primary/75">{title}</p>
          <h4 className="mt-1 text-xl font-bold text-brand-ink">Phương án {side.label}</h4>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${selected ? 'bg-brand-primary text-white' : 'bg-brand-secondary/25 text-brand-ink'}`}>Chọn</span>
      </div>

      <div className="mt-5 space-y-3">
        {details.map(([label, value]) => (
          <div key={label} className="flex items-start justify-between gap-4 rounded-2xl bg-white/60 px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-ink/55">{label}</span>
            <span className="text-right text-sm font-medium text-brand-ink">{value}</span>
          </div>
        ))}
      </div>
    </button>
  );
}

export default function ChoiceSetView({
  choiceSet,
  value,
  onChange,
  onNext,
  onBack,
  onOptOut,
  isFirst,
  isLast,
  questionIndex,
  totalQuestions
}) {
  const isAnswered = Boolean(value?.selected || value?.optOut);

  return (
    <GlassCard className="border border-white/60 bg-white/68 shadow-glass">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-primary/75">Bộ lựa chọn DCE</p>
          <p className="mt-1 text-sm font-medium text-brand-ink/70">Câu hỏi {questionIndex + 1} / {totalQuestions}</p>
        </div>
      </div>

      <h3 className="text-xl font-bold leading-snug text-brand-ink sm:text-2xl">Vui lòng chọn phương án phù hợp nhất với Anh/Chị</h3>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <ChoiceCard
          title="Bên trái"
          side={choiceSet.left}
          selected={value?.selected === 'left'}
          onSelect={() => onChange({
            selected: 'left',
            selectedSourceKey: choiceSet.left.sourceKey,
            selectedLabel: choiceSet.left.label,
            optOut: false
          })}
        />
        <ChoiceCard
          title="Bên phải"
          side={choiceSet.right}
          selected={value?.selected === 'right'}
          onSelect={() => onChange({
            selected: 'right',
            selectedSourceKey: choiceSet.right.sourceKey,
            selectedLabel: choiceSet.right.label,
            optOut: false
          })}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={onOptOut} className="min-w-[220px]">Tôi không chọn phương án nào</Button>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={onBack} disabled={isFirst}>Quay lại</Button>
        <Button onClick={onNext} disabled={!isAnswered}>{isLast ? 'Hoàn thành' : 'Tiếp theo'}</Button>
      </div>
    </GlassCard>
  );
}
