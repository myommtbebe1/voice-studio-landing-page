import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faCrown, faBookOpen, faUserPlus, faMicrophone, faGift } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../../hooks/useLanguage';

export default function Navbar({ activeSection = 'buyPoints', onSectionChange = () => {} }) {
  const { t } = useLanguage();
  const isBuyPoints = activeSection === 'buyPoints';
  const isPremium = activeSection === 'premium';
  return (
    <nav className="sticky top-[72px] z-40 w-full max-w-[1280px] mx-auto py-4 px-4 sm:px-6 -mt-px  ">
  <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 items-center">
    {/* Buy Points - Active/Selected State */}
    <button
      type="button"
      onClick={() => onSectionChange('buyPoints')}
      className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl text-sm sm:text-base font-medium transition-colors ${
        isBuyPoints
          ? 'border-2 border-blue-300 bg-blue-50 text-gray-700 hover:bg-blue-100'
          : 'bg-white text-gray-500 hover:bg-[#def4ff]'
      }`}
    >
      <FontAwesomeIcon icon={faCartShopping} className="text-sm sm:text-base" />
      <span className="hidden sm:inline">{t('pricing.buyPoints')}</span>
      <span className="sm:hidden">{t('pricing.buy')}</span>
    </button>

    {/* Premium - Active/Selected State */}
    <button
      type="button"
      onClick={() => onSectionChange('premium')}
      className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl text-sm sm:text-base font-medium transition-colors ${
        isPremium
          ? 'border-2 border-purple-300 bg-purple-50 text-gray-700 hover:bg-purple-100'
          : 'bg-white text-gray-500 hover:bg-[#def4ff]'
      }`}
    >
      <FontAwesomeIcon icon={faCrown} className="text-sm sm:text-base" />
      <span>{t('pricing.premium')}</span>
    </button>

    {/* Education - Default State */}
    <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl text-gray-500 text-sm sm:text-base font-medium bg-white hover:bg-[#def4ff] transition-colors">
      <FontAwesomeIcon icon={faBookOpen} className="text-sm sm:text-base" />
      <span>{t('pricing.education')}</span>
    </button>

    {/* Invite Friends - Default State */}
    <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl text-gray-500 text-sm sm:text-base font-medium bg-white hover:bg-[#def4ff] transition-colors">
      <FontAwesomeIcon icon={faUserPlus} className="text-sm sm:text-base" />
      <span className="hidden sm:inline">{t('pricing.inviteFriends')}</span>
      <span className="sm:hidden">{t('pricing.invite')}</span>
    </button>

    {/* Record Voice - Default State */}
    <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl text-gray-500 text-sm sm:text-base font-medium bg-white hover:bg-[#def4ff] transition-colors">
      <FontAwesomeIcon icon={faMicrophone} className="text-sm sm:text-base" />
      <span className="hidden sm:inline">{t('pricing.recordVoice')}</span>
      <span className="sm:hidden">{t('pricing.record')}</span>
    </button>

    {/* Redeem - Default State */}
    <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl text-gray-500 text-sm sm:text-base font-medium bg-white hover:bg-[#def4ff] transition-colors">
      <FontAwesomeIcon icon={faGift} className="text-sm sm:text-base" />
      <span>{t('pricing.redeem')}</span>
    </button>
  </div>
  
</nav>
  );
}
