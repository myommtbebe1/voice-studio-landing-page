import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import {useLanguage} from "../hooks/useLanguage"

function FQASection() {
  const{t}=useLanguage();
  return (
    <section className="py-20 px-6  ">
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-black text-center mb-12 text-gray-500">{t("faq.title")}</h2>
      <div className="flex flex-col gap-4">
        <details className="group bg-gray-50  rounded-2xl  overflow-hidden">
          <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
            <h3 className="font-bold text-lg text-gray-400">{t("faq.q1")}</h3>
            <span className="material-symbols-outlined transition-transform group-open:rotate-180 "><FontAwesomeIcon icon={faAngleDown} style={{color:'gray'}}  /></span>
          </summary>
          <div className="px-6 pb-6 text-gray-500 dark:text-gray-400 leading-relaxed">
          {t("faq.q1Ans")}
          </div>
        </details>

        <details className="group bg-gray-50  rounded-2xl  overflow-hidden">
          <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
            <h3 className="font-bold text-lg text-gray-400">{t("faq.q2")}</h3>
            <span className="material-symbols-outlined transition-transform group-open:rotate-180 "><FontAwesomeIcon icon={faAngleDown} style={{color:'gray'}}  /></span>
          </summary>
          <div className="px-6 pb-6 text-gray-500 dark:text-gray-400 leading-relaxed">
          {t("faq.q2Ans")}
          </div>
        </details>

        <details className="group bg-gray-50  rounded-2xl  overflow-hidden">
          <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
            <h3 className="font-bold text-lg text-gray-400">{t("faq.q3")}</h3>
            <span className="material-symbols-outlined transition-transform group-open:rotate-180 "><FontAwesomeIcon icon={faAngleDown} style={{color:'gray'}}  /></span>
          </summary>
          <div className="px-6 pb-6 text-gray-500 dark:text-gray-400 leading-relaxed">
          {t("faq.q3Ans")}
          </div>
        </details>
      </div>
    </div>
  </section>
  )
}

export default  FQASection;