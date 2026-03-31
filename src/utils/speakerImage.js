/**
 * Portrait URLs often point at `bn-voice-pics…amazonaws.com`. Some objects may be
 * unreadable from the browser (GLACIER, AccessDenied, etc.); the API/CDN side must fix that.
 *
 * In dev, optional `/voice-pics-proxy` in vite.config can forward to S3 with a Referer header.
 */
const VOICE_PICS_S3_HOST = "bn-voice-pics.s3.ap-southeast-1.amazonaws.com";

function rewriteVoicePicsPublicBase(url) {
  if (!url || typeof url !== "string" || typeof import.meta === "undefined") {
    return url;
  }
  const base = import.meta.env?.VITE_VOICE_PICS_PUBLIC_BASE;
  if (!base || typeof base !== "string" || !base.trim()) return url;
  try {
    const u = new URL(url);
    if (u.hostname !== VOICE_PICS_S3_HOST) return url;
    const origin = String(base).replace(/\/$/, "");
    return `${origin}${u.pathname}${u.search}`;
  } catch {
    return url;
  }
}

function proxyVoicePicsThroughVite(url) {
  if (
    !url ||
    typeof url !== "string" ||
    typeof import.meta === "undefined" ||
    !import.meta.env?.DEV
  ) {
    return url;
  }
  try {
    const u = new URL(url);
    if (u.hostname !== VOICE_PICS_S3_HOST) return url;
    return `/voice-pics-proxy${u.pathname}${u.search}`;
  } catch {
    return url;
  }
}

function rewriteResolvedS3PortraitUrl(url) {
  if (!url) return url;
  const viaCdn = rewriteVoicePicsPublicBase(url);
  if (viaCdn !== url) return viaCdn;
  return proxyVoicePicsThroughVite(url);
}

/**
 * Marketplace V1/V2 payloads use inconsistent fields for portrait URLs.
 * Resolves the best available URL; prefixes relative paths with VITE_VOICE_API_BASE_URL.
 */
export function resolveSpeakerPortraitUrl(speaker) {
  if (!speaker || typeof speaker !== "object") return null;

  const base =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_VOICE_API_BASE_URL) ||
    "https://api-voice.botnoi.ai";
  const origin = String(base).replace(/\/$/, "");

  const rawCandidates = [
    speaker.image,
    speaker.avatar_img,
    speaker.profile_image,
    speaker.thumbnail,
    speaker.thumbnail_url,
    speaker.photo,
    speaker.avatar,
    speaker.voice_img,
    speaker.img,
    speaker.square_image,
  ];

  for (const raw of rawCandidates) {
    if (typeof raw !== "string" || !raw.trim()) continue;
    const u = raw.trim();
    if (u.startsWith("http://") || u.startsWith("https://"))
      return rewriteResolvedS3PortraitUrl(u);
    if (u.startsWith("//"))
      return rewriteResolvedS3PortraitUrl(`https:${u}`);
    if (u.startsWith("/")) return `${origin}${u}`;
  }

  const fb = speaker.face_bio;
  if (typeof fb === "string") {
    const t = fb.trim();
    if (t.startsWith("http://") || t.startsWith("https://"))
      return rewriteResolvedS3PortraitUrl(t);
  }

  return null;
}
