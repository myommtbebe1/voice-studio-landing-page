import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faStar, faGem, faBan } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../../../hooks/useLanguage';

function PackageCardDetailed({ pkg, title, ctaLabel, t, formatPrice, onJoin, pointPerThbDefault = 90, multiplierDefault = 2.25, showAiToolsBullet = false, promoTotalMonths = null, durationLabel = null }) {
  const monthlyPoint = Number(pkg?.monthly_point ?? 0);
  const month = Number(pkg?.month ?? 0) || 1;
  const totalUsd = Number(pkg?.us_price ?? 0);
  const usdPerMonth = month > 0 ? totalUsd / month : totalUsd;
  const totalPointsForPromo = promoTotalMonths != null ? monthlyPoint * promoTotalMonths : monthlyPoint * month;
  const pointPerThb = Number(pkg?.point_per_thb ?? 0) || pointPerThbDefault;
  const multiplier = multiplierDefault;
  const multiplierDisplay = multiplier % 1 === 0 ? String(Math.round(multiplier)) : Number(multiplier).toFixed(2);
  const durationText = durationLabel != null ? durationLabel : `${t('membership.start')} ${month} ${t('membership.monthUnit')}`;

  return (
    <div className="rounded-2xl p-6 flex flex-col bg-white text-black shadow-lg border-2 border-gray-100 hover:border-purple-500 hover:shadow-xl transition-all duration-300 overflow-visible relative group bg-gradient-to-b from-white to-gray-50/50">
      {/* Buy-point style: pill above card visible on hover */}
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
        {title.toUpperCase()}
      </span>
      <div className="flex justify-between items-center mb-4 min-h-[2.5rem]">
        <p className="text-sm font-bold text-purple-600 uppercase tracking-wide transition-opacity duration-200 group-hover:opacity-0">
          {title}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-6 mb-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl text-indigo-500 font-black leading-none">P</span>
          <div>
            <p className="text-2xl font-black text-black tracking-tight">
              {monthlyPoint.toLocaleString()} <span className="text-base font-normal text-slate-700">{t('membership.ptPerMonth')}</span>
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              {formatPrice(usdPerMonth)} {t('membership.usdPerMonthGet')} {totalPointsForPromo.toLocaleString()} {t('membership.ptExclaim')}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-4 border-2 border-gray-100 bg-white/80 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl text-indigo-500 font-black">P</span>
            <div>
              <p className="text-lg font-black text-indigo-600">x{multiplierDisplay}</p>
              <p className="text-xs text-gray-500">({pointPerThb} {t('membership.pointsPerThb')})</p>
            </div>
          </div>
          <div className="text-right">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <FontAwesomeIcon icon={faBan} className="w-5 h-5" />
            </div>
            <p className="text-xs text-gray-500 mt-1">{t('membership.noAds')}</p>
          </div>
        </div>
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
            <p className="text-sm font-medium text-slate-700">{t('membership.monthlyPointsAutoReset')}</p>
          </div>
          {showAiToolsBullet && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
              <p className="text-sm font-medium text-slate-700">{t('membership.useAiToolsFree')}</p>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onJoin}
        className="mt-6 w-full py-3 font-semibold rounded-xl transition-all shadow-sm bg-white hover:bg-indigo-600 hover:text-white text-indigo-600 border border-gray-200"
      >
        {totalUsd} USD
      </button>
      <p className="text-sm text-gray-500 text-center mt-1.5">
        {durationText}
      </p>
    </div>
  );
}

function CheckBadge({ variant = 'default' }) {
  const classes =
    variant === 'pro'
      ? 'bg-indigo-100 text-indigo-600'
      : 'bg-emerald-100 text-emerald-600';
  return (
    <span className={`w-5 h-5 inline-flex items-center justify-center rounded-full text-[10px] font-black ${classes}`}>
      ✓
    </span>
  );
}

function TopIcon({ variant = 'default', hoverStyle = false }) {
  const color =
    hoverStyle
      ? 'text-purple-500'
      : variant === 'starter'
        ? 'text-indigo-200'
        : variant === 'pro'
          ? 'text-indigo-400'
          : variant === 'elite'
            ? 'text-purple-200'
            : 'text-slate-200';
  if (hoverStyle && (variant === 'starter' || variant === 'pro' || variant === 'elite')) {
    const icon = variant === 'starter' ? faRocket : variant === 'pro' ? faStar : faGem;
    return <FontAwesomeIcon icon={icon} className={`w-8 h-8 ${color}`} />;
  }
  const glyph = variant === 'pro' ? '★' : variant === 'elite' ? '◆' : variant === 'trial' ? 'ℹ' : '✔';
  return <span className={`text-3xl leading-none select-none ${color}`}>{glyph}</span>;
}

