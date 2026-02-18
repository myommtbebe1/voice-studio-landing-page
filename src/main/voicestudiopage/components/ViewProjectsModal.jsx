import { useState } from "react";
import { useLanguage } from "../../../hooks/useLanguage.js";

export default function ViewProjectsModal({
  isOpen,
  onClose,
  projects = [],
  currentProject = null,
  onSelectProject = null,
  onDeleteProject = null,      // ✅ NEW
  isDeleting = false,          // ✅ NEW (optional)
}) {
  const { t } = useLanguage();
  const [deletingId, setDeletingId] = useState(null);

  if (!isOpen) return null;

  // Combine current project with other projects
  const allProjects = currentProject
    ? [currentProject, ...projects.filter(p => p.workspace_id !== currentProject.workspace_id)]
    : projects;

  const handleSelectProject = (project) => {
    if (onSelectProject) onSelectProject(project);
    onClose();
  };

  const handleDelete = async (e, project, isCurrent) => {
    e.stopPropagation(); // ✅ prevent selecting when clicking delete

    if (!project?.workspace_id) {
      alert("This project has no workspace_id yet. Please refresh and try again.");
      return;
    }

    if (isCurrent) {
      const ok = window.confirm(
        "This is the current project. Delete it anyway?"
      );
      if (!ok) return;
    } else {
      const ok = window.confirm(`Delete project "${project.name}"?`);
      if (!ok) return;
    }

    try {
      setDeletingId(project.workspace_id);
      if (onDeleteProject) {
        await onDeleteProject(project);
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              {t("workspace.viewAllProjects") || "All Projects"}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <span className="material-icons-round text-xl">close</span>
            </button>
          </div>

          {/* Projects List */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {allProjects.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <span className="material-icons-round text-6xl text-slate-300 mb-4 block">
                  folder_open
                </span>
                <p className="text-lg font-medium">No projects found</p>
                <p className="text-sm mt-2">Create your first project to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {allProjects.map((project) => {
                  const isCurrent =
                    currentProject &&
                    (project.workspace_id === currentProject.workspace_id ||
                      project.id === currentProject.id);

                  const canDelete = !!project.workspace_id; // must exist to call API
                  const busy =
                    isDeleting ||
                    (deletingId && deletingId === project.workspace_id);

                  return (
                    <button
                      key={project.id || project.workspace_id}
                      type="button"
                      onClick={() => handleSelectProject(project)}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg border-2 transition-all text-left ${
                        isCurrent
                          ? "bg-blue-50 border-blue-300 hover:bg-blue-100"
                          : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <span
                        className={`material-icons-round text-2xl ${
                          isCurrent ? "text-blue-600" : "text-slate-400"
                        }`}
                      >
                        {project.isLoading ? "hourglass_empty" : "folder"}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold text-base ${
                              isCurrent ? "text-blue-700" : "text-slate-800"
                            }`}
                          >
                            {project.name}
                          </span>

                          {isCurrent && (
                            <span className="px-2 py-0.5 bg-blue-200 text-blue-700 text-xs font-medium rounded">
                              Current
                            </span>
                          )}
                        </div>

                        {project.type_workspace && (
                          <span className="text-xs text-slate-500 mt-1 block">
                            {project.type_workspace}
                          </span>
                        )}
                      </div>

                      {/* ✅ Delete button */}
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, project, isCurrent)}
                        disabled={!canDelete || busy}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                          !canDelete || busy
                            ? "border-slate-200 text-slate-400 cursor-not-allowed"
                            : "border-red-300 text-red-600 hover:bg-red-50"
                        }`}
                        title={!canDelete ? "This project has no workspace_id yet" : "Delete"}
                      >
                        {busy ? (t("workspace.deleting") || "Deleting...") : (t("workspace.delete") || "Delete")}
                      </button>

                      <span
                        className={`material-icons-round ${
                          isCurrent ? "text-blue-600" : "text-slate-400"
                        }`}
                      >
                        chevron_right
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              {t("workspace.close") || "Close"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
