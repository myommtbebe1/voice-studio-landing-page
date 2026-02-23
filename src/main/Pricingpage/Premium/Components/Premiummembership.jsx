import React, { useState } from 'react';
import { useLanguage } from '../../../../hooks/useLanguage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

// Icons matching app-subscription-card-v2 (point_icon_purple, point_star_dynamic, no_blue)
function PointIconPurple({ className = 'w-8 h-8' }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M16 0L17.875 14.4375L16 32C7.15669 32 0 24.8439 0 16C0 7.15669 7.15606 0 16 0Z" fill="url(#pointGrad0)" />
      <path d="M32 16C32 24.8433 24.8439 32 16 32V0C24.8433 0 32 7.15606 32 16Z" fill="url(#pointGrad1)" />
      <path d="M16.0004 4.88892L17.2504 13.5627L16.0004 24.6489L10.0492 25.9645C9.50828 26.0837 8.98397 25.7114 8.91603 25.1639L8.13791 18.842L5.22478 13.6258C4.96709 13.1628 5.14315 12.5798 5.61165 12.3364L11.1423 9.46642L15.3292 5.17204C15.5054 4.99142 15.7467 4.88892 15.9985 4.88892H16.0004Z" fill="url(#pointGrad2)" />
      <path d="M26.7775 13.622L23.8925 18.842L23.0837 25.1683C23.0132 25.7139 22.4895 26.0844 21.95 25.9645L16.015 24.6458L16 24.6489V4.88892C16.2544 4.88829 16.4931 4.99017 16.6688 5.16954L20.8881 9.46642L26.3906 12.3377C26.8567 12.5812 27.0322 13.161 26.7775 13.622Z" fill="url(#pointGrad3)" />
      <path d="M16.595 18.4165H14.2507V16.8906H16.595C16.9573 16.8906 17.2522 16.8298 17.4797 16.708C17.7072 16.582 17.8736 16.4081 17.9789 16.1864C18.0842 15.9647 18.1369 15.7147 18.1369 15.4365C18.1369 15.1539 18.0842 14.8909 17.9789 14.6474C17.8736 14.404 17.7072 14.2083 17.4797 14.0605C17.2522 13.9127 16.9573 13.8388 16.595 13.8388H14.9079V21.8009H13.0122V12.3064H16.595C17.3154 12.3064 17.9325 12.4412 18.4465 12.7107C18.9646 12.9759 19.3606 13.3432 19.6344 13.8127C19.9083 14.2822 20.0452 14.8191 20.0452 15.4234C20.0452 16.0364 19.9083 16.5668 19.6344 17.0145C19.3606 17.4623 18.9646 17.8079 18.4465 18.0514C17.9325 18.2948 17.3154 18.4165 16.595 18.4165Z" fill="white" />
      <defs>
        <linearGradient id="pointGrad0" x1="0" y1="16" x2="17.875" y2="16" gradientUnits="userSpaceOnUse"><stop stopColor="#5B6370" /><stop offset="1" stopColor="#323C4C" /></linearGradient>
        <linearGradient id="pointGrad1" x1="16" y1="16" x2="32" y2="16" gradientUnits="userSpaceOnUse"><stop stopColor="#5B6370" /><stop offset="1" stopColor="#323C4C" /></linearGradient>
        <linearGradient id="pointGrad2" x1="11.1782" y1="4.88892" x2="11.1782" y2="17.4158" gradientUnits="userSpaceOnUse"><stop stopColor="#F84BC7" /><stop offset="1" stopColor="#C63EF4" /></linearGradient>
        <linearGradient id="pointGrad3" x1="21.4473" y1="4.88892" x2="21.4473" y2="17.416" gradientUnits="userSpaceOnUse"><stop stopColor="#F84BC7" /><stop offset="1" stopColor="#C63EF4" /></linearGradient>
      </defs>
    </svg>
  );
}

function PointStarIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M11.8327 3.52783L12.6921 9.49103L11.8327 17.1128L7.74122 18.0173C7.36937 18.0993 7.00891 17.8433 6.9622 17.4669L6.42724 13.1206L4.42446 9.53443C4.2473 9.21612 4.36834 8.81531 4.69044 8.64799L8.49275 6.67486L11.3712 3.72248C11.4924 3.5983 11.6583 3.52783 11.8314 3.52783H11.8327Z" fill="url(#starGrad)" />
      <path d="M19.2425 9.53186L17.2591 13.1206L16.7031 17.4699C16.6546 17.845 16.2945 18.0997 15.9236 18.0173L11.8433 17.1107L11.833 17.1128V3.52783C12.0079 3.5274 12.172 3.59744 12.2928 3.72076L15.1936 6.67487L18.9766 8.64885C19.297 8.81626 19.4176 9.21492 19.2425 9.53186Z" fill="url(#starGrad2)" />
      <path d="M12.2415 12.8277H10.6298V11.7786H12.2415C12.4906 11.7786 12.6933 11.7368 12.8497 11.6531C13.0061 11.5664 13.1205 11.4469 13.1929 11.2944C13.2653 11.142 13.3015 10.9701 13.3015 10.7789C13.3015 10.5846 13.2653 10.4038 13.1929 10.2364C13.1205 10.069 13.0061 9.93454 12.8497 9.83292C12.6933 9.7313 12.4906 9.68049 12.2415 9.68049H11.0816V15.1544H9.77832V8.62695H12.2415C12.7368 8.62695 13.1611 8.7196 13.5144 8.90491C13.8706 9.08722 14.1429 9.33977 14.3311 9.66256C14.5194 9.98535 14.6135 10.3545 14.6135 10.7699C14.6135 11.1913 14.5194 11.5559 14.3311 11.8638C14.1429 12.1716 13.8706 12.4092 13.5144 12.5766C13.1611 12.744 12.7368 12.8277 12.2415 12.8277Z" fill="white" />
      <defs>
        <linearGradient id="starGrad" x1="4.42" y1="3.53" x2="18.98" y2="17.11" gradientUnits="userSpaceOnUse"><stop stopColor="#F84BC7" /><stop offset="1" stopColor="#C63EF4" /></linearGradient>
        <linearGradient id="starGrad2" x1="11.83" y1="3.53" x2="19.24" y2="9.53" gradientUnits="userSpaceOnUse"><stop stopColor="#F84BC7" /><stop offset="1" stopColor="#C63EF4" /></linearGradient>
      </defs>
    </svg>
  );
}

function NoBlueIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M13.0758 12.4088L4.59082 3.92383" stroke="#01BFFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.83301 14.1665C12.1467 14.1665 14.833 11.4802 14.833 8.1665C14.833 4.8528 12.1467 2.1665 8.83301 2.1665C5.5193 2.1665 2.83301 4.8528 2.83301 8.1665C2.83301 11.4802 5.5193 14.1665 8.83301 14.1665Z" stroke="#01BFFB" strokeWidth="2" strokeMiterlimit="10" />
    </svg>
  );
}

