import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AuthContext } from "../../../contexts/AuthContext.jsx";
import VoiceOver from "../VoiceOver.jsx";

const mockUseCachedAllSpeakers = vi.fn();
const mockGetUserBotnoiToken = vi.fn();
const mockGenerateVoice = vi.fn();

const voiceoverDict = {
  "voiceover.allVoices": "All voices",
  "voiceover.all": "All",
  "voiceover.premium": "Premium",
  "voiceover.new": "New",
  "voiceover.free": "Free",
  "voiceover.searchPlaceholder": "Search voices",
  "voiceover.language": "Language",
  "voiceover.style": "Style",
  "voiceover.category": "Category",
  "voiceover.genderAge": "Gender / Age",
  "voiceover.version": "Version",
  "voiceover.selectAll": "Select all",
  "voiceover.clear": "Clear",
  "voiceover.noVoicesMatching": "No voices match filters",
  "voiceover.noVoicesAvailable": "No voices available",
  "voiceover.availableLanguages": "Available languages",
  "voiceover.over400Voices": "400+ voices",
  "voiceover.heroSubtitle": "Hero subtitle",
};

vi.mock("../../../hooks/useCachedAllSpeakers.js", () => ({
  useCachedAllSpeakers: () => mockUseCachedAllSpeakers(),
}));

vi.mock("../../../utils/botnoiToken.js", () => ({
  getUserBotnoiToken: (...args) => mockGetUserBotnoiToken(...args),
}));

vi.mock("../../../hooks/useLanguage.js", () => ({
  useLanguage: () => ({
    language: "en",
    t: (key) => voiceoverDict[key] ?? key,
  }),
}));

vi.mock("../../../firebase/voiceApi.js", () => ({
  generateVoice: (...args) => mockGenerateVoice(...args),
}));

function makeSpeaker(id, overrides = {}) {
  return {
    speaker_id: String(id),
    eng_name: `Voice ${id}`,
    isV2: false,
    tier: "basic",
    popularity: "standard",
    available_language: ["en", "th"],
    eng_voice_style: ["Warm"],
    eng_speech_style: ["Storytelling"],
    eng_gender: "Female",
    eng_age_style: "Adult",
    audio: `https://example.com/audio-${id}.mp3`,
    image: null,
    ...overrides,
  };
}

/** Enough speakers to exercise pagination (15 per page). */
function speakerListForPagination() {
  return Array.from({ length: 18 }, (_, i) =>
    makeSpeaker(i + 1, { eng_name: `Paginated ${i + 1}` })
  );
}

function installAudioMock() {
  globalThis.Audio = vi.fn(function AudioCtor(url) {
    const inst = {
      src: url ?? "",
      onplay: null,
      onended: null,
      onerror: null,
      play: vi.fn(() => {
        queueMicrotask(() => inst.onplay?.());
        return Promise.resolve();
      }),
      pause: vi.fn(() => {
        inst.onplay = inst.onplay;
      }),
    };
    return inst;
  });
}

function renderVoiceOverPage(user = null, speakers = [], options = {}) {
  const { loading = false, error = null } = options;
  mockUseCachedAllSpeakers.mockReturnValue({ speakers, loading, error });
  return render(
    <AuthContext.Provider value={{ user, authReady: true }}>
      <VoiceOver />
    </AuthContext.Provider>
  );
}

