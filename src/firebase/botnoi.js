export async function getBotnoiToken(firebaseJwt) {
  if (!firebaseJwt || firebaseJwt.trim() === '') {
    throw new Error('Firebase JWT token is required but was not provided');
  }

  const res = await fetch(
    "https://api-voice-staging.botnoi.ai/api/dashboard/firebase_auth",
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
  
  return tokenResult;
}

export async function getProfile(botnoiJwt) {
  const res = await fetch("https://api-voice.botnoi.ai/api/dashboard/get_profile", {
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
