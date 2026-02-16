# How Voice Filtering Works

The filtering system in the Voice Over page uses a **sequential AND logic** - all active filters must pass for a voice to be displayed. Here's how each filter works:

## Filter Flow

The filtering happens in `VoiceCardsGrid.jsx` in the `filteredSpeakers` useMemo hook (lines 408-530). Each filter is checked in order, and if ANY filter fails, the voice is excluded.

## 1. Upper Filter Tabs (All, Premium, New, Free)

**Location:** Lines 410-441

### Premium Filter
Checks if the voice has ANY of these properties:
- `speaker.premium === true`
- `speaker.is_premium === true`
- `speaker.isV2 === true` (all V2 voices are considered premium)

```javascript
const isPremium = speaker.premium === true || speaker.is_premium === true || speaker.isV2 === true;
```

### New Filter
Checks if the voice has ANY of these properties:
- `speaker.is_new === true`
- `speaker.isNew === true`
- `speaker.isV2 === true` (all V2 voices are considered new)
- `speaker.created_at` is within the last 90 days

```javascript
const isNew = speaker.is_new === true || 
             speaker.isNew === true ||
             speaker.isV2 === true ||
             (speaker.created_at && new Date(speaker.created_at) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000));
```

### Free Filter
Checks if the voice:
- Has `speaker.free === true` OR `speaker.is_free === true`
- Has "Free" in its categories (from `speech_style`)
- Is NOT premium (doesn't have premium flags)

```javascript
const isFree = hasExplicitFreeFlag || hasFreeCategory || isNotPremium;
```

## 2. Search Query Filter

**Location:** Lines 443-451

Searches in:
- Voice name (`speaker.eng_name` or `speaker.thai_name`)
- Speaker ID (`speaker.speaker_id`)

**Logic:** Case-insensitive partial match - if the search query appears anywhere in the name or ID, the voice is included.

```javascript
const query = searchQuery.toLowerCase();
const name = (speaker.eng_name || speaker.thai_name || '').toLowerCase();
const speakerId = speaker.speaker_id?.toString().toLowerCase() || '';
if (!name.includes(query) && !speakerId.includes(query)) {
  return false; // Exclude if not found in name or ID
}
```

## 3. Language Filter

**Location:** Lines 453-459

**Logic:** The voice must support AT LEAST ONE of the selected languages.

```javascript
if (selectedLanguages.length > 0) {
  const speakerLangs = speaker.available_language || [];
  if (!selectedLanguages.some(lang => speakerLangs.includes(lang))) {
    return false; // Exclude if voice doesn't support any selected language
  }
}
```

**Example:** If you select "English" and "Thai", voices that support either English OR Thai (or both) will be shown.

## 4. Category Filter

**Location:** Lines 461-467

**Logic:** The voice must have AT LEAST ONE of the selected categories.

Categories are extracted from `speaker.eng_speech_style` or `speaker.speech_style` and mapped to display names:
- Storytelling
- News Reading
- Narrating
- Documentary
- Anime
- Teaching
- Local
- Free
- etc.

```javascript
if (selectedCategories.length > 0) {
  const categories = getActionButtons(speaker).map(btn => btn.text);
  if (!selectedCategories.some(cat => categories.includes(cat))) {
    return false; // Exclude if voice doesn't have any selected category
  }
}
```

## 5. Gender/Age Filter

**Location:** Lines 469-493

**Logic:** The voice must match AT LEAST ONE of the selected gender/age combinations.

Checks:
- **Gender:** `speaker.eng_gender` or `speaker.gender` (matches "female", "male", "girl", "boy", "woman", "man")
- **Age:** `speaker.eng_age_style` or `speaker.age_style` (matches "adult", "teen", "child")

```javascript
// Example: If "Female" is selected, checks if gender includes "female", "girl", or "woman"
if (filterLower === 'female' && (genderLower.includes('female') || genderLower.includes('girl') || genderLower.includes('woman'))) {
  matches = true;
}
```

## 6. Version Filter (V1/V2)

**Location:** Lines 495-510

**Logic:** Filters by whether the voice is V1 or V2.

- V1 voices: `speaker.isV2 === false` or `speaker.isV2` is undefined
- V2 voices: `speaker.isV2 === true`

```javascript
const isV2 = speaker.isV2 || false;
if (wantsV1 && isV2) {
  return false; // Want V1 but speaker is V2
} else if (wantsV2 && !isV2) {
  return false; // Want V2 but speaker is V1
}
```

## 7. Style Filter

**Location:** Lines 512-526

**Logic:** The voice must have AT LEAST ONE of the selected styles.

Checks `speaker.eng_voice_style` or `speaker.voice_style` for partial matches:
- "Confident"
- "Trustworthy"
- "Exciting"
- "Cute"
- "Serious"
- "Sweet"
- etc.

```javascript
if (selectedStyles.length > 0) {
  const voiceStyles = speaker.eng_voice_style || speaker.voice_style || [];
  // Checks if any selected style partially matches any voice style (case-insensitive)
  if (!matches) return false;
}
```

## How Filters Combine

**All filters use AND logic:**
- If you select "Premium" + "English" + "Female", only voices that are:
  - Premium **AND**
  - Support English **AND**
  - Are Female
  - will be shown

**Within each filter, it uses OR logic:**
- If you select "English" and "Thai" in languages, voices supporting English **OR** Thai are shown
- If you select "Storytelling" and "News Reading" in categories, voices with Storytelling **OR** News Reading are shown

## Data Sources

The filtering uses data from the API response:
- `speaker.premium`, `speaker.is_premium`, `speaker.isV2` - Premium status
- `speaker.is_new`, `speaker.isNew`, `speaker.created_at` - New status
- `speaker.available_language` - Array of supported languages
- `speaker.eng_speech_style` or `speaker.speech_style` - Categories
- `speaker.eng_gender`, `speaker.gender` - Gender
- `speaker.eng_age_style`, `speaker.age_style` - Age
- `speaker.eng_voice_style`, `speaker.voice_style` - Voice styles
- `speaker.eng_name`, `speaker.thai_name` - Names for search
- `speaker.speaker_id` - ID for search

## Performance

The filtering uses `useMemo` to only recalculate when filter states change:
```javascript
}, [speakers, upperFilter, searchQuery, selectedLanguages, selectedStyles, selectedCategories, selectedGenderAge, selectedVersions]);
```

This ensures filtering is efficient and only runs when necessary.
