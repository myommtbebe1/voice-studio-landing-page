export async function getBotnoiToken(firebaseJwt) {
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
    throw new Error(`firebase_auth failed: ${res.status} ${txt}`);
  }

  // could be JSON or plain text
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await res.json();
  } else {
    return await res.text();
  }
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
