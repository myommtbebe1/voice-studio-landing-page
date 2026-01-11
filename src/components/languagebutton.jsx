import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";

import React from "react";

function LanguageButton() {
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const dropdownRef = useRef(null);

  const languages = [
    { code: "en", name: "English" },
    { code: "my", name: "မြန်မာ" }, // Burmese
  ];

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.name);
    setIsLangDropdownOpen(false);
    // Add your language change logic here
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLangDropdownOpen(false);
      }
    };

    if (isLangDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLangDropdownOpen]);
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="lang-btn flex items-center gap-2"
        onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
      >
        {/* <FontAwesomeIcon icon={faEarthAmericas} className="lang-btn-icon" /> */}
        <span className="text-sm text-gray-600 font-semibold">
          {selectedLanguage === "English" ? "EN" : "MY"}
        </span>
        <FontAwesomeIcon
          icon={faAngleDown}
          className="lang-btn-icon"
          style={{
            transform: isLangDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            fontSize: "14px"
          }}
        />
      </button>
      {isLangDropdownOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg  py-1 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 ${
                selectedLanguage === lang.name
                  ? "bg-blue-100 text-primary font-semibold"
                  : "text-gray-700"
              }`}
            >
              <span>{lang.name}</span>
              {selectedLanguage === lang.name && (
                <span className="ml-auto text-primary">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageButton;
