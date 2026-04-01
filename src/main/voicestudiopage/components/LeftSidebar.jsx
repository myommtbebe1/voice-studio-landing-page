import { useState, useRef } from "react";
import { useLanguage } from "../../../hooks/useLanguage.js";

export default function LeftSidebar({
  voices,
  selectedVoiceId,
  setSelectedVoiceId,
  isLoading,
  isOpen = false,
  onClose,
}) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const audioRefs = useRef({});

  const handlePlayPreview = (voiceId, audioUrl) => {
    // Stop any currently playing audio
    Object.values(audioRefs.current).forEach(audio => {
      if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    if (playingAudioId === voiceId) {
      // If clicking the same voice, stop it
      setPlayingAudioId(null);
      return;
    }

    // Play the selected audio
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audioRefs.current[voiceId] = audio;
      audio.play();
      setPlayingAudioId(voiceId);

      audio.onended = () => {
        setPlayingAudioId(null);
      };

      audio.onerror = () => {
        setPlayingAudioId(null);
        console.error("Error playing audio preview");
      };
    }
  };

  const filteredVoices = voices.filter((voice) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      voice.name?.toLowerCase().includes(query) ||
      voice.tagline?.toLowerCase().includes(query) ||
      voice.speaker?.eng_name?.toLowerCase().includes(query) ||
      voice.speaker?.thai_name?.toLowerCase().includes(query)
    );
  });

  return (
    <aside className={`
      fixed lg:relative inset-y-0 left-0
      flex flex-col shrink-0 z-50 lg:z-10
      bg-[#eef2ff] border-r border-indigo-100
      transition-all duration-300 ease-in-out
      w-72 lg:w-72 xl:w-72 2xl:w-80
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Header */}
      <div className="px-3 lg:px-5 py-5 flex justify-between items-center">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Voice Library
        </h2>


        {/* Close button for mobile and tablet */}
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-slate-600 transition-colors"
          aria-label="Close sidebar"
        >
          <span className="material-icons-round text-lg">close</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-2 lg:px-5 pb-5 space-y-6">
        {/* Search */}
        <div className="relative group">
          <span className="absolute left-3 top-2.5 text-indigo-400 material-icons-round text-sm">
            search
          </span>
          <input
            type="text"
            placeholder="Search voices"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-indigo-100 rounded-lg py-2 pl-9 pr-4 text-sm placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 shadow-sm transition-all"
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Voice List */}
        {!isLoading && (
          <div className="space-y-3">
            {filteredVoices.length === 0 ? (
              <div className="text-center text-slate-500 text-sm py-4">
                No voices found
              </div>
            ) : (
              filteredVoices.map((voice) => {
                const active = selectedVoiceId === voice.id;
                const isPlaying = playingAudioId === voice.id;
                const speaker = voice.speaker;
                const uniqueKey = `${voice.id}_${speaker?.isV2 === true ? "v2" : "v1"}`;

                return (
                  <div
                    key={uniqueKey}
                    className={[
                      "w-full rounded-xl shadow-md transition-all duration-300 group relative p-[2px]",
                      active
                        ? "bg-gray-300 shadow-lg"
                        : "bg-gray-300 hover:shadow-lg hover:scale-[1.02]",
                    ].join(" ")}
                  >
                    <div className="w-full h-full rounded-[10px] bg-gradient-to-b from-blue-100 via-blue-200 to-purple-200 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedVoiceId(voice.id);
                        // Close sidebar on mobile and tablet after selection
                        if (onClose) {
                          // Check if we're on mobile/tablet (smaller than lg breakpoint)
                          const isMobileOrTablet = window.matchMedia('(max-width: 1023px)').matches;
                          if (isMobileOrTablet) {
                            onClose();
                          }
                        }
                      }}
                      className="w-full text-left p-2 lg:p-3 flex flex-row items-center gap-2 lg:gap-3 cursor-pointer relative z-10"
                    >
                      {/* Avatar/Image */}
                      {speaker?.image ? (
                        <img
                          src={speaker.image}
                          alt={voice.name}
                          className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover shrink-0 shadow-inner group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <div
                        className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#fcd34d] shrink-0 shadow-inner group-hover:scale-105 transition-transform"
                        style={{ display: speaker?.image ? 'none' : 'block' }}
                      />

                      {/* Text */}
                      <div className="min-w-0 flex-1 relative z-10">
                        <p className="font-bold text-slate-800 text-sm leading-tight truncate">
                          {voice.name} {active && "✓"}
                        </p>
                        <p className="text-slate-600 text-xs truncate">
                          {voice.tagline || ""}
                        </p>
                        {speaker?.eng_gender && (
                          <p className="text-slate-500 text-xs truncate mt-0.5">
                            {speaker.eng_gender} • {speaker.eng_age_style || ""}
                          </p>
                        )}
                      </div>
                    </button>

                    {/* Audio Preview Button */}
                    {speaker?.audio && (
                      <div className="px-2 lg:px-3 pb-2 lg:pb-3 relative z-10">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayPreview(voice.id, speaker.audio);
                          }}
                          className="w-full flex items-center justify-center gap-2 px-2 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/50 rounded-lg text-slate-700 text-xs font-medium transition-colors"
                        >
                          <span className="material-icons-round text-sm">
                            {isPlaying ? "pause" : "play_arrow"}
                          </span>
                          <span>
                            {isPlaying ? "Pause Preview" : "Play Preview"}
                          </span>
                        </button>
                      </div>
                    )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
