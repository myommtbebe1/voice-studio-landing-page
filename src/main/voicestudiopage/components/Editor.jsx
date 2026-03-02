import { useState } from "react";
import { useLanguage } from "../../../hooks/useLanguage.js";
import Emotionstyle from "./emotionstyle.jsx";
import PremiumPopup from "../../../components/normalpopup.jsx";


export default function Editor({ 
  text, 
  setText, 
  characterCount, 
  onGenerate, 
  isGenerating,
  language,
  setLanguage,
  speed,
  setSpeed,
  volume,
  setVolume,
  onOpenLeftSidebar,
  onOpenRightSidebar,
}) {
  const { t } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showEmotionMenu, setShowEmotionMenu] = useState(false);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const handlePurchase = () => {
    // Handle purchase logic here
    console.log("Navigate to purchase page or payment flow");
    // After successful purchase, you can:
    // setEmotionType("premium");
  };
  const handleGenerate = () => {
    if (!text.trim()) {
      return;
    }
    onGenerate?.();
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    // Limit to 1000 characters total (including spaces)
    if (newText.length <= 1000) {
      setText(newText);
    }
  };

  return (
    <section className="flex-1 flex flex-col bg-white relative min-w-0">
      {/* Mobile and tablet sidebar toggle buttons */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-white z-20">
        <button
          type="button"
          onClick={onOpenLeftSidebar}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          aria-label="Open voice library"
        >
          <span className="material-icons-round">library_music</span>
        </button>
        <button
          type="button"
          onClick={onOpenRightSidebar}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          aria-label="Open output deck"
        >
          <span className="material-icons-round">queue_music</span>
        </button>
      </div>

      {/* textarea */}
      <div className="flex-1 px-4 md:px-8 py-1 relative min-h-0">
        <textarea
          className="w-full h-full bg-transparent border-none resize-none focus:ring-0 text-lg md:text-xl leading-relaxed text-slate-800 placeholder-slate-300 font-normal p-0 outline-none"
          placeholder={t("voicestudio.editor.placeholder")}
          value={text}
          onChange={handleTextChange}
          disabled={isGenerating}
        />
        <div className="absolute bottom-2 right-4 md:right-8 text-xs font-medium text-slate-400 bg-white/80 px-2 py-1 backdrop-blur-sm rounded">
          {characterCount}/1000 characters
        </div>
      </div>

      {/* switchandgenerate */}
      <div className="border-t border-slate-100 bg-[#DCE2F2] px-4 md:px-8 py-2 md:py-3 space-y-2 md:space-y-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] z-10 shrink-0">
        <div className="flex flex-wrap gap-1.5 md:gap-2">
          {/* Language Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              <span className="material-icons-round text-xs text-slate-400">
                flag
              </span>
              {language === 'en' ? 'English' : language === 'my' ? 'Myanmar' : language}
              <span className="material-icons-round text-xs text-slate-400">
                expand_more
              </span>
            </button>
            {showLanguageMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-[120px]">
                <button
                  type="button"
                  onClick={() => {
                    setLanguage('en');
                    setShowLanguageMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
                    language === 'en' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLanguage('my');
                    setShowLanguageMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
                    language === 'my' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                  }`}
                >
                  Myanmar
                </button>
              </div>
            )}
          </div>

          {/* Emotion/Style - Placeholder for now */}
          <Emotionstyle setShowPremiumPopup={setShowPremiumPopup} />

          {/* Speed Selector */}
          <div className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 whitespace-nowrap">
            <span className="material-icons-round text-xs text-slate-400">
              speed
            </span>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-16 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs">{speed.toFixed(1)}x</span>
          </div>

          {/* Volume Display */}
          <div className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 whitespace-nowrap">
            <span className="material-icons-round text-xs text-slate-400">
              volume_up
            </span>
            <input
              type="range"
              min="0"
              max="200"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-14 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs">{volume}%</span>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={() => setText("")}
            className="flex items-center justify-center px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            <span className="material-icons-round text-xs text-slate-400">close</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">
            {t("voicestudio.editor.premiumQuota")} <span className="text-indigo-600 ml-1">2 {t("voicestudio.editor.times")}</span>
          </span>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !text.trim()}
            className={`
              w-full sm:w-auto px-6 md:px-8 py-2.5
              text-white font-bold rounded-full shadow-lg
              bg-gradient-to-r from-indigo-500 to-purple-600
              hover:from-indigo-600 hover:to-purple-700
              hover:shadow-xl hover:-translate-y-0.5
              transition-all duration-200
              ${isGenerating || !text.trim() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Generating...
              </span>
            ) : (
              t("voicestudio.editor.generate")
            )}
          </button>
        </div>
      </div>
      
      {/* Click outside to close menus */}
      {(showLanguageMenu || showSpeedMenu || showEmotionMenu) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowLanguageMenu(false);
            setShowSpeedMenu(false);
            setShowEmotionMenu(false);
          }}
        />
      )}

    <PremiumPopup 
        isOpen={showPremiumPopup}
        onClose={() => setShowPremiumPopup(false)}
        onPurchase={handlePurchase}
      />
    </section>
  );
}

{/* <div className="border-t border-slate-100 bg-white px-4 md:px-8 py-4 md:py-6 space-y-4 md:space-y-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] z-10 shrink-0"> */}