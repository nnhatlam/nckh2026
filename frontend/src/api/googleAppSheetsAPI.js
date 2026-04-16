const FALLBACK_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxT8bvc7CBEp-LlwKXdYZnFdWytU2dVq2SvX4LLc0NOX-uMj8HdHqdGamR-ZX3nT-Y1/exec';

export function resolveSurveyEndpoint(explicitEndpoint = '') {
  return explicitEndpoint?.trim() || import.meta.env.VITE_SURVEY_ENDPOINT_URL?.trim() || FALLBACK_ENDPOINT;
}

async function postJson(endpoint, payload) {
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

  return response;
}

async function postNoCors(endpoint, payload) {
  await fetch(endpoint, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify(payload)
  });
}

export async function submitSurveyData(payload, endpoint = '') {
  const targetEndpoint = resolveSurveyEndpoint(endpoint);

  if (!targetEndpoint) {
    throw new Error('Survey endpoint is not configured');
  }

  try {
    await postJson(targetEndpoint, payload);
    return { status: 'sent' };
  } catch (error) {
    if (error instanceof TypeError || String(error?.message || '').toLowerCase().includes('failed to fetch')) {
      await postNoCors(targetEndpoint, payload);
      return { status: 'sent' };
    }

    throw error;
  }
}