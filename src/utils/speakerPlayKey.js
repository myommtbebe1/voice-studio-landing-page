/** V1 and V2 marketplaces can reuse the same numeric speaker_id — keys must be unique in UI state. */
export function getSpeakerPlayKey(speaker) {
  if (!speaker || speaker.speaker_id == null) return null;
  return `${String(speaker.speaker_id)}_${speaker.isV2 === true ? "v2" : "v1"}`;
}

export function playKeyFromWorkspaceSpeaker(speakerId, speakerV2) {
  if (speakerId == null || speakerId === "") return null;
  const v2 =
    speakerV2 === true ||
    speakerV2 === "true" ||
    speakerV2 === 1 ||
    speakerV2 === "1";
  return `${String(speakerId)}_${v2 ? "v2" : "v1"}`;
}

/**
 * Resolve a speaker from the merged marketplace list.
 * Supports composite keys ("4_v2") and legacy numeric ids (first v1 match).
 */
export function findSpeakerByPlayKey(speakers, key) {
  if (key == null || !Array.isArray(speakers)) return undefined;
  const k = String(key);
  const exact = speakers.find((s) => getSpeakerPlayKey(s) === k);
  if (exact) return exact;
  if (/^\d+$/.test(k)) {
    return speakers.find((s) => String(s.speaker_id) === k && s.isV2 !== true);
  }
  return undefined;
}
