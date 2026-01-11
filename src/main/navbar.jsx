import React, { useContext } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import LanguageButton from "../components/languagebutton";
import useSignout from "../hooks/useSignout";
import { AuthContext } from "../contexts/AuthContext";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  let { logout } = useSignout();
  let navigate = useNavigate();
  let {user} =useContext(AuthContext);
  console.log(user)

  let signOutUser = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <div>
      <nav className="sticky top-0 z-40 w-full bg-white/40  backdrop-blur-lg  transition-all duration-300">
        <div className="max-w-[1280px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-primary">
              <div className="size-8 bg-primary rounded-xl flex items-center justify-center text-dark">
                <FontAwesomeIcon icon={faCircle} />
              </div>
               <Link to='/'>
                    <h2 className="text-[#0d0d1b]  text-xl font-black leading-tight tracking-[-0.02em]">
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
                  className="relative text-[#0d0d1b] hover:text-gray-400 transition-colors text-sm font-semibold leading-normal flex items-center gap-1"
                >
                  <span>Studio</span>
                  <span className="absolute -top-3 -right-6 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                    NEW
                  </span>
                </button>

                {/* Dropdown panel */}
                <div className="absolute left- top-full mt-3 w-[780px] bg-white border border-gray-100 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.16)] py-3 px-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-500 mb-2">
                    <span className="tracking-[0.12em] text-gray-500">STUDIO</span>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    <Link
                      to="/VoiceStudio"
                      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#0d0d1b] shadow-sm hover:border-blue-400 hover:text-blue-600 transition-colors whitespace-nowrap"
                    >
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-[9px] text-white font-bold">
                        VS
                      </span>
                      <span>Voice Studio</span>
                    </Link>
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
                href="#"
              >
                Voice Over
              </a>
              <a
                className="text-[#0d0d1b]  hover:text-gray-300  transition-colors text-sm font-semibold leading-normal"
                href="#"
              >
                API
              </a>
              <a
                className="text-[#0d0d1b]  hover:text-gray-300  transition-colors text-sm font-semibold leading-normal"
                href="#"
              >
                Price
              </a>
              <a
                className="text-[#0d0d1b]  hover:text-gray-300  transition-colors text-sm font-semibold leading-normal"
                href="#"
              >
                Enterprise
              </a>
            </div>

            <div className="flex items-center gap-3">
              
              <LanguageButton />
             
              <div className="flex space-x-3">
                {!user && 
                 <>
                    <Link to={`/login`} className="border border-blue-400 text-gray-500 hidden lg:flex h-10 px-4 items-center justify-center rounded-full">
                      Log In
                    </Link>
                    <Link to={`/register`} className="border border-blue-400 text-gray-500 hidden lg:flex h-10 px-4 items-center justify-center rounded-full" >
                      Sign Up</Link>
                 </>
                 
                }
                {
                  !!user && 
                 <>  
                  <button className="hidden sm:flex h-10 px-4 items-center justify-center rounded-full bg-blue-300 text-blue-600 font-semibold shadow-[0_6px_20px_rgba(19,19,236,0.12)]   hover:bg-primary/20 transition-all text-xs leading-normal tracking-[0.01em]">
                    100 Pts
                    </button>
                   <button className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[#0d0d1b] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors overflow-hidden">
                      <img
                        alt="User profile"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqQ4qodrBG2nz2Hv1-A8s32EfkKQbgSuinbPL1yOsiZN1zoKu1wmK4YQFRBm2odcp-ri4qQCKe9A6d9FfLQqQ5U6fJhAG1EMvMQiDn5uOP4mJPkyOszA7krIDE8tkipFTqEaaf3hzRNykvh1mXh0h3nwUEQrLd-JenpF6KEOt18vuwQZSA36tG-N7t2-CiwvBF4Ts_VSUXfbwpjtRrWDLDDFGsLnv4koX3UXOSEFKPRjms6J9qAMGgLk7sx2h0bk9v0pGI_F9mKA"
                      />
                    </button>
                     <button onClick={signOutUser} className="bg-red-400 text-white hidden lg:flex h-10 px-4 items-center justify-center rounded-full" >
                       logout
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
                <a
                  className="relative text-[#0d0d1b] hover:text-gray-600 transition-colors text-base font-semibold py-2 px-4 rounded-lg hover:bg-gray-50"
                  href="#"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Studio
                  <span className="absolute top-1 right-4 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    NEW
                  </span>
                </a>
                <a
                  className="text-[#0d0d1b] hover:text-gray-600 transition-colors text-base font-semibold py-2 px-4 rounded-lg hover:bg-gray-50"
                  href="#"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Voice Over
                </a>
                <a
                  className="text-[#0d0d1b] hover:text-gray-600 transition-colors text-base font-semibold py-2 px-4 rounded-lg hover:bg-gray-50"
                  href="#"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  API
                </a>
                <a
                  className="text-[#0d0d1b] hover:text-gray-600 transition-colors text-base font-semibold py-2 px-4 rounded-lg hover:bg-gray-50"
                  href="#"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Price
                </a>
                <a
                  className="text-[#0d0d1b] hover:text-gray-600 transition-colors text-base font-semibold py-2 px-4 rounded-lg hover:bg-gray-50"
                  href="#"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Enterprise
                </a>
                <a
                  className="text-[#0d0d1b] hover:text-gray-600 transition-colors text-base font-semibold py-2 px-4 rounded-lg hover:bg-gray-50"
                  href="#"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  logout
                </a>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Navbar;