function TierCard({
  badge,
  badgeTone = 'indigo',
  iconVariant,
  pointsLabel,
  pointsSuffix,
  priceLabel,
  priceTone = 'indigo',
  originalPriceLabel,
  features = [],
  ctaLabel,
  ctaVariant = 'outline',
  onClick,
  highlighted = false,
}) {
  const badgeClass =
    badgeTone === 'purple'
      ? 'bg-purple-50/50 text-purple-600 border-purple-100/50'
      : badgeTone === 'slate'
        ? 'bg-slate-100/50 text-slate-500 border-slate-200/50'
        : badgeTone === 'white'
          ? 'bg-indigo-600 text-white border-transparent'
          : 'bg-indigo-50/50 text-indigo-600 border-indigo-100/50';

  const priceClass = priceTone === 'slate' ? 'text-slate-900' : 'text-indigo-600';

  const baseCard =
    'group rounded-2xl p-6 relative transition-all duration-300 hover:-translate-y-1 flex flex-col bg-white text-black shadow-lg';
  const normalCard =
    'border-2 border-gray-100 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-200/30';
  const proCard =
    'border-2 border-indigo-200 shadow-xl shadow-indigo-100/60 ring-1 ring-indigo-100 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-200/30';
  const scale = highlighted ? 'z-10' : '';

  const buttonClass =
    ctaVariant === 'solid'
      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200'
      : ctaVariant === 'muted'
        ? 'bg-white hover:bg-gray-100 text-slate-700 border border-gray-200'
        : 'bg-white hover:bg-indigo-600 hover:text-white text-indigo-600 border border-gray-200';

  return (
    <div className={`${baseCard} ${highlighted ? proCard : normalCard} ${scale}`}>
      {/* Buy-point style: pill above card visible on hover */}
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
        {badge}
      </span>

      <div className="flex justify-between items-start mb-2 min-h-[2.5rem]">
        {/* Buy-point style: purple uppercase title — visible by default, disappears on hover */}
        <p className="text-sm font-bold text-purple-600 uppercase tracking-wide transition-opacity duration-200 group-hover:opacity-0">
          {badge}
        </p>
        <TopIcon variant={iconVariant} hoverStyle />
      </div>

      <div className="mb-1">
        <span className="text-2xl font-black tracking-tighter">{pointsLabel}</span>{' '}
        <span className="text-slate-500 font-bold text-sm">{pointsSuffix}</span>
      </div>

      <div className="mb-4 flex items-baseline gap-2">
        <span className={`text-lg font-semibold ${priceClass}`}>{priceLabel}</span>
        {originalPriceLabel ? (
          <span className="text-sm text-slate-400 line-through font-bold">{originalPriceLabel}</span>
        ) : null}
      </div>

      <ul className="mt-4 space-y-2 flex-1 text-sm font-semibold text-slate-600">
        {features.map((f, idx) => (
          <li key={idx} className="flex items-center gap-3">
            <CheckBadge variant={highlighted ? 'pro' : 'default'} /> {f}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onClick}
        className={`mt-6 w-full py-3 font-semibold rounded-xl transition-all shadow-sm ${buttonClass}`}
      >
        {ctaLabel}
      </button>
    </div>
  );
}

export default function MembershipSection({
  onJoin,
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
  const { t } = useLanguage();
  const [isYearly, setIsYearly] = useState(false);

  const formatPrice = (usdPrice) => {
    const num = Number(usdPrice);
    return `$${Number.isFinite(num) ? num.toFixed(2) : '0.00'}`;
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
      checkoutType: 'premium-membership',
      subscriptionId: starterPackage.sub_id ?? '38',
    };
    onJoin(normalizedPackage);
  };

  const handleJoinPro = () => {
    if (!proPackage || typeof onJoin !== 'function') return;
    const usPrice = Number(proPackage.us_price ?? 0);
    const month = Number(proPackage.month ?? 1);
    const durationMonths = month === 1 ? 3 : month;
    const totalUsd = month === 1 ? usPrice * 3 : usPrice;
    const points = Number(proPackage.monthly_point ?? 0) * durationMonths;
    const normalizedPackage = {
      ...proPackage,
      package_id: proPackage.sub_id ?? '41',
      product_id: proPackage.product_id,
      name: proPackage.subscription_rank ?? proPackage.name ?? t('membership.pro'),
      description: `${Number(proPackage.monthly_point ?? 0).toLocaleString()} PT/${t('membership.monthUnit')}`,
      points,
      price: totalUsd,
      noAds: true,
      checkoutType: 'premium-membership',
      subscriptionId: proPackage.sub_id ?? '41',
      checkoutQuantity: durationMonths,
      checkoutDurationMonths: durationMonths,
      checkoutExpectedTotalUsd: totalUsd,
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
      checkoutType: 'premium-membership',
      subscriptionId: elitePackage.sub_id ?? '44',
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
      checkoutType: 'premium-membership',
      subscriptionId: yearlyStarterPackage.sub_id ?? '53',
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
      checkoutType: 'premium-membership',
      subscriptionId: yearlyProPackage.sub_id ?? '50',
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
      checkoutType: 'premium-membership',
      subscriptionId: yearlyElitePackage.sub_id ?? '45',
    };
    onJoin(normalizedPackage);
  };

  // Starter: sub_id 38
  const starterPointsPerMonth = Number(starterPackage?.monthly_point ?? 0) || 18000;
  const starterDurationMonths = Number(starterPackage?.month ?? 0) || 3;
  const starterTotalUsd = Number(starterPackage?.us_price ?? 0) || 45;
  const starterUsdPerMonth = starterDurationMonths > 0 ? starterTotalUsd / starterDurationMonths : starterTotalUsd;

  // Pro: sub_id 41 — monthly_point 48000, us_price 90, month 3 → $30/mo
  const proPointsPerMonth = Number(proPackage?.monthly_point ?? 0) || 48000;
  const proMonthFromApi = Number(proPackage?.month ?? 1);
  const proUsdPerMonthFromApi = Number(proPackage?.us_price ?? 0) || 30;
  const proDurationMonths = proMonthFromApi === 1 ? 3 : proMonthFromApi;
  const proTotalUsd = proMonthFromApi === 1 ? proUsdPerMonthFromApi * 3 : Number(proPackage?.us_price ?? 0);
  const proUsdPerMonth = proDurationMonths > 0 ? proTotalUsd / proDurationMonths : proUsdPerMonthFromApi;

  // Elite: sub_id 44 — 160,000 PT/Month, 225 USD, 3 months, x4, 160 points/thb
  const elitePointsPerMonth = Number(elitePackage?.monthly_point ?? 0) || 160000;
  const eliteDurationMonths = Number(elitePackage?.month ?? 0) || 3;
  const eliteTotalUsd = Number(elitePackage?.us_price ?? 0) || 225;
  const eliteUsdPerMonth = eliteDurationMonths > 0 ? eliteTotalUsd / eliteDurationMonths : 75;

  // Yearly Starter: sub_id 53 (Starter_partner) — 18,000 PT/Month, 130 USD total, 12 months, 10.8 USD/Month, 216,000 PT, x2.5, 100 points/thb
  const yearlyStarterPointsPerMonth = Number(yearlyStarterPackage?.monthly_point ?? 0) || 18000;
  const yearlyStarterDurationMonths = Number(yearlyStarterPackage?.month ?? 0) || 12;
  const yearlyStarterTotalUsd = Number(yearlyStarterPackage?.us_price ?? 0) || 130;
  const yearlyStarterUsdPerMonth = yearlyStarterDurationMonths > 0 ? yearlyStarterTotalUsd / yearlyStarterDurationMonths : 10.8;

  // Yearly Pro: sub_id 50 (Pro_partner) — 48,000 PT/Month, 350 USD total, 12 months, 29.2 USD/Month, 576,000 PT, x3.5, 140 points/thb
  const yearlyProPointsPerMonth = Number(yearlyProPackage?.monthly_point ?? 0) || 48000;
  const yearlyProDurationMonths = Number(yearlyProPackage?.month ?? 0) || 12;
  const yearlyProTotalUsd = Number(yearlyProPackage?.us_price ?? 0) || 350;
  const yearlyProUsdPerMonth = yearlyProDurationMonths > 0 ? yearlyProTotalUsd / yearlyProDurationMonths : 29.2;

  // Yearly Elite: sub_id 45 — 160,000 PT/Month, 1000 USD total, 12 months, 83.3 USD/Month, 1,920,000 PT, x5, 200 points/thb
  const yearlyElitePointsPerMonth = Number(yearlyElitePackage?.monthly_point ?? 0) || 160000;
  const yearlyEliteDurationMonths = Number(yearlyElitePackage?.month ?? 0) || 12;
  const yearlyEliteTotalUsd = Number(yearlyElitePackage?.us_price ?? 0) || 1000;
  const yearlyEliteUsdPerMonth = yearlyEliteDurationMonths > 0 ? yearlyEliteTotalUsd / yearlyEliteDurationMonths : 83.3;

  const isLoading = loading || starterLoading || proLoading || eliteLoading || yearlyStarterLoading || yearlyProLoading || yearlyEliteLoading;
  const hasError = error || starterError || proError || eliteError || yearlyStarterError || yearlyProError || yearlyEliteError;

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

  const tiers = (isYearly
    ? [
      {
        key: 'ystarter',
        badge: t('membership.starter'),
        badgeTone: 'indigo',
        iconVariant: 'starter',
        pointsLabel: Number(yearlyStarterPointsPerMonth).toLocaleString(),
        pointsSuffix: 'Pts/mo',
        priceLabel: formatPrice(yearlyStarterUsdPerMonth),
        originalPriceLabel: null,
        features: ['Monthly points, auto-reset', 'No Ads'],
        ctaLabel: 'Get Started',
        ctaVariant: 'outline',
        onClick: handleJoinYearlyStarter,
      },
      {
        key: 'ypro',
        badge: t('membership.pro'),
        badgeTone: 'indigo',
        iconVariant: 'pro',
        pointsLabel: Number(yearlyProPointsPerMonth).toLocaleString(),
        pointsSuffix: 'Pts/mo',
        priceLabel: formatPrice(yearlyProUsdPerMonth),
        originalPriceLabel: null,
        features: ['Monthly points, auto-reset', 'No Ads'],
        ctaLabel: 'Go Pro',
        ctaVariant: 'outline',
        onClick: handleJoinYearlyPro,
      },
      {
        key: 'yelite',
        badge: t('membership.elite'),
        badgeTone: 'purple',
        iconVariant: 'elite',
        pointsLabel: Number(yearlyElitePointsPerMonth).toLocaleString(),
        pointsSuffix: 'Pts/mo',
        priceLabel: formatPrice(yearlyEliteUsdPerMonth),
        originalPriceLabel: null,
        features: ['Monthly points, auto-reset', 'No Ads'],
        ctaLabel: 'Go Professional',
        ctaVariant: 'outline',
        onClick: handleJoinYearlyElite,
      },
    ]
    : [
        {
          key: 'starter',
          badge: t('membership.starter'),
          badgeTone: 'indigo',
          iconVariant: 'starter',
          pointsLabel: Number(starterPointsPerMonth).toLocaleString(),
          pointsSuffix: 'Pts/mo',
          priceLabel: formatPrice(starterUsdPerMonth),
          originalPriceLabel: null,
          features: ['No Ads for 2 Months', 'Bonus: 5 Coins'],
          ctaLabel: 'Get Started',
          ctaVariant: 'outline',
          onClick: handleJoinStarter,
        },
        {
          key: 'pro',
          badge: t('membership.pro'),
          badgeTone: 'indigo',
          iconVariant: 'pro',
          pointsLabel: Number(proPointsPerMonth).toLocaleString(),
          pointsSuffix: 'Pts/mo',
          priceLabel: formatPrice(proUsdPerMonth),
          originalPriceLabel: null,
          features: ['No Ads for 6 Months', 'Bonus: 17 Coins'],
          ctaLabel: 'Go Pro',
          ctaVariant: 'outline',
          onClick: handleJoinPro,
        },
        {
          key: 'elite',
          badge: t('membership.elite'),
          badgeTone: 'purple',
          iconVariant: 'elite',
          pointsLabel: Number(elitePointsPerMonth).toLocaleString(),
          pointsSuffix: 'Pts/mo',
          priceLabel: formatPrice(eliteUsdPerMonth),
          originalPriceLabel: null,
          features: ['No Ads for 12 Months', 'Bonus: 200 Coins'],
          ctaLabel: 'Go Professional',
          ctaVariant: 'outline',
          onClick: handleJoinElite,
        },
      ]);

  const tierGridClass = tiers.length === 3
    ? 'max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    : 'max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4';

  return (
    <div className="py-16">
      <div className="text-center mb-16 px-4">
        <h2 className="text-5xl font-black text-black mb-6 tracking-tight">{t('membership.title')}</h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium">
          {t('membership.subtitle')}
        </p>

        <div className="mt-10 rounded-full inline-flex items-center justify-center p-1.5 bg-gray-100 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-6 px-4 py-2">
            <span className={`text-sm font-bold ${!isYearly ? 'text-slate-900' : 'text-slate-400'}`}>
              {t('membership.monthly')}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isYearly}
              onClick={() => setIsYearly((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isYearly ? 'bg-indigo-600' : 'bg-indigo-600'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                  isYearly ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-bold ${isYearly ? 'text-slate-900' : 'text-slate-400'}`}>
              {t('membership.yearlyLabel')}{' '}
              <span className="ml-1 text-xs text-indigo-600 font-black">{t('membership.yearlyDiscount')}</span>
            </span>
          </div>
        </div>
      </div>

      <div className={`${tierGridClass} mx-auto px-4 sm:px-6 lg:px-8 gap-4 sm:gap-6 mb-10`}>
      {tiers.map(({ key, ...tierProps }) => {
        if (!isYearly) {
          if (key === 'starter' && starterPackage) {
            return (
              <PackageCardDetailed
                key={key}
                pkg={starterPackage}
                title={t('membership.starter')}
                ctaLabel="Get Started"
                t={t}
                formatPrice={formatPrice}
                onJoin={handleJoinStarter}
                pointPerThbDefault={90}
                multiplierDefault={2.25}
              />
            );
          }
          if (key === 'pro' && proPackage) {
            return (
              <PackageCardDetailed
                key={key}
                pkg={proPackage}
                title={t('membership.pro')}
                ctaLabel="Go Pro"
                t={t}
                formatPrice={formatPrice}
                onJoin={handleJoinPro}
                pointPerThbDefault={120}
                multiplierDefault={3}
                showAiToolsBullet
              />
            );
          }
          if (key === 'elite' && elitePackage) {
            return (
              <PackageCardDetailed
                key={key}
                pkg={elitePackage}
                title={t('membership.elite')}
                ctaLabel="Go Professional"
                t={t}
                formatPrice={formatPrice}
                onJoin={handleJoinElite}
                pointPerThbDefault={160}
                multiplierDefault={4}
                showAiToolsBullet
              />
            );
          }
        }
        if (isYearly) {
          if (key === 'ystarter' && yearlyStarterPackage) {
            return (
              <PackageCardDetailed
                key={key}
                pkg={yearlyStarterPackage}
                title={t('membership.starter')}
                ctaLabel="Get Started"
                t={t}
                formatPrice={formatPrice}
                onJoin={handleJoinYearlyStarter}
                pointPerThbDefault={100}
                multiplierDefault={2.5}
                durationLabel={t('membership.total12Month')}
              />
            );
          }
          if (key === 'ypro' && yearlyProPackage) {
            return (
              <PackageCardDetailed
                key={key}
                pkg={yearlyProPackage}
                title={t('membership.pro')}
                ctaLabel="Go Pro"
                t={t}
                formatPrice={formatPrice}
                onJoin={handleJoinYearlyPro}
                pointPerThbDefault={140}
                multiplierDefault={3.5}
                showAiToolsBullet
                durationLabel={t('membership.total12Month')}
              />
            );
          }
          if (key === 'yelite' && yearlyElitePackage) {
            return (
              <PackageCardDetailed
                key={key}
                pkg={yearlyElitePackage}
                title={t('membership.elite')}
                ctaLabel="Go Professional"
                t={t}
                formatPrice={formatPrice}
                onJoin={handleJoinYearlyElite}
                pointPerThbDefault={200}
                multiplierDefault={5}
                showAiToolsBullet
                durationLabel={t('membership.total12Month')}
              />
            );
          }
        }
        return <TierCard key={key} {...tierProps} />;
      })}
      </div>
    </div>
  );
}
