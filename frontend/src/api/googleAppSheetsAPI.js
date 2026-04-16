const FALLBACK_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzQ8XGT2ZLklIMdSVzSdGo0DwanlaGFQ8Yxtrx9uw35Kqb8dP6uJGeDph3d8YtESW4/exec';

export function resolveSurveyEndpoint(explicitEndpoint = '') {
  return explicitEndpoint?.trim() || import.meta.env.VITE_SURVEY_ENDPOINT_URL?.trim() || FALLBACK_ENDPOINT;
}

async function postJson(endpoint, payload) {
  console.log('[Survey API] Sending to endpoint via no-cors (skips preflight)', endpoint);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    console.log('[Survey API] ✓ No-cors request sent successfully (response not readable due to CORS policy)');
    return response;
  } catch (error) {
    console.error('[Survey API] Fetch failed:', error.message);
    throw error;
  }
}

async function postNoCors(endpoint, payload) {
  console.log('[Survey API] Fallback: sending via no-cors mode', endpoint);
  try {
    await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });
    console.log('[Survey API] ✓ Fallback no-cors request sent (result unverified)');
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
    console.log('[Survey API] ✓ Submission successful');
    return { status: 'sent' };
  } catch (error) {
    console.warn('[Survey API] Primary method failed, attempting fallback:', error.message);
    try {
      await postNoCors(targetEndpoint, payload);
      console.log('[Survey API] ✓ Submission sent via fallback');
      return { status: 'sent' };
    } catch (corsError) {
      console.error('[Survey API] ✗ Both submission methods failed:', corsError.message);
      throw new Error(`Survey submission failed: ${error.message}`);
    }
  }
}