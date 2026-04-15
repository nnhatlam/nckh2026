import GlassCard from '../layout/GlassCard';
import Button from '../ui/Button';

function RadioGroup({ options, value, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const optionValue = typeof option === 'string' ? option : option.value;
        const label = typeof option === 'string' ? option : option.label;
        const checked = value === optionValue;

        return (
          <label
            key={optionValue}
            className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${checked ? 'border-brand-primary bg-brand-primary/10 shadow-md shadow-brand-primary/10' : 'border-white/70 bg-white/55 hover:bg-white/70'}`}
          >
            <input
              type="radio"
              className="mt-1 h-4 w-4 accent-brand-primary"
              checked={checked}
              onChange={() => onChange(optionValue)}
            />
            <span className="text-sm font-medium text-brand-ink">{label}</span>
          </label>
        );
      })}
    </div>
  );
}

function CheckboxGroup({ options, value, onChange }) {
  const selectedValues = Array.isArray(value) ? value : [];

  function toggleItem(option) {
    const next = selectedValues.includes(option)
      ? selectedValues.filter((item) => item !== option)
      : [...selectedValues, option];
    onChange(next);
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const checked = selectedValues.includes(option);

        return (
          <label
            key={option}
            className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${checked ? 'border-brand-primary bg-brand-primary/10 shadow-md shadow-brand-primary/10' : 'border-white/70 bg-white/55 hover:bg-white/70'}`}
          >
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-brand-primary"
              checked={checked}
              onChange={() => toggleItem(option)}
            />
            <span className="text-sm font-medium text-brand-ink">{option}</span>
          </label>
        );
      })}
    </div>
  );
}

export default function GeneralQuestionView({
  question,
  value,
  onChange,
  onNext,
  onBack,
  isFirst,
  isLast,
  questionIndex,
  totalQuestions
}) {
  const isAnswered = question.type === 'multi'
    ? Array.isArray(value) && value.length > 0
    : typeof value === 'string'
      ? value.trim().length > 0
      : value !== null && value !== undefined && value !== '';

  return (
    <GlassCard className="border border-white/60 bg-white/68 shadow-glass">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-primary/75">{question.section}</p>
          <p className="mt-1 text-sm font-medium text-brand-ink/70">Câu hỏi {questionIndex + 1} / {totalQuestions}</p>
        </div>
        <div className="rounded-full border border-brand-secondary/50 bg-brand-secondary/20 px-4 py-2 text-sm font-semibold text-brand-ink">Thông tin chung</div>
      </div>

      <h3 className="text-xl font-bold leading-snug text-brand-ink sm:text-2xl">{question.prompt}</h3>

      <div className="mt-5">
        {question.type === 'single' ? (
          <RadioGroup options={question.options} value={value} onChange={onChange} />
        ) : null}

        {question.type === 'multi' ? (
          <CheckboxGroup options={question.options} value={value} onChange={onChange} />
        ) : null}

        {question.type === 'text' ? (
          <textarea
            rows="4"
            value={value || ''}
            placeholder={question.placeholder}
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-[1.5rem] border border-white/70 bg-white/70 px-4 py-3 text-sm text-brand-ink outline-none ring-0 placeholder:text-brand-ink/35 focus:border-brand-primary/50 focus:bg-white focus:shadow-md focus:shadow-brand-primary/10"
          />
        ) : null}

        {question.type === 'number' ? (
          <input
            type="number"
            value={value || ''}
            placeholder={question.placeholder}
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-[1.5rem] border border-white/70 bg-white/70 px-4 py-3 text-sm text-brand-ink outline-none ring-0 placeholder:text-brand-ink/35 focus:border-brand-primary/50 focus:bg-white focus:shadow-md focus:shadow-brand-primary/10"
          />
        ) : null}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={onBack} disabled={isFirst}>Quay lại</Button>
        <Button onClick={onNext} disabled={!isAnswered}>{isLast ? 'Hoàn thành' : 'Tiếp theo'}</Button>
      </div>
    </GlassCard>
  );
}
