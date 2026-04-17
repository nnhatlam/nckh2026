import GlassCard from '../layout/GlassCard';
import Button from '../ui/Button';
import { formatChoiceDetails } from '../../utils/survey';

function ChoiceCard({ title, side, values, selected, onSelect }) {

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group h-full rounded-[1.35rem] border p-3 text-left transition-all duration-200 sm:rounded-[2rem] sm:p-5 ${selected ? 'border-brand-primary bg-brand-primary/10 shadow-lg shadow-brand-primary/10' : 'border-white/70 bg-white/60 hover:-translate-y-1 hover:bg-white/75 hover:shadow-lg hover:shadow-black/5'}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary/75 sm:text-xs sm:tracking-[0.28em]">{title}</p>
          <h4 className="mt-1 text-base font-bold text-brand-ink sm:text-xl">Phương án {side.label}</h4>
        </div>
        <span className={`rounded-full px-2 py-1 text-[10px] font-semibold sm:px-3 sm:text-xs ${selected ? 'bg-brand-primary text-white' : 'bg-brand-secondary/25 text-brand-ink'}`}>Chọn</span>
      </div>

      <div className="mt-3 space-y-2 sm:mt-5 sm:space-y-3">
        {values.map((valueText, index) => (
          <div key={`${side.sourceKey}-${index}`} className="flex items-start rounded-xl bg-white/60 px-2 py-2 sm:rounded-2xl sm:px-4 sm:py-3">
            <span className="text-xs font-medium text-brand-ink sm:text-sm">{valueText}</span>
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
  const leftDetails = formatChoiceDetails(choiceSet.left);
  const rightDetails = formatChoiceDetails(choiceSet.right);
  const detailLabels = leftDetails.map(([label]) => label);
  const leftValues = leftDetails.map(([, detailValue]) => detailValue);
  const rightValues = rightDetails.map(([, detailValue]) => detailValue);

  return (
    <GlassCard className="border border-white/60 bg-white/68 shadow-glass">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xl font-bold uppercase tracking-[0.28em] text-brand-primary/75">Bộ lựa chọn DCE</p>
          <p className='text-md font-medium text-brand-primary/75'>Hãy tưởng tượng bạn đang cần mua một chiếc xe mới để di chuyển hàng ngày. Vậy bạn sẽ chọn phương án nào trong các phương án dưới đây?</p>
          <p className="text-md text-brand-primary/75">Hàng nội địa: Vinfast, Datbike, Hãng mới: Vinfast, Yadea, Hàng nhập khẩu: Yadea, Yamaha, Honda, Hãng truyền thống: Honda, Yamaha</p>
          <p className="text-md text-brand-primary/75">Quãng đường là quãng đường tối đa xe có thể đi được sau khi được sạc đầy, trong điều kiện sử dụng bình thường</p>
          <p className="text-md text-brand-primary/75">Lưu ý: Nếu Anh/Chị không có sự khác biệt rõ ràng giữa 2 phương án, vui lòng chọn phương án mà Anh/Chị cảm thấy phù hợp hơn hoặc chọn "Tôi muốn chọn xe xăng"</p>
          <p className="mt-1 text-sm font-medium text-brand-ink/70">Câu hỏi {questionIndex + 1} / {totalQuestions}</p>

        </div>
      </div>

      <h3 className="text-xl font-bold leading-snug text-brand-ink sm:text-2xl">Vui lòng chọn phương án phù hợp nhất với Anh/Chị</h3>

      <div className="mt-5 grid grid-cols-[74px,minmax(0,1fr),minmax(0,1fr)] gap-2 sm:grid-cols-[120px,minmax(0,1fr),minmax(0,1fr)] sm:gap-4">
        <div className="pt-[52px] sm:pt-[78px]">
          <div className="mt-3 space-y-2 sm:mt-5 sm:space-y-3">
            {detailLabels.map((label) => (
              <div key={label} className="flex items-center px-1 py-2 sm:px-2 sm:py-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-brand-ink/55 sm:text-xs sm:tracking-[0.14em]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <ChoiceCard
          title="Bên trái"
          side={choiceSet.left}
          values={leftValues}
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
          values={rightValues}
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
        <Button variant="secondary" onClick={onOptOut} className="min-w-[220px]">Tôi muốn chọn xe xăng</Button>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={onBack} disabled={isFirst}>Quay lại</Button>
        <Button onClick={onNext} disabled={!isAnswered}>{isLast ? 'Hoàn thành' : 'Tiếp theo'}</Button>
      </div>
    </GlassCard>
  );
}
