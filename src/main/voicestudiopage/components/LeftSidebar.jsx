export default function LeftSidebar({
  voices,
  selectedVoiceId,
  setSelectedVoiceId,
}) {
  return (
    <aside className="hidden md:flex flex-col shrink-0 z-10 bg-[#eef2ff] border-r border-indigo-100 transition-all duration-300 ease-in-out md:w-20 lg:w-72 xl:w-80">
      {/* Header */}
      <div className="px-3 lg:px-5 py-5 flex justify-center lg:justify-between items-center">
        <h2 className="hidden lg:block text-xs font-bold text-slate-500 uppercase tracking-wider">
          Voice Library
        </h2>

        <span className="material-icons-round text-indigo-400 lg:hidden">
          library_music
        </span>

        <button
          type="button"
          className="hidden lg:block px-3 py-1 text-xs font-semibold bg-white text-slate-700 rounded border border-indigo-200 shadow-sm hover:shadow transition-shadow"
        >
          Manage
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-2 lg:px-5 pb-5 space-y-6">
        {/* Search */}
        <div className="relative group flex justify-center lg:block">
          <span className="lg:absolute left-3 top-2.5 text-indigo-400 material-icons-round text-sm">
            search
          </span>
          <input
            type="text"
            placeholder="Search voices"
            className="hidden lg:block w-full bg-white border border-indigo-100 rounded-lg py-2 pl-9 pr-4 text-sm placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 shadow-sm transition-all"
          />
        </div>

        {/* Voice List */}
        <div className="space-y-3">
          {voices.map((voice) => {
            const active = selectedVoiceId === voice.id;

            return (
              <button
                key={voice.id}
                type="button"
                onClick={() => setSelectedVoiceId(voice.id)}
                className={[
                  "w-full text-left p-2 lg:p-3 rounded-xl flex flex-col lg:flex-row items-center gap-1 lg:gap-3 shadow-md cursor-pointer transition-colors group",
                  active
                    ? "bg-indigo-700"
                    : "bg-[#4f46e5] hover:bg-indigo-700",
                ].join(" ")}
              >
                {/* Avatar */}
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#fcd34d] shrink-0 shadow-inner group-hover:scale-105 transition-transform" />

                {/* Text */}
                <div className="hidden lg:block min-w-0 flex-1">
                  <p className="font-bold text-white text-sm leading-tight truncate">
                    {voice.name} {active && "✓"}
                  </p>
                  <p className="text-indigo-200 text-xs truncate">
                    {voice.tagline || ""}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Voice Tuner */}
        <div className="hidden lg:block pt-5 border-t border-indigo-200/60">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-5">
            Voice Tuner
          </h3>

          <div className="space-y-3 mb-6">
            <label className="text-xs font-semibold text-slate-600">
              Stability
            </label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="75"
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-600">
              Similarity Boost
            </label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="40"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
