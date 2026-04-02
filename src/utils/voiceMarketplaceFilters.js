/** Shared Voice Over / Voice Studio marketplace filter logic (single source of truth). */

export const VOICE_FILTER_LANGUAGE_MAP = {
  en: { name: "English", flag: "🇬🇧" },
  id: { name: "Indonesian", flag: "🇮🇩" },
  ja: { name: "Japanese", flag: "🇯🇵" },
  lo: { name: "Lao", flag: "🇱🇦" },
  my: { name: "Burmese", flag: "🇲🇲" },
  th: { name: "Thai", flag: "🇹🇭" },
  vi: { name: "Vietnamese", flag: "🇻🇳" },
  zh: { name: "Chinese", flag: "🇨🇳" },
  km: { name: "Cambodia", flag: "🇰🇭" },
  ph: { name: "Filipino", flag: "🇵🇭" },
  ar: { name: "Arabic", flag: "🇸🇦" },
  de: { name: "German", flag: "🇩🇪" },
  es: { name: "Spanish", flag: "🇪🇸" },
  fr: { name: "French", flag: "🇫🇷" },
  ms: { name: "Malaysian", flag: "🇲🇾" },
  pt: { name: "Portuguese", flag: "🇵🇹" },
  ru: { name: "Russian", flag: "🇷🇺" },
  nl: { name: "Dutch", flag: "🇳🇱" },
  ko: { name: "Korean", flag: "🇰🇷" },
  hi: { name: "Hindi", flag: "🇮🇳" },
  sg: { name: "Singapore", flag: "🇸🇬" },
  tr: { name: "Turkish", flag: "🇹🇷" },
  it: { name: "Italian", flag: "🇮🇹" },
};

export const VOICE_FILTER_STYLE_OPTIONS = [
  "Confident",
  "Trustworthy",
  "Exciting",
  "Cute",
  "Serious",
  "Sweet",
  "Warm",
  "Soothing",
  "Gentle",
  "Calm",
  "Southern accent",
  "Clear",
  "Playful",
  "Regional accent",
  "Deep",
  "Gentle and tender",
  "Northeastern accent",
  "Northern accent",
  "Mellow",
];

export const VOICE_FILTER_CATEGORY_OPTIONS = [
  "Storytelling",
  "Narrating",
  "News Reading",
  "Documentary",
  "Anime",
  "Teaching",
  "Local",
  "Free",
];

export const VOICE_FILTER_GENDER_AGE_OPTIONS = ["Female", "Male", "Adult", "Teens", "Child"];

export const VOICE_FILTER_VERSION_OPTIONS = ["V1", "V2"];

