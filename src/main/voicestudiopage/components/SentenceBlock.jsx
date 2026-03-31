import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../../hooks/useLanguage.js";
import { resolveSpeakerPortraitUrl } from "../../../utils/speakerImage.js";
import Emotionstyle from "./emotionstyle.jsx";

export default function SentenceBlock({
  id,
  text,
  setText,
  selectedVoiceId,
  setSelectedVoiceId,
  language,
  setLanguage,
  speed,
  setSpeed,
  volume,
  setVolume,
  onGenerate,
  isGenerating,
  onDelete,
  onOpenVoiceSelector,
  onEdit,
  speakers = [],
  outputs = [],
  formatTime,
}) {
  const { t } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // Format time helper
  const formatTimeHelper = formatTime || ((totalSeconds) => {
    const s = Math.max(0, Number(totalSeconds) || 0);
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(Math.floor(s % 60)).padStart(2, "0");
    return `${mm}:${ss}`;
  });

  // Handle audio playback
  useEffect(() => {
    const playingOutput = outputs.find(output => output.id === playingId);
    
    if (playingOutput?.audioUrl && playingId) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      
      const audio = new Audio();
      audioRef.current = audio;
      
      if (playingOutput.volume !== undefined) {
        audio.volume = Math.min(playingOutput.volume / 100, 1);
      } else {
        audio.volume = 1.0;
      }
      
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      audio.src = playingOutput.audioUrl;
      
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };
      
      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      audio.onended = () => {
        setPlayingId(null);
        setCurrentTime(0);
        setDuration(0);
      };
      
      audio.onerror = () => {
        console.error('Error playing audio');
        setPlayingId(null);
      };
      
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
        setPlayingId(null);
      });
      
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setCurrentTime(0);
      setDuration(0);
    }
  }, [playingId, outputs]);

  const handlePlayPause = (outputId) => {
    if (playingId === outputId) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingId(null);
    } else {
      setPlayingId(outputId);
    }
  };

  const handleDownload = (output) => {
    if (output.blob) {
      const url = URL.createObjectURL(output.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = output.name || 'voice-output.mp3';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (output.audioUrl) {
      const a = document.createElement('a');
      a.href = output.audioUrl;
      a.download = output.name || 'voice-output.mp3';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Calculate points (example: 1 point per 10 characters)
  const calculatePoints = (text) => {
    return Math.ceil((text.length || 0) / 10);
  };

  const calculateUSD = (points) => {
    // Example: 1 point = 0.00075 USD
    return (points * 0.00075).toFixed(3);
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    if (newText.length <= 1000) {
      setText(newText);
    }
  };

  const characterCount = text.length;
  // Find speaker - handle both string and number types for speaker_id matching
  const selectedSpeaker = speakers.find(s => {
    if (!selectedVoiceId) return false;
    // Convert both to string for comparison to handle type mismatches
    return String(s.speaker_id) === String(selectedVoiceId) || s.speaker_id === selectedVoiceId;
  });

  const blockPortrait = selectedSpeaker
    ? resolveSpeakerPortraitUrl(selectedSpeaker)
    : null;
  const voiceDisplayName = selectedSpeaker
    ? String(
        selectedSpeaker.eng_name ||
          selectedSpeaker.speaker_name ||
          selectedSpeaker.thai_name ||
          ""
      ).trim()
    : "";

  // Debug logging
  if (!selectedSpeaker && selectedVoiceId) {
    console.log('⚠️ Speaker not found:', {
      selectedVoiceId,
      selectedVoiceIdType: typeof selectedVoiceId,
      availableSpeakerIds: speakers.map(s => ({ id: s.speaker_id, type: typeof s.speaker_id, name: s.eng_name || s.speaker_name }))
    });
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4">
      {/* Avatar and Voice Selection */}
      <div className="flex items-start gap-3 mb-3">
        <button
          type="button"
          onClick={() => {
            if (onOpenVoiceSelector) {
              onOpenVoiceSelector(id);
            }
          }}
          className="flex flex-col items-center gap-1 flex-shrink-0 w-[4.75rem] cursor-pointer hover:opacity-80 transition-opacity text-center"
          title={
            voiceDisplayName
              ? voiceDisplayName
              : t("voicestudio.editor.selectVoice")
          }
        >
          {blockPortrait ? (
            <>
              <img
                src={blockPortrait}
                alt={voiceDisplayName || t("voicestudio.editor.selectVoice")}
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
                onError={(e) => {
                  e.target.style.display = "none";
                  const placeholder = e.target.parentElement?.querySelector(
                    ".avatar-placeholder"
                  );
                  if (placeholder) placeholder.style.display = "flex";
                }}
              />
              <div
                className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center avatar-placeholder"
                style={{ display: "none" }}
              >
                <span className="material-icons-round text-slate-400 text-xl">
                  person
                </span>
              </div>
            </>
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
              <span className="material-icons-round text-slate-400 text-xl">
                person
              </span>
            </div>
          )}
          <span className="text-[10px] leading-tight font-semibold text-slate-600 max-w-full px-0.5 line-clamp-2 break-words">
            {voiceDisplayName || t("voicestudio.editor.selectVoice")}
          </span>
        </button>
        <div className="flex-1">
          <textarea
            className="w-full bg-transparent border-none resize-none focus:ring-0 text-base leading-relaxed text-slate-800 placeholder-slate-300 font-normal p-0 outline-none min-h-[60px]"
            placeholder={t("voicestudio.editor.placeholder")}
            value={text}
            onChange={handleTextChange}
            disabled={isGenerating}
          />
          <div className="text-xs font-medium text-slate-400 mt-1">
            {characterCount}/1000 characters
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="border-t border-slate-100 bg-[#DCE2F2] px-3 py-2 rounded-lg space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {/* Language Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              <span className="material-icons-round text-xs text-slate-400">
                flag
              </span>
              {language === 'en' ? 'English' : language === 'my' ? 'Myanmar' : language}
              <span className="material-icons-round text-xs text-slate-400">
                expand_more
              </span>
            </button>
            {showLanguageMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-[120px]">
                <button
                  type="button"
                  onClick={() => {
                    setLanguage('en');
                    setShowLanguageMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
                    language === 'en' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLanguage('my');
                    setShowLanguageMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
                    language === 'my' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                  }`}
                >
                  Myanmar
                </button>
              </div>
            )}
          </div>

          {/* Emotion/Style */}
          <Emotionstyle setShowPremiumPopup={() => {}} />

          {/* Speed Selector */}
          <div className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 whitespace-nowrap">
            <span className="material-icons-round text-xs text-slate-400">
              speed
            </span>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-16 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs">{speed.toFixed(1)}x</span>
          </div>

          {/* Volume Display */}
          <div className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 whitespace-nowrap">
            <span className="material-icons-round text-xs text-slate-400">
              volume_up
            </span>
            <input
              type="range"
              min="0"
              max="200"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-14 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs">{volume}%</span>
          </div>

          {/* Delete Button */}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="flex items-center justify-center px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors whitespace-nowrap"
            >
              <span className="material-icons-round text-xs text-slate-400">close</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between max-[377px]:flex-col max-[375px]:items-center max-[375px]:gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap max-[375px]:whitespace-normal max-[375px]:w-full max-[375px]:text-center">
            {t("voicestudio.editor.premiumQuota")} <span className="text-indigo-600 ml-1">3 {t("voicestudio.editor.times")}</span>
          </span>

          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating || !text.trim()}
            className={`
              px-6 py-2.5
              text-white font-bold rounded-full shadow-lg
              bg-gradient-to-r from-indigo-500 to-purple-600
              hover:from-indigo-600 hover:to-purple-700
              hover:shadow-xl hover:-translate-y-0.5
              transition-all duration-200
              max-[375px]:w-full max-[375px]:px-4 max-[375px]:text-center
              ${isGenerating || !text.trim() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Generating...
              </span>
            ) : (
              t("voicestudio.editor.generate")
            )}
          </button>
        </div>
      </div>

      {/* Generated Outputs */}
      {outputs && outputs.length > 0 && (
        <div className="mt-4 border-t border-slate-200 pt-4 space-y-3">
          {outputs.map((output) => {
            const isPlaying = playingId === output.id;
            const points = calculatePoints(text);
            const usd = calculateUSD(points);
            
            return (
              <div key={output.id} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                {/* Audio Player */}
                <div className="flex items-center gap-3 mb-3">
                  <button
                    type="button"
                    onClick={() => handlePlayPause(output.id)}
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-b from-blue-100 via-blue-200 to-purple-200 hover:from-blue-200 hover:via-blue-300 hover:to-purple-300 text-slate-800 border border-gray-300 transition-all shadow-md"
                  >
                    <span className="material-icons-round text-lg text-slate-700">
                      {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-slate-600">
                        {formatTimeHelper(currentTime)} / {formatTimeHelper(duration || output.durationSec || 0)}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-200 to-purple-300 transition-all duration-100"
                        style={{
                          width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Points and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-700">
                      {points} {t("voicestudio.rightSidebar.points")}
                    </span>
                    <span className="text-xs text-slate-500">
                      ≈ {usd} {t("voicestudio.rightSidebar.usd")}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => {
                          // Stop any playing audio
                          if (audioRef.current) {
                            audioRef.current.pause();
                            audioRef.current.currentTime = 0;
                            audioRef.current = null;
                          }
                          setPlayingId(null);
                          setCurrentTime(0);
                          setDuration(0);
                          
                          // Call the edit handler to clear outputs
                          if (onEdit) {
                            onEdit();
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-b from-blue-100 via-blue-200 to-purple-200 hover:from-blue-200 hover:via-blue-300 hover:to-purple-300 text-slate-800 border border-gray-300 transition-all flex items-center gap-1 font-semibold shadow-md"
                      >
                        <span className="material-icons-round text-sm text-slate-700">edit</span>
                        {t("voicestudio.editor.edit") || "Edit"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDownload(output)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-b from-blue-100 via-blue-200 to-purple-200 hover:from-blue-200 hover:via-blue-300 hover:to-purple-300 text-slate-800 border border-gray-300 transition-all flex items-center gap-1 font-semibold shadow-md"
                    >
                      <span className="material-icons-round text-sm text-slate-700">download</span>
                      {t("voicestudio.rightSidebar.download")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Click outside to close menus */}
      {showLanguageMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowLanguageMenu(false)}
        />
      )}
    </div>
  );
}
