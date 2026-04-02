import { useState, useRef, useMemo, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../../../hooks/useLanguage.js";
import {
  VOICE_FILTER_LANGUAGE_MAP,
  VOICE_FILTER_STYLE_OPTIONS,
  VOICE_FILTER_CATEGORY_OPTIONS,
  VOICE_FILTER_GENDER_AGE_OPTIONS,
  VOICE_FILTER_VERSION_OPTIONS,
  speakerMatchesMarketplaceFilters,
} from "../../../utils/voiceMarketplaceFilters.js";

export default function LeftSidebar({
  voiceSections = [],
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

  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGenderAge, setSelectedGenderAge] = useState([]);
  const [selectedVersions, setSelectedVersions] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  const toggleFilter = (filterType, value) => {
    switch (filterType) {
      case "language":
        setSelectedLanguages((prev) =>
          prev.includes(value) ? prev.filter((l) => l !== value) : [...prev, value]
        );
        break;
      case "style":
        setSelectedStyles((prev) =>
          prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
        );
        break;
      case "category":
        setSelectedCategories((prev) =>
          prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
        );
        break;
      case "genderAge":
        setSelectedGenderAge((prev) =>
          prev.includes(value) ? prev.filter((g) => g !== value) : [...prev, value]
        );
        break;
      case "version":
        setSelectedVersions((prev) =>
          prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
        break;
      default:
        break;
    }
  };

  const handleSelectAll = (filterType) => {
    switch (filterType) {
      case "language": {
        const allLangs = Object.keys(VOICE_FILTER_LANGUAGE_MAP);
        setSelectedLanguages((prev) => (prev.length === allLangs.length ? [] : [...allLangs]));
        break;
      }
      case "style":
        setSelectedStyles((prev) =>
          prev.length === VOICE_FILTER_STYLE_OPTIONS.length ? [] : [...VOICE_FILTER_STYLE_OPTIONS]
        );
        break;
      case "category":
        setSelectedCategories((prev) =>
          prev.length === VOICE_FILTER_CATEGORY_OPTIONS.length ? [] : [...VOICE_FILTER_CATEGORY_OPTIONS]
        );
        break;
      case "genderAge":
        setSelectedGenderAge((prev) =>
          prev.length === VOICE_FILTER_GENDER_AGE_OPTIONS.length ? [] : [...VOICE_FILTER_GENDER_AGE_OPTIONS]
        );
        break;
      case "version":
        setSelectedVersions((prev) =>
          prev.length === VOICE_FILTER_VERSION_OPTIONS.length ? [] : [...VOICE_FILTER_VERSION_OPTIONS]
        );
        break;
      default:
        break;
    }
  };

  const clearAllFilters = () => {
    setSelectedLanguages([]);
    setSelectedStyles([]);
    setSelectedCategories([]);
    setSelectedGenderAge([]);
    setSelectedVersions([]);
    setOpenDropdown(null);
  };

  const filterCriteria = useMemo(
    () => ({
      upperFilter: "all",
      searchQuery,
      selectedLanguages,
      selectedStyles,
      selectedCategories,
      selectedGenderAge,
      selectedVersions,
    }),
    [
      searchQuery,
      selectedLanguages,
      selectedStyles,
      selectedCategories,
      selectedGenderAge,
      selectedVersions,
    ]
  );

  const activeFilterCount =
    selectedLanguages.length +
    selectedStyles.length +
    selectedCategories.length +
    selectedGenderAge.length +
    selectedVersions.length;

  const filteredSections = useMemo(() => {
    return voiceSections
      .map((section) => ({
        ...section,
        voices: (section.voices || []).filter((voice) => {
          const extra = `${voice.name || ""} ${voice.tagline || ""}`;
          return speakerMatchesMarketplaceFilters(voice.speaker, filterCriteria, extra);
        }),
      }))
      .filter((section) => section.voices.length > 0);
  }, [voiceSections, filterCriteria]);

  const totalVisible = filteredSections.reduce((n, s) => n + s.voices.length, 0);

  const handlePlayPreview = (voiceId, audioUrl) => {
    Object.values(audioRefs.current).forEach((audio) => {
      if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    if (playingAudioId === voiceId) {
      setPlayingAudioId(null);
      return;
    }

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

  const filterBtnClass =
    "w-full flex items-center justify-between gap-1 px-2.5 py-2 border border-indigo-200/80 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-indigo-50/80 transition-colors";

  const panelClass =
    "absolute left-0 right-0 top-full mt-1 bg-white border border-indigo-100 rounded-lg shadow-lg z-[60] p-2 max-h-48 overflow-y-auto";

  const renderVoiceCard = (voice) => {
    const active = selectedVoiceId === voice.id;
    const isPlaying = playingAudioId === voice.id;
    const speaker = voice.speaker;

    return (
      <div
        key={voice.id}
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
              if (onClose) {
                const isMobileOrTablet = window.matchMedia("(max-width: 1023px)").matches;
                if (isMobileOrTablet) {
                  onClose();
                }
              }
            }}
            className="w-full text-left p-2 lg:p-3 flex flex-row items-center gap-2 lg:gap-3 cursor-pointer relative z-10"
          >
            {speaker?.image ? (
              <img
                src={speaker.image}
                alt={voice.name}
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover shrink-0 shadow-inner group-hover:scale-105 transition-transform"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
            ) : null}
            <div
              className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#fcd34d] shrink-0 shadow-inner group-hover:scale-105 transition-transform"
              style={{ display: speaker?.image ? "none" : "block" }}
            />

            <div className="min-w-0 flex-1 relative z-10">
              <p className="font-bold text-slate-800 text-sm leading-tight truncate">
                {voice.name} {active && "✓"}
              </p>
              <p className="text-slate-600 text-xs truncate">{voice.tagline || ""}</p>
              {speaker?.eng_gender && (
                <p className="text-slate-500 text-xs truncate mt-0.5">
                  {speaker.eng_gender} • {speaker.eng_age_style || ""}
                </p>
              )}
            </div>
          </button>

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
                  {isPlaying
                    ? t("voicestudio.leftSidebar.pausePreview")
                    : t("voicestudio.leftSidebar.playPreview")}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <aside
      className={`
      fixed lg:relative inset-y-0 left-0
      flex flex-col shrink-0 z-50 lg:z-10
      bg-[#eef2ff] border-r border-indigo-100
      transition-all duration-300 ease-in-out
      w-72 lg:w-72 xl:w-72 2xl:w-80
      max-h-[calc(100vh-80px)] lg:max-h-none
      ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    `}
    >
      <div className="shrink-0 px-3 lg:px-5 py-4 flex justify-between items-center border-b border-indigo-100/60">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {t("voicestudio.leftSidebar.voiceLibrary")}
        </h2>

        <button
          type="button"
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-slate-600 transition-colors"
          aria-label="Close sidebar"
        >
          <span className="material-icons-round text-lg">close</span>
        </button>
      </div>

      <div className="shrink-0 px-2 lg:px-5 pt-3 pb-2 space-y-3 border-b border-indigo-100/40">
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-indigo-400 material-icons-round text-sm">
            search
          </span>
          <input
            type="text"
            placeholder={t("voicestudio.leftSidebar.searchVoices")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-indigo-100 rounded-lg py-2 pl-9 pr-4 text-sm placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 shadow-sm transition-all"
          />
        </div>

        <div ref={filterRef} className="relative space-y-2">
          <div className="flex items-center justify-between gap-2 px-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              {t("voicestudio.leftSidebar.filters")}
            </span>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-[10px] font-medium text-indigo-600 hover:text-indigo-800"
              >
                {t("voicestudio.leftSidebar.clearFilters")}
              </button>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "language" ? null : "language")}
              className={filterBtnClass}
            >
              <span className="truncate">{t("voiceover.language")}</span>
              <FontAwesomeIcon icon={faChevronDown} className="text-[10px] shrink-0 opacity-60" />
            </button>
            {openDropdown === "language" && (
              <div className={panelClass}>
                <div className="flex justify-between mb-1.5 px-0.5">
                  <button
                    type="button"
                    onClick={() => handleSelectAll("language")}
                    className="text-[10px] text-indigo-600 hover:underline"
                  >
                    {t("voiceover.selectAll")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedLanguages([])}
                    className="text-[10px] text-slate-500 hover:underline"
                  >
                    {t("voiceover.clear")}
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-0.5">
                  {Object.entries(VOICE_FILTER_LANGUAGE_MAP).map(([code, { name, flag }]) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => toggleFilter("language", code)}
                      className={`text-left px-2 py-1 rounded text-xs flex items-center gap-2 ${
                        selectedLanguages.includes(code)
                          ? "bg-indigo-100 text-indigo-800"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{flag}</span>
                      <span className="truncate">{name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "style" ? null : "style")}
              className={filterBtnClass}
            >
              <span className="truncate">{t("voiceover.style")}</span>
              <FontAwesomeIcon icon={faChevronDown} className="text-[10px] shrink-0 opacity-60" />
            </button>
            {openDropdown === "style" && (
              <div className={panelClass}>
                <div className="flex justify-between mb-1.5 px-0.5">
                  <button
                    type="button"
                    onClick={() => handleSelectAll("style")}
                    className="text-[10px] text-indigo-600 hover:underline"
                  >
                    {t("voiceover.selectAll")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStyles([])}
                    className="text-[10px] text-slate-500 hover:underline"
                  >
                    {t("voiceover.clear")}
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-0.5">
                  {VOICE_FILTER_STYLE_OPTIONS.map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => toggleFilter("style", style)}
                      className={`text-left px-2 py-1 rounded text-xs truncate ${
                        selectedStyles.includes(style)
                          ? "bg-indigo-100 text-indigo-800"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
              className={filterBtnClass}
            >
              <span className="truncate">{t("voiceover.category")}</span>
              <FontAwesomeIcon icon={faChevronDown} className="text-[10px] shrink-0 opacity-60" />
            </button>
            {openDropdown === "category" && (
              <div className={panelClass}>
                <div className="flex justify-between mb-1.5 px-0.5">
                  <button
                    type="button"
                    onClick={() => handleSelectAll("category")}
                    className="text-[10px] text-indigo-600 hover:underline"
                  >
                    {t("voiceover.selectAll")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCategories([])}
                    className="text-[10px] text-slate-500 hover:underline"
                  >
                    {t("voiceover.clear")}
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-0.5">
                  {VOICE_FILTER_CATEGORY_OPTIONS.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleFilter("category", category)}
                      className={`text-left px-2 py-1 rounded text-xs truncate ${
                        selectedCategories.includes(category)
                          ? "bg-indigo-100 text-indigo-800"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "genderAge" ? null : "genderAge")}
              className={filterBtnClass}
            >
              <span className="truncate">{t("voiceover.genderAge")}</span>
              <FontAwesomeIcon icon={faChevronDown} className="text-[10px] shrink-0 opacity-60" />
            </button>
            {openDropdown === "genderAge" && (
              <div className={panelClass}>
                <div className="flex justify-between mb-1.5 px-0.5">
                  <button
                    type="button"
                    onClick={() => handleSelectAll("genderAge")}
                    className="text-[10px] text-indigo-600 hover:underline"
                  >
                    {t("voiceover.selectAll")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedGenderAge([])}
                    className="text-[10px] text-slate-500 hover:underline"
                  >
                    {t("voiceover.clear")}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-0.5">
                  {VOICE_FILTER_GENDER_AGE_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleFilter("genderAge", option)}
                      className={`px-2 py-1 rounded text-xs text-left ${
                        selectedGenderAge.includes(option)
                          ? "bg-indigo-100 text-indigo-800"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "version" ? null : "version")}
              className={filterBtnClass}
            >
              <span className="truncate">{t("voiceover.version")}</span>
              <FontAwesomeIcon icon={faChevronDown} className="text-[10px] shrink-0 opacity-60" />
            </button>
            {openDropdown === "version" && (
              <div className={panelClass}>
                <div className="flex justify-between mb-1.5 px-0.5">
                  <button
                    type="button"
                    onClick={() => handleSelectAll("version")}
                    className="text-[10px] text-indigo-600 hover:underline"
                  >
                    {t("voiceover.selectAll")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedVersions([])}
                    className="text-[10px] text-slate-500 hover:underline"
                  >
                    {t("voiceover.clear")}
                  </button>
                </div>
                <div className="space-y-0.5">
                  {VOICE_FILTER_VERSION_OPTIONS.map((version) => (
                    <button
                      key={version}
                      type="button"
                      onClick={() => toggleFilter("version", version)}
                      className={`w-full px-2 py-1 rounded text-xs text-left ${
                        selectedVersions.includes(version)
                          ? "bg-indigo-100 text-indigo-800"
                          : "text-slate-700 hover:bg-slate-50"
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

      <div className="flex-1 min-h-0 overflow-y-auto px-2 lg:px-5 py-3 pb-5">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {!isLoading && (
          <div className="space-y-6">
            {totalVisible === 0 ? (
              <div className="text-center text-slate-500 text-sm py-4">
                {t("voicestudio.leftSidebar.noVoicesFound")}
              </div>
            ) : (
              filteredSections.map((section) => (
                <div key={section.label} className="space-y-3">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">
                    {section.label}
                  </h3>
                  <div className="space-y-3">{section.voices.map(renderVoiceCard)}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
