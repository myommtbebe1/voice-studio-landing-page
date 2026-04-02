import React, { useRef, useContext, useState, useEffect } from 'react';
import VCHerosection from './VCHerosection';
import VoiceCardsGrid from './VoiceCardsGrid';
import { AuthContext } from "../../contexts/AuthContext.jsx";
import { useCachedAllSpeakers } from "../../hooks/useCachedAllSpeakers.js";
import { getUserBotnoiToken } from "../../utils/botnoiToken.js";

export default function VoiceOver() {
  const { user } = useContext(AuthContext);
  const audioRef = useRef(null);
  const [botnoiToken, setBotnoiToken] = useState(null);

  // Fetch botnoi token for voice generation (runs once per user)
  useEffect(() => {
    async function fetchToken() {
      if (!user) {
        setBotnoiToken(null);
        return;
      }

      try {
        const token = await getUserBotnoiToken(user);
        setBotnoiToken(token);
      } catch (err) {
        console.error('Failed to get Botnoi token:', err);
        setBotnoiToken(null);
      }
    }

    fetchToken();
  }, [user]);

  // Use cached hook instead of direct API calls
  // This automatically deduplicates marketplace and firebase_auth calls
  const { speakers: rawSpeakers, loading, error } = useCachedAllSpeakers();

  // Sort and deduplicate speakers (move to useMemo to avoid recalculating on every render)
  const speakers = React.useMemo(() => {
    if (!rawSpeakers.length) return [];

    // Sort speakers by speaker_id, but put "test" voice at the end
    const sortedSpeakers = [...rawSpeakers].sort((a, b) => {
      const aIsTest =
        a.speaker_id === "test" ||
        (a.eng_name && a.eng_name.toLowerCase() === "test") ||
        (a.thai_name && a.thai_name.toLowerCase() === "test");
      const bIsTest =
        b.speaker_id === "test" ||
        (b.eng_name && b.eng_name.toLowerCase() === "test") ||
        (b.thai_name && b.thai_name.toLowerCase() === "test");

      if (aIsTest && !bIsTest) return 1;
      if (!aIsTest && bIsTest) return -1;
      if (aIsTest && bIsTest) return 0;

      const idA = parseInt(a.speaker_id) || 0;
      const idB = parseInt(b.speaker_id) || 0;
      if (idA !== idB) return idA - idB;

      const aIsV2 = a.isV2 === true ? 1 : 0;
      const bIsV2 = b.isV2 === true ? 1 : 0;
      if (aIsV2 !== bIsV2) return aIsV2 - bIsV2;

      const aName = (a.eng_name || a.thai_name || '').toLowerCase();
      const bName = (b.eng_name || b.thai_name || '').toLowerCase();
      if (aName !== bName) return aName.localeCompare(bName);

      return 0;
    });

    // Remove duplicates: same speaker_id + isV2 combination should only appear once
    const uniqueSpeakersMap = new Map();
    sortedSpeakers.forEach((speaker) => {
      const uniqueKey = `${speaker.speaker_id}_${speaker.isV2 ? "v2" : "v1"}`;
      if (!uniqueSpeakersMap.has(uniqueKey)) {
        uniqueSpeakersMap.set(uniqueKey, speaker);
      }
    });

    return Array.from(uniqueSpeakersMap.values());
  }, [rawSpeakers]);

  return (
    <div>
      <VCHerosection speakers={speakers} loading={loading} botnoiToken={botnoiToken} />
      <VoiceCardsGrid speakers={speakers} loading={loading} botnoiToken={botnoiToken} />
    </div>
  );
}