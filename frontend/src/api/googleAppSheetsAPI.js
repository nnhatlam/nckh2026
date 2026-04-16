const FALLBACK_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxT8bvc7CBEp-LlwKXdYZnFdWytU2dVq2SvX4LLc0NOX-uMj8HdHqdGamR-ZX3nT-Y1/exec';

export function resolveSurveyEndpoint(explicitEndpoint = '') {
  return explicitEndpoint?.trim() || import.meta.env.VITE_SURVEY_ENDPOINT_URL?.trim() || FALLBACK_ENDPOINT;
}

async function postJson(endpoint, payload) {
  console.log('[Survey API] Sending to endpoint via JSON', endpoint);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('[Survey API] Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '(no response body)');
      console.error('[Survey API] Server error:', errorText);
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    const result = await response.json().catch(() => ({}));
    console.log('[Survey API] Server response:', result);
    return response;
  } catch (error) {
    console.error('[Survey API] Fetch failed:', error.message);
    throw error;
  }
}

async function postNoCors(endpoint, payload) {
  console.log('[Survey API] Sending to endpoint via no-cors mode', endpoint);
  try {
    await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });
    console.log('[Survey API] No-cors request sent (response not readable due to CORS policy)');
  } catch (error) {
    console.error('[Survey API] No-cors fetch failed:', error.message);
    throw error;
  }
}

export async function submitSurveyData(payload, endpoint = '') {
  const targetEndpoint = resolveSurveyEndpoint(endpoint);

  if (!targetEndpoint) {
    throw new Error('Survey endpoint is not configured');
  }

  console.log('[Survey API] Starting submission to:', targetEndpoint);
  console.log('[Survey API] Payload:', JSON.stringify(payload, null, 2));

  try {
    await postJson(targetEndpoint, payload);
    console.log('[Survey API] ✓ Submission successful via JSON');
    return { status: 'sent' };
  } catch (error) {
    console.warn('[Survey API] JSON submission failed, attempting no-cors fallback:', error.message);
    try {
      await postNoCors(targetEndpoint, payload);
      console.log('[Survey API] ✓ Submission sent via no-cors (result unverified)');
      return { status: 'sent' };
    } catch (corsError) {
      console.error('[Survey API] ✗ Both submission methods failed:', corsError.message);
      throw new Error(`Survey submission failed: ${error.message}`);
    }
  }
}