import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { faBars, faTimes, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import LanguageButton from "../components/languagebutton";
import useSignout from "../hooks/useSignout";
import { AuthContext } from "../contexts/AuthContext";
import { useLanguage } from "../hooks/useLanguage.js";
import LanguageButton from "../components/languagebutton.jsx";
import LoginForm from "./LoginForm.jsx"

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPointsDropdownOpen, setIsPointsDropdownOpen] = useState(false);
  const [showLogin, setShowLogIn] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  let { logout } = useSignout();
  let navigate = useNavigate();
  let { user } = useContext(AuthContext);
  const { t } = useLanguage();
  useEffect(() => {
    setProfileImageError(false);
  }, [user?.uid, user?.photoURL]);
  console.log(user)

  let handleLogIn = (type) => {
    if (type === "logIn") {  // Changed from "premium" to "logIn"
      setShowLogIn(true);
    } else {
      setShowLogIn(false);
    }
  };

  let signOutUser = async () => {
    await logout();
    navigate("/");
  };
  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 z-[1000] w-full bg-white backdrop-blur-lg border-b border-white/30 shadow-[0_12px_40px_rgba(15,23,42,0.12)] transition-all duration-300">
        <div className="max-w-[1280px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4 max-[375px]:gap-2">
            <div className="flex items-center gap-3 text-primary">
              <Link to="/" className="flex items-center gap-3">
                <img
                  src="https://voice.botnoi.ai/assets/icons/navbar-v2/logo_mobile2.webp"
                  alt="Botnoi Voice"
                  className="h-8 w-auto object-contain"
                />
                <h2 className="text-[#0d0d1b] text-xl font-black leading-tight tracking-[-0.02em]">
                  Botnoi Voice
                </h2>
              </Link>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Studio dropdown */}
              <div className="relative group">
                <button
                  type="button"
                  className="relative text-[#0d0d1b] hover:text-gray-400 transition-colors text-sm font-semibold leading-normal flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
                >
                  <span>{t("nav.studio")}</span>
                  <span className=" bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                    NEW
                  </span>
                </button>

                {/* Dropdown panel */}
                <div className="absolute left- top-full mt-3 w-[780px] bg-white border border-gray-100 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.16)] py-3 px-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-500 mb-2">
                    <span className="tracking-[0.12em] text-gray-500">STUDIO</span>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {user ? (
                      <Link
                        to="/VoiceStudio"
                        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#0d0d1b] shadow-sm hover:border-blue-400 hover:text-blue-600 transition-colors whitespace-nowrap"
                      >
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-[9px] text-white font-bold">
                          VS
                        </span>
                        <span>{t("nav.voicestudio")}</span>
                      </Link>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setShowLogIn(true);
                          sessionStorage.setItem('redirectAfterLogin', '/VoiceStudio');
                        }}
                        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#0d0d1b] shadow-sm hover:border-blue-400 hover:text-blue-600 transition-colors whitespace-nowrap"
                      >
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-[9px] text-white font-bold">
                          VS
                        </span>
                        <span>{t("nav.voicestudio")}</span>
                      </button>
                    )}
                    <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#0d0d1b] hover:border-blue-400 hover:text-blue-600 transition-colors whitespace-nowrap">
                      <span>BytePlus</span>
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#0d0d1b] hover:border-blue-400 hover:text-blue-600 transition-colors whitespace-nowrap">
                      <span>Voicebot</span>
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#0d0d1b] hover:border-blue-400 hover:text-blue-600 transition-colors whitespace-nowrap">
                      <span>MarAds</span>
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#0d0d1b] hover:border-blue-400 hover:text-blue-600 transition-colors whitespace-nowrap">
                      <span>Gen Sub</span>
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#0d0d1b] hover:border-blue-400 hover:text-blue-600 transition-colors whitespace-nowrap">
                      <span>Gen Skript</span>
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#0d0d1b] hover:border-blue-400 hover:text-blue-600 transition-colors whitespace-nowrap">
                      <span>Gen Avatar</span>
                    </button>
                  </div>
                </div>
              </div>
              
           
              <a
                className="text-[#0d0d1b]  hover:text-gray-300  transition-colors text-sm font-semibold leading-normal"
                href="/VoiceOver"
              >
                {t("nav.howItWorks")}
              </a>
              <a
                className="text-[#0d0d1b]  hover:text-gray-300  transition-colors text-sm font-semibold leading-normal"
                href="#"
              >
                {t("nav.api")}
              </a>
              <Link
                to="/Pricing"
                className="text-[#0d0d1b]  hover:text-gray-300  transition-colors text-sm font-semibold leading-normal"
              >
                {t("nav.pricing")} 
                <span className=" bg-red-500 text-white text-[12px] px-1.5 py-0.5 rounded-full font-bold ">
                  Sale
                </span>
              </Link>
                
              <Link
                to="/Report"
                className="text-[#0d0d1b]  hover:text-gray-300  transition-colors text-sm font-semibold leading-normal"
              >
                {t("nav.report")}
              </Link>
              <a
                className="text-[#0d0d1b]  hover:text-gray-300  transition-colors text-sm font-semibold leading-normal"
                href="#"
              >
                Enterprise
              </a>
            </div>

            <div className="flex items-center gap-3 max-[375px]:gap-1.5 max-[320px]:gap-1">

              <LanguageButton />

              <div className="flex space-x-3 max-[375px]:space-x-1.5 max-[320px]:space-x-1">
                {!user &&
                  <>
                    <button
                      onClick={() => handleLogIn("logIn")}
                      className="border border-blue-400 text-gray-500 hidden lg:flex h-10 px-4 items-center justify-center rounded-full"
                    >
                      {t("nav.login")}
                    </button>
                    {/* <Link to={`/register`} className="border border-blue-400 text-gray-500 hidden lg:flex h-10 px-4 items-center justify-center rounded-full" >
                      {t("nav.register")}</Link> */}
                  </>

                }
                {
                  !!user &&
                  <>
                    <div
                      className="hidden sm:block relative"
                      onMouseEnter={() => setIsPointsDropdownOpen(true)}
                      onMouseLeave={() => setIsPointsDropdownOpen(false)}
                    >
                      <button className="h-10 px-4 items-center justify-center rounded-full bg-blue-300 text-blue-600 font-semibold shadow-[0_6px_20px_rgba(19,19,236,0.12)] hover:bg-primary/20 transition-all text-xs leading-normal tracking-[0.01em] flex">
                        100 Pts
                      </button>

                      {/* Points Dropdown */}
                      {isPointsDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg border-2 border-blue-200 shadow-lg z-50 p-4">
                          <div className="text-sm text-gray-700">
                            <p className="font-medium mb-1">Point: 100 pts</p>
                            <p className="font-medium">Monthly Point: 0 pts</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <button className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[#0d0d1b] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors overflow-hidden" aria-label={t("nav.profile") || "User profile"}>
                      {(() => {
                        const photoURL = user?.photoURL || user?.providerData?.[0]?.photoURL;
                        return photoURL && !profileImageError ? (
                          <img
                            alt=""
                            className="w-full h-full object-cover"
                            src={photoURL}
                            referrerPolicy="no-referrer"
                            onError={() => setProfileImageError(true)}
                          />
                        ) : (
                          <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-gray-500" />
                        );
                      })()}
                    </button>
                    <button onClick={signOutUser} className="bg-red-400 text-white hidden lg:flex h-10 px-4 items-center justify-center rounded-full" >
                      {t("nav.logout")}
                    </button>
                  </>
                }

              </div>
              {/* Mobile Hamburger Button */}
              <button
                className="lg:hidden flex items-center justify-center size-10 rounded-full bg-white border border-gray-200 text-[#0d0d1b] hover:bg-gray-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <FontAwesomeIcon
                  icon={isMobileMenuOpen ? faTimes : faBars}
                  className="text-xl"
                />
              </button>
            </div>
          </div>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="absolute top-0 right-0 h-full w-64 bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-[#0d0d1b]">Menu</h3>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center size-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Close menu"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
                </button>
              </div>

              <nav className="flex flex-col gap-4">
                {user ? (
                  <Link
                    to="/VoiceStudio"
                    className="relative text-[#0d0d1b] hover:text-gray-600 transition-colors text-base font-semibold py-2 px-4 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("nav.voicestudio")}
                    <span className="absolute top-1 right-4 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      NEW
                    </span>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setShowLogIn(true);
                      sessionStorage.setItem('redirectAfterLogin', '/VoiceStudio');
                    }}
                    className="relative text-[#0d0d1b] hover:text-gray-600 transition-colors text-base font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 w-full text-left"
                  >
                    {t("nav.voicestudio")}
                    <span className="absolute top-1 right-4 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      NEW
                    </span>
                  </button>
                )}
                {user ? (
                  <Link
                    to="/VoiceOver"
                    className="text-[#0d0d1b] hover:text-gray-600 transition-colors text-base font-semibold py-2 px-4 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Voice Over
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setShowLogIn(true);
                      sessionStorage.setItem('redirectAfterLogin', '/VoiceOver');
                    }}
                    className="text-[#0d0d1b] hover:text-gray-600 transition-colors text-base font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 w-full text-left"
                  >
                    Voice Over
                  </button>
                )}
                <a
                  className="text-[#0d0d1b] hover:text-gray-600 transition-colors text-base font-semibold py-2 px-4 rounded-lg hover:bg-gray-50"
                  href="#"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  API
                </a>
                <Link
                  to="/Pricing"
                  className="text-[#0d0d1b] hover:text-gray-600 transition-colors text-base font-semibold py-2 px-4 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.pricing")}
                </Link>
                <Link
                  to="/Payment"
                  className="text-[#0d0d1b] hover:text-gray-600 transition-colors text-base font-semibold py-2 px-4 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.payment")}
                </Link>
                <Link
                  to="/Report"
                  className="text-[#0d0d1b] hover:text-gray-600 transition-colors text-base font-semibold py-2 px-4 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.report")}
                </Link>
                <a
                  className="text-[#0d0d1b] hover:text-gray-600 transition-colors text-base font-semibold py-2 px-4 rounded-lg hover:bg-gray-50"
                  href="#"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Enterprise
                </a>
                {!user && (
                  <button
                    onClick={() => {
                      handleLogIn("logIn");
                      setIsMobileMenuOpen(false);
                    }}
                    className=" text-gray-700 text-base font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 w-full text-left"
                  >
                    {t("nav.login")}
                  </button>
                )}
                {!!user && (
                  <>
                    <button
                      onClick={signOutUser}
                      className="bg-red-400 text-white text-base font-semibold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors w-full text-left"
                    >
                      {t("nav.logout")}
                    </button>
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
      <LoginForm  isOpen={showLogin} onClose={() => setShowLogIn(false)} />
    </div>
  );
}
export default Navbar;