describe("Voice Over page — functional integration", () => {
  let alertSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    installAudioMock();
    mockUseCachedAllSpeakers.mockReturnValue({
      speakers: [],
      loading: false,
      error: null,
    });
    mockGetUserBotnoiToken.mockResolvedValue("botnoi-token");
    mockGenerateVoice.mockResolvedValue({ persistentUrl: "https://example.com/generated.mp3" });
    Element.prototype.scrollIntoView = vi.fn();
    globalThis.URL.createObjectURL = vi.fn(() => "blob:mock-url");
    globalThis.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  describe("page shell and data wiring", () => {
    it("renders hero copy and the marketplace grid heading", () => {
      renderVoiceOverPage(null, [makeSpeaker(1)]);

      expect(screen.getByRole("heading", { name: /AI voice/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "All voices" })).toBeInTheDocument();
    });

    it("shows loading skeletons in hero and grid while speakers are loading", () => {
      renderVoiceOverPage(null, [], { loading: true });

      const pulses = document.querySelectorAll(".animate-pulse");
      expect(pulses.length).toBeGreaterThan(0);
    });

    it("fetches Botnoi token once for a signed-in user and does not call again after logout", async () => {
      const user = { uid: "u-1" };
      mockUseCachedAllSpeakers.mockReturnValue({
        speakers: [makeSpeaker(1)],
        loading: false,
        error: null,
      });

      const { rerender } = render(
        <AuthContext.Provider value={{ user, authReady: true }}>
          <VoiceOver />
        </AuthContext.Provider>
      );

      await waitFor(() => {
        expect(mockGetUserBotnoiToken).toHaveBeenCalledTimes(1);
        expect(mockGetUserBotnoiToken).toHaveBeenCalledWith(user);
      });

      rerender(
        <AuthContext.Provider value={{ user: null, authReady: true }}>
          <VoiceOver />
        </AuthContext.Provider>
      );

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: "All voices" })).toBeInTheDocument();
      });
      expect(mockGetUserBotnoiToken).toHaveBeenCalledTimes(1);
    });
  });

  describe("VoiceCardsGrid — upper tabs and search", () => {
    it("filters to premium voices when Premium tab is active", async () => {
      const user = userEvent.setup();
      const speakers = [
        makeSpeaker(1, { eng_name: "Basic Ana", isV2: false, tier: "basic" }),
        makeSpeaker(2, { eng_name: "Pro Ben", isV2: true, tier: "pro" }),
      ];
      renderVoiceOverPage(null, speakers);

      await user.click(screen.getByRole("button", { name: "Premium" }));

      expect(screen.getByRole("heading", { name: "Pro Ben" })).toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "Basic Ana" })).not.toBeInTheDocument();
    });

    it("filters to free-tier / V1 voices when Free tab is active", async () => {
      const user = userEvent.setup();
      const speakers = [
        makeSpeaker(1, { eng_name: "V1 Carla", isV2: false }),
        makeSpeaker(2, { eng_name: "V2 Dan", isV2: true, tier: "pro" }),
      ];
      renderVoiceOverPage(null, speakers);

      await user.click(screen.getByRole("button", { name: "Free" }));

      expect(screen.getByRole("heading", { name: "V1 Carla" })).toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "V2 Dan" })).not.toBeInTheDocument();
    });

    it("narrows cards by search query on name", async () => {
      const user = userEvent.setup();
      const speakers = [
        makeSpeaker(1, { eng_name: "Alpha" }),
        makeSpeaker(2, { eng_name: "Beta" }),
      ];
      renderVoiceOverPage(null, speakers);

      const search = screen.getByPlaceholderText("Search voices");
      await user.type(search, "Beta");

      expect(screen.getByRole("heading", { name: "Beta" })).toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "Alpha" })).not.toBeInTheDocument();
    });

    it("clears search when clear control is used", async () => {
      const user = userEvent.setup();
      const speakers = [
        makeSpeaker(1, { eng_name: "Alpha" }),
        makeSpeaker(2, { eng_name: "Beta" }),
      ];
      renderVoiceOverPage(null, speakers);

      const search = screen.getByPlaceholderText("Search voices");
      await user.type(search, "Beta");
      await user.click(screen.getByRole("button", { name: "Clear search" }));

      expect(search).toHaveValue("");
      expect(screen.getByRole("heading", { name: "Alpha" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Beta" })).toBeInTheDocument();
    });
  });

  describe("VoiceCardsGrid — dropdown filters", () => {
    it("filters by selected language", async () => {
      const user = userEvent.setup();
      const speakers = [
        makeSpeaker(1, { eng_name: "English only", available_language: ["en"] }),
        makeSpeaker(2, { eng_name: "Thai only", available_language: ["th"] }),
      ];
      renderVoiceOverPage(null, speakers);

      await user.click(screen.getByRole("button", { name: /Language/i }));
      const panel = screen.getByText("English").closest(".absolute");
      expect(panel).toBeTruthy();
      await user.click(within(panel).getByRole("button", { name: /English/i }));

      expect(screen.getByRole("heading", { name: "English only" })).toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "Thai only" })).not.toBeInTheDocument();
    });

    it("closes language dropdown when clicking outside", async () => {
      const user = userEvent.setup();
      renderVoiceOverPage(null, [makeSpeaker(1)]);

      await user.click(screen.getByRole("button", { name: /Language/i }));
      expect(screen.getByText("Select all")).toBeInTheDocument();

      await user.click(screen.getByRole("heading", { name: "All voices" }));

      expect(screen.queryByText("Select all")).not.toBeInTheDocument();
    });
  });

  describe("VoiceCardsGrid — pagination", () => {
    it("shows second page of cards after clicking page 2", async () => {
      const user = userEvent.setup();
      renderVoiceOverPage(null, speakerListForPagination());

      expect(screen.getByRole("heading", { name: "Paginated 1" })).toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "Paginated 16" })).not.toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "2" }));

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: "Paginated 16" })).toBeInTheDocument();
      });
      expect(screen.queryByRole("heading", { name: "Paginated 1" })).not.toBeInTheDocument();
      expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    });

    it("resets to page 1 when search changes", async () => {
      const user = userEvent.setup();
      const speakers = speakerListForPagination();
      renderVoiceOverPage(null, speakers);

      await user.click(screen.getByRole("button", { name: "2" }));
      await waitFor(() => {
        expect(screen.getByRole("heading", { name: "Paginated 16" })).toBeInTheDocument();
      });

      const search = screen.getByPlaceholderText("Search voices");
      await user.type(search, "Paginated 1");

      expect(screen.getByRole("heading", { name: "Paginated 1" })).toBeInTheDocument();
    });
  });

  describe("VoiceCardsGrid — empty states", () => {
    it("shows no-match copy when filters exclude all speakers", async () => {
      const user = userEvent.setup();
      renderVoiceOverPage(null, [makeSpeaker(1, { eng_name: "Solo", available_language: ["en"] })]);

      await user.click(screen.getByRole("button", { name: /Language/i }));
      const panel = screen.getByText("Japanese").closest(".absolute");
      await user.click(within(panel).getByRole("button", { name: /Japanese/i }));

      expect(screen.getByText("No voices match filters")).toBeInTheDocument();
    });

    it("shows no-voices-available when the marketplace list is empty and not loading", () => {
      renderVoiceOverPage(null, [], { loading: false });

      expect(screen.getByText("No voices available")).toBeInTheDocument();
    });
  });

  describe("VoiceCardsGrid — preview playback", () => {
    it("alerts when a voice has no preview URL", async () => {
      const user = userEvent.setup();
      const speakers = [
        makeSpeaker(1, {
          eng_name: "NoClip",
          audio: undefined,
          sample_audio: undefined,
          demo_audio_url: undefined,
          voice_sample_url: undefined,
        }),
      ];
      renderVoiceOverPage(null, speakers);

      const card = screen.getByRole("heading", { name: "NoClip" }).closest(".bg-white");
      const playBtn = within(card).getAllByRole("button")[0];
      await user.click(playBtn);

      expect(alertSpy).toHaveBeenCalledWith("Preview not available for this voice.");
    });
  });

  describe("VCHerosection — playback and generate fallback", () => {
    let consoleLogSpy;

    beforeEach(() => {
      consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
      consoleLogSpy?.mockRestore();
    });

    it("plays preview URL without calling generateVoice when sample exists", async () => {
      const user = userEvent.setup();
      const speakers = [
        makeSpeaker(1, { eng_name: "Hero One", audio: "https://example.com/hero1.mp3" }),
        makeSpeaker(2, { eng_name: "Hero Two" }),
        makeSpeaker(3, { eng_name: "Hero Three" }),
      ];
      renderVoiceOverPage({ uid: "u-hero" }, speakers);

      await waitFor(() => {
        expect(mockGetUserBotnoiToken).toHaveBeenCalled();
      });

      const heroRegion = screen.getByRole("heading", { name: /AI voice/i }).closest("div");
      const heroCard = within(heroRegion.closest(".relative.flex")).getByText("Hero One").closest(".relative.group");
      const playButtons = within(heroCard).getAllByRole("button");
      await user.click(playButtons[0]);

      await waitFor(() => {
        expect(mockGenerateVoice).not.toHaveBeenCalled();
      });
      expect(globalThis.Audio).toHaveBeenCalled();
    });

    it("calls generateVoice when no preview exists and token is present", async () => {
      const user = userEvent.setup();
      const speakers = [
        makeSpeaker(1, {
          eng_name: "Hero Gen",
          audio: undefined,
          sample_audio: undefined,
          demo_audio_url: undefined,
          voice_sample_url: undefined,
          voice_audio: undefined,
          preview_audio: undefined,
          available_language: ["en"],
        }),
        makeSpeaker(2, { eng_name: "Hero B" }),
        makeSpeaker(3, { eng_name: "Hero C" }),
      ];
      renderVoiceOverPage({ uid: "u-gen" }, speakers);

      await waitFor(() => {
        expect(mockGetUserBotnoiToken).toHaveBeenCalled();
      });

      const heroRegion = screen.getByRole("heading", { name: /AI voice/i }).closest("div");
      const heroCard = within(heroRegion.closest(".relative.flex")).getByText("Hero Gen").closest(".relative.group");
      await user.click(within(heroCard).getAllByRole("button")[0]);

      await waitFor(() => {
        expect(mockGenerateVoice).toHaveBeenCalledWith(
          "botnoi-token",
          expect.objectContaining({
            speaker: "1",
            language: "en",
            speaker_v2: false,
          })
        );
      });
    });

    it("alerts when generate fallback needs auth but token is missing", async () => {
      const user = userEvent.setup();
      mockGetUserBotnoiToken.mockResolvedValue(null);
      const speakers = [
        makeSpeaker(1, {
          eng_name: "Hero NoTok",
          audio: undefined,
          sample_audio: undefined,
          demo_audio_url: undefined,
          voice_sample_url: undefined,
          voice_audio: undefined,
          preview_audio: undefined,
          available_language: ["en"],
        }),
        makeSpeaker(2, { eng_name: "Hero B2" }),
        makeSpeaker(3, { eng_name: "Hero C2" }),
      ];
      renderVoiceOverPage({ uid: "u-null-token" }, speakers);

      await waitFor(() => {
        expect(mockGetUserBotnoiToken).toHaveBeenCalled();
      });

      const heroRegion = screen.getByRole("heading", { name: /AI voice/i }).closest("div");
      const heroCard = within(heroRegion.closest(".relative.flex")).getByText("Hero NoTok").closest(".relative.group");
      await user.click(within(heroCard).getAllByRole("button")[0]);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith("Authentication required. Please refresh the page.");
      });
    });
  });
});
