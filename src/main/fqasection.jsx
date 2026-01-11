import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

function FQASection() {
  return (
    <section className="py-20 px-6  ">
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-black text-center mb-12 text-gray-500">Frequently Asked Questions</h2>
      <div className="flex flex-col gap-4">
        <details className="group bg-gray-50  rounded-2xl  overflow-hidden">
          <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
            <h3 className="font-bold text-lg text-gray-400">Can I use the audio for commercial purposes?</h3>
            <span className="material-symbols-outlined transition-transform group-open:rotate-180 "><FontAwesomeIcon icon={faAngleDown} style={{color:'gray'}}  /></span>
          </summary>
          <div className="px-6 pb-6 text-gray-500 dark:text-gray-400 leading-relaxed">
            Yes! With our Pro and Enterprise plans, you get full commercial rights to all generated audio. You can use it in YouTube videos, podcasts, advertisements, and more.
          </div>
        </details>

        <details className="group bg-gray-50  rounded-2xl  overflow-hidden">
          <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
            <h3 className="font-bold text-lg text-gray-400">How many languages do you support?</h3>
            <span className="material-symbols-outlined transition-transform group-open:rotate-180 "><FontAwesomeIcon icon={faAngleDown} style={{color:'gray'}}  /></span>
          </summary>
          <div className="px-6 pb-6 text-gray-500 dark:text-gray-400 leading-relaxed">
            We currently support over 50 languages including English, Spanish, French, German, Japanese, Chinese, and many more, each with multiple distinct regional accents.
          </div>
        </details>

        <details className="group bg-gray-50  rounded-2xl  overflow-hidden">
          <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
            <h3 className="font-bold text-lg text-gray-400">Is there a free trial?</h3>
            <span className="material-symbols-outlined transition-transform group-open:rotate-180 "><FontAwesomeIcon icon={faAngleDown} style={{color:'gray'}}  /></span>
          </summary>
          <div className="px-6 pb-6 text-gray-500 dark:text-gray-400 leading-relaxed">
            Absolutely. You can start for free with 5000 characters per month. No credit card required to get started.
          </div>
        </details>
      </div>
    </div>
  </section>
  )
}

export default  FQASection;