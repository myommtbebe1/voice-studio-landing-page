import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLanguage } from "../hooks/useLanguage.js";

import { faLanguage, faMicrophone,faSliders,faCopyright } from '@fortawesome/free-solid-svg-icons';

function FeatureGrid() {
  const { t } = useLanguage();
  return (
    <section className="py-20 px-6">
            <div className="max-w-[1280px] mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-black text-[#0d0d1b] dark:text-gray-500 mb-4">{t("features.title")}</h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                {t("features.subtitle")}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-4xl shadow-sm hover:shadow-xl transition-shadow group">
                  <div className="size-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <FontAwesomeIcon icon={faMicrophone} size="xl"/>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-500">{t("features.f1_title")}</h3>
                  <p className="text-gray-700  leading-relaxed">
                  {t("features.f1_desc")}
                  </p>
                </div>

                <div className="bg-white p-8 rounded-4xl shadow-sm hover:shadow-xl transition-shadow group">
                  <div className="size-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FontAwesomeIcon icon={faLanguage} size="xl"/>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-500">{t("features.f2_title")}</h3>
                  <p className="text-gray-700  leading-relaxed">
                  {t("features.f2_desc")}
                  </p>
                </div>

                <div className="bg-white p-8 rounded-4xl shadow-sm hover:shadow-xl transition-shadow group">
                  <div className="size-14 rounded-2xl bg-pink-50 dark:bg-pink-900/20 text-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FontAwesomeIcon icon={faSliders} size="xl"/>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-500">{t("features.f3_title")}</h3>
                  <p className="text-gray-700  leading-relaxed">
                  {t("features.f3_desc")}
                  </p>
                </div>

                <div className="bg-white p-8 rounded-4xl shadow-sm hover:shadow-xl transition-shadow group">
                  <div className="size-14 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FontAwesomeIcon icon={faCopyright} size="xl"/>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-500">{t("features.f4_title")}</h3>
                  <p className="text-gray-700  leading-relaxed">
                  {t("features.f4_desc")}
                  </p>
                </div>
              </div>
            </div>
          </section>

  )
}

export default FeatureGrid;