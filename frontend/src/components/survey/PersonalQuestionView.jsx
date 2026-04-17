import GlassCard from '../layout/GlassCard';
import Button from '../ui/Button';

function RadioGroup({ options, value, onChange, name }) {
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
              name={name}
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

function isAnswered(question, value) {
  if (question.type === 'multi') {
    return Array.isArray(value) && value.length > 0;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  return value !== null && value !== undefined && value !== '';
}

export default function PersonalQuestionView({ questions, answers, onChange, onSubmit, onBack }) {
  const allAnswered = questions.every((question) => isAnswered(question, answers[question.id]));

  return (
    <GlassCard className="border border-white/60 bg-white/68 shadow-glass">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-primary/75">Phần 3: Thông tin cá nhân</p>
          <p className="mt-1 text-sm font-medium text-brand-ink/70">Đây là phần cuối cùng trước khi gửi khảo sát</p>
        </div>
        <div className="rounded-full border border-brand-secondary/50 bg-brand-secondary/20 px-4 py-2 text-sm font-semibold text-brand-ink">Thông tin cá nhân</div>
      </div>

      <div className="max-h-[62vh] space-y-6 overflow-y-auto pr-1">
        {questions.map((question, index) => {
          const value = answers[question.id];

          return (
            <section key={question.id} className="rounded-3xl border border-white/65 bg-white/45 p-4 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-ink/60">{question.section}</p>
              <h3 className="mt-2 text-lg font-bold leading-snug text-brand-ink sm:text-xl">Câu {index + 1}. {question.prompt}</h3>

              <div className="mt-4">
                {question.type === 'single' ? (
                  <RadioGroup
                    options={question.options}
                    value={value}
                    onChange={(nextValue) => onChange(question.id, nextValue)}
                    name={question.id}
                  />
                ) : null}

                {question.type === 'text' ? (
                  <textarea
                    rows="4"
                    value={value || ''}
                    placeholder={question.placeholder}
                    onChange={(event) => onChange(question.id, event.target.value)}
                    className="w-full rounded-[1.5rem] border border-white/70 bg-white/70 px-4 py-3 text-sm text-brand-ink outline-none ring-0 placeholder:text-brand-ink/35 focus:border-brand-primary/50 focus:bg-white focus:shadow-md focus:shadow-brand-primary/10"
                  />
                ) : null}

                {question.type === 'number' ? (
                  <input
                    type="number"
                    value={value || ''}
                    placeholder={question.placeholder}
                    onChange={(event) => onChange(question.id, event.target.value)}
                    className="w-full rounded-[1.5rem] border border-white/70 bg-white/70 px-4 py-3 text-sm text-brand-ink outline-none ring-0 placeholder:text-brand-ink/35 focus:border-brand-primary/50 focus:bg-white focus:shadow-md focus:shadow-brand-primary/10"
                  />
                ) : null}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={onBack}>Quay lại phần lựa chọn</Button>
        <Button onClick={onSubmit} disabled={!allAnswered}>Gửi khảo sát</Button>
      </div>
    </GlassCard>
  );
}
