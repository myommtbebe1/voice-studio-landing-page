import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileWaveform } from "@fortawesome/free-solid-svg-icons";


 function OurBestFeature() {
  return (
    <section className="py-20 px-6 ">
            <div className="max-w-[1280px] mx-auto">
              <div className="bg-white  rounded-[3rem] p-8 md:p-12 shadow-xl overflow-hidden relative border ">
                <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                  <div className="order-2 lg:order-1">
                    {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold mb-6">
                      <span className="material-symbols-outlined text-lg">star</span>
                      OUR BEST FEATURE
                    </div> */}
                    <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight dark:text-gray-600">
                      Clone Your Own Voice in <span className="text-gradient">Seconds</span>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 leading-relaxed">
                      Upload a 30-second sample and create a digital twin of your voice. Perfect for personalized content at scale without recording every word.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="h-12 px-8 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/30 bg-blue-700 hover:bg-blue-500 transition-colors">
                        Start Cloning
                      </button>
                      <button className="h-12 px-8 rounded-full bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 hover:text-white font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        Learn More
                      </button>
                    </div>
                  </div>
                  <div className="order-1 lg:order-2 relative">
                    <div className="w-full aspect-square md:aspect-video rounded-3xl bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 flex items-center justify-center p-8 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
                      <div className="relative z-10 flex items-center gap-6">
                        <div className="flex flex-col items-center gap-2">
                          <div className="size-20 rounded-full bg-white p-1 shadow-lg">
                            <img
                              alt="Real User Photo"
                              className="w-full h-full rounded-full object-cover"
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5RN1EIX5NOUfUa5W88u4iq4Mfh6auVGj25rXFS60Qku1AY3fJYL1SZPNteXQIv8rov7Uu63Ujfql257syB1OBHZDEVLvtNco8U3iZhuhluSQILqMg213Mmal2a4hrGd9JFNUccZskMOzGoHxmVvhC-p0-FB_Uk5Y-W2P_l_2iaGeqjLUHq1fFQKEYXUjUc4jZHkBDqkMziDrcst-0A14MgK_-EYxRyFo01AUZPTh3ivC7oqkyvPtzAn2FKpi6ABcFTX0B6MmoHA"
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-500 bg-white/80 px-2 py-1 rounded-full">Original</span>
                        </div>
                        <div 
                          className="h-0 w-12 self-center" 
                          style={{ 
                            borderTop: '3px solid #a78bfa',
                            marginTop: '40px',
                            marginBottom: 'auto'
                          }} 
                        />
                        <div className="flex flex-col items-center gap-2">
                          <div className="size-20 rounded-full bg-purple-600 p-1 shadow-lg shadow-primary/40">
                            <div className="w-full h-full rounded-full bg-white-100 flex items-center justify-center">
                                <FontAwesomeIcon icon={faFileWaveform} size="2x" />
                            </div>
                          </div>
                          <span className="text-xs font-bold text-gray-500 bg-white/80 px-2 py-1 rounded-full">AI Clone</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
  )
}

export default OurBestFeature;