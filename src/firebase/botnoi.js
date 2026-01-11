// src/api/botnoi.js

// ✅ Use ONE base URL so staging/prod never mismatch
// Create a .env file and set VITE_BOTNOI_API_BASE=https://api-voice-staging.botnoi.ai
// or VITE_BOTNOI_API_BASE=https://api-voice.botnoi.ai
const BOTNOI_BASE =
  import.meta.env.VITE_BOTNOI_API_BASE || "https://api-voice-staging.botnoi.ai";

const DASHBOARD = `${BOTNOI_BASE}/api/dashboard`;

async function readResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  const raw = contentType.includes("application/json")
    ? await res.json()
    : await res.text();
  return raw;
}

export async function getBotnoiToken(firebaseJwt) {
  const url = `${DASHBOARD}/firebase_auth`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      // ✅ Keep company header (your backend expects it)
      "botnoi-token": `Bearer ${firebaseJwt}`,
    },
  });

  const raw = await readResponse(res);

  console.log("🔥 firebase_auth url:", url);
  console.log("🔥 firebase_auth status:", res.status);
  console.log("🔥 firebase_auth response:", raw);

  if (!res.ok) {
    throw new Error(typeof raw === "string" ? raw : JSON.stringify(raw));
  }

  return raw;
}

export async function getProfile(botnoiJwt) {
  const url = `${DASHBOARD}/get_profile`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      // ✅ IMPORTANT: use same header style as company flow
      // (Some Botnoi endpoints accept Authorization, some accept botnoi-token)
      "botnoi-token": `Bearer ${botnoiJwt}`,
      Authorization: `Bearer ${botnoiJwt}`,
    },
  });

  const raw = await readResponse(res);

  console.log("🔥 get_profile url:", url);
  console.log("🔥 get_profile status:", res.status);
  console.log("🔥 get_profile response:", raw);

  if (!res.ok) {
    throw new Error(typeof raw === "string" ? raw : JSON.stringify(raw));
  }

  return raw;
}
