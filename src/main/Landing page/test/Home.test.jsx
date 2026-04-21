import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Home from "../home.jsx";

vi.mock("../herosection", () => ({
  default: () => <div>HERO_SECTION</div>,
}));

vi.mock("../socialproof", () => ({
  default: () => <div>SOCIAL_PROOF_SECTION</div>,
}));

vi.mock("../featuregrid.jsx", () => ({
  default: () => <div>FEATURE_GRID_SECTION</div>,
}));

vi.mock("../ourbestfeature.jsx", () => ({
  default: () => <div>OUR_BEST_FEATURE_SECTION</div>,
}));

vi.mock("../voiceshowcase.jsx", () => ({
  default: () => <div>VOICE_SHOWCASE_SECTION</div>,
}));

vi.mock("../ctabanner.jsx", () => ({
  default: () => <div>CTA_BANNER_SECTION</div>,
}));

vi.mock("../fqasection.jsx", () => ({
  default: () => <div>FAQ_SECTION</div>,
}));

vi.mock("../footer.jsx", () => ({
  default: () => <div>FOOTER_SECTION</div>,
}));

describe("Landing page Home", () => {
  it("renders all landing sections", () => {
    render(<Home />);

    expect(screen.getByText("HERO_SECTION")).toBeInTheDocument();
    expect(screen.getByText("SOCIAL_PROOF_SECTION")).toBeInTheDocument();
    expect(screen.getByText("FEATURE_GRID_SECTION")).toBeInTheDocument();
    expect(screen.getByText("OUR_BEST_FEATURE_SECTION")).toBeInTheDocument();
    expect(screen.getByText("VOICE_SHOWCASE_SECTION")).toBeInTheDocument();
    expect(screen.getByText("CTA_BANNER_SECTION")).toBeInTheDocument();
    expect(screen.getByText("FAQ_SECTION")).toBeInTheDocument();
    expect(screen.getByText("FOOTER_SECTION")).toBeInTheDocument();
  });
});
