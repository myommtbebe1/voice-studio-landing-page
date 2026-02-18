import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../hooks/useLanguage.js";
import React from "react";

function LanguageButton() {
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const { language, changeLanguage } = useLanguage();
  const dropdownRef = useRef(null);

  const handleSelect = (lang) => {
    changeLanguage(lang);
    setIsLangDropdownOpen(false);
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
        <span className="text-sm text-gray-600 font-semibold uppercase">
          {language === "en" ? "EN" : "MM"}
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
            <button
        onClick={() => handleSelect("en")}
        className={`px-3 py-2 w-full text-left rounded ${
          language === "en"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        English
      </button>
      <button
        onClick={() => handleSelect("my")}
        className={`px-3 py-2 w-full text-left rounded ${
          language === "my"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        မြန်မာ
      </button>
        </div>
      )}
    </div>
  );
}

export default LanguageButton;
