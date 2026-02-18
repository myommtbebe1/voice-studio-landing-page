import React from 'react';
import { useLanguage } from '../../../../hooks/useLanguage';

export default function MembershipSection({ onJoin, packages = [], loading = false, error = null }) {
  const { t, language } = useLanguage();

  // Currency conversion and formatting
  const formatPrice = (usdPrice) => {
    if (language === 'my') {
      // USD to MMK conversion rate (approximate - you should use a real rate)
      const mmkRate = 2100; // 1 USD = 2100 MMK (update this rate as needed)
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

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
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
      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-3 text-black">
        {t('membership.title')}
      </h1>
      
      {/* Subtitle */}
      <p className="text-center text-gray-600 text-base sm:text-lg mb-10">
        {t('membership.subtitle')}
      </p>

      {/* Add-on Packages */}
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
              {/* Package Label - Centered on top border */}
              <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
                <div className="bg-white px-4 py-1 rounded-lg border-2 border-purple-600">
                  <span className="text-sm font-semibold text-purple-900">
                    {pkg.display_name}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {/* Left Side - Package Info */}
                <div className="flex-1">
                  {/* Price Display */}
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

                  {/* Features */}
                  <p className="text-gray-700 text-base">
                    {t('membership.createUpTo')}{' '}
                    <span className="font-semibold text-cyan-500">
                      {pkg.text_limit?.toLocaleString()}
                    </span>{' '}
                    {t('membership.chars')}
                  </p>
                </div>

                {/* Right Side - Join Button */}
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

      {/* No packages available */}
      {!loading && packages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-base">
            {t('membership.noPackages')}
          </p>
        </div>
      )}
    </div>
  );
}
