import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../navbar.jsx";
import { AuthContext } from "../../../contexts/AuthContext.jsx";

const mockNavigate = vi.fn();
const mockLogout = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../../hooks/useSignout", () => ({
  default: () => ({
    logout: mockLogout,
  }),
}));

vi.mock("../../../hooks/useLanguage.js", () => ({
  useLanguage: () => ({
    t: (key) => {
      const dict = {
        "nav.studio": "Studio",
        "nav.voicestudio": "Voice Studio",
        "nav.howItWorks": "How It Works",
        "nav.api": "API",
        "nav.pricing": "Pricing",
        "nav.report": "Report",
        "nav.login": "Log In",
        "nav.logout": "Log Out",
        "nav.payment": "Payment",
        "nav.profile": "User profile",
      };
      return dict[key] ?? key;
    },
  }),
}));

vi.mock("../../../components/languagebutton.jsx", () => ({
  default: () => <button>Language</button>,
}));

vi.mock("../../Login and checkout/LoginForm.jsx", () => ({
  default: ({ isOpen, onClose }) => (
    <div>
      <div data-testid="login-form-state">{isOpen ? "OPEN" : "CLOSED"}</div>
      <button type="button" onClick={onClose}>
        CLOSE_LOGIN_FORM
      </button>
    </div>
  ),
}));

function renderNavbar(user = null) {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user, authReady: true }}>
        <Navbar />
      </AuthContext.Provider>
    </MemoryRouter>
  );
}


describe("Landing page Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("shows login UI when user is not authenticated", () => {
    renderNavbar(null);

    expect(screen.getByText("Botnoi Voice")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument();
    expect(screen.getByTestId("login-form-state")).toHaveTextContent("CLOSED");
  });

  it("opens login modal when clicking Log In", async () => {
    const user = userEvent.setup();
    renderNavbar(null);

    await user.click(screen.getByRole("button", { name: "Log In" }));

    expect(screen.getByTestId("login-form-state")).toHaveTextContent("OPEN");
  });

  it("closes login modal when LoginForm calls onClose", async () => {
    const user = userEvent.setup();
    renderNavbar(null);

    await user.click(screen.getByRole("button", { name: "Log In" }));
    expect(screen.getByTestId("login-form-state")).toHaveTextContent("OPEN");

    await user.click(screen.getByRole("button", { name: "CLOSE_LOGIN_FORM" }));
    expect(screen.getByTestId("login-form-state")).toHaveTextContent("CLOSED");
  });

  it("opens mobile menu and closes it via close button", async () => {
    const user = userEvent.setup();
    renderNavbar(null);

    await user.click(screen.getByRole("button", { name: "Toggle menu" }));
    expect(screen.getByRole("heading", { name: "Menu" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close menu" }));
    expect(screen.queryByRole("heading", { name: "Menu" })).not.toBeInTheDocument();
  });

  it("sets redirect target and opens login when guest clicks desktop Voice Studio", async () => {
    const user = userEvent.setup();
    renderNavbar(null);

    await user.click(screen.getAllByText("Voice Studio")[0]);

    expect(screen.getByTestId("login-form-state")).toHaveTextContent("OPEN");
    expect(sessionStorage.getItem("redirectAfterLogin")).toBe("/VoiceStudio");
  });

  it("sets redirect target and opens login from mobile Voice Over button", async () => {
    const user = userEvent.setup();
    renderNavbar(null);

    await user.click(screen.getByRole("button", { name: "Toggle menu" }));
    await user.click(screen.getByRole("button", { name: "Voice Over" }));

    expect(screen.queryByRole("heading", { name: "Menu" })).not.toBeInTheDocument();
    expect(screen.getByTestId("login-form-state")).toHaveTextContent("OPEN");
    expect(sessionStorage.getItem("redirectAfterLogin")).toBe("/VoiceOver");
  });

  it("shows profile image for authenticated user and falls back to icon on error", () => {
    const { container } = renderNavbar({ uid: "u-1", photoURL: "https://example.com/me.png" });

    const profileImage = container.querySelector('button[aria-label="User profile"] img');
    expect(profileImage).toBeInTheDocument();

    fireEvent.error(profileImage);
    expect(container.querySelector('button[aria-label="User profile"] img')).not.toBeInTheDocument();
  });

  it("resets profile image error when authenticated user identity changes", () => {
    const { rerender, container } = render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: { uid: "u-1", photoURL: "https://example.com/one.png" }, authReady: true }}>
          <Navbar />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    const firstImage = container.querySelector('button[aria-label="User profile"] img');
    fireEvent.error(firstImage);
    expect(container.querySelector('button[aria-label="User profile"] img')).not.toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: { uid: "u-2", photoURL: "https://example.com/two.png" }, authReady: true }}>
          <Navbar />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(container.querySelector('button[aria-label="User profile"] img')).toBeInTheDocument();
  });

  it("toggles points dropdown on hover for authenticated user", () => {
    renderNavbar({ uid: "u-1" });

    const pointsButton = screen.getByRole("button", { name: "100 Pts" });
    const hoverContainer = pointsButton.closest("div");
    expect(screen.queryByText("Point: 100 pts")).not.toBeInTheDocument();

    fireEvent.mouseEnter(hoverContainer);
    expect(screen.getByText("Point: 100 pts")).toBeInTheDocument();

    fireEvent.mouseLeave(hoverContainer);
    expect(screen.queryByText("Point: 100 pts")).not.toBeInTheDocument();
  });

  it("calls logout and navigates home for authenticated user", async () => {
    const user = userEvent.setup();
    mockLogout.mockResolvedValueOnce();
    renderNavbar({ uid: "u-1" });

    await user.click(screen.getByRole("button", { name: "Log Out" }));

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
