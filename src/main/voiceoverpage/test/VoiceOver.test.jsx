import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthContext } from "../../../contexts/AuthContext.jsx";
import VoiceOver from "../VoiceOver.jsx";

const mockUseCachedAllSpeakers = vi.fn();
const mockGetUserBotnoiToken = vi.fn();
const heroPropsSpy = vi.fn();
const gridPropsSpy = vi.fn();

vi.mock("../../../hooks/useCachedAllSpeakers.js", () => ({
  useCachedAllSpeakers: () => mockUseCachedAllSpeakers(),
}));

vi.mock("../../../utils/botnoiToken.js", () => ({
  getUserBotnoiToken: (...args) => mockGetUserBotnoiToken(...args),
}));

vi.mock("../VCHerosection", () => ({
  default: (props) => {
    heroPropsSpy(props);
    return <div>VOICE_OVER_HERO_SECTION</div>;
  },
}));

vi.mock("../VoiceCardsGrid", () => ({
  default: (props) => {
    gridPropsSpy(props);
    return <div>VOICE_OVER_CARDS_GRID_SECTION</div>;
  },
}));

function renderVoiceOver(user = null) {
  return render(
    <AuthContext.Provider value={{ user, authReady: true }}>
      <VoiceOver />
    </AuthContext.Provider>
  );
}

