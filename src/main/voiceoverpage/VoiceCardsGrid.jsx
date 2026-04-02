import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faSquare, faSpinner, faChevronLeft, faChevronRight, faChevronDown, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../../hooks/useLanguage.js";
import { shouldIgnorePlayAbortError } from "../../utils/audioPlayErrors.js";
import { getSpeakerPlayKey } from "../../utils/speakerPlayKey.js";
import {
  VOICE_FILTER_LANGUAGE_MAP as languageMap,
  VOICE_FILTER_STYLE_OPTIONS as styleOptions,
  VOICE_FILTER_CATEGORY_OPTIONS as categoryOptions,
  VOICE_FILTER_GENDER_AGE_OPTIONS as genderAgeOptions,
  VOICE_FILTER_VERSION_OPTIONS as versionOptions,
  getSpeakerActionCategories as getActionButtons,
  getSpeakerDescriptor as getDescriptor,
  speakerMatchesMarketplaceFilters,
} from "../../utils/voiceMarketplaceFilters.js";

export default function VoiceCardsGrid({ speakers, loading, botnoiToken }) {
  
  const [playingId, setPlayingId] = useState(null);
  const [generatingId, setGeneratingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredLanguageCard, setHoveredLanguageCard] = useState(null);
  
  const { t } = useLanguage();
  
  // Filter states
  const [upperFilter, setUpperFilter] = useState('all'); // all, premium, new, free
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGenderAge, setSelectedGenderAge] = useState([]);
  const [selectedVersions, setSelectedVersions] = useState([]);
  
  // Dropdown open states
  const [openDropdown, setOpenDropdown] = useState(null);
  
  const audioRef = useRef(null);
  const dropdownRef = useRef(null);
  const cardsGridRef = useRef(null);

  const cardsPerPage = 15; // 3 columns x 5 rows

  // Color palette for card backgrounds
  const cardColors = [
    'bg-yellow-300',
    'bg-blue-200',
    'bg-orange-300',
    'bg-pink-300',
    'bg-purple-300',
    'bg-green-300',
    'bg-cyan-300',
    'bg-amber-400',
    'bg-gray-300',
  ];


  const handlePlayVoice = async (speaker) => {
    const playKey = getSpeakerPlayKey(speaker);

    // If already playing this speaker, stop it
    if (playingId === playKey) {
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

    // Play only the speaker's own default voice clip (no "my name is..." TTS)
    const defaultClipUrl = speaker.audio || speaker.sample_audio || speaker.demo_audio_url || speaker.voice_sample_url;

    if (!defaultClipUrl) {
      alert('Preview not available for this voice.');
      return;
    }

    try {
      setGeneratingId(playKey);
      const audio = new Audio(defaultClipUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setPlayingId(playKey);
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

      await audio.play();
    } catch (error) {
      if (shouldIgnorePlayAbortError(error)) {
        setGeneratingId(null);
        setPlayingId(null);
        return;
      }
      console.error("Failed to play preview:", error);
      setGeneratingId(null);
      setPlayingId(null);
      alert(`Failed to play audio: ${error.message}`);
    }
  };

  const filteredSpeakers = useMemo(() => {
    const criteria = {
      upperFilter,
      searchQuery,
      selectedLanguages,
      selectedStyles,
      selectedCategories,
      selectedGenderAge,
      selectedVersions,
    };
    return speakers.filter((speaker) => speakerMatchesMarketplaceFilters(speaker, criteria));
  }, [
    speakers,
    upperFilter,
    searchQuery,
    selectedLanguages,
    selectedStyles,
    selectedCategories,
    selectedGenderAge,
    selectedVersions,
  ]);

  // Pagination calculations - use filtered speakers
  const totalPages = Math.ceil(filteredSpeakers.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentSpeakers = filteredSpeakers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [upperFilter, searchQuery, selectedLanguages, selectedStyles, selectedCategories, selectedGenderAge, selectedVersions]);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      if (start > 2) {
        pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to the voice cards grid section instead of top of page
      if (cardsGridRef.current) {
        cardsGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Fallback to top if ref not available
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside any dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // Toggle filter selection
  const toggleFilter = (filterType, value) => {
    switch (filterType) {
      case 'language':
        setSelectedLanguages(prev => 
          prev.includes(value) 
            ? prev.filter(l => l !== value)
            : [...prev, value]
        );
        break;
      case 'style':
        setSelectedStyles(prev => 
          prev.includes(value) 
            ? prev.filter(s => s !== value)
            : [...prev, value]
        );
        break;
      case 'category':
        setSelectedCategories(prev => 
          prev.includes(value) 
            ? prev.filter(c => c !== value)
            : [...prev, value]
        );
        break;
      case 'genderAge':
        setSelectedGenderAge(prev => 
          prev.includes(value) 
            ? prev.filter(g => g !== value)
            : [...prev, value]
        );
        break;
      case 'version':
        setSelectedVersions(prev => 
          prev.includes(value) 
            ? prev.filter(v => v !== value)
            : [...prev, value]
        );
        break;
    }
  };

  // Select all / Clear filters
  const handleSelectAll = (filterType) => {
    switch (filterType) {
      case 'language':
        const allLangs = Object.keys(languageMap);
        setSelectedLanguages(selectedLanguages.length === allLangs.length ? [] : allLangs);
        break;
      case 'style':
        setSelectedStyles(selectedStyles.length === styleOptions.length ? [] : [...styleOptions]);
        break;
      case 'category':
        setSelectedCategories(selectedCategories.length === categoryOptions.length ? [] : [...categoryOptions]);
        break;
      case 'genderAge':
        setSelectedGenderAge(selectedGenderAge.length === genderAgeOptions.length ? [] : [...genderAgeOptions]);
        break;
      case 'version':
        setSelectedVersions(selectedVersions.length === versionOptions.length ? [] : [...versionOptions]);
        break;
    }
  };



  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('voiceover.allVoices')}</h2>
      
      {/* Upper Filters: All, Premium, New, Free */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        {['all', 'premium', 'new', 'free'].map((filter) => (
          <button
            key={filter}
            onClick={() => setUpperFilter(filter)}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              upperFilter === filter
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t(`voiceover.${filter}`)}
          </button>
        ))}
      </div>

      {/* Search and Lower Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={t('voiceover.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500 ${
              searchQuery ? 'pl-10 pr-10' : 'pl-10 pr-4'
            }`}
          />
          <FontAwesomeIcon 
            icon={faSearch} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
              aria-label="Clear search"
            >
              <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Lower Filter Dropdowns */}
        <div className="flex gap-2 flex-wrap relative" ref={dropdownRef}>
          {/* Language Filter */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'language' ? null : 'language')}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              {t('voiceover.language')}
              <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
            </button>
            {openDropdown === 'language' && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] p-3 min-w-[260px] max-h-[280px] overflow-y-auto">
                <div className="flex justify-between mb-2">
                  <button
                    onClick={() => handleSelectAll('language')}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {t('voiceover.selectAll')}
                  </button>
                  <button
                    onClick={() => setSelectedLanguages([])}
                    className="text-sm text-gray-600 hover:text-gray-700"
                  >
                    {t('voiceover.clear')}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {Object.entries(languageMap).map(([code, { name, flag }]) => (
                    <button
                      key={code}
                      onClick={() => toggleFilter('language', code)}
                      className={`text-left px-2 py-1.5 rounded text-sm flex items-center gap-2 ${
                        selectedLanguages.includes(code)
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <span>{flag}</span>
                      <span>{name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Style Filter */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'style' ? null : 'style')}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              {t('voiceover.style')}
              <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
            </button>
            {openDropdown === 'style' && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] p-3 min-w-[260px] max-h-[280px] overflow-y-auto">
                <div className="flex justify-between mb-2">
                  <button
                    onClick={() => handleSelectAll('style')}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {t('voiceover.selectAll')}
                  </button>
                  <button
                    onClick={() => setSelectedStyles([])}
                    className="text-sm text-gray-600 hover:text-gray-700"
                  >
                    {t('voiceover.clear')}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {styleOptions.map((style) => (
                    <button
                      key={style}
                      onClick={() => toggleFilter('style', style)}
                      className={`px-2 py-1.5 rounded text-sm text-left ${
                        selectedStyles.includes(style)
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Category Filter */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              {t('voiceover.category')}
              <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
            </button>
            {openDropdown === 'category' && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] p-3 min-w-[260px] max-h-[280px] overflow-y-auto">
                <div className="flex justify-between mb-2">
                  <button
                    onClick={() => handleSelectAll('category')}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {t('voiceover.selectAll')}
                  </button>
                  <button
                    onClick={() => setSelectedCategories([])}
                    className="text-sm text-gray-600 hover:text-gray-700"
                  >
                    {t('voiceover.clear')}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {categoryOptions.map((category) => (
                    <button
                      key={category}
                      onClick={() => toggleFilter('category', category)}
                      className={`px-2 py-1.5 rounded text-sm text-left ${
                        selectedCategories.includes(category)
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Gender/Age Filter */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'genderAge' ? null : 'genderAge')}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              {t('voiceover.genderAge')}
              <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
            </button>
            {openDropdown === 'genderAge' && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] p-3 min-w-[200px] max-h-[220px] overflow-y-auto">
                <div className="flex justify-between mb-2">
                  <button
                    onClick={() => handleSelectAll('genderAge')}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {t('voiceover.selectAll')}
                  </button>
                  <button
                    onClick={() => setSelectedGenderAge([])}
                    className="text-sm text-gray-600 hover:text-gray-700"
                  >
                    {t('voiceover.clear')}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {genderAgeOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => toggleFilter('genderAge', option)}
                      className={`px-2 py-1.5 rounded text-sm text-left ${
                        selectedGenderAge.includes(option)
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Version Filter */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'version' ? null : 'version')}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              {t('voiceover.version')}
              <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
            </button>
            {openDropdown === 'version' && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] p-3 w-[200px] max-h-[160px] overflow-y-auto shrink-0">
                <div className="flex justify-between mb-2">
                  <button
                    onClick={() => handleSelectAll('version')}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {t('voiceover.selectAll')}
                  </button>
                  <button
                    onClick={() => setSelectedVersions([])}
                    className="text-sm text-gray-600 hover:text-gray-700"
                  >
                    {t('voiceover.clear')}
                  </button>
                </div>
                <div className="space-y-1">
                  {versionOptions.map((version) => (
                    <button
                      key={version}
                      onClick={() => toggleFilter('version', version)}
                      className={`w-full px-2 py-1.5 rounded text-sm text-left ${
                        selectedVersions.includes(version)
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {version}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Voice Cards Grid - 3x3 layout */}
      <div ref={cardsGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {loading ? (
          Array.from({ length: cardsPerPage }).map((_, index) => (
            <div key={`skeleton-${index}`} className="rounded-lg shadow-md border border-gray-200 p-1 flex gap-3 min-h-32 items-stretch">
                            <div className="shrink-0 w-32 self-stretch min-h-32 rounded-lg bg-gray-200 animate-pulse" />
              <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                <div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                  <span className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))
        ) : currentSpeakers.map((speaker, index) => {
          const playKey = getSpeakerPlayKey(speaker);
          const isPlaying = playingId === playKey;
          const isGenerating = generatingId === playKey;
          const colorClass = cardColors[(startIndex + index) % cardColors.length];
          const actionButtons = getActionButtons(speaker);
          const descriptor = getDescriptor(speaker);
          const name = speaker.eng_name || speaker.thai_name || `Speaker ${speaker.speaker_id}`;

          // Create a unique key combining speaker_id and isV2 status
          const uniqueKey = `${speaker.speaker_id}_${speaker.isV2 ? 'v2' : 'v1'}_${startIndex + index}`;
          // Normalize language list: V2/premium API may use different field names or omit it
          const displayLanguages = (() => {
            const raw = speaker.available_language ?? speaker.languages ?? speaker.supported_language;
            if (Array.isArray(raw) && raw.length > 0) return raw;
            if (typeof raw === 'string') return [raw];
            return ['en', 'my'];
          })();

          const isPremiumCard = speaker.isV2 === true || (speaker.tier && String(speaker.tier).toLowerCase() === 'pro');
          // Hash speaker id + version for stable but varied gradient (random-looking across grid)
          const speakerSeed = `${speaker.speaker_id}_${speaker.isV2 ? 'v2' : 'v1'}`;
          const hash = speakerSeed.split('').reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0);
          const premiumAvatarGradients = ['premium-avatar-gold', 'premium-avatar-yellow-orange', 'premium-avatar-blue-purple', 'premium-avatar-pink-purple'];
          const premiumAvatarClass = premiumAvatarGradients[Math.abs(hash) % premiumAvatarGradients.length];
          const premiumBorderGradients = [
            'premium-card-border-gold',
            'premium-card-border-purple-pink-orange',
            'premium-card-border-blue-purple-pink',
            'premium-card-border-yellow-orange',
            'premium-card-border-purple-blue',
            'premium-card-border-pink-purple',
          ];
          const premiumBorderClass = premiumBorderGradients[Math.abs(hash) % premiumBorderGradients.length];

          return (
            <div
              key={uniqueKey}
              className={isPremiumCard ? `rounded-lg p-[3px] ${premiumBorderClass}` : undefined}
            >
              <div
                className={isPremiumCard
                  ? 'bg-white rounded-[5px] shadow-md p-1 hover:shadow-lg transition-shadow flex gap-3 min-h-32 items-stretch'
                  : 'bg-white rounded-lg shadow-md border border-gray-200 p-1 hover:shadow-lg transition-shadow flex gap-3 min-h-32 items-stretch'
                }
              >
              {/* Left: Avatar with colored background - ~40% width */}
              <div className="relative shrink-0 w-32 self-stretch min-h-32">
                <div className={`w-full h-full rounded-lg relative overflow-hidden ${isPremiumCard ? premiumAvatarClass : colorClass}`}>
                  {speaker.image ? (
                    <img
                      src={speaker.image}
                      alt={name}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                      style={{ objectPosition: 'center 10%' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full rounded-lg bg-white flex items-center justify-center text-2xl font-bold text-gray-700">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  {/* Play button - circular with gradient, centered */}
                  <button
                    onClick={() => handlePlayVoice(speaker)}
                    disabled={isGenerating}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                      {isGenerating ? (
                        <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 text-white animate-spin" />
                      ) : isPlaying ? (
                        <FontAwesomeIcon icon={faSquare} className="w-3 h-3 text-white" />
                      ) : (
                        <FontAwesomeIcon icon={faPlay} className="w-4 h-4 text-white ml-0.5" />
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* Right: Details - ~60% width */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                {/* Name and Descriptor on same line */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-1">
                    <h3 className="text-lg font-bold text-gray-900 break-words">{name}</h3>
                    {descriptor && (
                      <span className="text-sm text-gray-600 shrink-0">{descriptor}</span>
                    )}
                  </div>

                  {/* API ID */}
                  <p className="text-xs text-gray-500 mb-2">API ID: {speaker.speaker_id}</p>
                </div>

                {/* Bottom section: Buttons and Flags */}
                <div>
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {actionButtons.map((btn, btnIndex) => (
                      <span
                        key={btnIndex}
                        className={`${btn.color} text-white text-xs px-2.5 py-1 rounded font-medium`}
                      >
                        {btn.text}
                      </span>
                    ))}
                  </div>

                  {/* Language Flags with Hover Tooltip */}
                  <div 
                    className="relative flex items-center gap-1.5 cursor-pointer overflow-visible"
                    onMouseEnter={() => setHoveredLanguageCard(uniqueKey)}
                    onMouseLeave={() => setHoveredLanguageCard(null)}
                  >
                    <div className="flex items-center gap-1.5">
                      {/* Display English and Myanmar flags if available, otherwise show first two */}
                      {displayLanguages.length > 0 && (() => {
                        const hasEnglish = displayLanguages.includes('en');
                        const hasMyanmar = displayLanguages.includes('my');
                        const flagsToShow = [];
                        
                        // Prioritize English and Myanmar if they exist
                        if (hasEnglish) {
                          flagsToShow.push('en');
                        }
                        if (hasMyanmar) {
                          flagsToShow.push('my');
                        }
                        
                        // If we don't have both, fill with other languages
                        if (flagsToShow.length < 2) {
                          const otherLanguages = displayLanguages.filter(
                            lang => lang !== 'en' && lang !== 'my'
                          );
                          flagsToShow.push(...otherLanguages.slice(0, 2 - flagsToShow.length));
                        }
                        
                        return (
                          <>
                            {flagsToShow.slice(0, 2).map((langCode, index) => {
                              const lang = languageMap[langCode];
                              if (!lang) return null;
                              return (
                                <span key={index} className="text-lg leading-none">{lang.flag}</span>
                              );
                            })}
                          </>
                        );
                      })()}
                    </div>
                    <span className="text-xs text-gray-600">+ Others</span>
                    
                    {/* Language Tooltip */}
                    {hoveredLanguageCard === uniqueKey && displayLanguages.length > 0 && (
                      <div className="absolute bottom-full left-0 mb-2 z-50 bg-gray-700/95 backdrop-blur-sm rounded-lg shadow-2xl p-3 min-w-[220px] border border-gray-600">
                        <h4 className="text-white text-sm font-semibold mb-3">{t('voiceover.availableLanguages')}</h4>
                        <div className="space-y-2">
                          {displayLanguages.map((langCode) => {
                            const lang = languageMap[langCode];
                            if (!lang) return null;
                            return (
                              <div key={langCode} className="flex items-center gap-2.5 text-white text-xs">
                                <span className="text-lg leading-none">{lang.flag}</span>
                                <span className="font-medium">{lang.name}</span>
                              </div>
                            );
                          })}
                        </div>
                        {/* Arrow pointing down */}
                        <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-gray-700/95 transform rotate-45 border-r border-b border-gray-600"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            </div>
          );
        })}
      </div>

      {/* Pagination - show even when only one page */}
      {totalPages >= 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {/* Previous button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3 text-gray-600" />
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                    ...
                  </span>
                );
              }
              
              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Next button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          >
            <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 text-gray-600" />
          </button>
        </div>
      )}

      {filteredSpeakers.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-12">
          <p>{t('voiceover.noVoicesMatching')}</p>
        </div>
      )}

      {speakers.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-12">
          <p>{t('voiceover.noVoicesAvailable')}</p>
        </div>
      )}
    </div>
    
  );
}
