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

  it("uses default project name when current project is missing", () => {
    render(<Workspace onSaveProject={vi.fn()} />);
    expect(screen.getByRole("button", { name: /Display: Project 1/i })).toBeInTheDocument();
  });

  it("shows loading state label when current project is loading", () => {
    render(
      <Workspace
        currentProject={{ id: 10, name: "Alpha", isLoading: true }}
        onSaveProject={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: /Display: Alpha \(Loading\)/i })).toBeInTheDocument();
  });

  it("closes dropdown when clicking outside", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Workspace
          currentProject={{ id: 1, workspace_id: "ws-1", name: "Alpha", isLoading: false }}
          projects={[{ id: 2, workspace_id: "ws-2", name: "Beta", isLoading: false }]}
          onSelectProject={vi.fn()}
        />
        <button type="button">OUTSIDE_TARGET</button>
      </div>
    );

    await user.click(screen.getByRole("button", { name: /Display: Alpha/i }));
    expect(screen.getByRole("button", { name: /Display: Beta/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "OUTSIDE_TARGET" }));
    expect(screen.queryByRole("button", { name: /Display: Beta/i })).not.toBeInTheDocument();
  });

  it("passes default project to onViewProject when no current project", async () => {
    const user = userEvent.setup();
    const onViewProject = vi.fn();

    render(<Workspace onViewProject={onViewProject} />);

    await user.click(screen.getByRole("button", { name: /Display: Project 1/i }));
    await user.click(screen.getByRole("button", { name: /View project/i }));

    expect(onViewProject).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        name: "Project 1",
      })
    );
  });

  it("hides save button when current project id is missing", () => {
    render(
      <Workspace
        currentProject={{ name: "No Id Project", isLoading: false }}
        onSaveProject={vi.fn()}
      />
    );

    expect(screen.queryByRole("button", { name: /Save project/i })).not.toBeInTheDocument();
  });
});
