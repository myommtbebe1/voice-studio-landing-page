import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useLanguage } from '../../../hooks/useLanguage';
import { formatPriceDisplay } from '../formatPrice';

export default function Buycustompoints({ customPoints, setCustomPoints, CUSTOM_POINTS_KEY, customPrice, onPurchase }) {
  const { t, language } = useLanguage();
  const priceDisplay = formatPriceDisplay(Number(customPrice), language, t);
  return (
    <section>
    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6">{t('pricing.buyCustomPoints')}</h2>
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 max-w-xl mx-auto bg-white rounded-lg p-5">
      <label className="flex items-center gap-2 text-gray-700 font-medium">
        <FontAwesomeIcon icon={faStar} className="text-cyan-500 text-sm" />
        {t('pricing.enterPoints')}
      </label>
      <input
        type="text"
        value={customPoints}
        onChange={(e) => {
          const val = Number(e.target.value);
          const num = Number.isNaN(val) ? 0 : val;
          setCustomPoints(num);
          if (num > 0) localStorage.setItem(CUSTOM_POINTS_KEY, String(num));
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && customPoints === 0) {
            const saved = localStorage.getItem(CUSTOM_POINTS_KEY);
            if (saved != null) {
              const num = Number(saved);
              if (num > 0) setCustomPoints(num);
            }
          }
        }}
        onBlur={() => {
          if (customPoints === 0) {
            const saved = localStorage.getItem(CUSTOM_POINTS_KEY);
            if (saved != null) {
              const num = Number(saved);
              if (num > 0) setCustomPoints(num);
            }
          }
        }}
        className="flex-1 min-w-0 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800"
      />
      <button
        onClick={() => customPoints > 0 && onPurchase?.({ points: customPoints, price: Number(customPrice), isCustomPoints: true })}
        disabled={customPoints === 0}
        className={`font-semibold px-6 py-2.5 rounded-lg transition-colors whitespace-nowrap ${
          customPoints === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
            : 'bg-cyan-500 hover:bg-cyan-600 text-white'
        }`}
      >
        {priceDisplay.display} {priceDisplay.currency}
      </button>
    </div>
  </section>
  )
}
