export default function VoiceStudioSkeleton() {
  return (
    <div className="h-[calc(100vh-80px)] flex flex-col overflow-hidden bg-white text-slate-800">
      {/* Top bar skeleton (Workspace row) */}
      <div className="bg-white border-b border-slate-200 shrink-0">
        <div className="px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          <div className="h-10 w-48 rounded-lg skeleton" />
          <div className="h-10 w-32 rounded-lg skeleton" />
        </div>
      </div>

      <main className="flex flex-1 overflow-hidden relative min-h-0">
        {/* Left column - Voice Library skeleton */}
        <aside className="hidden lg:flex flex-col shrink-0 w-72 xl:w-72 2xl:w-80 bg-[#eef2ff] border-r border-indigo-100">
          <div className="px-3 lg:px-5 py-5">
            <div className="h-4 w-28 skeleton rounded" />
          </div>
          <div className="px-2 lg:px-5 pb-5 space-y-4">
            <div className="h-10 w-full rounded-lg skeleton" />
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-xl p-3 bg-white/60 border border-indigo-100/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full skeleton shrink-0" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-4 w-3/4 skeleton rounded" />
                    <div className="h-3 w-full skeleton rounded" />
                    <div className="h-3 w-1/2 skeleton rounded" />
                  </div>
                </div>
                <div className="mt-2 h-8 w-full rounded-lg skeleton" />
              </div>
            ))}
          </div>
        </aside>

        {/* Center column - Editor / Sentence blocks skeleton */}
        <section className="flex-1 flex flex-col bg-white relative min-w-0 overflow-hidden">
          <div className="lg:hidden flex items-center justify-between px-4 py-2 border-b border-slate-200">
            <div className="h-10 w-10 rounded-lg skeleton" />
            <div className="h-10 w-10 rounded-lg skeleton" />
          </div>
          <div className="flex-1 px-4 md:px-8 py-4 flex flex-col min-h-0">
            {/* Project title */}
            <div className="h-6 w-40 skeleton rounded mb-4" />
            {/* Text area */}
            <div className="flex-1 min-h-[120px] rounded-lg skeleton mb-4" />
            {/* Character count */}
            <div className="h-4 w-24 skeleton rounded self-end mb-4" />
            {/* Controls row */}
            <div className="flex flex-wrap gap-2 mb-3">
              <div className="h-9 w-24 rounded-lg skeleton" />
              <div className="h-9 w-20 rounded-lg skeleton" />
              <div className="h-9 w-16 rounded-lg skeleton" />
              <div className="h-9 w-20 rounded-lg skeleton" />
            </div>
            {/* Premium quota */}
            <div className="h-4 w-36 skeleton rounded mb-3" />
            {/* Generate button */}
            <div className="h-12 w-full max-w-[200px] rounded-lg skeleton mb-4" />
            {/* Playback bar */}
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full skeleton shrink-0" />
              <div className="flex-1 h-2 rounded-full skeleton" />
              <div className="h-4 w-20 skeleton rounded" />
            </div>
            {/* Points / Edit / Download */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-4 w-24 skeleton rounded" />
              <div className="h-9 w-16 rounded-lg skeleton" />
              <div className="h-9 w-24 rounded-lg skeleton" />
            </div>
            {/* Add sentence button */}
            <div className="h-12 w-full rounded-lg border-2 border-dashed border-slate-200 skeleton border-solid" />
          </div>
        </section>

        {/* Right column - Output Deck skeleton */}
        <aside className="hidden lg:flex flex-col shrink-0 w-72 bg-[#eef2ff] border-l border-indigo-100">
          <div className="px-3 lg:px-5 py-5">
            <div className="h-4 w-28 skeleton rounded" />
          </div>
          <div className="flex-1 px-2 lg:px-5 pb-5 space-y-4 overflow-y-auto">
            {/* Download all section */}
            <div className="rounded-xl bg-white/60 border border-indigo-100/50 p-4 space-y-3">
              <div className="h-4 w-36 skeleton rounded" />
              <div className="h-4 w-24 skeleton rounded" />
              <div className="h-11 w-full rounded-lg skeleton" />
              <div className="h-11 w-full rounded-lg skeleton" />
            </div>
            {/* Import/Export section */}
            <div className="rounded-xl bg-white/60 border border-indigo-100/50 p-4 space-y-3">
              <div className="h-4 w-28 skeleton rounded" />
              <div className="h-11 w-full rounded-lg skeleton" />
              <div className="h-11 w-full rounded-lg skeleton" />
              <div className="h-11 w-full rounded-lg skeleton" />
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
