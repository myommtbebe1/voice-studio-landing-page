import React, { useState,useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faSquare, faSpinner } from "@fortawesome/free-solid-svg-icons";
import {  generateVoice } from "../../firebase/voiceApi.js";
import { useLanguage } from "../../hooks/useLanguage.js";

export default function VCHerosection({ speakers, loading, botnoiToken }) {
  const [playingId, setPlayingId] = useState(null);
  const [generatingId, setGeneratingId] = useState(null);

  const { language, t } = useLanguage();

  const audioRef = useRef(null);

  const handlePlayVoice = async (speaker) => {
    const speakerId = speaker.speaker_id;

    // If already playing this speaker, stop it
    if (playingId === speakerId) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingId(null);
      return;
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    try {
      setGeneratingId(speakerId);

      // Check if we have a token from parent
      if (!botnoiToken) {
        alert('Authentication required. Please refresh the page.');
        setGeneratingId(null);
        return;
      }

      // Choose playback language and demo text based on current UI language
      const supportedLanguages = Array.isArray(speaker.available_language)
        ? speaker.available_language
        : [];
      const voiceLanguage =
        language && supportedLanguages.includes(language)
          ? language
          : supportedLanguages[0] || 'en';

      const gender = speaker.eng_gender || speaker.gender || '';
      const myanmarPronoun = gender.toLowerCase().includes('female') ? 'ကျွန်မ' : 'ကျွန်တော်';

      
      const demoText =
        voiceLanguage === 'my'
          ? `ဟယ်လို! ${myanmarPronoun}  အေအိုင် အသံအကူအညီ ပေးသူ ဖြစ်ပါတယ်။`
          : `Hello!  I am an AI voice assistant.`;

      console.log('Hero speaker data:', speaker);

      // Generate voice using your API
      const result = await generateVoice(botnoiToken, {
        text: demoText,
        speaker: speaker.speaker_id,
        language: voiceLanguage,
        speed: 1.0,
        volume: 100,
        type_media: 'mp3',
        speaker_v2: speaker.isV2 || false
      });

      // Create audio element from blob or URL
      const audio = new Audio();

      if (result.blob) {
        // If we have a blob, create object URL
        const audioUrl = URL.createObjectURL(result.blob);
        audio.src = audioUrl;
      } else if (result.persistentUrl) {
        // If we have a persistent URL, use it directly
        audio.src = result.persistentUrl;
      }

      audioRef.current = audio;

      // Handle audio events
      audio.onplay = () => {
        setPlayingId(speakerId);
        setGeneratingId(null);
      };

      audio.onended = () => {
        setPlayingId(null);
        audioRef.current = null;
      };

      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setPlayingId(null);
        setGeneratingId(null);
        audioRef.current = null;
        alert('Failed to play audio. Please try again.');
      };

      // Start playing
      await audio.play();

    } catch (error) {
      console.error('Failed to generate voice:', error);
      setGeneratingId(null);
      setPlayingId(null);
      alert(`Failed to generate voice: ${error.message}`);
    }
  };



  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative flex flex-col lg:flex-row items-center justify-start w-full min-h-[540px]">
        <div className="flex-1 max-w-2xl w-full flex justify-center lg:justify-start items-center px-6 sm:px-8 lg:px-[56px] pt-10 lg:pt-[20px] pb-8 lg:pb-[36px]">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 lg:mb-6">
              AI voice
            </h1>

            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4 lg:mb-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                {t('voiceover.over400Voices')}
              </h2>
              <span className="px-3 py-1 bg-purple-100 text-purple-600 text-sm font-semibold rounded-full">
                {t('voiceover.free')}
              </span>
            </div>

            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
              {t('voiceover.heroSubtitle')}
            </p>
          </div>
        </div>

        {/* right side - speaker photos */}
        <div className="flex-1 w-full flex flex-col justify-center items-center lg:items-end px-6 sm:px-8 lg:pr-[56px] pb-10 lg:pb-0">
          <div className="relative flex items-center justify-center gap-6 sm:gap-8 mt-6 lg:mt-0">
            {loading ? (
              <div className="flex gap-6 sm:gap-8">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={`relative ${i === 2 ? 'hidden sm:block' : ''}`}>
                    <div className="relative w-[180px] h-[320px] rounded-full bg-gray-200 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              speakers.slice(0, 3).map((speaker, index) => (
                <div
                  key={speaker.speaker_id ? `${speaker.speaker_id}_${speaker.isV2 ? 'v2' : 'v1'}` : index}
                  className={`relative group ${index === 2 ? 'hidden sm:block' : ''}`}
                  style={{
                    transform: index === 1 ? 'translateY(20px)' : 'translateY(0)',
                    zIndex: speakers.length - index
                  }}
                >
                  {/* Speaker Image */}
                  <div className="relative w-[180px] h-[320px] rounded-full overflow-hidden shadow-xl">
                    {speaker.image ? (
                      <img
                        src={speaker.image}
                        alt={speaker.eng_name || speaker.thai_name || `Speaker ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                        {(speaker.eng_name || speaker.thai_name || 'V').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Play Button */}
                  <button
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 
                         w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 
                         rounded-full flex items-center justify-center
                         shadow-lg hover:shadow-xl hover:scale-110 
                         transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    onClick={() => handlePlayVoice(speaker)}
                    disabled={generatingId === speaker.speaker_id}
                  >
                    {generatingId === speaker.speaker_id ? (
                      <FontAwesomeIcon icon={faSpinner} className="w-6 h-6 text-white animate-spin" />
                    ) : playingId === speaker.speaker_id ? (
                      <FontAwesomeIcon icon={faSquare} className="w-5 h-5 text-white" />
                    ) : (
                      <FontAwesomeIcon icon={faPlay} className="w-6 h-6 text-white ml-1" />
                    )}
                  </button>

                  {/* Speaker Name Tooltip */}
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
                      {speaker.eng_name || speaker.thai_name || `Speaker ${index + 1}`}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

