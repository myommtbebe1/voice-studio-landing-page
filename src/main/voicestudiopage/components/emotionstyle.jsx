import React from 'react'
import { useState } from "react";
import { useLanguage } from "../../../hooks/useLanguage";

function Emotionstyle({ setShowPremiumPopup }) {
    const {t}=useLanguage();
    const [showEmotionMenu, setShowEmotionMenu] = useState(false);
    const [emotionType, setEmotionType] = useState("normal");
    
    const handleEmotionChange = (type) => {
        if (type === "premium") {
          // Show premium popup instead of changing directly
          setShowPremiumPopup(true);
          setShowEmotionMenu(false);
        } else {
          setEmotionType(type);
          setShowEmotionMenu(false);
        }
      };
     
  return (
    <>
     <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmotionMenu(!showEmotionMenu)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              <span className="material-icons-round text-sm md:text-base text-slate-400">
                sentiment_satisfied
              </span>
              {emotionType === "normal" ? t("voicestudio.editor.normal") : (
                <span className="flex items-center gap-1">
                  {t("voicestudio.editor.premium")}
                  <span className="text-pink-500">😊</span>
                </span>
              )}
              <span className="material-icons-round text-sm md:text-base text-slate-400">
                expand_more
              </span>
            </button>
            {showEmotionMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-[140px]">
                <button
                  type="button"
                  onClick={() => handleEmotionChange("normal")}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
                    emotionType === "normal" ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                  }`}
                >
                  {t("voicestudio.editor.normal")}
                </button>
                <button
                  type="button"
                  onClick={() => handleEmotionChange("premium")}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center justify-between ${
                    emotionType === "premium" ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                  }`}
                >
                  <span>{t("voicestudio.editor.premium")}</span>
                  <span className="text-pink-500">😊</span>
                </button>
              </div>
            )}
    </div>
    
    </>
    
  )
}

export default Emotionstyle;