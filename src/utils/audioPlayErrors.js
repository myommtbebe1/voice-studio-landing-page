/**
 * HTMLMediaElement.play() rejects if pause() runs before playback starts.
 * That is normal user behavior — do not treat as failure or show alerts.
 */
export function shouldIgnorePlayAbortError(error) {
  if (!error) return false;
  if (error.name === "AbortError") return true;
  return /interrupted by a call to pause/i.test(String(error.message || ""));
}
