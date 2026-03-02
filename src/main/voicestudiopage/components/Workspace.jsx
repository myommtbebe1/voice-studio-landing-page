import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../../../hooks/useLanguage.js";

export default function Workspace({ 
  currentProject = null,
  projects = [],
  onViewProject = null,
  onCreateProject = null,
  onSelectProject = null,
  onSaveProject = null,
  isLoading = false
}) {
  const { t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Default project if none provided
  const defaultProject = currentProject || {
    id: 1,
    name: t("workspace.defaultProjectName") || "Project 1",
    isLoading: isLoading
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleViewProject = () => {
    if (onViewProject) {
      onViewProject(defaultProject);
    }
    setIsDropdownOpen(false);
  };

  const handleCreateProject = () => {
    if (onCreateProject) {
      onCreateProject();
    }
    setIsDropdownOpen(false);
  };

  const handleSelectProject = (project) => {
    if (onSelectProject) {
      onSelectProject(project);
    }
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-white border-b border-slate-200">
      {/* Project Dropdown Section */}
      <div className="px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex-1 relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <span className="truncate">
            {defaultProject.isLoading 
              ? `${defaultProject.name} (${t("workspace.loading") || "Loading"})`
              : defaultProject.name
            }
          </span>
          <span className={`material-icons-round text-xs text-slate-400 ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-full left-4 md:left-8 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
            {/* View Project Option */}
            <button
              type="button"
              onClick={handleViewProject}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <span className="material-icons-round text-base text-slate-500">
                folder
              </span>
              <span>{t("workspace.viewProject") || "View project"}</span>
            </button>

            {/* Create Project Option */}
            <button
              type="button"
              onClick={handleCreateProject}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100"
            >
              <span className="material-icons-round text-base text-slate-500">
                add_circle
              </span>
              <span>{t("workspace.createProject") || "Create project"}</span>
            </button>

            {/* Current Project with Loading State - Highlighted */}
            <div className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 border-t border-slate-100">
              <span className="material-icons-round text-base text-slate-500">
                {defaultProject.isLoading ? 'hourglass_empty' : 'folder'}
              </span>
              <span className="text-sm text-slate-700">
                {defaultProject.isLoading 
                  ? `${defaultProject.name} (${t("workspace.loading") || "Loading"})`
                  : defaultProject.name
                }
              </span>
            </div>

            {/* Project List (if multiple projects) */}
            {projects && projects.length > 0 && (
              <>
                <div className="border-t border-slate-200"></div>
                {projects.map((project) => (
                  <button
                    key={project.id || project.workspace_id}
                    type="button"
                    onClick={() => handleSelectProject(project)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100"
                  >
                    <span className="material-icons-round text-base text-slate-500">
                      {project.isLoading ? 'hourglass_empty' : 'folder'}
                    </span>
                    <span className="truncate">
                      {project.isLoading 
                        ? `${project.name} (${t("workspace.loading") || "Loading"})`
                        : project.name
                      }
                    </span>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
        </div>

        {/* Save Project Button */}
        {onSaveProject && currentProject && currentProject.id && (
          <button
            type="button"
            onClick={onSaveProject}
            className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
          >
            <span className="material-icons-round text-base">save</span>
            <span>{t("workspace.saveProject") || "Save project"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
