const SESSION_STORAGE_KEY = 'nckh2026:dce-session';
const OFFLINE_QUEUE_KEY = 'nckh2026:dce-pending-submissions';

export function shuffle(array) {
  const cloned = [...array];

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[swapIndex]] = [cloned[swapIndex], cloned[index]];
  }

  return cloned;
}

export function getSessionId() {
  if (typeof window === 'undefined') {
    return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  const cached = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed.sessionId) {
        return parsed.sessionId;
      }
    } catch (error) {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  const sessionId = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return sessionId;
}

function getAvailableBlocks(choiceSets) {
  return [...new Set(choiceSets.map((choiceSet) => choiceSet.block))].sort((left, right) => left - right);
}

function randomBlock(choiceSets) {
  const blocks = getAvailableBlocks(choiceSets);
  const selectedIndex = Math.floor(Math.random() * blocks.length);
  return blocks[selectedIndex];
}

function createSidePayload(label, alternative, sourceKey) {
  return {
    label,
    sourceKey,
    origin: alternative.origin,
    brand: alternative.brand,
    price: alternative.price,
    batteryEnergy: alternative.batteryEnergy,
    range: alternative.range,
    station: alternative.station,
    chargeTime: alternative.chargeTime
  };
}

function randomizePresentation(choiceSet) {
  const useAlt1OnLeft = Math.random() < 0.5;
  const left = useAlt1OnLeft
    ? createSidePayload('A', choiceSet.alt1, 'alt1')
    : createSidePayload('B', choiceSet.alt2, 'alt2');
  const right = useAlt1OnLeft
    ? createSidePayload('B', choiceSet.alt2, 'alt2')
    : createSidePayload('A', choiceSet.alt1, 'alt1');

  return {
    setId: choiceSet.setId,
    choiceSet: choiceSet.choiceSet,
    block: choiceSet.block,
    left,
    right
  };
}

export function createSurveySession(choiceSets) {
  if (typeof window !== 'undefined') {
    const cached = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.sessionId && parsed.assignedBlock && Array.isArray(parsed.choiceSets)) {
          return parsed;
        }
      } catch (error) {
        window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
  }

  const assignedBlock = randomBlock(choiceSets);
  const blockChoiceSets = shuffle(choiceSets.filter((choiceSet) => choiceSet.block === assignedBlock));
  const session = {
    sessionId: getSessionId(),
    assignedBlock,
    choiceSets: blockChoiceSets.map(randomizePresentation)
  };

  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }

  return session;
}

export function choiceSetKey(choiceSet) {
  return `choice-set-${choiceSet.setId}`;
}

export function buildSubmissionPayload({ session, generalQuestions, answers }) {
  const generalAnswers = generalQuestions.map((question) => ({
    id: question.id,
    prompt: question.prompt,
    answer: answers[question.id] ?? null
  }));

  const choiceResponses = session.choiceSets.map((choiceSet) => {
    const answer = answers[choiceSetKey(choiceSet)] ?? null;
    return {
      setId: choiceSet.setId,
      choiceSet: choiceSet.choiceSet,
      block: choiceSet.block,
      positionLeft: choiceSet.left.label,
      positionRight: choiceSet.right.label,
      selected: answer?.selected ?? null,
      selectedSourceKey: answer?.selectedSourceKey ?? null,
      selectedLabel: answer?.selectedLabel ?? null,
      optOut: Boolean(answer?.optOut),
      left: choiceSet.left,
      right: choiceSet.right
    };
  });

  return {
    sessionId: session.sessionId,
    assignedBlock: session.assignedBlock,
    completedAt: new Date().toISOString(),
    generalAnswers,
    choiceResponses,
    answers
  };
}

function queueOfflineSubmission(payload) {
  if (typeof window === 'undefined') {
    return;
  }

  const currentQueue = JSON.parse(window.localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
  currentQueue.push(payload);
  window.localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(currentQueue));
}

export async function submitSurvey(endpoint, payload) {
  if (!endpoint) {
    queueOfflineSubmission(payload);
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    return { status: 'queued' };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return { status: 'sent' };
  } catch (error) {
    queueOfflineSubmission(payload);
    return { status: 'queued', error: error.message };
  }
}

export function formatChoiceDetails(side) {
  return [
    ['Xuất xứ', side.origin],
    ['Thương hiệu', side.brand],
    ['Giá', side.price],
    ['Pin / năng lượng', side.batteryEnergy],
    ['Quãng đường', side.range],
    ['Trạm sạc', side.station],
    ['Thời gian sạc', side.chargeTime]
  ];
}
