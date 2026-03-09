import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLanguage } from '../../../hooks/useLanguage';
import { formatPriceDisplay } from '../formatPrice';
import {
  faClock,
  faCircleInfo,
  faXmark,
  faPhone,
  faClockRotateLeft,
  faMessage,
  faChevronUp,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faStar,
  faRocket,
  faGem,
  faCheck,
  faGift,
  faMicrophone,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons';

const HOT_DEAL_PACKAGES = [
  { level: 1, points: 200000, noAds: 'No Ads 1 month', coins: 50, originalPrice: '141.99', discountedPrice: '70.49', timeLeft: '09:40', package_id: 'pack_5000' },
  { level: 2, points: 80000, noAds: 'No Ads 1 month', coins: 20, originalPrice: '35.99', discountedPrice: '30.49', timeLeft: '09:40', package_id: 'pack_2000' },
  { level: 3, points: 30000, noAds: 'No Ads 1 month', coins: 8, originalPrice: '15.99', discountedPrice: '12.49', timeLeft: '09:40', package_id: 'pack_750' },
];

const VOICEBOT_FEATURE_ICONS = [faPhone, faClockRotateLeft, faMessage];
const VOICEBOT_FEATURE_KEYS = ['voicebotFeature1', 'voicebotFeature2', 'voicebotFeature3'];

// Subscription banner card image (microphone); reference path: assets/payment/subscription-card/mid.webp
const SUBSCRIPTION_CARD_IMAGE_SRC = 'https://voice-staging.botnoi.ai/assets/payment/subscription-card/mid.webp';
// Company / Special Price banner (language-specific: company-en.webp, company-my.webp)
const COMPANY_BANNER_BASE_URL = 'https://voice-staging.botnoi.ai/assets/payment/buy-points/company-';
// Credits icon for point packages (reference: assets/img/Credits.svg)
const CREDITS_IMG_SRC = 'https://voice-staging.botnoi.ai/assets/img/Credits.svg';
// Hot Deal section gradient (red) — used for Hot Deal prices/timer area only
const HOT_DEAL_GRADIENT = 'linear-gradient(to right, #dc2626, #b91c1c)';
// Shared points display: number = #4D3A9C → #8C3A7A gradient, "Points" = solid #8C3A7A
const POINTS_NUMBER_GRADIENT = 'linear-gradient(to right, #4D3A9C, #8C3A7A)';
const POINTS_LABEL_CLASS = 'font-semibold text-[#8C3A7A]';

const PLAN_STYLES = {
  starter: { header: 'bg-gradient-to-r from-purple-400 to-cyan-400', tab: 'bg-cyan-500', button: 'bg-cyan-500 hover:bg-cyan-600' },
  regular: { header: 'bg-gradient-to-r from-purple-600 to-purple-700', tab: 'bg-purple-600', button: 'bg-purple-600 hover:bg-purple-700' },
  professional: { header: 'bg-amber-600', tab: 'bg-amber-600', button: 'bg-amber-600 hover:bg-amber-700' },
};

// Theme for reference design: title tab, content border (gradient), price color, button gradient, "More price" color, row hover
const PLAN_THEMES = {
  starter: {
    headerGradient: 'linear-gradient(to right, #a78bfa, #93c5fd)',
    buttonGradient: 'linear-gradient(to right, #60a5fa, #a78bfa)',
    borderGradient: 'linear-gradient(to right, #93c5fd, #c4b5fd)',
    priceClass: 'text-blue-500',
    pointClass: 'text-gray-900',
    morePriceClass: 'text-blue-500',
    iconStyle: { background: 'linear-gradient(135deg, #3b82f6, #6366f1)' },
    hoverClass: 'hover:bg-blue-50/80',
  },
  regular: {
    headerGradient: 'linear-gradient(to right, #6d28d9, #881337)',
    buttonGradient: 'linear-gradient(to right, #6d28d9, #881337)',
    borderGradient: 'linear-gradient(to right, #5b21b6, #9f1239)',
    priceClass: 'text-purple-700',
    pointClass: 'text-gray-900',
    morePriceClass: 'text-purple-600',
    iconStyle: { background: 'linear-gradient(135deg, #5b21b6, #9f1239)' },
    hoverClass: 'hover:bg-purple-50/80',
  },
  professional: {
    headerGradient: 'linear-gradient(to right, #fbbf24, #d97706)',
    buttonGradient: 'linear-gradient(to right, #d97706, #92400e)',
    borderGradient: 'linear-gradient(to right, #fbbf24, #ea580c)',
    priceClass: 'text-amber-600',
    pointClass: 'text-gray-900',
    morePriceClass: 'text-amber-600',
    iconStyle: { background: 'linear-gradient(135deg, #d97706, #b45309)' },
    hoverClass: 'hover:bg-amber-50/80',
  },
};

const STARTER_TIERS = [
  { points: 23500, noAds: 'No Ads 2 months', coins: 5, originalPrice: '15.99', currentPrice: '10.49', timeLeft: '09:22', package_id: 'pack_499' },
  { points: 12500, noAds: 'No Ads 1 month', coins: 3, originalPrice: '8.99', currentPrice: '5.99', timeLeft: '09:22' },
  { points: 4100, noAds: null, coins: 1, originalPrice: null, currentPrice: '2.99', timeLeft: null },
];

const REGULAR_TIERS = [
  { points: 97500, noAds: 'No Ads 6 months', coins: 17, originalPrice: '51.99', currentPrice: '39.99', timeLeft: '09:22' },
  { points: 42000, noAds: 'No Ads 3 months', coins: 6, originalPrice: null, currentPrice: '17.99', timeLeft: null, package_id: 'pack_599' },
];

const PROFESSIONAL_TIERS = [
  { points: 1000000, noAds: 'No Ads 12 months', coins: 200, originalPrice: '599.99', currentPrice: '299.99', timeLeft: '09:22' },
  { points: 200000, noAds: 'No Ads 12 months', coins: 25, originalPrice: null, currentPrice: '74.99', timeLeft: null, package_id: 'pack_2499' },
];

const PRICE_PER_POINT = 0.001;

const SALE_COUNTDOWN_SECONDS = 10 * 60; // 10 minutes
const SALE_END_STORAGE_KEY = 'pricing_sale_end_ts';

function getSaleEndTimestamp() {
  try {
    const s = sessionStorage.getItem(SALE_END_STORAGE_KEY);
    return s ? Number(s) : null;
  } catch {
    return null;
  }
}

function getInitialSaleSecondsLeft() {
  const end = getSaleEndTimestamp();
  const now = Date.now();
  if (end != null && end > now) return Math.ceil((end - now) / 1000);
  const newEnd = now + SALE_COUNTDOWN_SECONDS * 1000;
  try {
    sessionStorage.setItem(SALE_END_STORAGE_KEY, String(newEnd));
  } catch {}
  return SALE_COUNTDOWN_SECONDS;
}

function formatCountdown(secondsLeft) {
  if (secondsLeft <= 0) return '00:00';
  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Map API packages (level 1, 2, 3) to Hot Deal display shape
function mapApiPackagesToHotDeal(apiPackages) {
  if (!Array.isArray(apiPackages) || apiPackages.length === 0) return null;
  const byLevel = {};
  apiPackages.forEach((p) => { byLevel[p.level] = p; });
  const ordered = [byLevel[1], byLevel[2], byLevel[3]].filter(Boolean);
  if (ordered.length === 0) return null;
  // Map points to package_id so payment modal can show correct Hottest Promotion add-ons (30k=pack_750, 80k=pack_2000, 200k=pack_5000)
  const pointsToPackageId = { 30000: 'pack_750', 80000: 'pack_2000', 200000: 'pack_5000' };
  return ordered.map((p) => {
    const points = p.points ?? 0;
    const packageId = p.package_id ?? pointsToPackageId[points] ?? null;
    return {
      level: p.level,
      points,
      noAds: p.noAds ?? 'No Ads 1 month',
      coins: p.coin_voicebot ?? p.coins ?? 0,
      originalPrice: p.originalPrice != null ? String(p.originalPrice) : null,
      discountedPrice: p.price != null ? String(p.price) : null,
      timeLeft: p.timeLeft ?? '09:40',
      package_id: packageId,
      ...p,
    };
  });
}

// No Ads icon (matches reference noAdsIcon SVG)
function NoAdsIcon({ className = '' }) {
  return (
    <svg className={className} width="100%" height="100%" viewBox="0 0 25 16" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <rect x="0.5" y="0.888672" width="24" height="14.2222" rx="3" fill="#D40101" />
      <path d="M5.50605 4.01H7.24606L10.0361 11H8.22605L7.66605 9.56H5.08605L4.52605 11H2.70605L5.50605 4.01ZM7.22605 8.2L6.37605 5.85L5.51605 8.2H7.22605ZM10.7381 4.01H13.2481C14.0148 4.01 14.6848 4.15 15.2581 4.43C15.8314 4.71 16.2714 5.11333 16.5781 5.64C16.8914 6.16 17.0481 6.77 17.0481 7.47C17.0481 8.63 16.7081 9.51 16.0281 10.11C15.3481 10.7033 14.4048 11 13.1981 11H10.7381V4.01ZM13.3481 9.51C13.9548 9.51 14.4181 9.32667 14.7381 8.96C15.0648 8.59333 15.2281 8.09667 15.2281 7.47C15.2281 6.89667 15.0648 6.42667 14.7381 6.06C14.4181 5.68667 13.9748 5.5 13.4081 5.5H12.5081V9.51H13.3481ZM19.4806 11.15C19.0406 11.15 18.6039 11.1067 18.1706 11.02C17.7373 10.94 17.3806 10.8267 17.1006 10.68V9.09C17.4606 9.27667 17.8339 9.41667 18.2206 9.51C18.6139 9.60333 18.9873 9.65 19.3406 9.65C19.6673 9.65 19.9139 9.6 20.0806 9.5C20.2473 9.4 20.3306 9.25667 20.3306 9.07C20.3306 8.93 20.2839 8.81 20.1906 8.71C20.1039 8.60333 19.9739 8.50667 19.8006 8.42C19.6273 8.33333 19.3573 8.21333 18.9906 8.06C18.3439 7.78667 17.8739 7.48333 17.5806 7.15C17.2873 6.81667 17.1406 6.40667 17.1406 5.92C17.1406 5.52 17.2506 5.16333 17.4706 4.85C17.6973 4.53667 18.0106 4.29333 18.4106 4.12C18.8106 3.94667 19.2706 3.86 19.7906 3.86C20.2173 3.86 20.5973 3.89333 20.9306 3.96C21.2639 4.02667 21.5839 4.13333 21.8906 4.28V5.83C21.3039 5.52333 20.7139 5.37 20.1206 5.37C19.8006 5.37 19.5439 5.42333 19.3506 5.53C19.1639 5.63 19.0706 5.77667 19.0706 5.97C19.0706 6.16333 19.1673 6.32 19.3606 6.44C19.5539 6.56 19.9106 6.72333 20.4306 6.93C20.9039 7.12333 21.2706 7.31333 21.5306 7.5C21.7973 7.68667 21.9906 7.90333 22.1106 8.15C22.2306 8.39667 22.2906 8.71 22.2906 9.09C22.2906 9.73667 22.0539 10.2433 21.5806 10.61C21.1139 10.97 20.4139 11.15 19.4806 11.15Z" fill="white" />
      <line x1="2.03599" y1="13.1142" x2="23.036" y2="2.11417" stroke="#D40101" strokeWidth="2" />
    </svg>
  );
}

// Coin icon for Voicebot (matches reference coinVoicebot SVG)
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

// Promotion limitation icon — point_icon_red (dark gray circle, red star, white P)
function PromotionPointIcon({ className = '' }) {
  const id = React.useId().replace(/:/g, '');
  return (
    <svg className={className} width="100%" height="100%" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" focusable="false" aria-hidden>
      <defs>
        <linearGradient id={`paint0_linear_${id}`} x1="0" y1="18" x2="20.1094" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5B6370" />
          <stop offset="1" stopColor="#323C4C" />
        </linearGradient>
        <linearGradient id={`paint1_linear_${id}`} x1="18" y1="18" x2="36" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5B6370" />
          <stop offset="1" stopColor="#323C4C" />
        </linearGradient>
        <clipPath id={`clip0_${id}`}>
          <rect width="36" height="36" fill="white" />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip0_${id})`}>
        <path d="M18 0L20.1094 16.2422L18 36C8.05127 36 0 27.9494 0 18C0 8.05127 8.05057 0 18 0Z" fill={`url(#paint0_linear_${id})`} />
        <path d="M36 18C36 27.9487 27.9494 36 18 36V0C27.9487 0 36 8.05057 36 18Z" fill={`url(#paint1_linear_${id})`} />
        <path d="M18.0004 5.5L19.4067 15.258L18.0004 27.73L11.3052 29.2101C10.6968 29.3442 10.1069 28.9253 10.0305 28.3094L9.15508 21.1973L5.87781 15.329C5.58791 14.8081 5.78598 14.1522 6.31305 13.8784L12.535 10.6497L17.2452 5.81852C17.4435 5.61532 17.7149 5.5 17.9983 5.5H18.0004Z" fill="#FF0D0D" />
        <path d="M30.1256 15.3248L26.88 21.1973L25.9701 28.3143C25.8908 28.9281 25.3016 29.3449 24.6947 29.2101L18.0178 27.7265L18.0004 27.73V5.5C18.2866 5.4993 18.5557 5.61391 18.7533 5.81571L23.5001 10.6497L29.6904 13.8798C30.2148 14.1538 30.4121 14.8061 30.1256 15.3248Z" fill="#FF0D0D" />
        <path d="M18.6694 20.7186H16.032V19.002H18.6694C19.0769 19.002 19.4087 18.9335 19.6646 18.7966C19.9205 18.6547 20.1077 18.4591 20.2262 18.2097C20.3447 17.9603 20.4039 17.679 20.4039 17.366C20.4039 17.0481 20.3447 16.7523 20.2262 16.4784C20.1077 16.2045 19.9205 15.9844 19.6646 15.8181C19.4087 15.6518 19.0769 15.5687 18.6694 15.5687H16.7713V24.526H14.6387V13.8447H18.6694C19.4798 13.8447 20.1741 13.9963 20.7522 14.2996C21.3352 14.5979 21.7806 15.0112 22.0887 15.5394C22.3967 16.0676 22.5508 16.6716 22.5508 17.3514C22.5508 18.041 22.3967 18.6376 22.0887 19.1414C21.7806 19.6451 21.3352 20.0339 20.7522 20.3078C20.1741 20.5817 19.4798 20.7186 18.6694 20.7186Z" fill="white" />
      </g>
    </svg>
  );
}

// Credits "P" icon for plan boxes (matches Credits.svg from staging)
function PlanIcon({ planKey, className = '' }) {
  return (
    <img
      src={CREDITS_IMG_SRC}
      alt="Points"
      className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 object-contain ${className}`}
    />
  );
}

function getBuyButtonIdPrefix(planKey, regularIdPrefix) {
  if (planKey === 'regular' && regularIdPrefix) return regularIdPrefix;
  if (planKey === 'starter') return 'starter';
  if (planKey === 'professional') return 'professional';
  return planKey;
}

// Single row for point packages (Starter / Regular / Professional); theme-based design
function PointItemRow({ tier, planKey, onPurchase, saleCountdownDisplay, saleExpired, isHidden = false, packIndex = 1, regularIdPrefix, t, language }) {
  const { points, noAds, coins, originalPrice, currentPrice, timeLeft } = tier;
  const theme = PLAN_THEMES[planKey] || PLAN_THEMES.starter;
  const noAdsMatch = noAds && String(noAds).match(/No Ads\s*(\d+)\s*(\w+)/i);
  const noAdsNum = noAdsMatch ? noAdsMatch[1] : null;
  const noAdsUnit = noAdsMatch ? noAdsMatch[2] : '';
  const displayPrice = saleExpired ? (originalPrice != null ? originalPrice : currentPrice) : currentPrice;
  const priceDisplay = formatPriceDisplay(displayPrice, language, t);
  const originalPriceDisplay = originalPrice != null ? formatPriceDisplay(originalPrice, language, t) : null;
  // Use live 10-min countdown when sale is active; otherwise fall back to tier's timeLeft
  const timerValue = !saleExpired && saleCountdownDisplay != null ? saleCountdownDisplay : (timeLeft ?? null);
  // Only show countdown when this tier has a sale price (original price struck through)
  const showCounter = originalPrice != null && !saleExpired && timerValue != null;
  // Pass effective price so payment modal shows original when sale expired, discount when sale active
  const handlePurchase = () => onPurchase?.({ planKey, ...tier, price: displayPrice });
  const buyButtonId = `${getBuyButtonIdPrefix(planKey, regularIdPrefix)}_buyPT_pack${packIndex}_click`;

  const hoverClass = theme.hoverClass || 'hover:bg-gray-50';
  return (
    <div className={`item-content flex flex-row items-center justify-between gap-2 pt-1.5 pb-1.5 px-3 -mx-1 rounded-lg transition-colors ${hoverClass} last:pb-0 ${isHidden ? 'hidden' : ''}`}>
      <div className="left flex-1 min-w-0 min-h-0">
        <div className="group-flex flex items-start gap-3">
          <PlanIcon planKey={planKey} className="max-[580px]:hidden" />
          <div className="group flex-1 min-w-0">
            <div className="group-2 flex flex-wrap items-baseline gap-1">
              <span
                className="point price-gradient-text text-xl max-[425px]:text-lg sm:text-2xl sm:text-3xl font-bold tabular-nums inline-block"
                style={{ background: POINTS_NUMBER_GRADIENT }}
              >
                {typeof points === 'number' ? points.toLocaleString() : points}
              </span>
              <span className={`text-sm max-[425px]:text-xs sm:text-base sm:text-lg ${POINTS_LABEL_CLASS}`}>{t('pricing.points')}</span>
            </div>
            <div className="pills flex flex-wrap gap-2 mt-1 text-sm max-[425px]:text-xs">
              {noAds && (
                <span className="pill inline-flex items-center gap-1 bg-white border-2 border-red-400 text-gray-900 px-2.5 py-0.5 rounded-full font-semibold text-sm max-[425px]:text-xs">
                  <NoAdsIcon className="w-3.5 h-3.5 noads-icon shrink-0 max-[580px]:hidden" />
                  <span>{t('pricing.noAds')}</span>
                  {noAdsNum && <span className="font-bold text-red-500">{noAdsNum}</span>}
                  {noAdsUnit && <span>{noAdsUnit}</span>}
                </span>
              )}
              {coins != null && (
                <span className="pill inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-gray-900 px-2.5 py-0.5 rounded-full font-semibold text-sm max-[425px]:text-xs">
                  <CoinVoicebotIcon className="w-4 h-4 voicebot-icon shrink-0 max-[580px]:hidden" />
                  <span className="font-bold text-purple-600">{coins}</span>
                  <span>{coins === 1 ? t('pricing.coin') : t('pricing.coins')}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="group-discount flex flex-col items-end gap-1 flex-shrink-0 min-w-0">
        {/* Desktop: strikethrough above price row */}
        {!saleExpired && originalPriceDisplay != null && (
          <span className="discount-price text-sm text-red-500 line-through hidden md:block">{originalPriceDisplay.display} {originalPriceDisplay.currency}</span>
        )}
        <div className="group flex flex-wrap items-center justify-end sm:justify-start gap-2 sm:gap-3">
          {/* Desktop (>= 768px): price text + counter + Purchase button */}
          <span
            className="price price-gradient-text text-2xl sm:text-3xl font-bold tabular-nums hidden md:inline-block"
            style={{ background: theme.headerGradient }}
          >
            {priceDisplay.display}{' '}
            <span className="font-normal text-lg sm:text-xl">{priceDisplay.currency}</span>
          </span>
          {showCounter && (
            <div className="counter hidden md:flex items-center gap-1 text-xs text-gray-500 tabular-nums">
              <FontAwesomeIcon icon={faClock} className="text-gray-400" />
              <span>{t('pricing.within')}</span>
              <span>{timerValue}</span>
            </div>
          )}
          {/* Mobile (< 768px): strikethrough + price button on the right, countdown outside below */}
          <div className="md:hidden flex flex-col items-end gap-1 ml-auto">
            <div className="flex flex-wrap items-center justify-end gap-2">
              {!saleExpired && originalPriceDisplay != null && (
                <span className="text-sm text-red-500 line-through">{originalPriceDisplay.display} {originalPriceDisplay.currency}</span>
              )}
              <button type="button" data-button-id={buyButtonId} onClick={handlePurchase} className="text-white font-semibold px-5 py-2.5 rounded-lg hover:shadow-md transition-opacity hover:opacity-90 text-base max-[580px]:text-sm max-[425px]:text-xs" style={{ background: theme.headerGradient }}>
                <span className="tabular-nums">
                  {priceDisplay.display} <span className="font-normal max-[580px]:text-xs">{priceDisplay.currency}</span>
                </span>
              </button>
            </div>
            {showCounter && (
              <span className="flex items-center gap-1 text-xs max-[425px]:text-[10px] text-gray-500 tabular-nums">
                <FontAwesomeIcon icon={faClock} className="text-gray-400" />
                {t('pricing.within')} {timerValue}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="right flex-shrink-0">
        <button type="button" id={buyButtonId} onClick={handlePurchase} className="text-white font-semibold px-6 py-2.5 rounded-lg transition-shadow hover:shadow-md hidden md:inline-block" style={{ background: theme.headerGradient }}>{t('pricing.purchase')}</button>
      </div>
    </div>
  );
}

function TierRow({ points, noAds, coins, originalPrice, currentPrice, timeLeft, buttonClass, onPurchase, saleCountdownDisplay, saleExpired }) {
  const timerDisplay = saleCountdownDisplay != null ? (saleExpired ? 'Offer ended' : `Ends in ${saleCountdownDisplay}`) : (timeLeft ? `within ${timeLeft}` : null);
  return (
    <div className="w-full bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3 flex-1">
        <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center shrink-0"><span className="text-white font-bold text-lg">P</span></div>
        <div>
          <p className="text-lg sm:text-xl font-bold text-gray-800">{typeof points === 'number' ? points.toLocaleString() : points} Points</p>
          <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
            {noAds && <span className="flex items-center gap-1"><span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">ADS</span>{noAds}</span>}
            {coins != null && <span className="flex items-center gap-1"><span className="text-purple-500 font-medium">●</span> {coins} coin</span>}
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:items-end gap-2">
        <div className="flex items-baseline gap-2">
          {originalPrice != null && <span className="text-sm text-gray-400 line-through">{originalPrice} USD</span>}
          <span className="text-xl font-bold text-red-500">{currentPrice} USD</span>
        </div>
        <button onClick={onPurchase} className={`w-full sm:w-auto text-white font-semibold px-6 py-2.5 rounded-lg transition-colors ${buttonClass} disabled:opacity-50 disabled:cursor-not-allowed`} disabled={saleExpired}>Purchase</button>
        {timerDisplay && <span className="flex items-center gap-1 text-xs text-gray-500 tabular-nums"><FontAwesomeIcon icon={faClock} className="text-gray-400" />{timerDisplay}</span>}
      </div>
    </div>
  );
}


export default function PricingSections({ onPurchase, apiPackages = [], packagesLoading = false, onViewSubscriptions }) {
  const { t, language } = useLanguage();
  const [voicebotDismissed, setVoicebotDismissed] = useState(false);
  const [starterExpanded, setStarterExpanded] = useState(false);
  const [regularExpanded, setRegularExpanded] = useState(false);
  const [professionalExpanded, setProfessionalExpanded] = useState(false);
  const [starterPackageIndex, setStarterPackageIndex] = useState(0);
  const [regularPackageIndex, setRegularPackageIndex] = useState(0);
  const [professionalPackageIndex, setProfessionalPackageIndex] = useState(0);
  const CUSTOM_POINTS_KEY = 'customPoints';
  const [customPoints, setCustomPoints] = useState(5000);
  const [saleSecondsLeft, setSaleSecondsLeft] = useState(getInitialSaleSecondsLeft);

  useEffect(() => {
    if (saleSecondsLeft <= 0) return;
    const id = setInterval(() => {
      const end = getSaleEndTimestamp();
      const now = Date.now();
      if (end == null || end <= now) {
        setSaleSecondsLeft(0);
        return;
      }
      setSaleSecondsLeft(Math.ceil((end - now) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [saleSecondsLeft]);

  const saleCountdownDisplay = formatCountdown(saleSecondsLeft);
  const saleExpired = saleSecondsLeft <= 0;

  const hotDealPackages = mapApiPackagesToHotDeal(apiPackages) ?? HOT_DEAL_PACKAGES;
  const customPrice = (customPoints * PRICE_PER_POINT).toFixed(2);

  return (
    <>
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12">
      {/* ——— Hot Deals: gradient container with glass cards + illustration ——— */}
      <section className="w-full">
        <div className="relative w-full mb-16 p-8 md:p-10 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" aria-hidden />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full -ml-24 -mb-24" aria-hidden />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="w-full lg:flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-block px-3 py-1 bg-yellow-400 text-indigo-900 rounded-full text-xs font-black uppercase tracking-wider">{t('pricing.flashSale')}</span>
                <span className="text-indigo-100 text-sm font-medium">{t('pricing.promotionLimited')}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-8 leading-tight">{t('pricing.hotDealsTitle')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {packagesLoading && hotDealPackages.length === 0 ? (
                  <div className="col-span-full py-8 text-center text-white/90">{t('pricing.loadingPackages')}</div>
                ) : (
                  hotDealPackages.map((pkg, idx) => {
                    const hotDealPrice = saleExpired ? (pkg.originalPrice ?? pkg.discountedPrice ?? pkg.price) : (pkg.discountedPrice ?? pkg.price);
                    const hotDealPriceDisplay = formatPriceDisplay(hotDealPrice, language, t);
                    const hotDealOriginalPriceDisplay = pkg.originalPrice != null ? formatPriceDisplay(Number(pkg.originalPrice), language, t) : null;
                    return (
                      <div key={pkg.level ?? pkg.points} className="backdrop-blur-sm bg-white/10 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/20 hover:scale-105 transition-all duration-200 border border-white/10">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-2xl font-black block tabular-nums">{Number(pkg.points).toLocaleString()}</span>
                              <span className="text-xs uppercase font-bold opacity-80">{t('pricing.points')}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-xl font-bold block text-yellow-400 tabular-nums">{hotDealPriceDisplay.display} {hotDealPriceDisplay.currency}</span>
                              {!saleExpired && hotDealOriginalPriceDisplay && (
                                <span className="text-[10px] line-through opacity-60">{hotDealOriginalPriceDisplay.display} {hotDealOriginalPriceDisplay.currency}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {pkg.noAds && (
                              <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 text-white">
                                <span className="material-symbols-outlined text-[12px]" aria-hidden>block</span>
                                {pkg.noAds}
                              </span>
                            )}
                            {pkg.coins != null && (
                              <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 text-white">
                                <span className="material-symbols-outlined text-[12px]" aria-hidden>monetization_on</span>
                                {pkg.coins} {pkg.coins === 1 ? t('pricing.coin') : t('pricing.coins')}
                              </span>
                            )}
                          </div>
                          {!saleExpired && saleCountdownDisplay && (
                            <p className="flex items-center gap-1.5 text-[10px] font-medium text-indigo-200 tabular-nums opacity-90">
                              <FontAwesomeIcon icon={faClock} className="shrink-0" aria-hidden />
                              <span>{t('pricing.within')} {saleCountdownDisplay}</span>
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => onPurchase?.({ level: pkg.level, points: pkg.points, price: saleExpired ? (pkg.originalPrice ?? pkg.discountedPrice ?? pkg.price) : (pkg.discountedPrice ?? pkg.price), ...pkg })}
                          className="mt-4 w-full py-2 font-bold rounded-lg text-sm transition-all bg-white/10 text-white border border-white/20 hover:bg-yellow-400 hover:border-yellow-400 hover:text-indigo-900"
                        >
                          {t('pricing.claim')}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <div className="hidden lg:block w-64 h-64 relative shrink-0">
              <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full" aria-hidden />
              <img
                alt={t('pricing.promotionVisualAlt')}
                className="relative z-10 w-full h-full object-cover rounded-3xl shadow-2xl rotate-3"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbdxFL3mlqu19M-Tu7rLGzW43YYZ7VZTnPqPAARKcxH_csfNpYgecVhMTvpxSzFblk6KcQ55jW8OUdy4dnFVVCjyAvLrKQUvclATgywGN0G6uF5I2wfsXB3LJx9Ah2k1dRHxzCYUl49J1-RL4ngS7yomuOVR07PGQDykDqhgRbfFV__8AVxvXA74vErDnPwq1Vd9-RVMZUVH5CHMIQk5XBrUjXtcGu9EjsAcNBy-NA7_qT9e0TAIF3O1U7yHWlhMmOxFLu1RYtTec"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ——— Choose Your Package: 3 horizontal cards ——— */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('pricing.theMoreYouBuy')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Starter — with pagination to cycle through all starter tiers */}
          <div className="group bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 flex flex-col relative transition-all duration-200 hover:border-purple-500 hover:shadow-xl hover:-translate-y-1">
            {/* "STARTER" badge above box — visible only on hover, like MOST POPULAR */}
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {t('pricing.starter')}
            </span>
            <div className="absolute top-4 right-4 text-purple-500">
              <FontAwesomeIcon icon={faRocket} className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-purple-600 uppercase tracking-wide group-hover:opacity-0 transition-opacity duration-200">{t('pricing.starter')}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {STARTER_TIERS[starterPackageIndex].points?.toLocaleString()} <span className="text-gray-500 font-normal text-lg">Pts</span>
            </p>
            <p className="text-lg font-semibold text-blue-600">
              {saleExpired && STARTER_TIERS[starterPackageIndex].originalPrice
                ? STARTER_TIERS[starterPackageIndex].originalPrice
                : STARTER_TIERS[starterPackageIndex].currentPrice}
              {t('pricing.currencyUsd')}
              {!saleExpired && STARTER_TIERS[starterPackageIndex].originalPrice && (
                <span className="ml-2 text-sm font-normal text-gray-400 line-through">{STARTER_TIERS[starterPackageIndex].originalPrice} {t('pricing.currencyUsd')}</span>
              )}
            </p>
            {!saleExpired && STARTER_TIERS[starterPackageIndex].originalPrice && saleCountdownDisplay && (
              <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-indigo-800 tabular-nums">
                <FontAwesomeIcon icon={faClock} className="text-indigo-700 shrink-0" aria-hidden />
                <span>{t('pricing.within')} {saleCountdownDisplay}</span>
              </p>
            )}
            {/* Pagination: dots + prev/next */}
            <div className="flex items-center justify-between gap-2 mt-3">
              <div className="flex items-center gap-1.5">
                {STARTER_TIERS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setStarterPackageIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 ${
                      i === starterPackageIndex ? 'bg-purple-600' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={t('pricing.points') + ` ${i + 1}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => setStarterPackageIndex((i) => (i <= 0 ? STARTER_TIERS.length - 1 : i - 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors disabled:opacity-50"
                  aria-label="Previous"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setStarterPackageIndex((i) => (i >= STARTER_TIERS.length - 1 ? 0 : i + 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors disabled:opacity-50"
                  aria-label="Next"
                >
                  <FontAwesomeIcon icon={faChevronRight} className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <ul className="mt-4 space-y-2 flex-1 text-sm text-gray-600">
              {STARTER_TIERS[starterPackageIndex].noAds && (
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-500 text-lg shrink-0" aria-hidden>block</span>
                  <span>{STARTER_TIERS[starterPackageIndex].noAds}</span>
                </li>
              )}
              {STARTER_TIERS[starterPackageIndex].coins != null && (
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-500 text-lg shrink-0" aria-hidden>savings</span>
                  <span>{t('pricing.bonus')}: <strong>{STARTER_TIERS[starterPackageIndex].coins} {STARTER_TIERS[starterPackageIndex].coins === 1 ? t('pricing.coin') : t('pricing.coins')}</strong></span>
                </li>
              )}
            </ul>
            <button
              type="button"
              onClick={() => onPurchase?.({ planKey: 'starter', ...STARTER_TIERS[starterPackageIndex], price: saleExpired && STARTER_TIERS[starterPackageIndex].originalPrice ? STARTER_TIERS[starterPackageIndex].originalPrice : STARTER_TIERS[starterPackageIndex].currentPrice })}
              className="mt-6 w-full bg-gray-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {t('pricing.getStarted')}
            </button>
          </div>
          {/* Regular — same layout as Starter, with carousel */}
          <div className="group bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 flex flex-col relative transition-all duration-200 hover:border-purple-500 hover:shadow-xl hover:-translate-y-1">
            {/* "REGULAR" badge above box — visible only on hover, same position as Starter */}
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {t('pricing.regular')}
            </span>
            <div className="absolute top-4 right-4 text-purple-500">
              <FontAwesomeIcon icon={faStar} className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-purple-600 uppercase tracking-wide group-hover:opacity-0 transition-opacity duration-200">{t('pricing.regular')}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {REGULAR_TIERS[regularPackageIndex].points?.toLocaleString()} <span className="text-gray-500 font-normal text-lg">Pts</span>
            </p>
            <p className="text-lg font-semibold text-blue-600">
              {saleExpired && REGULAR_TIERS[regularPackageIndex].originalPrice
                ? REGULAR_TIERS[regularPackageIndex].originalPrice
                : REGULAR_TIERS[regularPackageIndex].currentPrice}
              {t('pricing.currencyUsd')}
              {!saleExpired && REGULAR_TIERS[regularPackageIndex].originalPrice && (
                <span className="ml-2 text-sm font-normal text-gray-400 line-through">{REGULAR_TIERS[regularPackageIndex].originalPrice} {t('pricing.currencyUsd')}</span>
              )}
            </p>
            {!saleExpired && REGULAR_TIERS[regularPackageIndex].originalPrice && saleCountdownDisplay && (
              <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-indigo-800 tabular-nums">
                <FontAwesomeIcon icon={faClock} className="text-indigo-700 shrink-0" aria-hidden />
                <span>{t('pricing.within')} {saleCountdownDisplay}</span>
              </p>
            )}
            {/* Pagination: dots + prev/next */}
            <div className="flex items-center justify-between gap-2 mt-3">
              <div className="flex items-center gap-1.5">
                {REGULAR_TIERS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRegularPackageIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 ${
                      i === regularPackageIndex ? 'bg-purple-600' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={t('pricing.points') + ` ${i + 1}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => setRegularPackageIndex((i) => (i <= 0 ? REGULAR_TIERS.length - 1 : i - 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors"
                  aria-label="Previous"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setRegularPackageIndex((i) => (i >= REGULAR_TIERS.length - 1 ? 0 : i + 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors"
                  aria-label="Next"
                >
                  <FontAwesomeIcon icon={faChevronRight} className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <ul className="mt-4 space-y-2 flex-1 text-sm text-gray-600">
              {REGULAR_TIERS[regularPackageIndex].noAds && (
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-500 text-lg shrink-0" aria-hidden>block</span>
                  <span>{REGULAR_TIERS[regularPackageIndex].noAds}</span>
                </li>
              )}
              {REGULAR_TIERS[regularPackageIndex].coins != null && (
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-500 text-lg shrink-0" aria-hidden>savings</span>
                  <span>{t('pricing.bonus')}: <strong>{REGULAR_TIERS[regularPackageIndex].coins} {REGULAR_TIERS[regularPackageIndex].coins === 1 ? t('pricing.coin') : t('pricing.coins')}</strong></span>
                </li>
              )}
            </ul>
            <button
              type="button"
              onClick={() => onPurchase?.({ planKey: 'regular', ...REGULAR_TIERS[regularPackageIndex], price: saleExpired && REGULAR_TIERS[regularPackageIndex].originalPrice ? REGULAR_TIERS[regularPackageIndex].originalPrice : REGULAR_TIERS[regularPackageIndex].currentPrice })}
              className="mt-6 w-full bg-gray-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {t('pricing.purchaseNow')}
            </button>
          </div>
          {/* Professional — same layout as Starter, with carousel */}
          <div className="group bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 flex flex-col relative transition-all duration-200 hover:border-purple-500 hover:shadow-xl hover:-translate-y-1">
            {/* "PROFESSIONAL" badge above box — visible only on hover, like Starter */}
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {t('pricing.professional')}
            </span>
            <div className="absolute top-4 right-4 text-purple-500">
              <FontAwesomeIcon icon={faGem} className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-purple-600 uppercase tracking-wide group-hover:opacity-0 transition-opacity duration-200">{t('pricing.professional')}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {PROFESSIONAL_TIERS[professionalPackageIndex].points?.toLocaleString()} <span className="text-gray-500 font-normal text-lg">Pts</span>
            </p>
            <p className="text-lg font-semibold text-blue-600">
              {saleExpired && PROFESSIONAL_TIERS[professionalPackageIndex].originalPrice
                ? PROFESSIONAL_TIERS[professionalPackageIndex].originalPrice
                : PROFESSIONAL_TIERS[professionalPackageIndex].currentPrice}
              {t('pricing.currencyUsd')}
              {!saleExpired && PROFESSIONAL_TIERS[professionalPackageIndex].originalPrice && (
                <span className="ml-2 text-sm font-normal text-gray-400 line-through">{PROFESSIONAL_TIERS[professionalPackageIndex].originalPrice} {t('pricing.currencyUsd')}</span>
              )}
            </p>
            {!saleExpired && PROFESSIONAL_TIERS[professionalPackageIndex].originalPrice && saleCountdownDisplay && (
              <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-indigo-800 tabular-nums">
                <FontAwesomeIcon icon={faClock} className="text-indigo-700 shrink-0" aria-hidden />
                <span>{t('pricing.within')} {saleCountdownDisplay}</span>
              </p>
            )}
            {/* Pagination: dots + prev/next */}
            <div className="flex items-center justify-between gap-2 mt-3">
              <div className="flex items-center gap-1.5">
                {PROFESSIONAL_TIERS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setProfessionalPackageIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 ${
                      i === professionalPackageIndex ? 'bg-purple-600' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={t('pricing.points') + ` ${i + 1}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => setProfessionalPackageIndex((i) => (i <= 0 ? PROFESSIONAL_TIERS.length - 1 : i - 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors"
                  aria-label="Previous"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setProfessionalPackageIndex((i) => (i >= PROFESSIONAL_TIERS.length - 1 ? 0 : i + 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors"
                  aria-label="Next"
                >
                  <FontAwesomeIcon icon={faChevronRight} className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <ul className="mt-4 space-y-2 flex-1 text-sm text-gray-600">
              {PROFESSIONAL_TIERS[professionalPackageIndex].noAds && (
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-500 text-lg shrink-0" aria-hidden>block</span>
                  <span>{PROFESSIONAL_TIERS[professionalPackageIndex].noAds}</span>
                </li>
              )}
              {PROFESSIONAL_TIERS[professionalPackageIndex].coins != null && (
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-500 text-lg shrink-0" aria-hidden>savings</span>
                  <span>{t('pricing.bonus')}: <strong>{PROFESSIONAL_TIERS[professionalPackageIndex].coins} {PROFESSIONAL_TIERS[professionalPackageIndex].coins === 1 ? t('pricing.coin') : t('pricing.coins')}</strong></span>
                </li>
              )}
            </ul>
            <button
              type="button"
              onClick={() => onPurchase?.({ planKey: 'professional', ...PROFESSIONAL_TIERS[professionalPackageIndex], price: saleExpired && PROFESSIONAL_TIERS[professionalPackageIndex].originalPrice ? PROFESSIONAL_TIERS[professionalPackageIndex].originalPrice : PROFESSIONAL_TIERS[professionalPackageIndex].currentPrice })}
              className="mt-6 w-full bg-gray-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {t('pricing.goProfessional')}
            </button>
          </div>
        </div>
      </section>

      {/* ——— Buy Custom Points + Government & SME (side by side) ——— */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t('pricing.buyCustomPoints')}</h2>
          <p className="mt-2 text-gray-600 text-sm sm:text-base">{t('pricing.needSpecificAmount')}</p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="flex items-center gap-2 flex-1 border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50">
              <img src={CREDITS_IMG_SRC} alt="" className="w-6 h-6 object-contain" />
              <input
                type="text"
                inputMode="numeric"
                value={customPoints}
                onChange={(e) => {
                  const digitsOnly = e.target.value.replace(/\D/g, '');
                  const num = digitsOnly === '' ? 0 : Math.max(0, parseInt(digitsOnly, 10));
                  setCustomPoints(num);
                  if (num > 0) localStorage.setItem(CUSTOM_POINTS_KEY, String(num));
                }}
                className="flex-1 min-w-0 bg-transparent border-0 text-gray-800 font-medium focus:ring-0 focus:outline-none"
              />
            </div>
            <button
              onClick={() => customPoints > 0 && onPurchase?.({ points: customPoints, price: Number(customPrice), isCustomPoints: true })}
              disabled={customPoints === 0}
              className="font-semibold px-6 py-2.5 rounded-lg transition-colors whitespace-nowrap bg-purple-400 hover:bg-purple-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formatPriceDisplay(Number(customPrice), language, t).display} {formatPriceDisplay(Number(customPrice), language, t).currency}
            </button>
          </div>
        </div>
        <a
          href="https://www.facebook.com/texttospeech.botnoi"
          target="_blank"
          rel="noopener noreferrer"
          className="group block bg-gradient-to-br from-teal-400 to-blue-500 p-8 rounded-3xl text-white relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h4 className="text-xl font-bold mb-2">{t('pricing.governmentSme')}</h4>
              <p className="text-white/80 text-sm mb-6">{t('pricing.governmentSmeDesc')}</p>
            </div>
            <span className="block w-full bg-white text-teal-600 font-bold py-3 rounded-xl hover:-translate-y-1 transition-transform text-center">
              {t('pricing.contactUs')}
            </span>
          </div>
          <FontAwesomeIcon icon={faBuilding} className="absolute -bottom-4 -right-4 text-9xl opacity-10 rotate-12 group-hover:scale-110 transition-transform pointer-events-none" aria-hidden />
        </a>
      </section>

      {/* ——— Subscription is here! ——— */}
      <div
        className="banner-sub w-full rounded-2xl overflow-hidden text-white px-6 py-8 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-gray-900 bg-no-repeat relative"
        style={{
          backgroundImage: `url(${SUBSCRIPTION_CARD_IMAGE_SRC})`,
          backgroundSize: '125% auto',
          backgroundPosition: '-100% center',
        }}
      >
        <div className="flex-1 z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" aria-hidden />
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest">{t('pricing.newSubscriptionModel')}</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{t('pricing.subscriptionHere')}</h3>
          <p className="text-slate-400 max-w-lg mb-0">{t('pricing.subscriptionDesc')}</p>
          {typeof onViewSubscriptions === 'function' && (
            <button type="button" onClick={onViewSubscriptions} className="mt-4 w-full sm:w-auto bg-purple-400 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              {t('pricing.viewSubscriptions')}
            </button>
          )}
        </div>
        <div className="hidden sm:block w-24 h-24 sm:w-32 sm:h-32 relative z-10 opacity-90">
          <FontAwesomeIcon icon={faMicrophone} className="w-full h-full text-white/80" aria-hidden />
        </div>
      </div>

      {/* ——— Optional: Company banner (commented out) ——— */}
      {/* <a
        href="https://www.facebook.com/texttospeech.botnoi"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full rounded-2xl overflow-hidden cursor-pointer"
      >
        <img
          id="sme_pricepage_banner"
          alt={t('pricing.companyBannerAlt')}
          className="banner-company w-full h-auto object-cover object-center"
          src={`${COMPANY_BANNER_BASE_URL}en.webp`}
          loading="lazy"
        />
      </a> */}
    </div>

      {/* ——— Report an issue (wider box) ——— */}
     
    </>
  );
}

// Button ID prefix for reference: starter, hob (Regular), professional