describe("Voice Over page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCachedAllSpeakers.mockReturnValue({
      speakers: [],
      loading: false,
      error: null,
    });
    mockGetUserBotnoiToken.mockResolvedValue("token-123");
  });

  it("renders voice over hero and cards sections", () => {
    renderVoiceOver();

    expect(screen.getByText("VOICE_OVER_HERO_SECTION")).toBeInTheDocument();
    expect(screen.getByText("VOICE_OVER_CARDS_GRID_SECTION")).toBeInTheDocument();
  });

  it("sorts speakers, deduplicates by speaker and version, and puts test voice last", async () => {
    mockUseCachedAllSpeakers.mockReturnValue({
      speakers: [
        { speaker_id: "2", eng_name: "Beta", isV2: false },
        { speaker_id: "1", eng_name: "Alpha", isV2: false },
        { speaker_id: "1", eng_name: "Alpha Duplicate", isV2: false },
        { speaker_id: "1", eng_name: "Alpha V2", isV2: true },
        { speaker_id: "test", eng_name: "Test", isV2: false },
      ],
      loading: false,
      error: null,
    });

    renderVoiceOver();

    await waitFor(() => {
      expect(heroPropsSpy).toHaveBeenCalled();
    });

    const lastHeroProps = heroPropsSpy.mock.calls.at(-1)[0];
    expect(lastHeroProps.speakers).toHaveLength(4);
    expect(lastHeroProps.speakers.map((s) => `${s.speaker_id}_${s.isV2 ? "v2" : "v1"}`)).toEqual([
      "1_v1",
      "1_v2",
      "2_v1",
      "test_v1",
    ]);
  });

  it("fetches Botnoi token when user is available and forwards it to child sections", async () => {
    const user = { uid: "u-1" };
    renderVoiceOver(user);

    await waitFor(() => {
      expect(mockGetUserBotnoiToken).toHaveBeenCalledWith(user);
    });

    const heroProps = heroPropsSpy.mock.calls.at(-1)[0];
    const gridProps = gridPropsSpy.mock.calls.at(-1)[0];
    expect(heroProps.botnoiToken).toBe("token-123");
    expect(gridProps.botnoiToken).toBe("token-123");
  });

  it("does not fetch token when user is missing and keeps botnoiToken null", async () => {
    renderVoiceOver(null);

    await waitFor(() => {
      expect(heroPropsSpy).toHaveBeenCalled();
    });

    expect(mockGetUserBotnoiToken).not.toHaveBeenCalled();
    const heroProps = heroPropsSpy.mock.calls.at(-1)[0];
    const gridProps = gridPropsSpy.mock.calls.at(-1)[0];
    expect(heroProps.botnoiToken).toBe(null);
    expect(gridProps.botnoiToken).toBe(null);
  });

  it("falls back to null botnoiToken when token fetch fails", async () => {
    const user = { uid: "u-2" };
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockGetUserBotnoiToken.mockRejectedValueOnce(new Error("token failed"));

    renderVoiceOver(user);

    await waitFor(() => {
      expect(mockGetUserBotnoiToken).toHaveBeenCalledWith(user);
    });

    const heroProps = heroPropsSpy.mock.calls.at(-1)[0];
    const gridProps = gridPropsSpy.mock.calls.at(-1)[0];
    expect(heroProps.botnoiToken).toBe(null);
    expect(gridProps.botnoiToken).toBe(null);
    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it("forwards loading and error states from speaker hook to child sections", async () => {
    mockUseCachedAllSpeakers.mockReturnValue({
      speakers: [{ speaker_id: "10", eng_name: "Demo", isV2: false }],
      loading: true,
      error: new Error("load failed"),
    });

    renderVoiceOver();

    await waitFor(() => {
      expect(heroPropsSpy).toHaveBeenCalled();
      expect(gridPropsSpy).toHaveBeenCalled();
    });

    const heroProps = heroPropsSpy.mock.calls.at(-1)[0];
    const gridProps = gridPropsSpy.mock.calls.at(-1)[0];
    expect(heroProps.loading).toBe(true);
    expect(gridProps.loading).toBe(true);
    expect(heroProps.speakers).toEqual([{ speaker_id: "10", eng_name: "Demo", isV2: false }]);
    expect(gridProps.speakers).toEqual([{ speaker_id: "10", eng_name: "Demo", isV2: false }]);
  });

  it("re-fetches token when auth user changes", async () => {
    const firstUser = { uid: "u-1" };
    const secondUser = { uid: "u-2" };
    mockGetUserBotnoiToken
      .mockResolvedValueOnce("token-user-1")
      .mockResolvedValueOnce("token-user-2");

    const { rerender } = render(
      <AuthContext.Provider value={{ user: firstUser, authReady: true }}>
        <VoiceOver />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(mockGetUserBotnoiToken).toHaveBeenCalledWith(firstUser);
    });

    rerender(
      <AuthContext.Provider value={{ user: secondUser, authReady: true }}>
        <VoiceOver />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(mockGetUserBotnoiToken).toHaveBeenCalledWith(secondUser);
    });

    const heroProps = heroPropsSpy.mock.calls.at(-1)[0];
    const gridProps = gridPropsSpy.mock.calls.at(-1)[0];
    expect(heroProps.botnoiToken).toBe("token-user-2");
    expect(gridProps.botnoiToken).toBe("token-user-2");
  });

  it("clears token after user logs out", async () => {
    const user = { uid: "u-logout" };
    mockGetUserBotnoiToken.mockResolvedValueOnce("token-before-logout");

    const { rerender } = render(
      <AuthContext.Provider value={{ user, authReady: true }}>
        <VoiceOver />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(mockGetUserBotnoiToken).toHaveBeenCalledWith(user);
    });

    rerender(
      <AuthContext.Provider value={{ user: null, authReady: true }}>
        <VoiceOver />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      const latestHeroProps = heroPropsSpy.mock.calls.at(-1)[0];
      expect(latestHeroProps.botnoiToken).toBe(null);
    });

    const heroProps = heroPropsSpy.mock.calls.at(-1)[0];
    const gridProps = gridPropsSpy.mock.calls.at(-1)[0];
    expect(heroProps.botnoiToken).toBe(null);
    expect(gridProps.botnoiToken).toBe(null);
  });

  it("keeps deterministic order and dedupes same id/version using name sort fallback", async () => {
    mockUseCachedAllSpeakers.mockReturnValue({
      speakers: [
        { speaker_id: "5", eng_name: "Zeta", isV2: false },
        { speaker_id: "5", eng_name: "Alpha", isV2: false },
        { speaker_id: "5", eng_name: "Alpha", isV2: true },
      ],
      loading: false,
      error: null,
    });

    renderVoiceOver();

    await waitFor(() => {
      expect(heroPropsSpy).toHaveBeenCalled();
    });

    const heroProps = heroPropsSpy.mock.calls.at(-1)[0];
    expect(heroProps.speakers.map((s) => `${s.eng_name}_${s.isV2 ? "v2" : "v1"}`)).toEqual(["Alpha_v1", "Alpha_v2"]);
  });

  it("moves test speakers to the end when marked by eng_name or thai_name", async () => {
    mockUseCachedAllSpeakers.mockReturnValue({
      speakers: [
        { speaker_id: "9", eng_name: "Normal", isV2: false },
        { speaker_id: "3", eng_name: "TEST", isV2: false },
        { speaker_id: "1", thai_name: "test", isV2: true },
      ],
      loading: false,
      error: null,
    });

    renderVoiceOver();

    await waitFor(() => {
      expect(heroPropsSpy).toHaveBeenCalled();
    });

    const heroProps = heroPropsSpy.mock.calls.at(-1)[0];
    expect(heroProps.speakers.map((s) => s.eng_name || s.thai_name)).toEqual(["Normal", "TEST", "test"]);
  });

  it("uses thai_name fallback when eng_name is missing for deterministic sorting", async () => {
    mockUseCachedAllSpeakers.mockReturnValue({
      speakers: [
        { speaker_id: "7", thai_name: "Zulu", isV2: false },
        { speaker_id: "7", thai_name: "Alpha", isV2: true },
      ],
      loading: false,
      error: null,
    });

    renderVoiceOver();

    await waitFor(() => {
      expect(heroPropsSpy).toHaveBeenCalled();
    });

    const heroProps = heroPropsSpy.mock.calls.at(-1)[0];
    expect(heroProps.speakers.map((s) => `${s.thai_name}_${s.isV2 ? "v2" : "v1"}`)).toEqual(["Zulu_v1", "Alpha_v2"]);
  });

  it("does not re-fetch token when rerendered with the same user object", async () => {
    const sameUser = { uid: "stable-user" };

    const { rerender } = render(
      <AuthContext.Provider value={{ user: sameUser, authReady: true }}>
        <VoiceOver />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(mockGetUserBotnoiToken).toHaveBeenCalledTimes(1);
      expect(mockGetUserBotnoiToken).toHaveBeenCalledWith(sameUser);
    });

    rerender(
      <AuthContext.Provider value={{ user: sameUser, authReady: true }}>
        <VoiceOver />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(heroPropsSpy).toHaveBeenCalled();
    });
    expect(mockGetUserBotnoiToken).toHaveBeenCalledTimes(1);
  });
});
