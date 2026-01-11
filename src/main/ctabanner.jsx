import React from 'react'

function CtaBanner() {
  return (
    <section className="py-12 px-6">
    <div className="max-w-[1280px] mx-auto">
      <div className="rounded-[2.5rem] bg-linear-to-r from-[#1313ec] to-[#5d3eff] p-8 md:p-16 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <h2 className="text-3xl md:text-5xl font-black text-white">Ready to Go Viral?</h2>
          <p className="text-white/80 text-lg max-w-xl">
            Upgrade to the full version to unlock unlimited generations, commercial rights, and premium voices.
          </p>
          <button className="h-14 px-10 rounded-full bg-white text-blue-600 text-base font-bold shadow-lg hover:scale-105 transition-transform">
            UPGRADE TO FULL VERSION
          </button>
        </div>
      </div>
    </div>
  </section>
  )
}
export default  CtaBanner;
