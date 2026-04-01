import LeftSidebar from "./components/LeftSidebar.jsx";
import Editor from "./components/Editor.jsx";
import RightSidebar from "./components/RightSidebar.jsx";
import SentenceBlock from "./components/SentenceBlock.jsx";
import Workspace from "./components/Workspace.jsx";
import CreateProjectModal from "./components/CreateProjectModal.jsx";
import ViewProjectsModal from "./components/ViewProjectsModal.jsx";
import VoiceStudioSkeleton from "./components/VoiceStudioSkeleton.jsx";

import { useMemo, useState, useEffect, useContext, useCallback, useRef } from "react";
import { useLanguage } from "../../hooks/useLanguage.js";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import {
  generateVoice,
  getAllWorkspaces,
  createWorkspace,
  deleteWorkspace,
  saveWorkspaceText
} from "../../firebase/voiceApi.js";
import { useSearchParams } from "react-router-dom";
import { useCachedSpeakers } from "../../hooks/useCachedSpeakers.js";
import { useCachedWorkspaceContent } from "../../hooks/useCachedWorkspaceContent.js";
import { getUserBotnoiToken } from "../../utils/botnoiToken.js";

function formatTime(totalSeconds) {
  const s = Math.max(0, Number(totalSeconds) || 0);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(Math.floor(s % 60)).padStart(2, "0");
  return `${mm}:${ss}`;
}

function normalizeWorkspaceName(rawName, index, t) {
  const fallbackNumber = index + 1;
  const projectLabel = t("workspace.project") || "Project";
  const defaultName = t("workspace.defaultProjectName") || "Project 1";

  if (!rawName || typeof rawName !== "string") {
    return fallbackNumber === 1 ? defaultName : `${projectLabel} ${fallbackNumber}`;
  }

  const trimmed = rawName.trim();
  const genericPatterns = [
    /^project\s*(\d+)?$/i,
    /^โปรเจค\s*(\d+)?$/i,
    /^ပရောဂျက်\s*(\d+)?$/u,
  ];

  for (const pattern of genericPatterns) {
    const match = trimmed.match(pattern);
    if (match) {
      const parsedNumber = Number(match[1]);
      const numberToUse = Number.isFinite(parsedNumber) && parsedNumber > 0
        ? parsedNumber
        : fallbackNumber;

      return numberToUse === 1 ? defaultName : `${projectLabel} ${numberToUse}`;
    }
  }

  return rawName;
}

