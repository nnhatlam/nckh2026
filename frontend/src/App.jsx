import { useEffect, useMemo, useState } from 'react';
import choiceSets from './data/choice_sets.json';
import { generalQuestions, introductionCopy } from './data/generalQuestions';
import SiteHeader from './components/layout/SiteHeader';
import SiteFooter from './components/layout/SiteFooter';
import IntroScreen from './components/survey/IntroScreen';
import GeneralQuestionView from './components/survey/GeneralQuestionView';
import ChoiceSetView from './components/survey/ChoiceSetView';
import LoadingOverlay from './components/survey/LoadingOverlay';
import ThankYouScreen from './components/survey/ThankYouScreen';
import DeclinedScreen from './components/survey/DeclinedScreen';
import { buildSubmissionPayload, choiceSetKey, createSurveySession, submitSurvey } from './utils/survey';

const ESTIMATED_TIME = '8 - 12 phút';

export default function App() {
  const surveySession = useMemo(() => createSurveySession(choiceSets), []);
  const surveySteps = useMemo(
    () => [
      ...generalQuestions.map((question) => ({ ...question, stepType: 'general' })),
      ...surveySession.choiceSets.map((choiceSet) => ({
        ...choiceSet,
        id: choiceSetKey(choiceSet),
        stepType: 'choice'
      }))
    ],
    [surveySession.choiceSets]
  );

  const [phase, setPhase] = useState('landing');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submissionResult, setSubmissionResult] = useState({ status: 'idle' });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [phase, currentStepIndex]);

  const currentStep = surveySteps[currentStepIndex];
  const totalQuestions = surveySteps.length;
  const progress = phase === 'landing' ? 0 : Math.min(((currentStepIndex + 1) / totalQuestions) * 100, 100);

  function updateAnswer(stepId, value) {
    setAnswers((previous) => ({
      ...previous,
      [stepId]: value
    }));
  }

  function goNext() {
    if (!currentStep) {
      return;
    }

    if (currentStep.stepType === 'general' && currentStep.id === 'consent') {
      const consentValue = answers[currentStep.id];
      if (consentValue === 'Tôi không đồng ý') {
        setPhase('declined');
        return;
      }
    }

    if (currentStepIndex === surveySteps.length - 1) {
      void handleSubmit();
      return;
    }

    setCurrentStepIndex((index) => index + 1);
  }

  function goBack() {
    if (currentStepIndex === 0) {
      return;
    }

    setCurrentStepIndex((index) => index - 1);
  }

  async function handleSubmit() {
    setPhase('submitting');

    const payload = buildSubmissionPayload({
      session: surveySession,
      generalQuestions,
      answers
    });

    const result = await submitSurvey(import.meta.env.VITE_SURVEY_ENDPOINT_URL, payload);
    setSubmissionResult(result);
    setPhase('done');
  }

  function handleRestart() {
    window.sessionStorage.removeItem('nckh2026:dce-session');
    setAnswers({});
    setCurrentStepIndex(0);
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
          onStart={() => setPhase('survey')}
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

    if (!currentStep) {
      return null;
    }

    if (currentStep.stepType === 'general') {
      return (
        <GeneralQuestionView
          question={currentStep}
          value={answers[currentStep.id]}
          onChange={(value) => updateAnswer(currentStep.id, value)}
          onNext={goNext}
          onBack={goBack}
          isFirst={currentStepIndex === 0}
          isLast={currentStepIndex === surveySteps.length - 1}
          questionIndex={currentStepIndex}
          totalQuestions={totalQuestions}
        />
      );
    }

    return (
      <ChoiceSetView
        choiceSet={currentStep}
        value={answers[currentStep.id]}
        onChange={(value) => updateAnswer(currentStep.id, value)}
        onNext={goNext}
        onBack={goBack}
        onOptOut={() => updateAnswer(currentStep.id, {
          selected: null,
          selectedSourceKey: null,
          selectedLabel: null,
          optOut: true
        })}
        isFirst={currentStepIndex === 0}
        isLast={currentStepIndex === surveySteps.length - 1}
        questionIndex={currentStepIndex}
        totalQuestions={totalQuestions}
      />
    );
  }

  return (
    <div className="survey-shell flex min-h-screen flex-col">
      <SiteHeader sessionId={surveySession.sessionId} assignedBlock={surveySession.assignedBlock} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-10" id="survey-preview">
        <div className="mb-6 rounded-[1.75rem] border border-white/50 bg-white/50 p-3 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 px-2 pb-3 text-sm font-medium text-brand-ink/80">
            <span>{phase === 'landing' ? 'Sẵn sàng bắt đầu' : phase === 'survey' ? 'Đang thực hiện khảo sát' : phase === 'submitting' ? 'Đang đồng bộ' : 'Hoàn tất'}</span>
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
