import React from 'react';

export default function AddOnPackagesSection({
  packages = [],
  formatPrice,
  t,
  onJoinAddOn,
}) {
  if (!packages.length) return null;

  return (
    <>
      <h2 className="text-4xl sm:text-5xl font-bold text-black mb-2 text-center">
        {t('membership.addOnPackages')}
      </h2>
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
                    onClick={() => onJoinAddOn(pkg)}
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
  );
}
