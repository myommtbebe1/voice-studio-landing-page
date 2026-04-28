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

  it("creates project when pressing Enter with non-empty input", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    const onClose = vi.fn();
    render(<CreateProjectModal isOpen={true} onClose={onClose} onCreate={onCreate} />);

    const input = screen.getByPlaceholderText("Project name");
    await user.type(input, "Studio Project");
    await user.keyboard("{Enter}");

    expect(onCreate).toHaveBeenCalledWith("Studio Project");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not create project when input is only whitespace", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    const onClose = vi.fn();
    render(<CreateProjectModal isOpen={true} onClose={onClose} onCreate={onCreate} />);

    const input = screen.getByPlaceholderText("Project name");
    await user.type(input, "   ");
    const saveButton = screen.getByRole("button", { name: "Save" });
    expect(saveButton).toBeDisabled();
    await user.click(saveButton);

    expect(onCreate).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes when clicking modal backdrop", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = render(
      <CreateProjectModal isOpen={true} onClose={onClose} onCreate={vi.fn()} />
    );

    const backdrop = container.querySelector(".fixed.inset-0.bg-black\\/50");
    await user.click(backdrop);
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
