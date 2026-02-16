import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../../../hooks/useLanguage.js";

export default function CreateProjectModal({ isOpen, onClose, onCreate }) {
  const { t } = useLanguage();
  const [projectName, setProjectName] = useState("");
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setProjectName("");
    }
  }, [isOpen]);

  const handleSave = () => {
    if (projectName.trim()) {
      onCreate(projectName.trim());
      setProjectName("");
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && projectName.trim()) {
      handleSave();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center text-slate-800 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <span className="material-icons-round text-xl">close</span>
          </button>

          {/* Title */}
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pr-8">
            Name the project
          </h2>

          {/* Input Field */}
          <div className="mb-6">
            <label 
              htmlFor="project-name-input"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Enter a new project name
            </label>
            <input
              ref={inputRef}
              id="project-name-input"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Project name"
              className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-800 placeholder-slate-400 text-base"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!projectName.trim()}
              className={`px-5 py-2.5 rounded-lg transition-colors font-medium ${
                projectName.trim()
                  ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