export function getSpeakerActionCategories(speaker) {
  const buttons = [];

  const speechStyles = speaker.eng_speech_style || speaker.speech_style || [];
  const allSpeechStyles = Array.isArray(speechStyles) ? speechStyles : [speechStyles].filter(Boolean);

  const categoryMap = {
    Storytelling: { color: "bg-green-500" },
    "News Reading": { color: "bg-blue-500" },
    Character: { color: "bg-blue-400" },
    Narrating: { color: "bg-red-500" },
    "Advertising Spot": { color: "bg-orange-500" },
    Documentary: { color: "bg-yellow-500" },
    Anime: { color: "bg-purple-500" },
    Teaching: { color: "bg-indigo-500" },
    Local: { color: "bg-teal-500" },
    "Foreign Voice": { color: "bg-pink-500" },
    Free: { color: "bg-gray-500" },
  };

  const hasNarrating = allSpeechStyles.some(
    (s) => s?.toLowerCase().includes("narrat") || s?.toLowerCase().includes("narrating")
  );
  const hasCharacter = allSpeechStyles.some(
    (s) => s?.toLowerCase().includes("character") || s?.toLowerCase().includes("char")
  );

  if (hasNarrating && hasCharacter) {
    buttons.push({ text: "Narrating,Character", color: "bg-red-400" });
  }

  allSpeechStyles.forEach((style) => {
    if (!style) return;

    const styleLower = style.toLowerCase().trim();
    let categoryName = null;

    if (styleLower.includes("storytelling") || styleLower.includes("story")) {
      categoryName = "Storytelling";
    } else if (
      styleLower.includes("news reading") ||
      styleLower.includes("news") ||
      styleLower.includes("read")
    ) {
      categoryName = "News Reading";
    } else if (styleLower.includes("character") || styleLower.includes("char")) {
      categoryName = "Character";
    } else if (styleLower.includes("narrating") || styleLower.includes("narrat")) {
      categoryName = "Narrating";
    } else if (
      styleLower.includes("advertising") ||
      styleLower.includes("ad") ||
      styleLower.includes("spot")
    ) {
      categoryName = "Advertising Spot";
    } else if (styleLower.includes("documentary") || styleLower.includes("doc")) {
      categoryName = "Documentary";
    } else if (styleLower.includes("anime") || styleLower.includes("animation")) {
      categoryName = "Anime";
    } else if (
      styleLower.includes("teaching") ||
      styleLower.includes("teach") ||
      styleLower.includes("education")
    ) {
      categoryName = "Teaching";
    } else if (styleLower.includes("local") || styleLower.includes("native")) {
      categoryName = "Local";
    } else if (styleLower.includes("foreign") || styleLower.includes("international")) {
      categoryName = "Foreign Voice";
    } else if (styleLower.includes("free")) {
      categoryName = "Free";
    }

    if (categoryName && categoryMap[categoryName]) {
      if (categoryName === "Narrating" && hasNarrating && hasCharacter) return;
      if (categoryName === "Character" && hasNarrating && hasCharacter) return;

      buttons.push({
        text: categoryName,
        color: categoryMap[categoryName].color,
      });
    }
  });

  if (buttons.length === 0) {
    buttons.push({ text: "Storytelling", color: "bg-green-500" });
  }

  const uniqueButtons = [];
  const seen = new Set();
  buttons.forEach((btn) => {
    if (!seen.has(btn.text)) {
      seen.add(btn.text);
      uniqueButtons.push(btn);
    }
  });

  return uniqueButtons;
}

export function getSpeakerDescriptor(speaker) {
  let gender = speaker.eng_gender || speaker.gender || "";
  let age = speaker.eng_age_style || speaker.age_style || "";

  if (gender) {
    const genderLower = gender.toLowerCase().trim();
    if (genderLower.startsWith("a ")) {
      gender = genderLower.substring(2);
    } else if (genderLower.startsWith("an ")) {
      gender = genderLower.substring(3);
    }
    if (
      genderLower.includes("girl") ||
      genderLower.includes("female") ||
      genderLower === "woman"
    ) {
      gender = "female";
    } else if (
      genderLower.includes("boy") ||
      genderLower.includes("male") ||
      genderLower === "man"
    ) {
      gender = "male";
    } else {
      gender = gender.toLowerCase();
    }
  }

  if (age) {
    const ageLower = age.toLowerCase().trim();
    if (ageLower.includes("teen")) {
      age = "teen";
    } else if (ageLower.includes("adult")) {
      age = "adult";
    } else if (ageLower.includes("child")) {
      age = "child";
    } else {
      age = ageLower;
    }
  }

  if (gender && age) {
    return `${gender}/${age}`;
  }
  if (gender) return gender;
  if (age) return age;
  return "";
}

/**
 * @param {object} speaker - raw marketplace speaker
 * @param {object} criteria
 * @param {string} [criteria.upperFilter] - 'all' | 'premium' | 'new' | 'free'
 * @param {string} [criteria.searchQuery]
 * @param {string[]} [criteria.selectedLanguages]
 * @param {string[]} [criteria.selectedStyles]
 * @param {string[]} [criteria.selectedCategories]
 * @param {string[]} [criteria.selectedGenderAge]
 * @param {string[]} [criteria.selectedVersions]
 * @param {string} [extraSearchText] - e.g. sidebar row name + tagline (optional)
 */
