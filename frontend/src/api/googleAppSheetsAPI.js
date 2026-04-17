const GOOGLE_APPS_SCRIPT_WEB_APP_RE = /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec\/?$/i;

function normalizeEndpoint(endpoint = '') {
  return endpoint.trim().replace(/\/+$/, '');
}

function isLikelyGoogleAppsScriptWebApp(endpoint = '') {
  return GOOGLE_APPS_SCRIPT_WEB_APP_RE.test(endpoint);
}

export function resolveSurveyEndpoint(explicitEndpoint = '') {
  const candidate = explicitEndpoint || import.meta.env.VITE_SURVEY_ENDPOINT_URL || '';
  return normalizeEndpoint(candidate);
}

function resolveEndpointSource(explicitEndpoint = '') {
  if (explicitEndpoint && explicitEndpoint.trim()) {
    return 'explicit';
  }

  if (import.meta.env.VITE_SURVEY_ENDPOINT_URL && import.meta.env.VITE_SURVEY_ENDPOINT_URL.trim()) {
    return 'VITE_SURVEY_ENDPOINT_URL';
  }

  return 'unset';
}

async function postCors(endpoint, payload) {
  console.log('[Survey API] Sending to endpoint via cors', endpoint);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    console.log('[Survey API] ✓ CORS request verified by browser');
    return response;
  } catch (error) {
    console.error('[Survey API] CORS fetch failed:', error.message);
    throw error;
  }
}

async function postNoCors(endpoint, payload) {
  console.log('[Survey API] Fallback: sending via no-cors mode (opaque response)', endpoint);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    console.warn('[Survey API] ⚠ No-cors request dispatched. Browser cannot verify delivery/status.', {
      responseType: response.type
    });
  } catch (error) {
    console.error('[Survey API] No-cors fetch failed:', error.message);
    throw error;
  }
}

export async function submitSurveyData(payload, endpoint = '') {
  const targetEndpoint = resolveSurveyEndpoint(endpoint);

  if (!targetEndpoint) {
    throw new Error('Survey endpoint is not configured. Set VITE_SURVEY_ENDPOINT_URL to your deployed Google Apps Script Web App URL ending with /exec.');
  }

  if (!isLikelyGoogleAppsScriptWebApp(targetEndpoint)) {
    throw new Error(`Survey endpoint appears invalid: ${targetEndpoint}. Expected a Google Apps Script Web App URL ending with /exec.`);
  }

  console.log('[Survey API] Endpoint source:', resolveEndpointSource(endpoint));
  console.log('[Survey API] Starting submission to:', targetEndpoint);
  console.log('[Survey API] Payload:', JSON.stringify(payload, null, 2));

  try {
    await postCors(targetEndpoint, payload);
    console.log('[Survey API] ✓ Submission successful (verified)');
    return { status: 'sent' };
  } catch (error) {
    console.warn('[Survey API] Primary CORS method failed, attempting no-cors fallback:', error.message);
    try {
      await postNoCors(targetEndpoint, payload);
      return {
        status: 'sent_unverified',
        warning: `Sent via no-cors fallback after CORS error: ${error.message}`
      };
    } catch (fallbackError) {
      console.error('[Survey API] ✗ Both submission methods failed:', fallbackError.message);
      throw new Error(`Survey submission failed: ${error.message}`);
    }
  }
}