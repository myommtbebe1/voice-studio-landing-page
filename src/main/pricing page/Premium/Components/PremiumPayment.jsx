import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCreditCard, faAngleUp, faAngleDown, faFire } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from '../../../../hooks/useLanguage';
import { formatPriceDisplay } from '../../formatPrice';

export default function PremiumPaymentModal({ isOpen, onClose, selectedPackage, onPurchase }) {
  const { t, language } = useLanguage();
  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const [codeExpanded, setCodeExpanded] = useState(false);
  const [promotionExpanded, setPromotionExpanded] = useState(true);
  const [promoCode, setPromoCode] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedPromotions([]);
      setCodeExpanded(false);
      setPromotionExpanded(true);
      setPromoCode('');
    }
  }, [isOpen, selectedPackage?.points, selectedPackage?.package_id]);

  if (!isOpen) return null;

  const isCoinPurchase = Boolean(selectedPackage?.coins) && selectedPackage?.points == null;
  const isCustomPoints = Boolean(selectedPackage?.isCustomPoints);
  const toNumber = (value, fallback) => {
    const num = typeof value === 'string' ? Number.parseFloat(value) : Number(value);
    return Number.isFinite(num) ? num : fallback;
  };

  const basePoints = isCoinPurchase ? 0 : (selectedPackage?.points != null ? toNumber(selectedPackage.points, 200000) : 200000);
  const basePrice = selectedPackage?.price != null
    ? toNumber(selectedPackage.price, 70.49)
    : selectedPackage?.discountedPrice != null
      ? toNumber(selectedPackage.discountedPrice, 70.49)
      : selectedPackage?.currentPrice != null
        ? toNumber(selectedPackage.currentPrice, 70.49)
        : 70.49;

  const togglePromotion = (id) => {
    setSelectedPromotions(prev =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const HOT_DEAL_ADDONS = {
    pack_750: [
      { id: 'pack_490', packageId: 'pack_490', label: '+8,000 PT', price: 1.99, points: 8000 },
      { id: 'pack_x3_1', packageId: 'pack_x3_1', label: 'Buy 1 more, get 1 free!', price: 0, points: 0 },
    ],
    pack_2000: [
      { id: 'pack_20k', packageId: 'pack_20k', label: '+20,000 PT', price: 4.99, points: 20000 },
      { id: 'pack_x3_2', packageId: 'pack_x3_2', label: 'Buy 1 more, get 1 free!', price: 0, points: 0 },
    ],
    pack_5000: [
      { id: 'pack_60k', packageId: 'pack_60k', label: '+60,000 PT', price: 14.99, points: 60000 },
      { id: 'pack_x3_3', packageId: 'pack_x3_3', label: 'Buy 1 more, get 1 free!', price: 0, points: 0 },
    ],
    pack_499: [
      { id: 'starter_5k', packageId: 'starter_5k', label: '+5,000 PT', price: 1.99, points: 5000 },
    ],
    starter_23500: [
      { id: 'starter_5k', packageId: 'starter_5k', label: '+5,000 PT', price: 1.99, points: 5000 },
    ],
    starter_12500: [
      { id: 'starter_5k', packageId: 'starter_5k', label: '+5,000 PT', price: 1.99, points: 5000 },
    ],
    starter_4100: [
      { id: 'starter_2k', packageId: 'starter_2k', label: '+2,000 PT', price: 0.99, points: 2000 },
    ],
    regular_97500: [
      { id: 'pack_1699', packageId: 'pack_1699', label: '+24,000 PT', price: 7.99, points: 24000 },
    ],
    pack_599: [
      { id: 'pack_719', packageId: 'pack_719', label: '+10,000 PT', price: 0, points: 10000 },
    ],
    pack_20000: [
      { id: 'pack_11799', packageId: 'pack_11799', label: '+300,000 PT', price: 4.99, points: 300000 },
    ],
    professional_1000000: [
      { id: 'pack_1m_addon', packageId: 'pack_1m_addon', label: '+300,000 PT', price: 59.99, points: 300000 },
    ],
    pack_2499: [
      { id: 'pack_2999', packageId: 'pack_2999', label: '+50,000 PT', price: 14.99, points: 50000 },
    ],
  };

  const points = Number(selectedPackage?.points);
  const basePackageId =
    selectedPackage?.package_id ??
    (points === 30000 ? 'pack_750'
      : points === 80000 ? 'pack_2000'
      : points === 200000 ? 'pack_5000'
      : points === 23500 ? 'pack_499'
      : points === 12500 ? 'starter_12500'
      : points === 4100 ? 'starter_4100'
      : points === 97500 ? 'regular_97500'
      : points === 42000 ? 'pack_599'
      : points === 20000 ? 'pack_20000'
      : points === 1000000 ? 'professional_1000000'
      : null);
  const promotions = (HOT_DEAL_ADDONS[basePackageId] ?? []);
  const isBogoSelected = selectedPromotions.includes('pack_x3_1') || selectedPromotions.includes('pack_x3_2') || selectedPromotions.includes('pack_x3_3');
  const PACK_X3_1_DISPLAY = { points: 90000, price: 25.99, originalPrice: 31.98, noAds: 'No Ads 1 month' };
  const PACK_X3_2_DISPLAY = { points: 240000, price: 64.99, originalPrice: 71.98, noAds: 'No Ads 1 month' };
  const PACK_X3_3_DISPLAY = { points: 600000, price: 144.99, originalPrice: 141.99, noAds: 'No Ads 1 month' };
  const bogoDisplay = selectedPromotions.includes('pack_x3_3') ? PACK_X3_3_DISPLAY
    : selectedPromotions.includes('pack_x3_2') ? PACK_X3_2_DISPLAY
    : PACK_X3_1_DISPLAY;

  const calculateTotal = () => {
    let totalPoints, totalPrice;
    if (isBogoSelected) {
      totalPoints = bogoDisplay.points;
      totalPrice = bogoDisplay.price;
      selectedPromotions.forEach(id => {
        if (id === 'pack_x3_1' || id === 'pack_x3_2' || id === 'pack_x3_3') return;
        const promo = promotions.find(p => p.id === id);
        if (promo) {
          totalPoints += promo.points;
          totalPrice += promo.price;
        }
      });
    } else {
      totalPoints = basePoints;
      totalPrice = basePrice;
      selectedPromotions.forEach(id => {
        const promo = promotions.find(p => p.id === id);
        if (promo) {
          totalPoints += promo.points;
          totalPrice += promo.price;
        }
      });
    }
    return { totalPoints, totalPrice };
  };

  const { totalPoints, totalPrice } = calculateTotal();
  const basePriceDisplay = formatPriceDisplay(basePrice, language, t);
  const totalPriceDisplay = formatPriceDisplay(totalPrice, language, t);

  const selectedAddOnPackageIds = selectedPromotions
    .map((id) => promotions.find((p) => p.id === id)?.packageId)
    .filter(Boolean);

  const handlePurchaseClick = () => {
    const noAdsRaw = !isCoinPurchase && !isCustomPoints
      ? (isBogoSelected ? bogoDisplay?.noAds : selectedPackage?.noAds)
      : null;
    const freeNoAdsLabel = noAdsRaw
      ? `Free ${String(noAdsRaw).replace(/No\s*Ads?\s*/i, 'No ads ').replace(/\s{2,}/g, ' ').trim()}`
      : null;

    if (typeof onPurchase === 'function') {
      onPurchase({
        basePackage: selectedPackage,
        basePackageId: selectedPackage?.package_id ?? basePackageId,
        selectedAddOnPackageIds,
        totalPoints,
        totalPrice,
        freeNoAdsLabel,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/15 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-xl w-full max-w-[420px] p-4 relative shadow-2xl max-h-[92vh] min-h-[420px] overflow-y-auto [&::-webkit-scrollbar]:hidden"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <h2 className="text-xl font-bold text-center mb-4 text-gray-700">{t('nav.payment')}</h2>
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-sm text-gray-700">{t('paymentModal.orderList')}</h3>
          {!isCoinPurchase && (
            <div className="border-2 border-transparent bg-gradient-to-r from-purple-400 to-cyan-400 rounded-lg p-[2px]">
              <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src="https://voice-staging.botnoi.ai/assets/img/Real_point.svg" alt="Points" className="w-8 h-8 shrink-0" />
                  <div className="min-w-0">
                    <p className={`font-bold text-base ${isBogoSelected ? 'text-red-600' : 'text-purple-400'}`}>
                      {(isBogoSelected ? bogoDisplay.points : basePoints).toLocaleString()} PT
                    </p>
                    {!isCustomPoints && (isBogoSelected ? bogoDisplay.noAds : selectedPackage?.noAds) && (
                      <p className="text-xs text-cyan-500">
                        Free {String(isBogoSelected ? bogoDisplay.noAds : selectedPackage.noAds).replace('No Ads', 'NoAds')}
                      </p>
                    )}
                  </div>
                </div>
                <p className={`font-bold text-base shrink-0 ml-2 ${isBogoSelected ? 'text-red-600' : 'text-cyan-400'}`}>
                  {isBogoSelected
                    ? `${formatPriceDisplay(bogoDisplay.originalPrice, language, t).display} ${formatPriceDisplay(bogoDisplay.originalPrice, language, t).currency}`
                    : `${basePriceDisplay.display} ${basePriceDisplay.currency}`}
                </p>
              </div>
            </div>
          )}
          {isCoinPurchase && (
            <div className="border-2 border-transparent bg-gradient-to-r from-purple-400 to-cyan-400 rounded-lg p-[2px]">
              <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-gray-700 font-bold text-sm">C</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-purple-400 font-bold text-base">{Number(selectedPackage.coins).toLocaleString()} {t('pricing.coin')}</p>
                  </div>
                </div>
                <p className="text-cyan-400 font-bold text-base shrink-0 ml-2">{basePriceDisplay.display} {basePriceDisplay.currency}</p>
              </div>
            </div>
          )}
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-sm text-gray-700">{t('paymentModal.selectPaymentMethod')}</h3>
          <div className="flex justify-center">
            <div className="w-28 h-20 border-2 border-blue-400 rounded-xl p-2 relative flex flex-col items-center justify-center">
              <div className="absolute top-1.5 right-1.5 bg-blue-400 rounded-full w-4 h-4 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <FontAwesomeIcon icon={faCreditCard} className="text-blue-400 text-sm mb-0.5" />
              <p className="font-semibold text-xs text-gray-700 text-center leading-tight">{t('paymentModal.creditDebitCard')}</p>
              <p className="text-[10px] text-gray-400">{t('paymentModal.processingFee')}</p>
            </div>
          </div>
        </div>
        <div className="border-t pt-3 mb-4 space-y-1.5 text-sm">
          {!isCoinPurchase && (
            <div className="flex justify-between">
              <span className='text-gray-700'>{t('paymentModal.totalPoint')}</span>
              <span className={`font-bold ${isBogoSelected ? 'text-red-600' : 'text-cyan-400'}`}>{totalPoints.toLocaleString()} PTs</span>
            </div>
          )}
          <div className="flex justify-between text-xs">
            <span className='text-gray-700'>{t('paymentModal.operationFee')}</span>
            <span className='text-gray-700'>- {totalPriceDisplay.currency}</span>
          </div>
          <div className="flex justify-between font-bold text-base">
            <span className='text-gray-700'>{t('paymentModal.totalPayment')}</span>
            <span className={isBogoSelected ? 'text-red-600' : 'text-cyan-400'}>{totalPriceDisplay.display} {totalPriceDisplay.currency}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onClose}
            className="flex-1 border-2 border-cyan-400 text-cyan-400 rounded-lg py-2.5 text-sm font-semibold hover:bg-cyan-50 transition-colors"
          >
            {t('paymentModal.cancel')}
          </button>
          <button 
            onClick={handlePurchaseClick}
            className="flex-1 bg-cyan-400 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-cyan-500 transition-colors"
          >
            {t('paymentModal.purchase')}
          </button>
        </div>
      </div>
    </div>
  );
}