export function speakerMatchesMarketplaceFilters(speaker, criteria, extraSearchText = "") {
  const {
    upperFilter = "all",
    searchQuery = "",
    selectedLanguages = [],
    selectedStyles = [],
    selectedCategories = [],
    selectedGenderAge = [],
    selectedVersions = [],
  } = criteria || {};

  if (upperFilter !== "all") {
    if (upperFilter === "premium") {
      const tierPro = speaker.tier && String(speaker.tier).toLowerCase() === "pro";
      const fromV2Api = speaker.isV2 === true;
      if (!(tierPro || fromV2Api)) return false;
    } else if (upperFilter === "new") {
      const popularityNew =
        speaker.popularity && String(speaker.popularity).toLowerCase() === "new";
      if (!popularityNew) return false;
    } else if (upperFilter === "free") {
      const tierBasic = speaker.tier && String(speaker.tier).toLowerCase() === "basic";
      const fromV1Api = speaker.isV2 === false;
      if (!(tierBasic || fromV1Api)) return false;
    }
  }

  if (searchQuery && String(searchQuery).trim()) {
    const query = String(searchQuery).toLowerCase();
    const name = (speaker.eng_name || speaker.thai_name || "").toLowerCase();
    const speakerId = speaker.speaker_id?.toString().toLowerCase() || "";
    const extra = (extraSearchText || "").toLowerCase();
    if (!name.includes(query) && !speakerId.includes(query) && !extra.includes(query)) {
      return false;
    }
  }

  if (selectedLanguages.length > 0) {
    const speakerLangs = speaker.available_language || [];
    if (!selectedLanguages.some((lang) => speakerLangs.includes(lang))) {
      return false;
    }
  }

  if (selectedCategories.length > 0) {
    const categories = getSpeakerActionCategories(speaker).map((btn) => btn.text);
    if (!selectedCategories.some((cat) => categories.includes(cat))) {
      return false;
    }
  }

  if (selectedGenderAge.length > 0) {
    const descriptor = getSpeakerDescriptor(speaker).toLowerCase();
    const gender = speaker.eng_gender || speaker.gender || "";
    const age = speaker.eng_age_style || speaker.age_style || "";
    const genderLower = (gender || "").toString().toLowerCase().trim();
    const ageLower = (age || "").toString().toLowerCase();

    const isFemale =
      genderLower.includes("female") ||
      genderLower.includes("girl") ||
      genderLower.includes("woman");
    const isMale =
      (genderLower.includes("male") ||
        genderLower.includes("boy") ||
        genderLower.includes("man")) &&
      !genderLower.includes("female");
    const isAdult = ageLower.includes("adult") || descriptor.includes("adult");
    const isTeens = ageLower.includes("teen") || descriptor.includes("teen");
    const isChild = ageLower.includes("child") || descriptor.includes("child");

    for (const filter of selectedGenderAge) {
      const filterLower = filter.toLowerCase();
      if (filterLower === "female" && !isFemale) return false;
      if (filterLower === "male" && !isMale) return false;
      if (filterLower === "adult" && !isAdult) return false;
      if (filterLower === "teens" && !isTeens) return false;
      if (filterLower === "child" && !isChild) return false;
    }
  }

  if (selectedVersions.length > 0) {
    const isV2 = speaker.isV2 || false;
    const wantsV1 = selectedVersions.includes("V1");
    const wantsV2 = selectedVersions.includes("V2");

    if (wantsV1 && wantsV2) {
      /* show all */
    } else if (wantsV1 && isV2) {
      return false;
    } else if (wantsV2 && !isV2) {
      return false;
    } else if (!wantsV1 && !wantsV2) {
      return false;
    }
  }

  if (selectedStyles.length > 0) {
    const voiceStyles = speaker.eng_voice_style || speaker.voice_style || [];
    const allStyles = Array.isArray(voiceStyles) ? voiceStyles : [voiceStyles].filter(Boolean);
    const styleStrings = allStyles.map((s) => s?.toLowerCase() || "");

    let matches = false;
    selectedStyles.forEach((selectedStyle) => {
      const selectedLower = selectedStyle.toLowerCase();
      if (
        styleStrings.some(
          (style) => style.includes(selectedLower) || selectedLower.includes(style)
        )
      ) {
        matches = true;
      }
    });
    if (!matches) return false;
  }

  return true;
}
