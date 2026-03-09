import React from 'react';
import Premiumfaq from './Components/Premiumfaq';
import AddOnPackagesSection from './Components/AddOnPackagesSection';
import { useLanguage } from '../../../hooks/useLanguage';

export default function Premiumpage({ onJoin, packages = [] }) {
  const { t, language } = useLanguage();

  const formatPrice = (usdPrice) => {
    const num = Number(usdPrice);
    return `$${Number.isFinite(num) ? num.toFixed(2) : '0.00'}`;
  };

  const handleJoin = (pkg) => {
    const price = Number(pkg?.us_price_discount ?? pkg?.us_price ?? 0);
    const textLimit = Number(pkg?.text_limit ?? 0);
    const normalizedPackage = {
      ...pkg,
      package_id: pkg?.package_id ?? pkg?.add_id,
      addOnId: pkg?.add_id ?? pkg?.package_id,
      name: pkg?.display_name ?? 'Membership',
      description:
        textLimit > 0
          ? `Create up to ${textLimit.toLocaleString()} chars.`
          : 'Membership package',
      points: textLimit,
      price,
      noAds: null,
      checkoutType: 'premium-add-on',
    };

    if (typeof onJoin === 'function') {
      onJoin(normalizedPackage);
    }
  };

  return (
    <div>
      <AddOnPackagesSection
        packages={packages}
        formatPrice={formatPrice}
        t={t}
        onJoinAddOn={handleJoin}
      />
      <Premiumfaq />
    </div>
  );
}
