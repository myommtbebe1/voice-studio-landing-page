/**
 * voiceApi.js
 * Voice + Workspace API service (staging)
 */

const VOICE_API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_VOICE_API_BASE_URL) ||
  "https://api-voice.ibotnoi.com";
const VOICE_API_ORIGIN = String(VOICE_API_BASE_URL).replace(/\/$/, "");

/* ----------------------------- Helpers ----------------------------- */

function assertBnToken(bnToken) {
  if (!bnToken || bnToken.trim() === "") {
    throw new Error("Botnoi token (bnToken) is required but was not provided");
  }
}

function authHeader(bnToken) {
  assertBnToken(bnToken);

  // Debug preview (safe): helps you confirm token is not undefined/empty
  console.log(
    "🔑 bnToken preview:",
    bnToken.slice(0, 10),
    "...",
    bnToken.slice(-6)
  );

  return { Authorization: `Bearer ${bnToken}` };
}

async function readErrorText(res) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

/* ----------------------------- Speakers API ----------------------------- */

export async function getAllSpeakersV1(bnToken) {
  assertBnToken(bnToken);

  const res = await fetch(
    `${VOICE_API_ORIGIN}/api/marketplace/get_all_marketplace`,
    {
      method: "GET",
      headers: {
        ...authHeader(bnToken),
      },
    }
  );

  if (!res.ok) {
    const txt = await readErrorText(res);
    throw new Error(`get_all_marketplace failed: ${res.status} ${txt}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data : (data?.data ?? data?.speakers ?? data?.results ?? []);
}

export async function getAllSpeakersV2(bnToken) {
  assertBnToken(bnToken);

  const res = await fetch(
    `${VOICE_API_ORIGIN}/api/marketplace/get_all_marketplace_v2`,
    {
      method: "GET",
      headers: {
        ...authHeader(bnToken),
      },
    }
  );

  if (!res.ok) {
    const txt = await readErrorText(res);
    throw new Error(`get_all_marketplace_v2 failed: ${res.status} ${txt}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data : (data?.data ?? data?.speakers ?? data?.results ?? []);
}

export async function getAllSpeakers(bnToken, languages = ["en", "my"]) {
  const [v1, v2] = await Promise.all([
    getAllSpeakersV1(bnToken).catch(() => []),
    getAllSpeakersV2(bnToken).catch(() => []),
  ]);

  const v1Array = Array.isArray(v1) ? v1 : [];
  const v2Array = Array.isArray(v2) ? v2 : [];

  const all = [
    ...v1Array.map((s) => ({ ...s, isV2: false })),
    ...v2Array.map((s) => ({ ...s, isV2: true })),
  ];

  if (!languages?.length) return all;

  return all.filter((speaker) => {
    const available = speaker.available_language || [];
    return languages.some((lang) => available.includes(lang));
  });
}

/* ----------------------------- Voice Generation API ----------------------------- */

function mapLanguageCode(lang) {
  const languageMap = {
    en: "en",
    my: "my",
    "my-MM": "my-MM",
    mya: "mya",
  };
  return languageMap[lang] || lang;
}

export async function generateVoice(bnToken, options) {
  assertBnToken(bnToken);

  const {
    text,
    speaker,
    language = "en",
    speed = 1.0,
    volume = 100,
    type_media = "mp3",
    speaker_v2 = false,
  } = options || {};

  if (!text || String(text).trim() === "") throw new Error("text is required");
  if (speaker === undefined || speaker === null || String(speaker).trim() === "")
    throw new Error("speaker is required");

  const apiLanguage = mapLanguageCode(language);
  const audio_id = Math.random().toString(36).substring(2, 7).toUpperCase();

  const payload = {
    audio_id,
    emotion_id: "",
    pitch_file: false,
    transfer: false,
    speaker_v2,
    text,
    text_delay: text,
    speaker: String(speaker),
    volume: String(volume),
    speed: String(speed),
    type_media,
    language: apiLanguage,
    
  };

  const res = await fetch(
    `${VOICE_API_ORIGIN}/voice/v1/generate_voice?provider=studio`,
    {
      method: "POST",
      headers: {
        ...authHeader(bnToken),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const txt = await readErrorText(res);
    throw new Error(`generate_voice failed: ${res.status} ${txt}`);
  }

  // API might return JSON with a URL
  const contentType = res.headers.get("Content-Type") || "";
  if (contentType.includes("application/json")) {
    const json = await res.json();
    const audioUrl = json?.data;
    if (!audioUrl) throw new Error(`Unexpected JSON response: ${JSON.stringify(json)}`);

    const audioRes = await fetch(audioUrl);
    if (!audioRes.ok) {
      throw new Error(`Failed to fetch audio URL: ${audioRes.status} ${audioRes.statusText}`);
    }
    const blob = await audioRes.blob();
    // Return both blob and persistent URL so it can be saved
    return { blob, persistentUrl: audioUrl, audio_id };
  }

  // Or direct blob - in this case there's no persistent URL
  const blob = await res.blob();
  return { blob, persistentUrl: null, audio_id };
}

/* ----------------------------- Workspace API (FIXED) ----------------------------- */
/**
 * IMPORTANT FLOW:
 * 1) getAllWorkspaces(bnToken)  -> choose a workspace_id from the returned list
 * 2) getWorkspaceContent(bnToken, workspace_id)
 * If you use a workspace_id that is not yours, backend can return 403.
 */

const WS_BASE = `${VOICE_API_ORIGIN}/api/workspace`;

export async function getAllWorkspaces(bnToken) {
  if (!bnToken || bnToken.trim() === '') {
    throw new Error('Botnoi token is required');
  }

  const endpoint = `${VOICE_API_ORIGIN}/api/workspace/get_all_workspace`;
  console.log('🔍 Fetching workspaces from:', endpoint);

  const res = await fetch(endpoint, {
    method: "GET",
    headers: { Authorization: `Bearer ${bnToken}` },
  });

  console.log('📡 get_all_workspace status:', res.status, res.statusText);

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`get_all_workspace failed: ${res.status} ${txt}`);
  }

  const json = await res.json();
  console.log('📦 RAW get_all_workspace JSON:', json);

  // ✅ Extract array from many possible shapes
  const pickArray = (v) => (Array.isArray(v) ? v : null);

  const arr =
    pickArray(json) ||
    pickArray(json?.data) ||
    pickArray(json?.data?.data) ||
    pickArray(json?.result) ||
    pickArray(json?.results) ||
    pickArray(json?.workspaces) ||
    pickArray(json?.payload) ||
    pickArray(json?.payload?.data) ||
    null;

  if (arr) return arr;

  // ✅ last resort: deep search first array found
  const deepFindArray = (obj, depth = 0) => {
    if (!obj || typeof obj !== "object" || depth > 4) return null;
    if (Array.isArray(obj)) return obj;
    for (const v of Object.values(obj)) {
      const found = deepFindArray(v, depth + 1);
      if (found) return found;
    }
    return null;
  };

  return deepFindArray(json) || [];
}


export async function createWorkspace(bnToken, options) {
  assertBnToken(bnToken);

  const { workspace_id, workspace, type_workspace = "conversation" } = options || {};
  if (!workspace || workspace.trim() === "") throw new Error("workspace (name) is required");

  const payload = {
    workspace_id:
      workspace_id || Math.random().toString(36).substring(2, 7).toUpperCase(),
    workspace: workspace.trim(),
    type_workspace, // must be "conversation"
  };

  const endpoint = `${WS_BASE}/insert_workspace`;
  console.log("🆕 POST insert_workspace:", endpoint, payload);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      ...authHeader(bnToken),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  console.log("📡 insert_workspace status:", res.status, res.statusText);

  if (!res.ok) {
    const txt = await readErrorText(res);
    throw new Error(`insert_workspace failed: ${res.status} ${txt}`);
  }

  return await res.json();
}

export async function deleteWorkspace(bnToken, workspace_id) {
  assertBnToken(bnToken);

  if (!workspace_id || workspace_id.trim() === "") {
    throw new Error("workspace_id is required");
  }

  const endpoint = `${WS_BASE}/delete_workspace`;
  const payload = { workspace_id };

  console.log("🗑️ POST delete_workspace:", endpoint, payload);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      ...authHeader(bnToken),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  console.log("📡 delete_workspace status:", res.status, res.statusText);

  if (!res.ok) {
    const txt = await readErrorText(res);
    throw new Error(`delete_workspace failed: ${res.status} ${txt}`);
  }

  return await res.json();
}

export async function getWorkspaceContent(bnToken, workspace_id) {
  assertBnToken(bnToken);

  if (!workspace_id || workspace_id.trim() === "") {
    throw new Error("workspace_id is required");
  }

  const endpoint = `${WS_BASE}/get_workspace?workspace_id=${encodeURIComponent(workspace_id)}`;
  console.log("📄 GET get_workspace:", endpoint);

  const res = await fetch(endpoint, {
    method: "GET",
    headers: { ...authHeader(bnToken) },
  });

  console.log("📡 get_workspace status:", res.status, res.statusText);

  if (!res.ok) {
    const txt = await readErrorText(res);
    throw new Error(`get_workspace failed: ${res.status} ${txt}`);
  }

  const data = await res.json();

  // common patterns:
  // { text_list: [...] } OR { data: { text_list: [...] } }
  const text_list =
    (Array.isArray(data?.text_list) && data.text_list) ||
    (Array.isArray(data?.data?.text_list) && data.data.text_list) ||
    (Array.isArray(data) && data) ||
    [];

  return { ...data, text_list };
}

export async function saveWorkspaceText(bnToken, options) {
  assertBnToken(bnToken);

  const { workspace_id, text_list } = options || {};
  if (!workspace_id || workspace_id.trim() === "") {
    throw new Error("workspace_id is required");
  }
  if (!Array.isArray(text_list)) {
    throw new Error("text_list must be an array");
  }

  const endpoint = `${WS_BASE}/workspace_text_save`;
  const payload = { workspace_id, text_list };

  console.log("💾 POST workspace_text_save:", endpoint, {
    workspace_id,
    text_list_count: text_list.length,
    text_list_sample: text_list.length > 0 ? text_list[0] : null
  });

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      ...authHeader(bnToken),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  console.log("📡 workspace_text_save status:", res.status, res.statusText);

  if (!res.ok) {
    const txt = await readErrorText(res);
    console.error("❌ workspace_text_save error details:", {
      status: res.status,
      statusText: res.statusText,
      errorBody: txt,
      payload: JSON.stringify(payload, null, 2)
    });
    throw new Error(`workspace_text_save failed: ${res.status} ${txt}`);
  }

  return await res.json();
}

/* ----------------------------- Packages API (level 1, 2, 3) ----------------------------- */

const PACKAGES_ENDPOINT =
  typeof import.meta !== "undefined" && import.meta.env?.DEV
    ? "/api-voice-proxy/api/payment/v2/get_all_package"
    : `${VOICE_API_ORIGIN}/api/payment/v2/get_all_package`;

/**
 * Normalize a single package from API (supports level or package_level).
 * API stores package level as 1, 2, or 3.
 */
function normalizePackage(pkg) {
  const level = pkg.level ?? pkg.package_level ?? pkg.packageLevel;
  const points = pkg.points ?? pkg.point ?? 0;
  const price = pkg.price ?? pkg.price_usd ?? pkg.currentPrice ?? pkg.discountedPrice ?? 0;
  return {
    level: Number(level),
    points: Number(points),
    price: Number(price),
    originalPrice: pkg.originalPrice ?? pkg.original_price ?? null,
    noAds: pkg.noAds ?? pkg.no_ads ?? pkg.noAdsMonth ?? null,
    coins: pkg.coins ?? pkg.coin ?? 0,
    timeLeft: pkg.timeLeft ?? pkg.time_left ?? null,
    ...pkg,
  };
}

/**
 * Fetch packages from API (GET with Authorization: Bearer + bn_token).
 * Packages are stored with level 1, 2, or 3.
 * Returns array of { level, points, price, ... } sorted by level.
 */
export async function getPackages(bnToken) {
  assertBnToken(bnToken);

  const res = await fetch(PACKAGES_ENDPOINT, {
    method: "GET",
    headers: { ...authHeader(bnToken) },
  });

  if (!res.ok) {
    const txt = await readErrorText(res);
    throw new Error(`getPackages failed: ${res.status} ${txt}`);
  }

  const data = await res.json();
  const rawList = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.packages)
        ? data.packages
        : [];

  const packages = rawList.map(normalizePackage).filter((p) => p.level >= 1 && p.level <= 3);
  return packages.sort((a, b) => a.level - b.level);
}
