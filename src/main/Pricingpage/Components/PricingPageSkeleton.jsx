import React from 'react';

export default function PricingPageSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12" aria-busy="true" aria-label="Loading pricing">
      {/* Navbar skeleton */}
      <nav className="w-full max-w-[1280px] mx-auto py-4 px-4 sm:px-6">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-10 w-20 sm:w-24 rounded-xl skeleton" />
          ))}
        </div>
      </nav>

      {/* Hot Deal section */}
      <section className="space-y-0">
        <div className="relative w-full rounded-t-2xl min-h-[180px] sm:min-h-[220px] skeleton" />
        <div className="flex justify-center -mt-6 sm:-mt-8 z-10 relative">
          <div className="h-8 w-[180px] sm:w-[220px] rounded-t-xl skeleton" />
        </div>
        <div className="w-full rounded-b-2xl border-2 border-gray-200 overflow-hidden bg-white shadow-lg -mt-px p-4">
          <div className="divide-y divide-gray-100 space-y-0">
            {[1, 2, 3].map((i) => (
              <div key={i} className="py-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full skeleton shrink-0" />
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="h-6 w-24 skeleton rounded" />
                    <div className="flex gap-2">
                      <div className="h-5 w-20 skeleton rounded-full" />
                      <div className="h-5 w-16 skeleton rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="h-6 w-16 skeleton rounded" />
                  <div className="h-9 w-20 skeleton rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Up Voicebot Coins */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <div className="h-10 w-64 mx-auto skeleton rounded" />
          <div className="h-4 w-48 mx-auto skeleton rounded" />
          <div className="h-10 w-40 mx-auto skeleton rounded-full mt-4" />
        </div>
        <div className="w-full rounded-2xl border-2 border-gray-200 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full skeleton" />
              <div className="h-5 w-40 skeleton rounded" />
            </div>
          </div>
          <div className="h-4 w-full skeleton rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full skeleton" />
                <div className="h-4 w-full skeleton rounded" />
              </div>
            ))}
          </div>
          <div className="h-11 w-32 skeleton rounded-xl mx-auto" />
        </div>
      </section>

      {/* Addon coin section */}
      <section className="space-y-0">
        <div className="h-14 w-full rounded-t-xl skeleton" />
        <div className="w-full border-2 border-gray-200 rounded-b-xl p-4 space-y-3 -mt-px">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 skeleton rounded" />
                <div className="h-5 w-16 skeleton rounded" />
              </div>
              <div className="h-9 w-24 skeleton rounded-lg" />
            </div>
          ))}
        </div>
      </section>

      {/* Section heading */}
      <div className="h-8 w-72 mx-auto skeleton rounded my-8" />

      {/* Subscription banner */}
      <div className="w-full rounded-2xl min-h-[120px] skeleton" />

      {/* Plan boxes: Starter, Regular, Professional */}
      <section className="sm:w-screen sm:relative sm:left-1/2 sm:right-1/2 sm:-ml-[50vw] sm:-mr-[50vw]">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          {['starter', 'regular', 'professional'].map((plan) => (
            <div key={plan} className="w-full flex flex-col">
              <div className="h-9 w-[190px] rounded-tl-xl rounded-tr-xl skeleton" />
              <div className="w-full rounded-2xl -mt-px border-2 border-gray-200 overflow-hidden p-4 space-y-3 bg-white">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 skeleton rounded shrink-0" />
                      <div className="space-y-1 flex-1">
                        <div className="h-5 w-20 skeleton rounded" />
                        <div className="flex gap-2">
                          <div className="h-4 w-16 skeleton rounded-full" />
                          <div className="h-4 w-12 skeleton rounded-full" />
                        </div>
                      </div>
                    </div>
                    <div className="h-9 w-24 skeleton rounded-lg shrink-0" />
                  </div>
                ))}
                <div className="h-8 w-full skeleton rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Company banner */}
      <div className="w-full rounded-2xl h-32 sm:h-40 skeleton" />

      {/* Buy custom points */}
      <section className="space-y-4">
        <div className="h-8 w-56 mx-auto skeleton rounded" />
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4 p-5 bg-white rounded-lg border border-gray-200">
          <div className="h-4 w-24 skeleton rounded shrink-0" />
          <div className="h-10 flex-1 skeleton rounded-lg" />
          <div className="h-10 w-28 skeleton rounded-lg" />
        </div>
      </section>

      {/* Report issue */}
      <div className="w-full py-8">
        <div className="w-full bg-white rounded-3xl shadow-lg px-6 sm:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 skeleton rounded" />
                <div className="h-7 w-48 skeleton rounded" />
              </div>
              <div className="h-4 w-full max-w-md skeleton rounded" />
            </div>
            <div className="h-12 w-40 skeleton rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
