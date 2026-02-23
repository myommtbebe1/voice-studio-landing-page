import { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageContext.jsx";

// Custom hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageContextProvider");
  }
  return context;
}
