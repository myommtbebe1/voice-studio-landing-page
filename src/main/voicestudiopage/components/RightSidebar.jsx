import { useState } from "react";

export default function RightSidebar({ outputs, formatTime }) {
  const latest = outputs?.[0];
  const recent = outputs?.slice(1) ?? [];

  const [showHistory, setShowHistory] = useState(true);
  const [showDownloadAll, setShowDownloadAll] = useState(true);
  const [showImportExport, setShowImportExport] = useState(true);

  return (
    <aside className="hidden lg:flex flex-col shrink-0 w-[360px] bg-[#1b2333] text-white border-l border-white/10">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-white/10">
        <h2 className="text-sm font-semibold tracking-wide text-white/80">
          OUTPUT DECK
        </h2>

        <button
          type="button"
          className="text-white/60 hover:text-white/90"
          aria-label="More"
          title="More"
        >
          <span className="material-icons-round text-base">more_horiz</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Generated just now */}
        {latest && (
          <section className="px-5 py-5 border-b border-white/10">
            <p className="text-xs font-bold tracking-widest text-indigo-300 uppercase mb-2">
              Generated just now
            </p>

            <p className="text-xl font-semibold mb-4">{latest.name}</p>

            <div className="bg-[#141b28] rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="w-14 h-14 rounded-full bg-white text-[#1b2333] flex items-center justify-center shadow"
                  aria-label="Play"
                  title="Play"
                >
                  <span className="material-icons-round text-3xl ml-0.5">
                    play_arrow
                  </span>
                </button>

                <div className="flex-1 flex items-center justify-between gap-2">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-indigo-400/80"
                      style={{
                        height: `${10 + ((i * 7) % 22)}px`,
                        opacity: 0.65 + ((i % 3) * 0.1),
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-white/60">
                <span>{formatTime(0)}</span>
                <span>{formatTime(latest.durationSec)}</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="h-12 rounded-xl bg-[#2f66ff] hover:bg-[#2a5bf0] transition flex items-center justify-center gap-2 font-semibold"
                >
                  <span className="material-icons-round">download</span>
                  Download
                </button>

                <button
                  type="button"
                  className="h-12 rounded-xl bg-white/15 hover:bg-white/20 transition flex items-center justify-center gap-2 font-semibold"
                >
                  <span className="material-icons-round">share</span>
                  Share
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Recent History (collapsible) */}
        <section className="px-5 py-5 border-b border-white/10">
          <button
            type="button"
            onClick={() => setShowHistory((s) => !s)}
            className="w-full flex items-center justify-between"
          >
            <span className="text-sm font-semibold text-white/80">
              Recent History
            </span>

            <div className="flex items-center gap-2 text-white/60">
              <span className="text-xs">{showHistory ? "Hide" : "View all"}</span>
              <span className="material-icons-round text-base">
                {showHistory ? "expand_less" : "expand_more"}
              </span>
            </div>
          </button>

          {showHistory && (
            <div className="mt-3 space-y-3">
              {recent.length === 0 ? (
                <div className="text-sm text-white/50">No recent files yet.</div>
              ) : (
                recent.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#141b28] rounded-xl border border-white/10 px-4 py-3 flex items-center gap-3"
                  >
                    <button
                      type="button"
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center"
                      aria-label="Play item"
                    >
                      <span className="material-icons-round text-white/80">
                        play_arrow
                      </span>
                    </button>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-white/50 truncate">{item.when}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>

        {/* Download all voices (collapsible) */}
        <section className="px-5 py-5 border-b border-white/10">
          <button
            type="button"
            onClick={() => setShowDownloadAll((s) => !s)}
            className="w-full flex items-center justify-between"
          >
            <span className="text-sm font-semibold text-white/80">
              Download all voices
            </span>
            <span className="material-icons-round text-white/60 text-base">
              {showDownloadAll ? "expand_less" : "expand_more"}
            </span>
          </button>

          {showDownloadAll && (
            <div className="mt-4">
              <div className="flex items-start justify-between mb-3">
                <div />
                <div className="text-right">
                  <p className="text-sm font-bold">0 Points</p>
                  <p className="text-xs text-white/50">≈ 0.000 USD</p>
                </div>
              </div>

              <button
                type="button"
                className="w-full h-11 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition flex items-center justify-center gap-2 font-semibold"
              >
                <span className="material-icons-round">download</span>
                Download All
              </button>

              <button
                type="button"
                className="mt-3 w-full h-11 rounded-xl bg-transparent hover:bg-white/5 border border-cyan-400/50 text-cyan-300 transition flex items-center justify-center gap-2 font-semibold"
              >
                <span className="material-icons-round">auto_awesome</span>
                Automatically generate
              </button>
            </div>
          )}
        </section>

        {/* Import / Export (collapsible) */}
        <section className="px-5 py-5">
          <button
            type="button"
            onClick={() => setShowImportExport((s) => !s)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white/80">
                Import/Export
              </span>
              <span className="material-icons-round text-white/40 text-sm">
                info
              </span>
            </div>

            <span className="material-icons-round text-white/60 text-base">
              {showImportExport ? "expand_less" : "expand_more"}
            </span>
          </button>

          {showImportExport && (
            <div className="mt-4 space-y-3">
              {/* Upload DOCX */}
              <label className="w-full h-11 rounded-xl bg-[#141b28] border border-white/10 hover:bg-white/5 transition flex items-center justify-center gap-2 font-semibold cursor-pointer">
                <span className="material-icons-round text-cyan-300">description</span>
                Upload File .docx
                <input type="file" accept=".doc,.docx" className="hidden" />
              </label>

              {/* Upload CSV */}
              <label className="w-full h-11 rounded-xl bg-[#141b28] border border-white/10 hover:bg-white/5 transition flex items-center justify-center gap-2 font-semibold cursor-pointer">
                <span className="material-icons-round text-cyan-300">table_chart</span>
                Upload .csv
                <input type="file" accept=".csv" className="hidden" />
              </label>

              {/* Download CSV */}
              <button
                type="button"
                className="w-full h-11 rounded-xl bg-[#141b28] border border-white/10 hover:bg-white/5 transition flex items-center justify-center gap-2 font-semibold"
              >
                <span className="material-icons-round text-cyan-300">download</span>
                Download .csv
              </button>
            </div>
          )}
        </section>
      </div>
    </aside>
  );
}
