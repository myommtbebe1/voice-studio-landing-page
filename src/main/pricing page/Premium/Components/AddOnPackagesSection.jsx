import React from 'react';

export default function AddOnPackagesSection({
  packages = [],
  loading = false,
  error = null,
  formatPrice,
  t,
  onJoinAddOn,
}) {
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
            {t('membership.addOnTitle')}
          </h2>
          <p className="text-xl text-slate-500 font-medium">
            {t('membership.addOnPackagesSubtitle')}
          </p>
        </div>
        <div className="animate-pulse rounded-[3rem] p-8 sm:p-10 border bg-white/60">
          <div className="h-8 w-48 mx-auto md:mx-0 bg-slate-200 rounded mb-6" />
          <div className="h-10 w-64 mx-auto md:mx-0 bg-slate-200 rounded mb-4" />
          <div className="h-6 w-56 mx-auto md:mx-0 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
            {t('membership.addOnTitle')}
          </h2>
          <p className="text-xl text-slate-500 font-medium">
            {t('membership.addOnPackagesSubtitle')}
          </p>
        </div>
        <div className="rounded-[2rem] border border-red-200 bg-red-50 px-6 py-5 text-center text-red-600 font-medium">
          {error}
        </div>
      </div>
    );
  }

  if (!packages.length) return null;

  const getNumbers = (pkg) => {
    const original = Number(pkg?.us_price ?? pkg?.price ?? 0);
    const discounted = Number(pkg?.us_price_discount ?? pkg?.price_discount ?? original);
    const hasDiscount =
      Number.isFinite(original) &&
      Number.isFinite(discounted) &&
      discounted > 0 &&
      discounted < original;
    return { original, discounted, hasDiscount };
  };

  const cardStyle = {
    borderColor: 'rgba(255,255,255,0.6)',
    background:
      'linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.12) 100%)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  };
  const cardClassName =
    'relative rounded-[3rem] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-300 overflow-visible group border-2 border-gray-100 bg-white shadow-lg hover:shadow-xl hover:shadow-purple-200/30 hover:-translate-y-0.5';

  return (
    <>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
            {t('membership.addOnTitle')}
          </h2>
          <p className="text-xl text-slate-500 font-medium">
            {t('membership.addOnPackagesSubtitle')}
          </p>
        </div>

        <div className="space-y-8">
          {packages.map((pkg, index) => {
            const { original, discounted, hasDiscount } = getNumbers(pkg);
            const currentPrice = hasDiscount ? discounted : original;
            const textLimit = Number(pkg?.text_limit ?? 0);
            const displayName = String(pkg?.display_name ?? pkg?.name ?? '').trim();

            return (
              <div
                key={String(pkg?.add_id ?? pkg?.package_id ?? index)}
                className={cardClassName}
                style={cardStyle}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-8 py-2 rounded-full border border-indigo-100 shadow-sm">
                  <span className="text-indigo-900 font-black text-xs uppercase tracking-widest">
                    {displayName || (pkg?.NoAds ? 'No Ads' : 'More Text')}
                  </span>
                </div>

                <div className="text-center md:text-left relative z-10">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-3">
                    {hasDiscount && (
                      <span className="text-slate-400 text-2xl line-through font-bold opacity-50">
                        {formatPrice(original)}/{t('membership.perMonth')}
                      </span>
                    )}
                    <span className="text-3xl font-black text-indigo-600">
                      {t('membership.special')} {formatPrice(currentPrice)}
                      <span className="text-sm">/{t('membership.perMonth')}</span>
                    </span>
                  </div>
                  <p className="text-slate-600 text-xl font-medium">
                    {t('membership.createUpTo')}{' '}
                    <span className="text-sky-500 font-black">
                      {Number.isFinite(textLimit) && textLimit > 0
                        ? textLimit.toLocaleString()
                        : '—'}
                    </span>{' '}
                    {t('membership.chars')}
                  </p>
                </div>

                <button
                  type="button"
                  className="px-14 py-5 bg-white hover:bg-indigo-600 hover:text-white text-indigo-600 border border-gray-200 font-black text-xl rounded-4xl shadow-sm transition-all active:scale-95 relative z-10 w-full md:w-auto"
                  onClick={() => onJoinAddOn(pkg)}
                >
                  {t('membership.joinButton')}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
