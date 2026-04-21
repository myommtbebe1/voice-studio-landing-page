import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Workspace from "../components/Workspace.jsx";

vi.mock("../../../hooks/useLanguage.js", () => ({
  useLanguage: () => ({
    t: (key) => {
      const dict = {
        "workspace.defaultProjectName": "Project 1",
        "workspace.loading": "Loading",
        "workspace.viewProject": "View project",
        "workspace.createProject": "Create project",
        "workspace.saveProject": "Save project",
      };
      return dict[key] ?? key;
    },
  }),
}));

vi.mock("../../../utils/workspaceDisplayName.js", () => ({
  getWorkspaceDisplayName: (name) => `Display: ${name}`,
}));

describe("Workspace", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders current project and save button", () => {
    render(
      <Workspace
        currentProject={{ id: 10, name: "Alpha", isLoading: false }}
        onSaveProject={vi.fn()}
      />
    );

    expect(screen.getByText("Display: Alpha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Save project/i })).toBeInTheDocument();
  });

  it("opens dropdown and triggers view/create/select callbacks", async () => {
    const user = userEvent.setup();
    const onViewProject = vi.fn();
    const onCreateProject = vi.fn();
    const onSelectProject = vi.fn();
    const projectB = { id: 2, workspace_id: "ws-2", name: "Beta", isLoading: false };

    render(
      <Workspace
        currentProject={{ id: 1, workspace_id: "ws-1", name: "Alpha", isLoading: false }}
        projects={[projectB]}
        onViewProject={onViewProject}
        onCreateProject={onCreateProject}
        onSelectProject={onSelectProject}
      />
    );

    await user.click(screen.getByRole("button", { name: /Display: Alpha/i }));
    await user.click(screen.getByRole("button", { name: /View project/i }));
    expect(onViewProject).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: /Display: Alpha/i }));
    await user.click(screen.getByRole("button", { name: /Create project/i }));
    expect(onCreateProject).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: /Display: Alpha/i }));
    await user.click(screen.getByRole("button", { name: /Display: Beta/i }));
    expect(onSelectProject).toHaveBeenCalledWith(projectB);
  });
});
