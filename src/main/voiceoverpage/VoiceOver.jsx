import React, { useState, useEffect, useContext, useRef } from 'react';
import VCHerosection from './VCHerosection';
import VoiceCardsGrid from './VoiceCardsGrid';
import { AuthContext } from "../../contexts/AuthContext.jsx";
import { getBotnoiToken } from "../../firebase/botnoi.js";
import { getAllSpeakers } from "../../firebase/voiceApi.js";

export default function VoiceOver() {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const botnoiTokenRef = useRef(null);
  const audioRef = useRef(null);

  const loadSpeakers = async () => {
    if (!user) return;

    try {
      setLoading(true);
      // Get Firebase JWT token
      const firebaseToken = await user.getIdToken();

      // Get Botnoi token
      const botnoiTokenResponse = await getBotnoiToken(firebaseToken);

      // Extract token - handle various response formats
      let botnoiToken;
      if (typeof botnoiTokenResponse === 'string') {
        botnoiToken = botnoiTokenResponse;
      } else if (botnoiTokenResponse && typeof botnoiTokenResponse === 'object') {
        botnoiToken = botnoiTokenResponse.token
          || botnoiTokenResponse.access_token
          || botnoiTokenResponse.jwt
          || botnoiTokenResponse.data?.token
          || botnoiTokenResponse.data?.access_token
          || JSON.stringify(botnoiTokenResponse);
      } else {
        botnoiToken = botnoiTokenResponse;
      }

      if (!botnoiToken || (typeof botnoiToken === 'string' && botnoiToken.trim() === '')) {
        console.error('Failed to retrieve Botnoi authentication token');
        setLoading(false);
        return;
      }

      // Store token for later use
      botnoiTokenRef.current = botnoiToken;

      // Get all speakers from API (show all voices regardless of language)
      const allSpeakers = await getAllSpeakers(botnoiToken, []);

      // Sort speakers by speaker_id, but put "test" voice at the end
      const sortedSpeakers = allSpeakers.sort((a, b) => {
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

      const deduplicatedSpeakers = Array.from(uniqueSpeakersMap.values());

      setSpeakers(deduplicatedSpeakers);
    } catch (error) {
      console.error("Failed to load speakers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadSpeakers();
    } else {
      setLoading(false);
    }

    // Cleanup audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [user]);

  return (
    <div>
      <VCHerosection speakers={speakers} loading={loading} botnoiToken={botnoiTokenRef.current} />
      <VoiceCardsGrid speakers={speakers} loading={loading} botnoiToken={botnoiTokenRef.current} />
    </div>
  );
}