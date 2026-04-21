import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CreateProjectModal from "../components/CreateProjectModal.jsx";

vi.mock("../../../hooks/useLanguage.js", () => ({
  useLanguage: () => ({
    t: (key) => key,
  }),
}));

describe("CreateProjectModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when closed", () => {
    render(<CreateProjectModal isOpen={false} onClose={vi.fn()} onCreate={vi.fn()} />);
    expect(screen.queryByText("Name the project")).not.toBeInTheDocument();
  });

  it("creates project with trimmed name and closes modal", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    const onClose = vi.fn();

    render(<CreateProjectModal isOpen={true} onClose={onClose} onCreate={onCreate} />);

    const input = screen.getByPlaceholderText("Project name");
    await user.type(input, "  New Voice Project  ");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onCreate).toHaveBeenCalledWith("New Voice Project");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape key", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<CreateProjectModal isOpen={true} onClose={onClose} onCreate={vi.fn()} />);
    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
