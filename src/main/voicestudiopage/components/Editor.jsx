export default function Editor({ text, setText, wordCount, onGenerate, isGenerating }) {
  return (
    <section className="flex-1 flex flex-col bg-white relative min-w-0">
      <div className="h-12 flex items-center justify-end px-4 md:px-8 pt-4 shrink-0">
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="text-slate-400">Saving...</span>
          <a
            className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors"
            href="#"
          >
            Version History{" "}
            <span className="material-icons-round text-sm">history</span>
          </a>
        </div>
      </div>

      <div className="flex-1 px-4 md:px-8 py-4 relative">
        <textarea
          className="w-full h-full bg-transparent border-none resize-none focus:ring-0 text-lg md:text-xl leading-relaxed text-slate-800 placeholder-slate-300 font-normal p-0 outline-none"
          placeholder="Type or paste your script here ..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="absolute bottom-4 right-8 text-xs font-medium text-slate-400 bg-white/80 px-2 py-1 backdrop-blur-sm rounded">
          {wordCount}/5000 words
        </div>
      </div>

      <div className="border-t border-slate-100 bg-white px-4 md:px-8 py-4 md:py-6 space-y-4 md:space-y-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] z-10 shrink-0">
        <div className="flex flex-wrap gap-2 md:gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            <span className="material-icons-round text-sm md:text-base text-slate-400">
              flag
            </span>
            Myanmar
            <span className="material-icons-round text-sm md:text-base text-slate-400">
              expand_more
            </span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            <span className="material-icons-round text-sm md:text-base text-slate-400">
              sentiment_satisfied
            </span>
            Normal
            <span className="material-icons-round text-sm md:text-base text-slate-400">
              expand_more
            </span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            <span className="material-icons-round text-sm md:text-base text-slate-400">
              speed
            </span>
            1.0x
            <span className="material-icons-round text-sm md:text-base text-slate-400">
              expand_more
            </span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            <span className="material-icons-round text-sm md:text-base text-slate-400">
              volume_up
            </span>
            100%
          </button>
        </div>

        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-indigo-600 transition-colors flex items-center justify-center shrink-0"
            >
              <span className="material-icons-round text-lg md:text-xl">history</span>
            </button>

            <button
              type="button"
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-indigo-600 transition-colors flex items-center justify-center shrink-0"
            >
              <span className="material-icons-round text-lg md:text-xl">
                content_cut
              </span>
            </button>

            <button
              type="button"
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-red-500 transition-colors flex items-center justify-center shrink-0"
            >
              <span className="material-icons-round text-lg md:text-xl">close</span>
            </button>

            <button
              type="button"
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-indigo-100 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors flex items-center justify-center shadow-sm shrink-0"
            >
              <span className="material-icons-round text-lg md:text-xl">
                auto_awesome
              </span>
            </button>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center gap-3 sm:gap-5 w-full xl:w-auto">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">
              Premium Quota <span className="text-indigo-600 ml-1">2 times</span>
            </span>

            <button
              type="button"
              className="
                w-full sm:w-auto px-6 md:px-8 py-2.5
                text-white font-bold rounded-full shadow-lg
                bg-gradient-to-r from-indigo-500 to-purple-600
                hover:from-indigo-600 hover:to-purple-700
                hover:shadow-xl hover:-translate-y-0.5
                transition-all duration-200
                cursor-pointer
              "
            >
              Generate
            </button>



          </div>
        </div>
      </div>
    </section>
  );
}
