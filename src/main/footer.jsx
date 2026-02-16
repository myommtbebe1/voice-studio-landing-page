import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthAmericas,faEnvelope,faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../hooks/useLanguage.js";

function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-linear-to-br from-gray-900 to-black text-white pt-20 pb-10 px-6 rounded-t-[3rem] mt-10">
            <div className="max-w-[1280px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3 text-white mb-6">
                    <div className="size-8 bg-primary rounded-xl flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-xl"></span>
                    </div>
                    <h2 className="text-xl font-black">AI Voice</h2>
                  </div>
                  <p className="text-gray-400 mb-6 max-w-sm">
                    {t("footer.title")}                  </p>
                  <div className="flex gap-4">
                    <a className="size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors" href="#">
                      <span className="material-symbols-outlined text-sm"><FontAwesomeIcon  icon={faEarthAmericas} /></span>
                    </a>
                    <a className="size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors" href="#">
                      <span className="material-symbols-outlined text-sm"><FontAwesomeIcon icon={faEnvelope} /></span>
                    </a>
                    <a className="size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors" href="#">
                      <span className="material-symbols-outlined text-sm"><FontAwesomeIcon icon={faPaperPlane} /></span>
                    </a>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold mb-6">{t("footer.product")}</h4>
                  <ul className="flex flex-col gap-3 text-gray-400 text-sm">
                    <li>
                      <a className="hover:text-white transition-colors" href="#">
                        {t("footer.studio")}
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-white transition-colors" href="#">
                        {t("footer.api")}
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-white transition-colors" href="#">
                        Voice Cloning
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-white transition-colors" href="#">
                        Pricing
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-6">{t("footer.resources")}</h4>
                  <ul className="flex flex-col gap-3 text-gray-400 text-sm">
                    <li>
                      <a className="hover:text-white transition-colors" href="#">
                        Community
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-white transition-colors" href="#">
                        {t("footer.help")}
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-white transition-colors" href="#">
                        {t("footer.blog")}
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-white transition-colors" href="#">
                        Status
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-6">{t("footer.company")}</h4>
                  <ul className="flex flex-col gap-3 text-gray-400 text-sm">
                    <li>
                      <a className="hover:text-white transition-colors" href="#">
                        {t("footer.about")}
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-white transition-colors" href="#">
                        {t("footer.careers")}
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-white transition-colors" href="#">
                        {t("footer.legal")}
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-white transition-colors" href="#">
                        {t("footer.contact")}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-500 text-sm">© 2023 AI Voice Platform. All rights reserved.</p>
                <div className="flex gap-6 text-sm text-gray-500">
                  <a className="hover:text-white transition-colors" href="#">
                    Privacy Policy
                  </a>
                  <a className="hover:text-white transition-colors" href="#">
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </footer>
  )
}


export default Footer;