import React from 'react';
import { useLanguage } from '../../../hooks/useLanguage';
import { formatPriceDisplay } from '../formatPrice';

const COIN_PACKAGES = [
  { coins: 100, price: 19.99 },
  { coins: 500, price: 100.99 },
];

const VOICEBOT_COINS_IMAGE_SRC = 'https://voice-staging.botnoi.ai/assets/marAds/dialog_package/speaker_off.webp';

function CoinVoicebotIcon({ className = '' }) {
  const id = React.useId().replace(/:/g, '');
  return (
    <svg className={className} width="100%" height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <g clipPath={`url(#clip0_${id})`}>
        <path d="M8 0L8.9375 7.21875L8 16C3.57834 16 0 12.422 0 8C0 3.57834 3.57803 0 8 0Z" fill={`url(#paint0_linear_${id})`} />
        <path d="M16 8C16 12.4217 12.422 16 8 16V0C12.4217 0 16 3.57803 16 8Z" fill={`url(#paint1_linear_${id})`} />
        <path d="M7.99996 2.44434L8.62496 6.78121L7.99996 12.3243L5.02434 12.9821C4.7539 13.0417 4.49174 12.8556 4.45777 12.5818L4.06871 9.4209L2.61214 6.81277C2.4833 6.58127 2.57133 6.28977 2.80558 6.16809L5.5709 4.73309L7.66434 2.5859C7.75246 2.49559 7.87309 2.44434 7.99903 2.44434H7.99996Z" fill={`url(#paint2_linear_${id})`} />
        <path d="M13.3887 6.8109L11.9462 9.4209L11.5419 12.584C11.5066 12.8568 11.2448 13.0421 10.975 12.9821L8.0075 12.3228L8 12.3243V2.44434C8.12719 2.44402 8.24656 2.49496 8.33438 2.58465L10.4441 4.73309L13.1953 6.16871C13.4284 6.29046 13.5161 6.5804 13.3887 6.8109Z" fill={`url(#paint3_linear_${id})`} />
        <path d="M5.5 6H6.91525L8 9L9.0904 6H10.5L8.42373 11H7.58192L5.5 6Z" fill="white" />
      </g>
      <defs>
        <linearGradient id={`paint0_linear_${id}`} x1="8" y1="8" x2="0" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5B6370" /><stop offset="1" stopColor="#323C4C" />
        </linearGradient>
        <linearGradient id={`paint1_linear_${id}`} x1="8" y1="8" x2="16" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5B6370" /><stop offset="1" stopColor="#323C4C" />
        </linearGradient>
        <linearGradient id={`paint2_linear_${id}`} x1="6.99976" y1="3" x2="6.99976" y2="13" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9D5EFC" /><stop offset="1" stopColor="#96BAF1" />
        </linearGradient>
        <linearGradient id={`paint3_linear_${id}`} x1="8.5" y1="2.5" x2="8.5" y2="12.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9D5EFC" /><stop offset="1" stopColor="#96BAF1" />
        </linearGradient>
        <clipPath id={`clip0_${id}`}><rect width="16" height="16" fill="white" /></clipPath>
      </defs>
    </svg>
  );
}

export default function Addoncoinpayment({ onPurchase }) {
  const { t, language } = useLanguage();
  return (
    <section className="sm:w-screen sm:relative sm:left-1/2 sm:right-1/2 sm:-ml-[50vw] sm:-mr-[50vw]">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
        <div className="price-box flex flex-col w-full">
          {/* box-header-tag: purple title bar */}
          <div className="box-header-tag relative w-full sm:w-fit h-[50px] sm:h-[70px] bg-[#6c42f5] sm:border-2 sm:border-b-0 sm:border-[#7a59e5] rounded-t-[1.1rem] overflow-visible flex items-center">
            <img
              src={VOICEBOT_COINS_IMAGE_SRC}
              alt="speaker"
              className="speaker-img absolute left-0 bottom-[-10px] sm:bottom-[-20px] w-20 h-[100px] sm:w-[120px] sm:h-[140px] object-contain object-bottom"
              width={120}
              height={140}
              loading="lazy"
            />
            <div
              className="relative z-10 flex items-center justify-center sm:justify-start flex-1 min-w-0 pl-20 sm:pl-[120px] pr-4 sm:pr-6 rounded-tl-xl h-full"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
            >
              <h2 className="text-white text-base sm:text-xl font-bold whitespace-nowrap text-center sm:text-left">{t('pricing.addCoinsForVoicebot')}</h2>
            </div>
          </div>
          {/* box-body: white content with price-card rows */}
          <div className="box-body w-full border-2 border-t-0 sm:border-t-2 border-[#7a59e5] rounded-b-[1.25rem] sm:rounded-tr-[1.25rem] sm:rounded-tl-none bg-white p-4 sm:p-6 shadow-sm -mt-px">
            {COIN_PACKAGES.map((pkg) => {
              const priceDisplay = formatPriceDisplay(pkg.price, language, t);
              return (
              <div key={pkg.coins} className="price-card flex flex-row items-center justify-between gap-3 sm:gap-4 py-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                <div className="left flex items-center gap-3 min-w-0">
                  <CoinVoicebotIcon className="w-10 h-10 sm:w-12 sm:h-12 shrink-0" />
                  <div className="wrapper flex flex-col sm:flex-row sm:items-baseline gap-0 sm:gap-1">
                    <span className="amount text-lg sm:text-xl font-bold tracking-tight" style={{ color: '#4a2b5e' }}>{pkg.coins}</span>
                    <span className="unit font-normal text-base sm:text-lg" style={{ color: '#4a2b5e' }}>Coin</span>
                  </div>
                </div>
                <div className="right flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => onPurchase?.({ coins: pkg.coins, price: pkg.price })}
                    className="buy-btn text-white font-bold px-5 py-2.5 sm:px-6 rounded-xl transition-colors hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: '#8a5af8' }}
                  >
                    {priceDisplay.display} {priceDisplay.currency}
                  </button>
                </div>
              </div>
            );})}
          </div>
        </div>
      </div>
    </section>
  );
}
