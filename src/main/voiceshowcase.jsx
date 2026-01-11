import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons"
import CardVoiceSample from '../components/cardvoicesample';


function VoiceShowcase() {
  return (
    <section className="py-20 px-6 overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-black text-[#0d0d1b]  mb-2">Explore Voices</h2>
          <p className="text-gray-600 ">Listen to samples from our premium collection.</p>
        </div>
        <button className="hidden md:flex text-gray-600 font-bold items-center gap-1 hover:gap-2 transition-all">
          CHECK OUT 400+ VOICE SAMPLES
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

      <div >

        <CardVoiceSample/>
        
      </div>
      {/* <div className="mt-4 flex md:hidden justify-center">
        <button className="text-primary font-bold flex items-center gap-1 text-sm">
          View All Voices
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div> */}
      </div>
    </section>
  )
}

export default VoiceShowcase;
