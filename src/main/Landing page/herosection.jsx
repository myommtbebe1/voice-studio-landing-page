import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../hooks/useLanguage.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { getBotnoiToken } from "../firebase/botnoi.js";
import { generateVoice, getAllSpeakers } from "../firebase/voiceApi.js";

import "../App.css";

function HeroSection() {
  const { t } = useLanguage();
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState(null);
  const [availableSpeakers, setAvailableSpeakers] = useState([]);
  const [showVoiceDropdown, setShowVoiceDropdown] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Fetch speakers and set default speakers (Polly for English, Yati Teacher for Myanmar)
  useEffect(() => {
    async function fetchDefaultSpeakers() {
      if (!user) return;
      
      try {
        const firebaseToken = await user.getIdToken();
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
          return;
        }
        
        const speakers = await getAllSpeakers(botnoiToken, ['en', 'my']);
        
        // Find Paul (English) and Yati Teacher (Myanmar)
        const paulSpeaker = speakers.find(s => 
          (s.eng_name && s.eng_name.toLowerCase().includes('paul')) ||
          (s.thai_name && s.thai_name.toLowerCase().includes('paul'))
        );
        
        const yatiSpeaker = speakers.find(s => 
          (s.eng_name && s.eng_name.toLowerCase().includes('yati')) ||
          (s.thai_name && s.thai_name.toLowerCase().includes('yati')) ||
          (s.eng_name && s.eng_name.toLowerCase().includes('yati teacher')) ||
          (s.thai_name && s.thai_name.toLowerCase().includes('yati teacher'))
        );
        
        // Set available speakers (Paul and Yati Teacher)
        const testSpeakers = [];
        if (paulSpeaker) testSpeakers.push(paulSpeaker);
        if (yatiSpeaker) testSpeakers.push(yatiSpeaker);
        
        // If we couldn't find the specific speakers, use first two available
        if (testSpeakers.length === 0 && speakers.length >= 2) {
          testSpeakers.push(speakers[0], speakers[1]);
        } else if (testSpeakers.length === 0 && speakers.length === 1) {
          testSpeakers.push(speakers[0]);
        }
        
        setAvailableSpeakers(testSpeakers);
        
        // Set default to Paul (English) if available, otherwise first speaker
        if (paulSpeaker) {
          setSelectedSpeakerId(paulSpeaker.speaker_id);
          setSelectedSpeaker(paulSpeaker);
        } else if (testSpeakers.length > 0) {
          setSelectedSpeakerId(testSpeakers[0].speaker_id);
          setSelectedSpeaker(testSpeakers[0]);
        }
      } catch (err) {
        console.error("Error fetching speakers:", err);
      }
    }
    
    fetchDefaultSpeakers();
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showVoiceDropdown && !event.target.closest('.voice-dropdown-container')) {
        setShowVoiceDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showVoiceDropdown]);

  // Detect Myanmar text
  const detectMyanmarText = (text) => {
    const myanmarRegex = /[\u1000-\u109F]/;
    return myanmarRegex.test(text);
  };

  // Note: Removed auto-switching - users can now manually choose between Polly and Yati Teacher
  // regardless of the text language

  const handleGenerateAudio = async (overrideSpeaker = null) => {
    if (!user) {
      // If not logged in, redirect to login
      const encodedText = encodeURIComponent(text);
      navigate(`/login?redirect=/VoiceStudio&text=${encodedText}`);
      return;
    }

    if (!text.trim()) {
      setError("Please enter some text");
      return;
    }

    if (isGenerating) {
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      // Auto-detect language
      const hasMyanmar = detectMyanmarText(text.trim());
      const language = hasMyanmar ? 'my' : 'en';

      // Get tokens
      const firebaseToken = await user.getIdToken();
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
        throw new Error('Failed to retrieve Botnoi authentication token');
      }

      // Use override speaker if provided, otherwise use selected speaker
      const speakerToUse = overrideSpeaker || selectedSpeaker;
      const speakerIdToUse = overrideSpeaker?.speaker_id || selectedSpeakerId;

      if (!speakerIdToUse) {
        throw new Error("Please wait for voice to load");
      }

      // Get speaker info
      const speakers = await getAllSpeakers(botnoiToken, ['en', 'my']);
      const speakerForGeneration = speakers.find(s => s.speaker_id === speakerIdToUse) || speakerToUse;

      // Generate voice using the selected speaker at normal speed (1.0)
      const audioBlob = await generateVoice(botnoiToken, {
        text: text.trim(),
        speaker: speakerIdToUse,
        language: language,
        speed: 1.0, // Normal speed (1.0 = 1x speed)
        volume: 100,
        type_media: 'mp3',
        speaker_v2: speakerForGeneration?.isV2 || false,
      });

      // Create audio URL
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      // Audio will play only when user clicks the play button in the audio player
    } catch (err) {
      console.error("Error generating voice:", err);
      setError(err.message || "Failed to generate audio");
    } finally {
      setIsGenerating(false);
    }
  };

    return (
        <section className="relative z-10 pt-16 pb-20 px-6">
            <div className="max-w-[1280px] mx-auto">
              <div className={`grid ${user ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-12 lg:gap-20 items-center`}>
                {/* Left: Text */}
                <div className={`flex flex-col gap-8 text-center ${user ? 'lg:text-left' : 'lg:text-center'} ${!user ? 'w-full max-w-3xl mx-auto' : ''}`}>
                  <div className="flex flex-col gap-4">
                    <h1 className="text-[#0d0d1b] text-4xl md:text-6xl lg:text-[56px] font-black leading-[1.2] tracking-[-0.03em] break-words">
                    {t("hero.title")} <span className="text-gradient">{t("hero.small")}</span> 
                    {t("hero.to")} <span className="text-gradient">{t("hero.speech")}</span>
                    </h1>
                    <p className={`text-gray-600 dark:text-gray-400 text-lg md:text-xl font-normal leading-relaxed ${user ? 'max-w-lg mx-auto lg:mx-0' : 'max-w-2xl mx-auto'}`}>
                      {t("hero.subtitle")}
                    </p>
                  </div>
                  <div className={`flex flex-col sm:flex-row gap-4 ${user ? 'justify-center lg:justify-start' : 'justify-center'}`}>
                    <button className="h-14 px-8 rounded-full bg-button-gradient text-white text-base font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-transform">
                      {t("hero.start")}
                    </button>
                    <button className="h-14 px-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[#0d0d1b] dark:text-white text-base font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 justify-center">
                      <FontAwesomeIcon icon={faCirclePlay} />
                      {t("hero.demo")}
                    </button>
                  </div>
                </div>

                {/* Right: Widget - Only show when user is logged in */}
                {user && (
                  <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
                    <div className="absolute -inset-4 bg-linear-to-r from-pink-300 via-purple-300 to-indigo-400 rounded-[2.5rem] blur-xl opacity-30 animate-pulse" />
                    <div className="relative bg-white  rounded-4xl p-6 shadow-2xl border border-white/50">
                      {/* Widget Header */}
                      <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-800 pb-4 relative">
                        <div className="flex items-center gap-3 flex-1">
                          {selectedSpeaker ? (
                            <>
                              <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold overflow-hidden border-2 border-primary">
                                {selectedSpeaker.image ? (
                                  <img
                                    alt={selectedSpeaker.eng_name || selectedSpeaker.thai_name}
                                    className="w-full h-full object-cover"
                                    src={selectedSpeaker.image}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                    {(selectedSpeaker.eng_name || selectedSpeaker.thai_name || 'V').charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-bold dark:text-gray-500">
                                  {selectedSpeaker.eng_name || selectedSpeaker.thai_name || 'Voice'}
                                </div>
                                <div className="text-xs text-green-500 font-medium">
                                  {selectedSpeaker.eng_voice_style?.[0] || selectedSpeaker.voice_style?.[0] || 'Pro Voice'}
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold overflow-hidden border-2 border-primary">
                                <img
                                  alt="AI Voice Avatar"
                                  className="w-full h-full object-cover"
                                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD190318vP5qbrGVlMgcKq-SrSD1ON3sqtkt-3lmF0ChifP2nyGudAEOQCEmct6XMxGCTzX12d4jg0Olh7au8MSvcPrXGkglMGcjpRuAroCnasfQPJSvS98i1MdLve6IlPtLWgPvFNOXfdQPderPi4RyfUq-CbsX6DzJbd856c9A27ljppYREPDvCQWW1P_7v4oY0-RzATYZRluP_18rcU0NsCnqzOTt1baEFz9ROuyRH1IlLk6EPrES1XDWYtSP8sP82w3d2ecOA"
                                />
                              </div>
                              <div>
                                <div className="text-sm font-bold dark:text-gray-500">
                                  Jenny (US)
                                </div>
                                <div className="text-xs text-green-500 font-medium">
                                  Pro Voice
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="relative voice-dropdown-container">
                          <button 
                            onClick={() => setShowVoiceDropdown(!showVoiceDropdown)}
                            className="text-xs font-bold text-gray-500 hover:text-primary flex items-center gap-1"
                          >
                            Change Voice
                            <span className="material-symbols-outlined text-sm">
                              <FontAwesomeIcon icon={faAngleDown} />
                            </span>
                          </button>
                          
                          {/* Voice Dropdown */}
                          {showVoiceDropdown && availableSpeakers.length > 0 && (
                            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg border-2 border-blue-200 shadow-lg z-50 overflow-hidden">
                              {availableSpeakers.map((speaker) => (
                                <button
                                  key={speaker.speaker_id}
                                  onClick={async () => {
                                    setSelectedSpeakerId(speaker.speaker_id);
                                    setSelectedSpeaker(speaker);
                                    setShowVoiceDropdown(false);
                                    
                                    // Auto-generate audio if text is present
                                    if (text.trim() && user) {
                                      // Generate with the selected speaker directly
                                      handleGenerateAudio(speaker);
                                    }
                                  }}
                                  className={`w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                                    selectedSpeakerId === speaker.speaker_id ? 'bg-blue-50' : ''
                                  }`}
                                >
                                  <div className="size-10 rounded-full overflow-hidden border-2 border-blue-200">
                                    {speaker.image ? (
                                      <img
                                        alt={speaker.eng_name || speaker.thai_name}
                                        className="w-full h-full object-cover"
                                        src={speaker.image}
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                        {(speaker.eng_name || speaker.thai_name || 'V').charAt(0).toUpperCase()}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 text-left">
                                    <div className="text-sm font-bold text-gray-800">
                                      {speaker.eng_name || speaker.thai_name || 'Voice'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {speaker.eng_voice_style?.[0] || speaker.voice_style?.[0] || 'Voice'}
                                    </div>
                                  </div>
                                  {selectedSpeakerId === speaker.speaker_id && (
                                    <span className="text-blue-500">✓</span>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Text Input */}
                      <div className="mb-4">
                        <textarea
                          className="w-full h-32 p-4 bg-gray-500  rounded-xl  resize-none focus:ring-2 focus:ring-primary/20 text-gray-700 dark:text-gray-300 text-sm leading-relaxed"
                          placeholder={t("hero.aitext")}
                          value={text}
                          onChange={(e) => {
                            const newText = e.target.value;
                            // Limit to 1000 characters total (including spaces)
                            if (newText.length <= 1000) {
                              setText(newText);
                            }
                          }}
                        /> 
                        <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium px-1">
                          <span>{text.length} chars</span>
                          <span>Free Limit: 1000 chars</span>
                        </div>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                          {error}
                        </div>
                      )}

                      {/* Audio Player */}
                      {audioUrl && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 rounded-lg">
                          <audio controls className="w-full" src={audioUrl} />
                        </div>
                      )}

                      {/* Controls */}
                      <div className="flex gap-3">
                        <button 
                          onClick={handleGenerateAudio}
                          disabled={isGenerating || !text.trim()}
                          className={`flex-1 h-12 bg-primary bg-blue-500 hover:bg-blue-700 text-white rounded-full font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group ${
                            isGenerating || !text.trim() ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {isGenerating ? 'Generating...' : 'Generate Audio'}
                        </button>
                        <button 
                          onClick={() => {
                            const encodedText = encodeURIComponent(text);
                            navigate(`/VoiceStudio${text.trim() ? `?text=${encodedText}` : ''}`);
                          }}
                          className="px-6 h-12 rounded-full flex items-center justify-center bg-gray-500 hover:bg-gray-800 transition-colors text-white font-semibold text-sm"
                        >
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
          </section>
    )
}

export default HeroSection ;