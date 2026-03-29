// In-flight dedupe (same JWT, parallel callers) + short TTL cache (navigation remounts)
const inFlightTokenRequests = new Map();
const botnoiTokenResultCache = new Map();
const BOTNOI_TOKEN_TTL_MS = 5 * 60 * 1000;

const VOICE_API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_VOICE_API_BASE_URL) ||
  "https://api-voice.botnoi.ai";

export async function getBotnoiToken(firebaseJwt) {
  if (!firebaseJwt || firebaseJwt.trim() === '') {
    throw new Error('Firebase JWT token is required but was not provided');
  }

  const now = Date.now();
  const cached = botnoiTokenResultCache.get(firebaseJwt);
  if (cached && now - cached.at < BOTNOI_TOKEN_TTL_MS) {
    return cached.value;
  }

  if (inFlightTokenRequests.has(firebaseJwt)) {
    return inFlightTokenRequests.get(firebaseJwt);
  }

  const request = (async () => {
    const res = await fetch(
      `${String(VOICE_API_BASE_URL).replace(/\/$/, "")}/api/dashboard/firebase_auth`,
      {
        method: "GET",
        headers: {
          "botnoi-token": `Bearer ${firebaseJwt}`,
        },
      }
    );

    if (!res.ok) {
      const txt = await res.text();
      console.error(`Botnoi token request failed: ${res.status}`, txt);
      throw new Error(`firebase_auth failed: ${res.status} ${txt}`);
    }

    // could be JSON or plain text
    const contentType = res.headers.get("content-type") || "";
    let tokenResult;
    if (contentType.includes("application/json")) {
      tokenResult = await res.json();
      console.log('Botnoi token response (JSON):', typeof tokenResult, Object.keys(tokenResult || {}));
    } else {
      tokenResult = await res.text();
      console.log('Botnoi token response (text):', typeof tokenResult, tokenResult ? `${tokenResult.substring(0, 20)}...` : 'empty');
    }

    // Log for debugging (remove in production if sensitive)
    if (!tokenResult) {
      console.warn('Botnoi token response is empty or undefined');
    }

    botnoiTokenResultCache.set(firebaseJwt, { value: tokenResult, at: Date.now() });
    return tokenResult;
  })();

  // Store the promise to deduplicate concurrent requests
  inFlightTokenRequests.set(firebaseJwt, request);

  try {
    return await request;
  } finally {
    // Clean up the promise cache after completion
    inFlightTokenRequests.delete(firebaseJwt);
  }
}

export async function getProfile(botnoiJwt) {
  const res = await fetch(`${String(VOICE_API_BASE_URL).replace(/\/$/, "")}/api/dashboard/get_profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${botnoiJwt}`,
    },
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`get_profile failed: ${res.status} ${txt}`);
  }

  return await res.json();
}
