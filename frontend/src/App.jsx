import { useEffect, useMemo, useState } from 'react';
import choiceSets from './data/choice_sets.json';
import { generalQuestions, introductionCopy } from './data/generalQuestions';
import { personalQuestions } from './data/personalQuestions';
import SiteHeader from './components/layout/SiteHeader';
import SiteFooter from './components/layout/SiteFooter';
import IntroScreen from './components/survey/IntroScreen';
import GeneralQuestionView from './components/survey/GeneralQuestionView';
import ChoiceSetView from './components/survey/ChoiceSetView';
import PersonalQuestionView from './components/survey/PersonalQuestionView';
import LoadingOverlay from './components/survey/LoadingOverlay';
import ThankYouScreen from './components/survey/ThankYouScreen';
import DeclinedScreen from './components/survey/DeclinedScreen';
import { buildSubmissionPayload, choiceSetKey, createSurveySession, submitSurvey } from './utils/survey';

const ESTIMATED_TIME = '8 - 12 phút';

export default function App() {
  const surveySession = useMemo(() => createSurveySession(choiceSets), []);
  const consentQuestion = useMemo(
    () => generalQuestions.find((question) => question.id === 'consent') || null,
    []
  );
  const generalSurveyQuestions = useMemo(
    () => generalQuestions.filter((question) => question.id !== 'consent'),
    []
  );

  const [phase, setPhase] = useState('landing');
  const [currentChoiceIndex, setCurrentChoiceIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submissionResult, setSubmissionResult] = useState({ status: 'idle' });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [phase, currentChoiceIndex]);

  const totalProgressSteps = surveySession.choiceSets.length + 3;
  const currentProgressStep = phase === 'landing'
    ? 0
    : phase === 'consent'
      ? 1
      : phase === 'general'
        ? 2
      : phase === 'choice'
        ? currentChoiceIndex + 3
        : phase === 'personal' || phase === 'submitting' || phase === 'done'
          ? totalProgressSteps
          : 0;
  const progress = Math.min((currentProgressStep / totalProgressSteps) * 100, 100);

  const currentChoiceSet = surveySession.choiceSets[currentChoiceIndex];

  function updateAnswer(stepId, value) {
    setAnswers((previous) => ({
      ...previous,
      [stepId]: value
    }));
  }

  function goFromConsentToGeneral() {
    if (answers.consent === 'Tôi không đồng ý') {
      setPhase('declined');
      return;
    }

    setPhase('general');
  }

  function goFromGeneralToChoice() {
    setPhase('choice');
  }

  function goChoiceNext() {
    if (currentChoiceIndex === surveySession.choiceSets.length - 1) {
      setPhase('personal');
      return;
    }

    setCurrentChoiceIndex((index) => index + 1);
  }

  function goChoiceBack() {
    if (currentChoiceIndex === 0) {
      setPhase('general');
      return;
    }

    setCurrentChoiceIndex((index) => index - 1);
  }

  function goBackFromPersonal() {
    setPhase('choice');
    setCurrentChoiceIndex(surveySession.choiceSets.length - 1);
  }

  async function handleSubmit() {
    setPhase('submitting');

    const payload = buildSubmissionPayload({
      session: surveySession,
      generalQuestions,
      personalQuestions,
      answers
    });

    const result = await submitSurvey(payload);
    setSubmissionResult(result);
    setPhase('done');
  }

  function handleRestart() {
    window.sessionStorage.removeItem('nckh2026:dce-session');
    setAnswers({});
    setCurrentChoiceIndex(0);
    setSubmissionResult({ status: 'idle' });
    setPhase('landing');
    window.location.reload();
  }

  function renderContent() {
    if (phase === 'landing') {
      return (
        <IntroScreen
          introCopy={introductionCopy}
          estimatedTime={ESTIMATED_TIME}
          onStart={() => setPhase('consent')}
        />
      );
    }

    if (phase === 'declined') {
      return <DeclinedScreen />;
    }

    if (phase === 'done') {
      return (
        <ThankYouScreen
          sessionId={surveySession.sessionId}
          assignedBlock={surveySession.assignedBlock}
          submissionStatus={submissionResult.status}
          onRestart={handleRestart}
        />
      );
    }

    if (phase === 'consent' && consentQuestion) {
      return (
        <GeneralQuestionView
          questions={[consentQuestion]}
          answers={answers}
          onChange={updateAnswer}
          onNext={goFromConsentToGeneral}
          title="Phần 1: Xác nhận tham gia"
          subtitle="Vui lòng xác nhận đồng ý trước khi tiếp tục khảo sát"
          nextButtonLabel="Tiếp tục"
        />
      );
    }

    if (phase === 'general') {
      return (
        <GeneralQuestionView
          questions={generalSurveyQuestions}
          answers={answers}
          onChange={updateAnswer}
          onNext={goFromGeneralToChoice}
          title="Phần 2: Câu hỏi chung"
          subtitle="Vui lòng trả lời toàn bộ câu hỏi trước khi tiếp tục"
          nextButtonLabel="Bắt đầu phần lựa chọn"
        />
      );
    }

    if (phase === 'choice' && currentChoiceSet) {
      const currentChoiceKey = choiceSetKey(currentChoiceSet);

      return (
      <ChoiceSetView
        choiceSet={currentChoiceSet}
        value={answers[currentChoiceKey]}
        onChange={(value) => updateAnswer(currentChoiceKey, value)}
        onNext={goChoiceNext}
        onBack={goChoiceBack}
        onOptOut={() => updateAnswer(currentChoiceKey, {
          selected: null,
          selectedSourceKey: null,
          selectedLabel: null,
          optOut: true
        })}
        isFirst={currentChoiceIndex === 0}
        isLast={currentChoiceIndex === surveySession.choiceSets.length - 1}
        questionIndex={currentChoiceIndex}
        totalQuestions={surveySession.choiceSets.length}
      />
      );
    }

    if (phase === 'personal') {
      return (
        <PersonalQuestionView
          questions={personalQuestions}
          answers={answers}
          onChange={updateAnswer}
          onSubmit={() => {
            void handleSubmit();
          }}
          onBack={goBackFromPersonal}
        />
      );
    }

    return null;
  }

  return (
    <div className="survey-shell flex min-h-screen flex-col">
      <SiteHeader sessionId={surveySession.sessionId} assignedBlock={surveySession.assignedBlock} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-10" id="survey-preview">
        <div className="mb-6 rounded-[1.75rem] border border-white/50 bg-white/50 p-3 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 px-2 pb-3 text-sm font-medium text-brand-ink/80">
            <span>{phase === 'landing' ? 'Sẵn sàng bắt đầu' : phase === 'submitting' ? 'Đang đồng bộ' : phase === 'done' ? 'Hoàn tất' : 'Đang thực hiện khảo sát'}</span>
            <span>{phase === 'landing' ? '0%' : `${Math.round(progress)}%`}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/70">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-primary via-[#b6322c] to-brand-secondary transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {renderContent()}
      </main>

      <SiteFooter />

      {phase === 'submitting' ? <LoadingOverlay message="Vui lòng không đóng tab trong lúc dữ liệu đang được xử lý." /> : null}
    </div>
  );
}
