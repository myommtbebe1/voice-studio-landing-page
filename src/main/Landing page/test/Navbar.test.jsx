import { render, screen } from "@testing-library/react";
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
  default: ({ isOpen }) => <div data-testid="login-form-state">{isOpen ? "OPEN" : "CLOSED"}</div>,
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

  it("calls logout and navigates home for authenticated user", async () => {
    const user = userEvent.setup();
    mockLogout.mockResolvedValueOnce();
    renderNavbar({ uid: "u-1" });

    await user.click(screen.getByRole("button", { name: "Log Out" }));

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