function SubscriptionCardV2({
  label,
  pointsPerMonth,
  usdPerMonth,
  totalPoints,
  totalUsd,
  durationMonths,
  pointsPerThb,
  formatPrice,
  t,
  onPurchase,
  variant = 'default',
  purchaseButtonId = 'starter_monthly_subscription',
  extraListItems = [],
  multiplierOverride,
  pointsPerThbOverride,
  durationLabelType = 'start',
}) {
  const isRedBlue = variant === 'red-blue';
  const durationLabelPrefix = durationLabelType === 'total' ? t('membership.total') : t('membership.start');
  const displayPointsPerThb = pointsPerThbOverride ?? (pointsPerThb > 0 ? pointsPerThb : 90);
  const displayMultiplier = multiplierOverride ?? (pointsPerThb > 0 ? (pointsPerThb / 40).toFixed(2) : '2.25');

  // Pro outer box: red → blue → purple gradient (line 72–74)
  const borderGradient = isRedBlue
    ? 'bg-gradient-to-r from-red-400 via-blue-400 to-purple-500'
    : null;
  const starterGradientStyle = !isRedBlue
    ? { background: 'linear-gradient(90deg, #b2e9ff, #80b0ff, #ffd7d7)' }
    : undefined;
  const nameTextClass = isRedBlue
    ? 'red-blue bg-gradient-to-r from-red-500 to-blue-600 bg-clip-text text-transparent font-semibold'
    : 'text-black font-medium';
  const pointTextClass = isRedBlue
    ? 'red-blue-text bg-gradient-to-r from-red-500 to-blue-600 bg-clip-text text-transparent font-bold'
    : 'text-[#323C4C] font-bold';
  const buttonGradient = isRedBlue
    ? 'btn-blue-red-grad bg-gradient-to-r from-[#3b82f6] to-[#ef4444] hover:from-[#2563eb] hover:to-[#dc2626]'
    : 'btn-blue-grad bg-gradient-to-r from-[#6366f1] to-[#3b82f6] hover:from-[#4f46e5] hover:to-[#2563eb]';

  // Pro section box colors (when variant="red-blue"):
  // - Outer card border: borderGradient above (red → blue → purple)
  // - Pro pill border: line ~97 (linear-gradient #fbcfe8, #f9a8d4, #e9d5ff)
  // - Main card background: <main> has bg-white (line ~124)
  // - Expand section box: expandBoxGradient (Pro: #fbcfe8, #f9a8d4, #e9d5ff)
  const expandBoxGradient = isRedBlue
    ? 'linear-gradient(90deg, #fbcfe8, #f9a8d4, #e9d5ff)'
    : 'linear-gradient(90deg, #b2e9ff, #80b0ff, #ffd7d7)';

  return (
    <div
      className={`bg-card-container relative rounded-2xl p-[2px] w-full max-w-2xl mx-auto ${borderGradient ?? ''} shadow-sm ${isRedBlue ? 'border-red-blue' : 'border-default default'}`}
      style={starterGradientStyle}
    >
      {/* Starter/name word box: middle and center of package box, overlapping top edge like a tab */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-10">
        {isRedBlue ? (
          <div
            className="inline-block rounded-[1rem] overflow-hidden pt-[3px] px-[0px] pb-0"
            style={{ background: 'linear-gradient(90deg,rgb(251, 219, 207), #f9a8d4, #e9d5ff)' }}
          >
            <div className="bg-name name inline-flex items-center gap-1.5 bg-white rounded-t-[1rem] rounded-b-[1rem] px-4 py-2">
              <span className={`text-sm font-medium red-blue ${nameTextClass}`}>{label}</span>
              <button type="button" className="info-icon text-gray-500 hover:text-gray-700" aria-label="Info">
                <FontAwesomeIcon icon={faCircleInfo} className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div
            className="inline-block rounded-[1rem] overflow-hidden pt-[3px] px-[0px] pb-0"
            style={{ background: 'linear-gradient(90deg, #b2e9ff, #80b0ff, #ffd7d7)' }}
          >
            <div className="bg-name name inline-flex items-center gap-1.5 bg-white rounded-t-[1rem] rounded-b-[1rem] px-4 py-2">
              <span className={`text-sm font-medium default ${nameTextClass}`}>{label}</span>
              <button type="button" className="info-icon text-gray-500 hover:text-gray-700" aria-label="Info">
                <FontAwesomeIcon icon={faCircleInfo} className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <main className="card-container rounded-2xl bg-white overflow-hidden pt-5">
        <div className="card-wrapper px-5 pt-2 pb-4 sm:px-6 sm:pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <section className="left flex-1 min-w-0">
              <div className="left-row-1 flex items-baseline gap-2 flex-wrap">
                <PointIconPurple className="w-8 h-8 flex-shrink-0 point-icon" />
                <span className={`point text-xl sm:text-2xl ${pointTextClass}`}>
                  {Number(pointsPerMonth).toLocaleString()}
                </span>
                <span className="point-month text-base sm:text-lg text-gray-500">
                  {t('membership.ptPerMonth')}
                </span>
                <span className="sm:hidden ml-1">
                  <button type="button" className="text-gray-400" aria-label="Info">
                    <FontAwesomeIcon icon={faCircleInfo} className="w-3.5 h-3.5" />
                  </button>
                </span>
              </div>
              <p className="left-row-2 summary text-sm text-gray-500 mt-1">
                {formatPrice(Number(usdPerMonth))}/{t('membership.perMonth')} {t('membership.usdPerMonthGet')}{' '}
                <span className="text-500 font-semibold text-gray-700">
                  {Number(totalPoints).toLocaleString()}
                </span>{' '}
                {t('membership.ptExclaim')}
              </p>
            </section>

            <section className="right hidden sm:flex flex-shrink-0 flex-col items-end gap-1">
              <button
                type="button"
                onClick={onPurchase}
                id={purchaseButtonId}
                className={`purchase-btn w-full sm:w-auto min-w-[120px] text-white font-bold text-xl py-3 px-5 rounded-xl shadow-md hover:shadow-lg transition-all ${buttonGradient}`}
              >
                <span>{Number(totalUsd)}</span>
                <span className="text-small-btn text-sm font-medium opacity-90 ml-0.5"> USD</span>
              </button>
              <span className="minimum text-xs text-gray-500">
                {durationLabelPrefix} {Number(durationMonths)} {t('membership.monthUnit')}
              </span>
            </section>
          </div>
        </div>

        <div className="expand-wrapper px-5 sm:px-6 pb-4">
          <div
            className="rounded-[12px] overflow-hidden p-[2px]"
            style={{ background: expandBoxGradient }}
          >
            <div className="bg-expand-content bg-gray-50 overflow-hidden rounded-[10px]">
            <section className="expand-content p-4">
              <div className="sub-card-container grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="card-left flex items-start gap-2 rounded-lg bg-white/80 p-3 border border-gray-100">
                  <PointStarIcon className="w-6 h-6 flex-shrink-0 star-icon mt-0.5" />
                  <div>
                    <div className="sub-card-title font-semibold text-[#323C4C]">x{displayMultiplier}</div>
                    <span className="sub-card-info text-xs text-gray-500">({displayPointsPerThb} {t('membership.pointsPerThb')})</span>
                  </div>
                </div>
                <div className="card-right flex items-start gap-2 rounded-lg bg-white/80 p-3 border border-gray-100">
                  <NoBlueIcon className="w-5 h-5 flex-shrink-0 no-icon mt-0.5" />
                  <div>
                    <div className="sub-card-title text-[#01BFFB] font-medium">ADS</div>
                    <span className="sub-card-info text-xs text-gray-600">{t('membership.noAds')}</span>
                  </div>
                </div>
              </div>
              <div className="list-info space-y-2">
                <div className="list flex items-center gap-2">
                  <div className="bullet w-2 h-2 rounded-full bg-[#01BFFB] flex-shrink-0" />
                  <span className="list-text text-sm text-gray-700">{t('membership.monthlyPointsAutoReset')}</span>
                </div>
                {extraListItems.map((text, i) => (
                  <div key={i} className="list flex items-center gap-2">
                    <div className="bullet w-2 h-2 rounded-full bg-[#01BFFB] flex-shrink-0" />
                    <span className="list-text text-sm text-gray-700">{text}</span>
                  </div>
                ))}
              </div>
            </section>
            </div>
          </div>
        </div>

        <div className="sm:hidden px-5 sm:px-6 pb-4 flex flex-col items-stretch gap-1">
          <button
            type="button"
            onClick={onPurchase}
            className={`purchase-btn-mobile w-full text-white font-bold text-lg py-3 px-4 rounded-xl ${buttonGradient}`}
          >
            <span>{Number(totalUsd)}</span>
            <span className="text-small-btn text-sm opacity-90 ml-1"> USD</span>
          </button>
          <span className="minimum-mobile text-xs text-gray-500 text-center">
            {durationLabelPrefix} {Number(durationMonths)} {t('membership.monthUnit')}
          </span>
        </div>
      </main>
    </div>
  );
}

export default function MembershipSection({
  onJoin,
  packages = [],
  loading = false,
  error = null,
  starterPackage = null,
  starterLoading = false,
  starterError = null,
  proPackage = null,
  proLoading = false,
  proError = null,
  elitePackage = null,
  eliteLoading = false,
  eliteError = null,
  trialPlusPackage = null,
  trialPlusLoading = false,
  trialPlusError = null,
  yearlyStarterPackage = null,
  yearlyStarterLoading = false,
  yearlyStarterError = null,
  yearlyProPackage = null,
  yearlyProLoading = false,
  yearlyProError = null,
  yearlyElitePackage = null,
  yearlyEliteLoading = false,
  yearlyEliteError = null,
}) {
  const { t, language } = useLanguage();
  const [isYearly, setIsYearly] = useState(false);

  const formatPrice = (usdPrice) => {
    if (language === 'my') {
      const mmkRate = 2100;
      const mmkPrice = Math.round(usdPrice * mmkRate);
      return `${mmkPrice.toLocaleString('my-MM')} ကျပ်`;
    }
    return `$${usdPrice}`;
  };

  const handleJoin = (pkg) => {
    const price = Number(pkg?.us_price_discount ?? pkg?.us_price ?? 0);
    const textLimit = Number(pkg?.text_limit ?? 0);
    const normalizedPackage = {
      ...pkg,
      package_id: pkg?.package_id ?? pkg?.add_id,
      name: pkg?.display_name ?? 'Membership',
      description: textLimit > 0 ? `Create up to ${textLimit.toLocaleString()} chars.` : 'Membership package',
      points: textLimit,
      price,
      noAds: null,
    };

    if (typeof onJoin === 'function') {
      onJoin(normalizedPackage);
    }
  };

  const handleJoinStarter = () => {
    if (!starterPackage || typeof onJoin !== 'function') return;
    const price = Number(starterPackage.us_price ?? 0);
    const points = Number(starterPackage.monthly_point ?? 0);
    const normalizedPackage = {
      ...starterPackage,
      package_id: starterPackage.sub_id ?? '38',
      product_id: starterPackage.product_id,
      name: starterPackage.subscription_rank ?? starterPackage.name ?? t('membership.starter'),
      description: `${points.toLocaleString()} PT/${t('membership.monthUnit')}`,
      points,
      price,
      noAds: true,
    };
    onJoin(normalizedPackage);
  };

  const handleJoinPro = () => {
    if (!proPackage || typeof onJoin !== 'function') return;
    const usPrice = Number(proPackage.us_price ?? 0);
    const month = Number(proPackage.month ?? 1);
    const totalUsd = month === 1 ? usPrice * 3 : usPrice;
    const durationMonths = month === 1 ? 3 : month;
    const points = Number(proPackage.monthly_point ?? 0) * durationMonths;
    const normalizedPackage = {
      ...proPackage,
      package_id: proPackage.sub_id ?? '40',
      product_id: proPackage.product_id,
      name: proPackage.subscription_rank ?? proPackage.name ?? t('membership.pro'),
      description: `${Number(proPackage.monthly_point ?? 0).toLocaleString()} PT/${t('membership.monthUnit')}`,
      points,
      price: totalUsd,
      noAds: true,
    };
    onJoin(normalizedPackage);
  };

  const handleJoinElite = () => {
    if (!elitePackage || typeof onJoin !== 'function') return;
    const price = Number(elitePackage.us_price ?? 0);
    const points = Number(elitePackage.monthly_point ?? 0) * Number(elitePackage.month ?? 3);
    const normalizedPackage = {
      ...elitePackage,
      package_id: elitePackage.sub_id ?? '44',
      product_id: elitePackage.product_id,
      name: elitePackage.subscription_rank ?? elitePackage.name ?? t('membership.elite'),
      description: `${Number(elitePackage.monthly_point ?? 0).toLocaleString()} PT/${t('membership.monthUnit')}`,
      points,
      price,
      noAds: true,
    };
    onJoin(normalizedPackage);
  };

  const handleJoinTrialPlus = () => {
    if (!trialPlusPackage || typeof onJoin !== 'function') return;
    const price = Number(trialPlusPackage.us_price ?? 0);
    const points = Number(trialPlusPackage.monthly_point ?? 0) * Number(trialPlusPackage.month ?? 1);
    const normalizedPackage = {
      ...trialPlusPackage,
      package_id: trialPlusPackage.sub_id ?? '52',
      product_id: trialPlusPackage.product_id,
      name: trialPlusPackage.subscription_rank ?? trialPlusPackage.name ?? t('membership.trialPlus'),
      description: `${Number(trialPlusPackage.monthly_point ?? 0).toLocaleString()} PT/${t('membership.monthUnit')}`,
      points,
      price,
      noAds: true,
    };
    onJoin(normalizedPackage);
  };

  const handleJoinYearlyStarter = () => {
    if (!yearlyStarterPackage || typeof onJoin !== 'function') return;
    const price = Number(yearlyStarterPackage.us_price ?? 0);
    const points = Number(yearlyStarterPackage.monthly_point ?? 0) * Number(yearlyStarterPackage.month ?? 12);
    const normalizedPackage = {
      ...yearlyStarterPackage,
      package_id: yearlyStarterPackage.sub_id ?? '53',
      product_id: yearlyStarterPackage.product_id,
      name: yearlyStarterPackage.subscription_rank ?? yearlyStarterPackage.name ?? t('membership.starter'),
      description: `${Number(yearlyStarterPackage.monthly_point ?? 0).toLocaleString()} PT/${t('membership.monthUnit')}`,
      points,
      price,
      noAds: true,
    };
    onJoin(normalizedPackage);
  };

  const handleJoinYearlyPro = () => {
    if (!yearlyProPackage || typeof onJoin !== 'function') return;
    const price = Number(yearlyProPackage.us_price ?? 0);
    const points = Number(yearlyProPackage.monthly_point ?? 0) * Number(yearlyProPackage.month ?? 12);
    const normalizedPackage = {
      ...yearlyProPackage,
      package_id: yearlyProPackage.sub_id ?? '50',
      product_id: yearlyProPackage.product_id,
      name: yearlyProPackage.subscription_rank ?? yearlyProPackage.name ?? t('membership.pro'),
      description: `${Number(yearlyProPackage.monthly_point ?? 0).toLocaleString()} PT/${t('membership.monthUnit')}`,
      points,
      price,
      noAds: true,
    };
    onJoin(normalizedPackage);
  };

  const handleJoinYearlyElite = () => {
    if (!yearlyElitePackage || typeof onJoin !== 'function') return;
    const price = Number(yearlyElitePackage.us_price ?? 0);
    const points = Number(yearlyElitePackage.monthly_point ?? 0) * Number(yearlyElitePackage.month ?? 12);
    const normalizedPackage = {
      ...yearlyElitePackage,
      package_id: yearlyElitePackage.sub_id ?? '45',
      product_id: yearlyElitePackage.product_id,
      name: yearlyElitePackage.subscription_rank ?? yearlyElitePackage.name ?? t('membership.elite'),
      description: `${Number(yearlyElitePackage.monthly_point ?? 0).toLocaleString()} PT/${t('membership.monthUnit')}`,
      points,
      price,
      noAds: true,
    };
    onJoin(normalizedPackage);
  };

  // Starter: sub_id 38
  const starterPointsPerMonth = Number(starterPackage?.monthly_point ?? 0) || 18000;
  const starterDurationMonths = Number(starterPackage?.month ?? 0) || 3;
  const starterTotalUsd = Number(starterPackage?.us_price ?? 0) || 45;
  const starterUsdPerMonth = starterDurationMonths > 0 ? starterTotalUsd / starterDurationMonths : starterTotalUsd;
  const starterTotalPoints = starterPointsPerMonth * starterDurationMonths;
  const starterPointsPerThb = Number(starterPackage?.point_per_thb ?? 0);
  const starterLabel = starterPackage?.subscription_rank ?? starterPackage?.name ?? t('membership.starter');

  // Pro: sub_id 40 — API has month: 1, us_price: 30; display as 3-month plan (90 USD, 144,000 PT)
  const proPointsPerMonth = Number(proPackage?.monthly_point ?? 0) || 48000;
  const proMonthFromApi = Number(proPackage?.month ?? 1);
  const proUsdPerMonthFromApi = Number(proPackage?.us_price ?? 0) || 30;
  const proDurationMonths = proMonthFromApi === 1 ? 3 : proMonthFromApi;
  const proTotalUsd = proMonthFromApi === 1 ? proUsdPerMonthFromApi * 3 : Number(proPackage?.us_price ?? 0);
  const proUsdPerMonth = proDurationMonths > 0 ? proTotalUsd / proDurationMonths : proUsdPerMonthFromApi;
  const proTotalPoints = proPointsPerMonth * proDurationMonths;
  const proLabel = proPackage?.subscription_rank ?? proPackage?.name ?? t('membership.pro');

  // Elite: sub_id 44 — 160,000 PT/Month, 225 USD, 3 months, x4, 160 points/thb
  const elitePointsPerMonth = Number(elitePackage?.monthly_point ?? 0) || 160000;
  const eliteDurationMonths = Number(elitePackage?.month ?? 0) || 3;
  const eliteTotalUsd = Number(elitePackage?.us_price ?? 0) || 225;
  const eliteUsdPerMonth = eliteDurationMonths > 0 ? eliteTotalUsd / eliteDurationMonths : 75;
  const eliteTotalPoints = elitePointsPerMonth * eliteDurationMonths;
  const eliteLabel = elitePackage?.subscription_rank ?? elitePackage?.name ?? t('membership.elite');

  // Trial+: sub_id 52 — 35,000 PT/Month, 15 USD, 1 month; design shows "get 105,000 PT!" (35k*3)
  const trialPlusPointsPerMonth = Number(trialPlusPackage?.monthly_point ?? 0) || 35000;
  const trialPlusDurationMonths = Number(trialPlusPackage?.month ?? 0) || 1;
  const trialPlusTotalUsd = Number(trialPlusPackage?.us_price ?? 0) || 15;
  const trialPlusUsdPerMonth = trialPlusTotalUsd;
  const trialPlusTotalPointsDisplay = trialPlusPointsPerMonth * (trialPlusDurationMonths === 1 ? 3 : trialPlusDurationMonths);
  const trialPlusLabel = trialPlusPackage?.subscription_rank ?? trialPlusPackage?.name ?? t('membership.trialPlus');

  // Yearly Starter: sub_id 53 (Starter_partner) — 18,000 PT/Month, 130 USD total, 12 months, 10.8 USD/Month, 216,000 PT, x2.5, 100 points/thb
  const yearlyStarterPointsPerMonth = Number(yearlyStarterPackage?.monthly_point ?? 0) || 18000;
  const yearlyStarterDurationMonths = Number(yearlyStarterPackage?.month ?? 0) || 12;
  const yearlyStarterTotalUsd = Number(yearlyStarterPackage?.us_price ?? 0) || 130;
  const yearlyStarterUsdPerMonth = yearlyStarterDurationMonths > 0 ? yearlyStarterTotalUsd / yearlyStarterDurationMonths : 10.8;
  const yearlyStarterTotalPoints = yearlyStarterPointsPerMonth * yearlyStarterDurationMonths;
  const yearlyStarterLabel = t('membership.starter');

  // Yearly Pro: sub_id 50 (Pro_partner) — 48,000 PT/Month, 350 USD total, 12 months, 29.2 USD/Month, 576,000 PT, x3.5, 140 points/thb
  const yearlyProPointsPerMonth = Number(yearlyProPackage?.monthly_point ?? 0) || 48000;
  const yearlyProDurationMonths = Number(yearlyProPackage?.month ?? 0) || 12;
  const yearlyProTotalUsd = Number(yearlyProPackage?.us_price ?? 0) || 350;
  const yearlyProUsdPerMonth = yearlyProDurationMonths > 0 ? yearlyProTotalUsd / yearlyProDurationMonths : 29.2;
  const yearlyProTotalPoints = yearlyProPointsPerMonth * yearlyProDurationMonths;
  const yearlyProLabel = t('membership.pro');

  // Yearly Elite: sub_id 45 — 160,000 PT/Month, 1000 USD total, 12 months, 83.3 USD/Month, 1,920,000 PT, x5, 200 points/thb
  const yearlyElitePointsPerMonth = Number(yearlyElitePackage?.monthly_point ?? 0) || 160000;
  const yearlyEliteDurationMonths = Number(yearlyElitePackage?.month ?? 0) || 12;
  const yearlyEliteTotalUsd = Number(yearlyElitePackage?.us_price ?? 0) || 1000;
  const yearlyEliteUsdPerMonth = yearlyEliteDurationMonths > 0 ? yearlyEliteTotalUsd / yearlyEliteDurationMonths : 83.3;
  const yearlyEliteTotalPoints = yearlyElitePointsPerMonth * yearlyEliteDurationMonths;
  const yearlyEliteLabel = t('membership.elite');

  const isLoading = loading || starterLoading || proLoading || eliteLoading || trialPlusLoading || yearlyStarterLoading || yearlyProLoading || yearlyEliteLoading;
  const hasError = error || starterError || proError || eliteError || trialPlusError || yearlyStarterError || yearlyProError || yearlyEliteError;

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-12">
        <div className="text-center text-red-600">
          <p>{t('membership.error')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-3 text-black">
        {t('membership.title')}
      </h1>

      <p className="text-center text-gray-600 text-base sm:text-lg mb-8">
        {t('membership.subtitle')}
      </p>

      {/* Monthly / Yearly toggle */}
      <div className="flex justify-center mb-10">
        <div
          className="inline-flex rounded-[1.25rem] p-2"
          style={{ background: 'linear-gradient(90deg, #EBE8F6 0%, #F0ECFA 100%)' }}
        >
          <button
            type="button"
            onClick={() => setIsYearly(false)}
            className={`px-4 py-2 rounded-[1.25rem] text-sm font-medium transition-all ${
              !isYearly
                ? 'bg-white shadow-none'
                : 'text-[#515151] hover:text-gray-900'
            }`}
          >
            <span
              className={!isYearly ? 'bg-clip-text text-transparent' : ''}
              style={
                !isYearly
                  ? { backgroundImage: 'linear-gradient(90deg, #8A48F9, #AD5AFE, #65A7FF, #3F8CFF)' }
                  : undefined
              }
            >
              {t('membership.monthly')}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setIsYearly(true)}
            className={`px-4 py-2 rounded-[1.25rem] text-sm font-medium transition-all ${
              isYearly
                ? 'bg-white shadow-none'
                : 'hover:opacity-90'
            }`}
          >
            {isYearly ? (
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, #8A48F9, #AD5AFE, #65A7FF, #3F8CFF)' }}
              >
                {t('membership.yearly')}
              </span>
            ) : (
              <>
                <span className="text-[#515151]">{t('membership.yearlyLabel')}</span>
                <span className="text-[#8A48F9]">{t('membership.yearlyDiscountPrefix')}</span>
                <span className="text-[#FE655B]">{t('membership.yearlyDiscountSuffix')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Monthly section: Starter + Pro + Elite + Trial+ subscription cards */}
      {!isYearly && (
        <article className="package-cards space-y-10 mb-10">
          {starterPackage ? (
            <SubscriptionCardV2
              label={starterLabel}
              pointsPerMonth={starterPointsPerMonth}
              usdPerMonth={starterUsdPerMonth}
              totalPoints={starterTotalPoints}
              totalUsd={starterTotalUsd}
              durationMonths={starterDurationMonths}
              pointsPerThb={starterPointsPerThb}
              formatPrice={formatPrice}
              t={t}
              onPurchase={handleJoinStarter}
              variant="default"
              purchaseButtonId="starter_monthly_subscription"
            />
          ) : (
            <div className="text-center py-8 text-gray-500 rounded-2xl border-2 border-dashed border-gray-200">
              {t('membership.noStarterPackage')}
            </div>
          )}

          {proPackage && (
            <SubscriptionCardV2
              label={proLabel}
              pointsPerMonth={proPointsPerMonth}
              usdPerMonth={proUsdPerMonth}
              totalPoints={proTotalPoints}
              totalUsd={proTotalUsd}
              durationMonths={proDurationMonths}
              pointsPerThb={Number(proPackage?.point_per_thb ?? 0)}
              formatPrice={formatPrice}
              t={t}
              onPurchase={handleJoinPro}
              variant="red-blue"
              purchaseButtonId="Pro_monthly_subscription"
              extraListItems={[t('membership.useAiToolsFree')]}
              multiplierOverride={3}
              pointsPerThbOverride={120}
            />
          )}

          {elitePackage && (
            <SubscriptionCardV2
              label={eliteLabel}
              pointsPerMonth={elitePointsPerMonth}
              usdPerMonth={eliteUsdPerMonth}
              totalPoints={eliteTotalPoints}
              totalUsd={eliteTotalUsd}
              durationMonths={eliteDurationMonths}
              pointsPerThb={Number(elitePackage?.point_per_thb ?? 0)}
              formatPrice={formatPrice}
              t={t}
              onPurchase={handleJoinElite}
              variant="default"
              purchaseButtonId="Elite_monthly_subscription"
              extraListItems={[t('membership.useAiToolsFree')]}
              multiplierOverride={4}
              pointsPerThbOverride={160}
            />
          )}

          {trialPlusPackage && (
            <SubscriptionCardV2
              label={trialPlusLabel}
              pointsPerMonth={trialPlusPointsPerMonth}
              usdPerMonth={trialPlusUsdPerMonth}
              totalPoints={trialPlusTotalPointsDisplay}
              totalUsd={trialPlusTotalUsd}
              durationMonths={trialPlusDurationMonths}
              pointsPerThb={Number(trialPlusPackage?.point_per_thb ?? 0)}
              formatPrice={formatPrice}
              t={t}
              onPurchase={handleJoinTrialPlus}
              variant="default"
              purchaseButtonId="Trial_monthly_subscription"
              extraListItems={[t('membership.useAiToolsFree')]}
              multiplierOverride={1}
              pointsPerThbOverride={50}
            />
          )}
        </article>
      )}

      {/* Yearly section: Yearly Starter + Pro + Elite */}
      {isYearly && (
        <article className="package-cards space-y-10 mb-10">
          {yearlyStarterPackage ? (
            <SubscriptionCardV2
              label={yearlyStarterLabel}
              pointsPerMonth={yearlyStarterPointsPerMonth}
              usdPerMonth={Math.round(yearlyStarterUsdPerMonth * 10) / 10}
              totalPoints={yearlyStarterTotalPoints}
              totalUsd={yearlyStarterTotalUsd}
              durationMonths={yearlyStarterDurationMonths}
              pointsPerThb={Number(yearlyStarterPackage?.point_per_thb ?? 0)}
              formatPrice={formatPrice}
              t={t}
              onPurchase={handleJoinYearlyStarter}
              variant="default"
              purchaseButtonId="starter_yearly_subscription"
              extraListItems={[]}
              multiplierOverride={2.5}
              pointsPerThbOverride={100}
              durationLabelType="total"
            />
          ) : null}

          {yearlyProPackage && (
            <SubscriptionCardV2
              label={yearlyProLabel}
              pointsPerMonth={yearlyProPointsPerMonth}
              usdPerMonth={Math.round(yearlyProUsdPerMonth * 10) / 10}
              totalPoints={yearlyProTotalPoints}
              totalUsd={yearlyProTotalUsd}
              durationMonths={yearlyProDurationMonths}
              pointsPerThb={Number(yearlyProPackage?.point_per_thb ?? 0)}
              formatPrice={formatPrice}
              t={t}
              onPurchase={handleJoinYearlyPro}
              variant="red-blue"
              purchaseButtonId="Pro_yearly_subscription"
              extraListItems={[t('membership.useAiToolsFree')]}
              multiplierOverride={3.5}
              pointsPerThbOverride={140}
              durationLabelType="total"
            />
          )}

          {yearlyElitePackage && (
            <SubscriptionCardV2
              label={yearlyEliteLabel}
              pointsPerMonth={yearlyElitePointsPerMonth}
              usdPerMonth={Math.round(yearlyEliteUsdPerMonth * 10) / 10}
              totalPoints={yearlyEliteTotalPoints}
              totalUsd={yearlyEliteTotalUsd}
              durationMonths={yearlyEliteDurationMonths}
              pointsPerThb={Number(yearlyElitePackage?.point_per_thb ?? 0)}
              formatPrice={formatPrice}
              t={t}
              onPurchase={handleJoinYearlyElite}
              variant="default"
              purchaseButtonId="Elite_yearly_subscription"
              extraListItems={[t('membership.useAiToolsFree')]}
              multiplierOverride={5}
              pointsPerThbOverride={200}
              durationLabelType="total"
            />
          )}

          {!yearlyStarterPackage && !yearlyProPackage && !yearlyElitePackage && (
            <div className="text-center py-8 text-gray-500 rounded-2xl border-2 border-dashed border-gray-200">
              {t('membership.yearlyComingSoon')}
            </div>
          )}
        </article>
      )}

      {/* Add-on Packages (from get_all_package_add_on) */}
      {packages.length > 0 && (
        <>
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-2 text-center">{t('membership.addOnPackages')}</h2>
          <p className="text-center text-gray-600 text-base sm:text-lg mb-6 max-w-2xl mx-auto">
            {t('membership.addOnPackagesSubtitle')}
          </p>
          <div className="space-y-5">
            {packages.map((pkg, index) => {
              const hasDiscount = pkg.price_discount && pkg.price_discount < pkg.price;
              const currentPrice = pkg.us_price_discount || pkg.us_price;
              const originalPrice = pkg.us_price;

              return (
                <div
                  key={pkg.add_id || index}
                  className="relative bg-white rounded-2xl border-2 border-blue-200 p-6 shadow-sm"
                >
                  <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
                    <div className="bg-white px-4 py-1 rounded-lg border-2 border-purple-600">
                      <span className="text-sm font-semibold text-purple-900">
                        {pkg.display_name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {hasDiscount && (
                          <span className="text-base text-gray-400 line-through">
                            {formatPrice(originalPrice)}/{t('membership.perMonth')}
                          </span>
                        )}
                        <span className="text-2xl font-bold text-purple-600">
                          {t('membership.special')} {formatPrice(currentPrice)}
                          <span className="text-base">/{t('membership.perMonth')}</span>
                        </span>
                      </div>
                      <p className="text-gray-700 text-base">
                        {t('membership.createUpTo')}{' '}
                        <span className="font-semibold text-cyan-500">
                          {pkg.text_limit?.toLocaleString()}
                        </span>{' '}
                        {t('membership.chars')}
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <button
                        onClick={() => handleJoin(pkg)}
                        className="bg-cyan-400 hover:bg-cyan-500 text-white font-bold text-lg px-10 py-3 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        {t('membership.joinButton')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {!loading && packages.length === 0 && !starterPackage && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-base">{t('membership.noPackages')}</p>
        </div>
      )}
    </div>
  );
}
