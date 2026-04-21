import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ViewProjectsModal from "../components/ViewProjectsModal.jsx";

vi.mock("../../../hooks/useLanguage.js", () => ({
  useLanguage: () => ({
    t: (key) => {
      const dict = {
        "workspace.viewAllProjects": "All Projects",
        "workspace.close": "Close",
        "workspace.delete": "Delete",
        "workspace.deleting": "Deleting...",
      };
      return dict[key] ?? key;
    },
  }),
}));

vi.mock("../../../utils/workspaceDisplayName.js", () => ({
  getWorkspaceDisplayName: (name) => `Display: ${name}`,
}));

describe("ViewProjectsModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("confirm", vi.fn(() => true));
  });

  it("renders projects and marks current one", () => {
    render(
      <ViewProjectsModal
        isOpen={true}
        onClose={vi.fn()}
        currentProject={{ id: 1, workspace_id: "ws-1", name: "Alpha", type_workspace: "conversation" }}
        projects={[{ id: 2, workspace_id: "ws-2", name: "Beta", type_workspace: "conversation" }]}
      />
    );

    expect(screen.getByText("All Projects")).toBeInTheDocument();
    expect(screen.getByText("Display: Alpha")).toBeInTheDocument();
    expect(screen.getByText("Display: Beta")).toBeInTheDocument();
    expect(screen.getByText("Current")).toBeInTheDocument();
  });

  it("selects project and closes modal", async () => {
    const user = userEvent.setup();
    const onSelectProject = vi.fn();
    const onClose = vi.fn();
    const beta = { id: 2, workspace_id: "ws-2", name: "Beta", type_workspace: "conversation" };

    render(
      <ViewProjectsModal
        isOpen={true}
        onClose={onClose}
        currentProject={{ id: 1, workspace_id: "ws-1", name: "Alpha", type_workspace: "conversation" }}
        projects={[beta]}
        onSelectProject={onSelectProject}
      />
    );

    await user.click(screen.getByRole("button", { name: /Display: Beta/i }));
    expect(onSelectProject).toHaveBeenCalledWith(beta);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("deletes project when confirmed", async () => {
    const user = userEvent.setup();
    const onDeleteProject = vi.fn().mockResolvedValueOnce();

    render(
      <ViewProjectsModal
        isOpen={true}
        onClose={vi.fn()}
        currentProject={{ id: 1, workspace_id: "ws-1", name: "Alpha", type_workspace: "conversation" }}
        projects={[{ id: 2, workspace_id: "ws-2", name: "Beta", type_workspace: "conversation" }]}
        onDeleteProject={onDeleteProject}
      />
    );

    const deleteButtons = screen.getAllByRole("button", { name: "Delete" });
    await user.click(deleteButtons[1]);

    expect(globalThis.confirm).toHaveBeenCalled();
    expect(onDeleteProject).toHaveBeenCalledTimes(1);
    expect(onDeleteProject).toHaveBeenCalledWith(
      expect.objectContaining({ workspace_id: "ws-2", name: "Beta" })
    );
  });
});