export default function Voicestudio() {
  const { t } = useLanguage();
  const { user } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [selectedVoiceId, setSelectedVoiceId] = useState(null);
  const selectedVoiceIdRef = useRef(selectedVoiceId);
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en");
  const [speed, setSpeed] = useState(1.0);
  const [volume, setVolume] = useState(100);
  const [outputs, setOutputs] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState(null);
  
  // Multiple sentence blocks state
  const [sentenceBlocks, setSentenceBlocks] = useState([
    {
      id: 1,
      text: "",
      selectedVoiceId: null,
      language: "en",
      speed: 1.0,
      volume: 100,
      isGenerating: false,
      outputs: []
    }
  ]);
  const [generatingBlockId, setGeneratingBlockId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const blocksPerPage = 15;

  // Workspace state
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(true);
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [isSavingWorkspace, setIsSavingWorkspace] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isViewProjectsModalOpen, setIsViewProjectsModalOpen] = useState(false);
  const [botnoiToken, setBotnoiToken] = useState(null);
  const {
    speakers,
    loading: isLoadingSpeakers,
    error: speakersError,
  } = useCachedSpeakers();

  // Use cached workspace content
  const {
    data: workspaceContent,
    loading: isLoadingWorkspaceContent,
    error: workspaceContentError
  } = useCachedWorkspaceContent(
    botnoiToken,
    currentWorkspace?.workspace_id || null
  );

  // Read initial text from URL params
  useEffect(() => {
    const textParam = searchParams.get("text");
    if (textParam) {
      const decodedText = decodeURIComponent(textParam);
      setText(decodedText);
      // Remove the text param from URL after reading it
      searchParams.delete("text");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Helper function to get Botnoi token
  const getBotnoiTokenHelper = useCallback(async () => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const botnoiToken = await getUserBotnoiToken(user);
    
    if (!botnoiToken || (typeof botnoiToken === 'string' && botnoiToken.trim() === '')) {
      throw new Error('Failed to retrieve Botnoi authentication token.');
    }
    
    if (typeof botnoiToken !== 'string') {
      throw new Error('Invalid Botnoi token format received from server.');
    }
    
    return botnoiToken;
  }, [user]);

  // Fetch workspaces on component mount
  useEffect(() => {
    async function fetchWorkspaces() {
      if (!user) {
        return;
      }

      try {
        setIsLoadingWorkspaces(true);
        const botnoiToken = await getBotnoiTokenHelper();
        setBotnoiToken(botnoiToken);
        const fetchedWorkspaces = await getAllWorkspaces(botnoiToken);
        
        // Transform workspaces to match our format
        const transformedWorkspaces = fetchedWorkspaces.map((ws, index) => ({
          id: ws.workspace_id || ws.id || index + 1,
          workspace_id: ws.workspace_id || ws.id,
          name: normalizeWorkspaceName(ws.workspace || ws.name, index, t),
          type_workspace: ws.type_workspace || 'conversation',
          isLoading: false
        }));
        
        setWorkspaces(transformedWorkspaces);
        
        // Set first workspace as current if none selected
        if (transformedWorkspaces.length > 0 && !currentWorkspace) {
          setCurrentWorkspace(transformedWorkspaces[0]);
        } else if (transformedWorkspaces.length === 0) {
          // Create default workspace if none exist
          const defaultWorkspace = {
            id: 1,
            workspace_id: null,
            name: t("workspace.defaultProjectName") || "Project 1",
            type_workspace: 'conversation',
            isLoading: false
          };
          setCurrentWorkspace(defaultWorkspace);
        }
      } catch (err) {
        console.error("Error fetching workspaces:", err);
        // Set default workspace on error
        setCurrentWorkspace({
          id: 1,
          workspace_id: null,
          name: t("workspace.defaultProjectName") || "Project 1",
          type_workspace: 'conversation',
          isLoading: false
        });
      } finally {
        setIsLoadingWorkspaces(false);
      }
    }

    fetchWorkspaces();
  }, [user, getBotnoiTokenHelper, t]);

  // Keep ref in sync with state
  useEffect(() => {
    selectedVoiceIdRef.current = selectedVoiceId;
  }, [selectedVoiceId]);

  // Process workspace content from cache
  useEffect(() => {
    // Clear outputs from previous workspace when switching
    setOutputs([]);

    if (!currentWorkspace || !user) {
      // If no workspace or no workspace_id, reset to default empty block
      if (!currentWorkspace || !currentWorkspace.workspace_id) {
        setSentenceBlocks([{
          id: 1,
          text: "",
          selectedVoiceId: selectedVoiceIdRef.current || (speakers.length > 0 ? speakers[0].speaker_id : null),
          language: "en",
          speed: 1.0,
          volume: 100,
          isGenerating: false,
          outputs: []
        }]);
        setCurrentPage(1);
      }
      return;
    }

    if (!currentWorkspace.workspace_id) {
      // Workspace without ID (default workspace), start with empty block
      setSentenceBlocks([{
        id: 1,
        text: "",
        selectedVoiceId: selectedVoiceIdRef.current || (speakers.length > 0 ? speakers[0].speaker_id : null),
        language: "en",
        speed: 1.0,
        volume: 100,
        isGenerating: false,
        outputs: []
      }]);
      setCurrentPage(1);
      return;
    }

    // Handle loading state
    if (isLoadingWorkspaceContent) {
      return;
    }

    // Handle error state
    if (workspaceContentError) {
      console.error("Error loading workspace content:", workspaceContentError);
      setSentenceBlocks([{
        id: 1,
        text: "",
        selectedVoiceId: selectedVoiceIdRef.current || (speakers.length > 0 ? speakers[0].speaker_id : null),
        language: "en",
        speed: 1.0,
        volume: 100,
        isGenerating: false,
        outputs: []
      }]);
      setCurrentPage(1);
      return;
    }

    console.log('📂 Loaded workspace content:', workspaceContent);

    // Transform workspace content to sentence blocks
    if (workspaceContent && workspaceContent.text_list && Array.isArray(workspaceContent.text_list) && workspaceContent.text_list.length > 0) {
      const blocks = workspaceContent.text_list.map((item, index) => ({
        id: index + 1,
        text: item.text || "",
        selectedVoiceId: item.speaker || null,
        language: "en", // Default, can be extracted from item if available
        speed: parseFloat(item.speed) || 1.0,
        volume: parseInt(item.volume) || 100,
        isGenerating: false,
        outputs: item.url ? [{
          id: Date.now() + index,
          name: `Voice_${item.audio_id || 'output'}.mp3`,
          durationSec: 0,
          when: t("voicestudio.voicestudio.generatedJustNow"),
          audioUrl: item.url,
          persistentUrl: item.url, // Store as persistent URL since it came from server
          blob: null, // Will be fetched if needed
          volume: parseInt(item.volume) || 100,
          audio_id: item.audio_id || null, // Store audio_id from saved data
        }] : []
      }));

      setSentenceBlocks(blocks);
      setCurrentPage(1);
    } else {
      // Empty workspace, start with one empty block
      console.log('📂 Workspace is empty, starting with empty block');
      setSentenceBlocks([{
        id: 1,
        text: "",
        selectedVoiceId: selectedVoiceIdRef.current || (speakers.length > 0 ? speakers[0].speaker_id : null),
        language: "en",
        speed: 1.0,
        volume: 100,
        isGenerating: false,
        outputs: []
      }]);
      setCurrentPage(1);
    }
  }, [currentWorkspace, user, workspaceContent, isLoadingWorkspaceContent, workspaceContentError, t, speakers]);

  useEffect(() => {
    if (!speakers.length || selectedVoiceId) {
      return;
    }

    setSelectedVoiceId(speakers[0].speaker_id);
    setSentenceBlocks((prev) =>
      prev.map((block) => ({
        ...block,
        selectedVoiceId: block.selectedVoiceId || speakers[0].speaker_id,
      }))
    );
  }, [selectedVoiceId, speakers]);

  useEffect(() => {
    if (speakersError) {
      setError(speakersError);
    }
  }, [speakersError]);

  // Function to detect if text contains Myanmar script
  const detectMyanmarText = (text) => {
    // Myanmar Unicode range: U+1000 to U+109F
    const myanmarRegex = /[\u1000-\u109F]/;
    return myanmarRegex.test(text);
  };

  // Auto-detect language based on text content
  useEffect(() => {
    if (text.trim()) {
      const hasMyanmar = detectMyanmarText(text);
      if (hasMyanmar && language !== 'my') {
        console.log('🔍 Detected Myanmar text, auto-switching language to "my"');
        setLanguage('my');
      } else if (!hasMyanmar && language === 'my' && /^[a-zA-Z0-9\s.,!?;:'"()-]+$/.test(text.trim())) {
        // If text is clearly English (only ASCII), switch to English
        console.log('🔍 Detected English text, auto-switching language to "en"');
        setLanguage('en');
      }
    }
  }, [text, language]);

  // Get selected speaker object
  const selectedSpeaker = useMemo(() => {
    return speakers.find(s => s.speaker_id === selectedVoiceId);
  }, [speakers, selectedVoiceId]);

  // Handle voice generation
  const handleGenerateVoice = useCallback(async () => {
    if (!user || !selectedVoiceId || !text.trim()) {
      setError("Please select a voice and enter some text");
      return;
    }

    // Prevent duplicate generation if already generating
    if (isGenerating) {
      console.log('Already generating, ignoring duplicate request');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      // Auto-detect language from text if not manually set
      let detectedLanguage = language;
      const hasMyanmar = detectMyanmarText(text.trim());
      if (hasMyanmar) {
        detectedLanguage = 'my';
        if (language !== 'my') {
          console.log('🔍 Auto-detected Myanmar text, using language: my');
          setLanguage('my');
        }
      }

      const botnoiToken = await getBotnoiTokenHelper();
      
      // Debug: Log the language state before generating
      console.log('🎯 Current language state:', language);
      console.log('🔍 Detected language from text:', detectedLanguage);
      console.log('🎤 Selected speaker:', selectedSpeaker);
      console.log('📝 Text to generate:', text.trim());
      
      // Determine the correct language code to use (use detected language)
      let languageToUse = detectedLanguage;
      let availableLanguages = [];
      
      // Verify selected speaker supports the chosen language and get exact code
      if (selectedSpeaker) {
        availableLanguages = selectedSpeaker.available_language || [];
        console.log('🌐 Speaker available languages:', availableLanguages);
        
        // Try to find exact match first
        if (availableLanguages.includes(languageToUse)) {
          console.log('✅ Using exact language match:', languageToUse);
        } else {
          // Try to find a language that starts with our language code (e.g., 'my' matches 'my-MM')
          const matchingLang = availableLanguages.find(lang => 
            lang === languageToUse || 
            lang.startsWith(languageToUse + '-') || 
            lang.toLowerCase().startsWith(languageToUse.toLowerCase())
          );
          
          if (matchingLang) {
            languageToUse = matchingLang;
            console.log(`✅ Found matching language: '${detectedLanguage}' -> '${matchingLang}'`);
          } else {
            console.warn(`⚠️ Warning: Selected speaker may not support language '${languageToUse}'. Available:`, availableLanguages);
            
            // If trying to generate Myanmar but speaker doesn't support it, show error
            if (languageToUse === 'my' && !availableLanguages.includes('my') && !availableLanguages.some(lang => lang.startsWith('my'))) {
              throw new Error(`Selected speaker "${selectedSpeaker.eng_name || selectedSpeaker.speaker_name}" does not support Myanmar language. Please select a different speaker that supports Myanmar.`);
            }
            
            console.warn(`⚠️ Will try with '${languageToUse}' anyway, but it may default to English`);
          }
        }
      } else {
        console.warn('⚠️ No speaker selected');
      }
      
      // Final validation: if text is Myanmar but language is not 'my', warn user
      if (hasMyanmar && languageToUse !== 'my' && !availableLanguages.some(lang => lang.startsWith('my'))) {
        console.error('❌ Error: Myanmar text detected but language is not set to Myanmar');
        throw new Error('Myanmar text detected but language is set to English. Please select Myanmar from the language dropdown.');
      }
      
      // Generate voice with the determined language code
      const audioBlob = await generateVoice(botnoiToken, {
        text: text.trim(),
        speaker: selectedVoiceId,
        language: languageToUse, // Use the language code that matches speaker's available languages
        speed: speed,
        volume: volume,
        type_media: 'mp3',
        speaker_v2: selectedSpeaker?.isV2 || false,
      });

      // Validate the blob
      if (!audioBlob || audioBlob.size === 0) {
        throw new Error('Received empty or invalid audio blob from server');
      }

      console.log('Audio blob received:', {
        size: audioBlob.size,
        type: audioBlob.type,
        sizeKB: Math.round(audioBlob.size / 1024),
        sizeMB: (audioBlob.size / (1024 * 1024)).toFixed(2)
      });
      
      let processedBlob = audioBlob;
      
      // If blob is suspiciously small, it might be an error message
      if (audioBlob.size < 1024) { // Less than 1KB
        console.warn('Blob is very small, might be an error message. Checking content...');
        try {
          const text = await audioBlob.text();
          if (text.includes('error') || text.includes('Error') || text.trim().startsWith('{')) {
            throw new Error(`API may have returned an error: ${text.substring(0, 200)}`);
          }
          // If it's not text, recreate the blob from the original
          const arrayBuffer = await audioBlob.arrayBuffer();
          processedBlob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
        } catch (e) {
          if (e.message.includes('API may have returned')) {
            throw e;
          }
          console.warn('Could not check blob content:', e);
        }
      }

      // Verify it's actually an audio file by checking the first few bytes
      try {
        const arrayBuffer = await audioBlob.slice(0, 4).arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const header = Array.from(uint8Array).map(b => b.toString(16).padStart(2, '0')).join('');
        
        // Check for MP3 header (ID3 tag or MPEG frame sync)
        const isMP3 = header.startsWith('494433') || // ID3
                      header.startsWith('fffb') ||   // MPEG-1 Layer 3
                      header.startsWith('fff3') ||   // MPEG-1 Layer 3
                      header.startsWith('ffe3');     // MPEG-2 Layer 3
        
        if (!isMP3) {
          console.warn('Blob may not be a valid MP3 file. Header:', header);
        } else {
          console.log('Valid MP3 header detected:', header);
        }
      } catch (e) {
        console.warn('Could not verify blob header:', e);
      }

      // Ensure the blob has the correct MIME type
      if (!processedBlob.type || processedBlob.type === 'application/octet-stream') {
        // If no type is set, assume it's MP3
        processedBlob = new Blob([processedBlob], { type: 'audio/mpeg' });
        console.log('Set blob MIME type to audio/mpeg');
      }

      // Create audio URL from blob
      const audioUrl = URL.createObjectURL(processedBlob);
      
      const newOutputId = Date.now();
      
      // Create audio element to get duration and verify it's valid
      const audio = new Audio();
      
      // Preload the audio to ensure it's ready
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      
      let outputAdded = false;
      
      const addOutput = (durationSec = 0) => {
        if (outputAdded) {
          console.log('Output already added, skipping duplicate');
          return; // Prevent duplicate additions
        }
        
        outputAdded = true;
        const newOutput = {
          id: newOutputId,
          name: `Voice_${selectedSpeaker?.eng_name || 'output'}_${new Date().toISOString().split('T')[0]}.mp3`,
          durationSec: durationSec,
          when: t("voicestudio.voicestudio.generatedJustNow"),
          audioUrl: audioUrl,
          blob: processedBlob, // Store the processed blob
          volume: volume, // Store volume setting for playback
        };
        
        console.log('Adding output to list:', newOutput.id);
        setOutputs(prev => [newOutput, ...prev]);
      };
      
      // Use a single event handler to prevent duplicates
      let metadataHandlerCalled = false;
      
      audio.onloadedmetadata = () => {
        if (metadataHandlerCalled) {
          console.log('Metadata handler already called, skipping');
          return;
        }
        metadataHandlerCalled = true;
        
        if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
          const durationSec = Math.floor(audio.duration);
          console.log('Audio metadata loaded, duration:', durationSec);
          addOutput(durationSec);
        } else {
          console.warn('Audio duration is invalid:', audio.duration);
          addOutput(0);
        }
      };
      
      // Only use oncanplay as fallback if metadata doesn't load
      let canPlayHandlerCalled = false;
      audio.oncanplay = () => {
        if (canPlayHandlerCalled || metadataHandlerCalled) {
          return;
        }
        canPlayHandlerCalled = true;
        
        // Only add if metadata hasn't loaded after a delay
        setTimeout(() => {
          if (!outputAdded && (!audio.duration || isNaN(audio.duration))) {
            console.log('Audio can play but duration not available, adding with 0 duration');
            addOutput(0);
          }
        }, 500);
      };
      
      audio.onerror = (e) => {
        console.error("Error loading audio metadata:", e);
        console.error("Audio error code:", audio.error?.code);
        console.error("Audio error message:", audio.error?.message);
        
        // Only add output on error if it hasn't been added yet
        if (!outputAdded) {
          console.log('Adding output despite error (user can try to play manually)');
          addOutput(0);
        }
      };
      
      // Set the source and load
      audio.src = audioUrl;
      audio.load();
    } catch (err) {
      console.error("Error generating voice:", err);
      
      // Provide more helpful error messages
      let errorMessage = err.message || "Failed to generate voice";
      
      if (err.message && err.message.includes('403')) {
        errorMessage = "Access denied. Please check if your account has permission to generate voice, or if the selected speaker supports the chosen language.";
      } else if (err.message && err.message.includes('401')) {
        errorMessage = "Authentication failed. Please try logging out and back in.";
      } else if (err.message && err.message.includes('does not support')) {
        errorMessage = err.message; // Use the specific error message we created
      }
      
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, [user, selectedVoiceId, text, language, speed, volume, selectedSpeaker, t, isGenerating]);

  const characterCount = useMemo(() => {
    // Count total characters (including spaces)
    return text.length;
  }, [text]);

  // Transform speakers for LeftSidebar
  const voices = useMemo(() => {
    return speakers.map(speaker => ({
      id: speaker.speaker_id,
      name: speaker.eng_name || speaker.thai_name,
      tagline: speaker.eng_voice_style?.[0] || speaker.voice_style?.[0] || "",
      image: speaker.image,
      audio: speaker.audio,
      speaker: speaker, // Pass full speaker object
    }));
  }, [speakers]);

  // Calculate pagination - limit to maximum 4 pages
  const maxPages = 4;
  const maxBlocks = blocksPerPage * maxPages; // 15 * 4 = 60 blocks maximum
  const calculatedPages = Math.ceil(sentenceBlocks.length / blocksPerPage);
  const totalPages = Math.min(calculatedPages, maxPages);
  const startIndex = (currentPage - 1) * blocksPerPage;
  const endIndex = startIndex + blocksPerPage;
  const currentPageBlocks = sentenceBlocks.slice(startIndex, endIndex);
  const canAddMore = currentPageBlocks.length < blocksPerPage && sentenceBlocks.length < maxBlocks;

  // Add new sentence block
  const handleAddSentence = () => {
    // Check if we've reached the maximum number of blocks (60 = 4 pages * 15 blocks)
    if (sentenceBlocks.length >= maxBlocks) {
      setError("Maximum limit reached. You can only have up to 60 sentences (4 pages).");
      return;
    }

    // Check if current page is full (15 blocks)
    if (currentPageBlocks.length >= blocksPerPage) {
      // Check if we can move to next page (not exceeding max pages)
      const nextPage = currentPage + 1;
      if (nextPage <= maxPages) {
        setCurrentPage(nextPage);
      } else {
        setError("Maximum limit reached. You can only have up to 4 pages.");
        return;
      }
    }
    
    const newId = Math.max(...sentenceBlocks.map(b => b.id), 0) + 1;
    setSentenceBlocks(prev => [...prev, {
      id: newId,
      text: "",
      selectedVoiceId: selectedVoiceId || (speakers.length > 0 ? speakers[0].speaker_id : null),
      language: "en",
      speed: 1.0,
      volume: 100,
      isGenerating: false,
      outputs: []
    }]);
  };

  // Delete sentence block
  const handleDeleteSentence = (blockId) => {
    if (sentenceBlocks.length > 1) {
      setSentenceBlocks(prev => {
        const updated = prev.filter(block => block.id !== blockId);
        
        // Recalculate total pages after deletion
        const newTotalPages = Math.ceil(updated.length / blocksPerPage);
        
        // If current page is now empty or beyond total pages, go to last page
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
        
        return updated;
      });
    }
  };

  // Update sentence block
  const handleUpdateSentenceBlock = (blockId, updates) => {
    setSentenceBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    ));
  };

  // Generate voice for a specific sentence block
  const handleGenerateForBlock = useCallback(async (blockId) => {
    const block = sentenceBlocks.find(b => b.id === blockId);
    if (!block || !block.text.trim() || !user) {
      return;
    }

    if (generatingBlockId === blockId) {
      return; // Already generating
    }

    try {
      setGeneratingBlockId(blockId);
      setError(null);

      const botnoiToken = await getBotnoiTokenHelper();

      const selectedSpeaker = speakers.find(s => s.speaker_id === block.selectedVoiceId);
      if (!selectedSpeaker) {
        throw new Error('Please select a voice');
      }

      const result = await generateVoice(botnoiToken, {
        text: block.text.trim(),
        speaker: block.selectedVoiceId,
        language: block.language,
        speed: block.speed,
        volume: block.volume,
        type_media: 'mp3',
        speaker_v2: selectedSpeaker?.isV2 || false,
      });

      const audioBlob = result.blob;
      const persistentUrl = result.persistentUrl;
      const audio_id = result.audio_id;

      if (!audioBlob || audioBlob.size === 0) {
        throw new Error('Received empty or invalid audio blob from server');
      }

      // Prefer the generated blob URL for playback.
      // Persistent URLs can be signed/expired or blocked by CORS, which leads to NotSupportedError.
      const audioUrl = URL.createObjectURL(audioBlob) || persistentUrl;
      const newOutputId = Date.now();
      
      const audio = new Audio();
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      
      let outputAdded = false;
      
      const addOutput = async (durationSec = 0) => {
        if (outputAdded) return;
        outputAdded = true;
        
        const newOutput = {
          id: newOutputId,
          name: `Voice_${selectedSpeaker?.eng_name || 'output'}_${new Date().toISOString().split('T')[0]}.mp3`,
          durationSec: durationSec,
          when: t("voicestudio.voicestudio.generatedJustNow"),
          audioUrl: audioUrl,
          persistentUrl: persistentUrl, // Store persistent URL for saving
          blob: audioBlob,
          volume: block.volume,
          audio_id: audio_id, // Store audio_id for reference
        };
        
        // Replace block's outputs with only the new output (limit to one)
        handleUpdateSentenceBlock(blockId, {
          outputs: [newOutput]
        });
        
        // Also add to main outputs (for download all functionality)
        setOutputs(prev => [newOutput, ...prev]);
      };
      
      audio.onloadedmetadata = () => {
        if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
          addOutput(Math.floor(audio.duration));
        } else {
          addOutput(0);
        }
      };
      
      audio.onerror = () => {
        if (!outputAdded) {
          addOutput(0);
        }
      };
      
      audio.src = audioUrl;
      audio.load();
    } catch (err) {
      console.error("Error generating voice for block:", err);
      setError(err.message || "Failed to generate voice");
    } finally {
      setGeneratingBlockId(null);
    }
  }, [sentenceBlocks, user, speakers, generatingBlockId, t, currentWorkspace, handleUpdateSentenceBlock, getBotnoiTokenHelper]);

  // Workspace handlers
  const handleViewProject = useCallback(() => {
    // Open the view all projects modal
    setIsViewProjectsModalOpen(true);
  }, []);

  const handleCreateProject = useCallback(() => {
    if (!user) {
      setError("Please log in to create a project");
      return;
    }
    // Open the modal instead of using prompt
    setIsCreateProjectModalOpen(true);
  }, [user]);

  const handleDeleteProject = useCallback(async (project) => {
    if (!user || !project?.workspace_id) return;
  
    try {
      const botnoiToken = await getBotnoiTokenHelper();
  
      // 1) delete in backend
      await deleteWorkspace(botnoiToken, project.workspace_id);
  
      // 2) refresh list
      const fetchedWorkspaces = await getAllWorkspaces(botnoiToken);
      const transformedWorkspaces = fetchedWorkspaces.map((ws, index) => ({
        id: ws.workspace_id || ws.id || index + 1,
        workspace_id: ws.workspace_id || ws.id,
        name: normalizeWorkspaceName(ws.workspace || ws.name, index, t),
        type_workspace: ws.type_workspace || "conversation",
        isLoading: false
      }));
  
      setWorkspaces(transformedWorkspaces);
  
      // 3) if deleted current, switch to first (or null)
      if (currentWorkspace?.workspace_id === project.workspace_id) {
        setCurrentWorkspace(transformedWorkspaces[0] || null);
      }
    } catch (err) {
      console.error("Error deleting workspace:", err);
      setError(err.message || "Failed to delete project");
    }
  }, [user, getBotnoiTokenHelper, currentWorkspace]);
  

  const handleCreateProjectConfirm = useCallback(async (workspaceName) => {
    if (!user || !workspaceName || workspaceName.trim() === '') {
      return;
    }

    try {
      setIsCreatingWorkspace(true);
      const botnoiToken = await getBotnoiTokenHelper();

      const result = await createWorkspace(botnoiToken, {
        workspace: workspaceName.trim(),
        type_workspace: 'conversation'
      });

      console.log('✅ Workspace creation result:', result);

      // Small delay to ensure the workspace is saved on the server
      await new Promise(resolve => setTimeout(resolve, 500));

      // Refresh workspaces list
      const fetchedWorkspaces = await getAllWorkspaces(botnoiToken);
      console.log('📋 Fetched workspaces after creation:', fetchedWorkspaces);
      
      const transformedWorkspaces = fetchedWorkspaces.map((ws, index) => ({
        id: ws.workspace_id || ws.id || index + 1,
        workspace_id: ws.workspace_id || ws.id,
        name: normalizeWorkspaceName(ws.workspace || ws.name, index, t),
        type_workspace: ws.type_workspace || 'conversation',
        isLoading: false
      }));
      
      console.log('🔄 Transformed workspaces:', transformedWorkspaces);
      
      // If the new workspace is not in the list, add it manually
      const resultWorkspaceId = result?.workspace_id || result?.data?.workspace_id || result?.data?.id;
      const searchName = workspaceName.trim();
      
      console.log('🔍 Looking for workspace:', {
        resultWorkspaceId,
        searchName,
        availableWorkspaces: transformedWorkspaces.map(ws => ({ id: ws.workspace_id, name: ws.name }))
      });
      
      let newWorkspace = transformedWorkspaces.find(
        ws => 
          (resultWorkspaceId && ws.workspace_id === resultWorkspaceId) || 
          ws.name === searchName ||
          ws.name.toLowerCase() === searchName.toLowerCase()
      );
      
      // If not found, create it from the result
      if (!newWorkspace && result) {
        console.log('⚠️ New workspace not in list, creating from result:', result);
        newWorkspace = {
          id: resultWorkspaceId || transformedWorkspaces.length + 1,
          workspace_id: resultWorkspaceId || result.id,
          name: searchName,
          type_workspace: result.type_workspace || 'conversation',
          isLoading: false
        };
        
        // Add to the list
        transformedWorkspaces.push(newWorkspace);
        console.log('✅ Added new workspace to list:', newWorkspace);
      }
      
      setWorkspaces(transformedWorkspaces);
      
      if (newWorkspace) {
        console.log('✅ Found/created and selecting new workspace:', newWorkspace);
        setCurrentWorkspace(newWorkspace);
      } else if (transformedWorkspaces.length > 0) {
        console.warn('⚠️ Could not find or create workspace, selecting last one');
        setCurrentWorkspace(transformedWorkspaces[transformedWorkspaces.length - 1]);
      }
    } catch (err) {
      console.error("Error creating workspace:", err);
      setError(err.message || "Failed to create project");
    } finally {
      setIsCreatingWorkspace(false);
    }
  }, [user, getBotnoiTokenHelper]);

  const handleSelectProject = useCallback((project) => {
    setCurrentWorkspace(project);
  }, []);

  // Save sentence blocks to workspace
  const saveTextToWorkspace = useCallback(async () => {
    if (!currentWorkspace || !currentWorkspace.workspace_id || !user) {
      return;
    }

    try {
      setIsSavingWorkspace(true);
      const botnoiToken = await getBotnoiTokenHelper();
      
      // Transform sentence blocks to workspace text_list format
      const textList = sentenceBlocks
        // Only save blocks with text AND a generated audio with a persistent URL
        .filter(block => block.text.trim() !== '' && block.outputs && block.outputs.length > 0 && block.outputs[0]?.persistentUrl)
        .map(block => {
          const output = block.outputs && block.outputs.length > 0 ? block.outputs[0] : null;
          const selectedSpeaker = speakers.find(s => s.speaker_id === block.selectedVoiceId);
          
          // Validate speaker ID exists
          const speakerId = block.selectedVoiceId || (speakers.length > 0 ? speakers[0].speaker_id : null);
          if (!speakerId || !output?.persistentUrl) {
            console.warn('⚠️ Skipping save for block due to missing speaker or audio URL');
            return null;
          }
          
          // Use persistent URL from API response
          const audioUrl = output.persistentUrl;
          
          return {
            text: block.text.trim(),
            speaker: Number(speakerId) || 1, // API expects number
            speed: String(block.speed || 1.0),
            volume: String(block.volume || 100),
            speaker_v2: selectedSpeaker?.isV2 || false,
            clone_voice: false,
            audio_id: output?.audio_id || (output ? `AUDIO_${output.id}` : '') || '',
            url: audioUrl || '',
            status_download: false,
            avatar_img: "",
            avatar_video: ""
          };
        })
        .filter(item => item !== null); // Remove any null items (invalid data)

      // Avoid calling API with an empty payload (backend returns 422)
      if (textList.length === 0) {
        console.log("Skipping save: no text blocks to persist");
        setIsSavingWorkspace(false);
        return;
      }
      
      console.log('💾 Saving workspace with text_list:', {
        workspace_id: currentWorkspace.workspace_id,
        count: textList.length,
        items: textList
      });

      await saveWorkspaceText(botnoiToken, {
        workspace_id: currentWorkspace.workspace_id,
        text_list: textList
      });

      console.log("Workspace saved successfully");
      setSuccessMessage("Project saved successfully!");
      setError(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Error saving workspace:", err);
      setError(err.message || "Failed to save workspace");
    } finally {
      setIsSavingWorkspace(false);
    }
  }, [currentWorkspace, sentenceBlocks, speakers, user, getBotnoiTokenHelper]);

  const isPageLoading = isLoadingSpeakers || isLoadingWorkspaces;

  // Must run on every render (before conditional return) to satisfy Rules of Hooks
  const rightSidebarOutputs = useMemo(() => {
    const allOutputs = [];
    sentenceBlocks.forEach(block => {
      if (block.outputs && block.outputs.length > 0) {
        allOutputs.push(...block.outputs);
      }
    });
    const uniqueOutputs = [];
    const seenKeys = new Set();
    allOutputs.forEach(output => {
      const uniqueKey = output.id
        || output.audio_id
        || output.persistentUrl
        || output.audioUrl
        || `${output.name}_${Date.now()}`;
      if (!seenKeys.has(uniqueKey)) {
        seenKeys.add(uniqueKey);
        uniqueOutputs.push(output);
      }
    });
    return uniqueOutputs;
  }, [sentenceBlocks]);

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col overflow-hidden bg-white text-slate-800">
      {isPageLoading ? (
        <VoiceStudioSkeleton />
      ) : (
        <>
      {/* Workspace Component */}
      <Workspace
        currentProject={currentWorkspace ? {
          id: currentWorkspace.id,
          name: currentWorkspace.name,
          isLoading: isCreatingWorkspace || isLoadingWorkspaces
        } : null}
        projects={workspaces.filter(ws => ws.workspace_id !== currentWorkspace?.workspace_id)}
        onViewProject={handleViewProject}
        onCreateProject={handleCreateProject}
        onSelectProject={handleSelectProject}
        onSaveProject={saveTextToWorkspace}
        isLoading={isLoadingWorkspaces || isCreatingWorkspace}
      />
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-4 mt-4 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mx-4 mt-4 rounded">
          <p className="font-bold">Success</p>
          <p>{successMessage}</p>
        </div>
      )}
      <main className="flex flex-1 overflow-hidden relative">
        {/* Mobile and tablet overlay for sidebars */}
        {(isLeftSidebarOpen || isRightSidebarOpen) && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => {
              setIsLeftSidebarOpen(false);
              setIsRightSidebarOpen(false);
            }}
          />
        )}

        <LeftSidebar
          voices={voices}
          selectedVoiceId={activeBlockId 
            ? sentenceBlocks.find(b => b.id === activeBlockId)?.selectedVoiceId || selectedVoiceId
            : selectedVoiceId
          }
          setSelectedVoiceId={(voiceId) => {
            setSelectedVoiceId(voiceId);
            // Update the active block if one is selected
            if (activeBlockId) {
              handleUpdateSentenceBlock(activeBlockId, { selectedVoiceId: voiceId });
            } else {
              // Update all blocks that don't have a voice selected
              setSentenceBlocks(prev => prev.map(block => ({
                ...block,
                selectedVoiceId: block.selectedVoiceId || voiceId
              })));
            }
          }}
          isLoading={isLoadingSpeakers}
          isOpen={isLeftSidebarOpen}
          onClose={() => {
            setIsLeftSidebarOpen(false);
            setActiveBlockId(null);
          }}
        />

        {/* Sentence Blocks Container */}
        <section className="flex-1 flex flex-col bg-white relative min-w-0 overflow-y-auto">
          {/* Mobile and tablet sidebar toggle buttons */}
          <div className="lg:hidden flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-white z-20">
            <button
              type="button"
              onClick={() => setIsLeftSidebarOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              aria-label="Open voice library"
            >
              <span className="material-icons-round">library_music</span>
            </button>
            <button
              type="button"
              onClick={() => setIsRightSidebarOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              aria-label="Open output deck"
            >
              <span className="material-icons-round">queue_music</span>
            </button>
          </div>

          {/* Sentence Blocks */}
          <div className="flex-1 px-4 md:px-8 py-4 overflow-y-auto">
            {currentPageBlocks.map((block) => (
              <SentenceBlock
                key={block.id}
                id={block.id}
                text={block.text}
                setText={(newText) => handleUpdateSentenceBlock(block.id, { text: newText })}
                selectedVoiceId={block.selectedVoiceId}
                setSelectedVoiceId={(voiceId) => handleUpdateSentenceBlock(block.id, { selectedVoiceId: voiceId })}
                language={block.language}
                setLanguage={(lang) => handleUpdateSentenceBlock(block.id, { language: lang })}
                speed={block.speed}
                setSpeed={(spd) => handleUpdateSentenceBlock(block.id, { speed: spd })}
                volume={block.volume}
                setVolume={(vol) => handleUpdateSentenceBlock(block.id, { volume: vol })}
                onGenerate={() => handleGenerateForBlock(block.id)}
                isGenerating={generatingBlockId === block.id}
                onDelete={sentenceBlocks.length > 1 ? () => handleDeleteSentence(block.id) : null}
                onOpenVoiceSelector={(blockId) => {
                  setActiveBlockId(blockId);
                  setIsLeftSidebarOpen(true);
                }}
                onEdit={() => {
                  // Clear outputs for this block to return to normal state
                  handleUpdateSentenceBlock(block.id, {
                    outputs: []
                  });
                }}
                speakers={speakers}
                outputs={block.outputs || []}
                formatTime={formatTime}
              />
            ))}

            {/* Add Sentence Button */}
            <button
              type="button"
              onClick={handleAddSentence}
              disabled={sentenceBlocks.length >= maxBlocks}
              className={`w-full py-3 px-4 border-2 border-dashed rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                sentenceBlocks.length >= maxBlocks
                  ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-600'
              }`}
            >
              <span className="material-icons-round">add</span>
              {sentenceBlocks.length >= maxBlocks 
                ? `Maximum reached (${maxBlocks} sentences)` 
                : t("voicestudio.voicestudio.addSentence")}
            </button>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  <span className="material-icons-round text-sm">chevron_left</span>
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    {currentPage} / {totalPages}
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, maxPages, prev + 1))}
                  disabled={currentPage >= totalPages || currentPage >= maxPages}
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  <span className="material-icons-round text-sm">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        </section>

        <RightSidebar
          outputs={rightSidebarOutputs}
          formatTime={formatTime}
          isOpen={isRightSidebarOpen}
          onClose={() => setIsRightSidebarOpen(false)}
        />
      </main>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onCreate={handleCreateProjectConfirm}
      />

      {/* View Projects Modal */}
      <ViewProjectsModal
        isOpen={isViewProjectsModalOpen}
        onClose={() => setIsViewProjectsModalOpen(false)}
        projects={workspaces.filter(ws => ws.workspace_id !== currentWorkspace?.workspace_id)}
        currentProject={currentWorkspace ? {
          id: currentWorkspace.id,
          name: currentWorkspace.name,
          workspace_id: currentWorkspace.workspace_id,
          type_workspace: currentWorkspace.type_workspace
        } : null}
        onSelectProject={handleSelectProject}
        onDeleteProject={handleDeleteProject}
      />
        </>
      )}
    </div>
  );
}
