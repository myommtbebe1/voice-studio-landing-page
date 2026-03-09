import { createContext, useState, useEffect } from "react";
import React from "react";
import { t } from "../language file/i18n.js";

const LanguageContext = createContext();

export default function LanguageContextProvider({ children }) {
  // Get saved language from localStorage or default to 'en'
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("language");
    return saved || "en";
  });

  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // When returning from Stripe (or any link with ?lang=), restore language from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get("lang");
    if (langParam === "my" || langParam === "en") {
      setLanguage(langParam);
    }
  }, []);

  // Translation function that uses current language
  const translate = (key) => {
    return t(language, key);
  };

  // Function to change language
  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  const value = {
    language,
    changeLanguage,
    t: translate,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export { LanguageContext };
