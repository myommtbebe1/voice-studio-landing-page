import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../../hooks/useLanguage';
import { formatPriceDisplay } from '../formatPrice';
import PaymentSuccessModal from './PaymentSuccessModal';

const COMPANY_NAME = 'iBOTNOI Co., Ltd.';
const PACKAGE_DESCRIPTION = 'Botnoi voice platform Package';

export default function CheckoutPage({
  onBack,
  orderTitle = 'pack 200000 pt',
  orderDescription = PACKAGE_DESCRIPTION,
  totalPrice = 70.49,
  freeNoAdsLabel = null,
  testMode = true,
}) {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [country, setCountry] = useState('Thailand');
  const [saveInfo, setSaveInfo] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  const subtotal = totalPrice;
  const priceDisplay = formatPriceDisplay(Number(totalPrice), language, t);

  const handlePay = (e) => {
    e.preventDefault();
    // Replace with actual Stripe/payment submission
    console.log('Pay', { email, totalPrice, orderTitle });
  };

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-white rounded-b-2xl shadow-sm overflow-hidden">
          {/* Header with back + company + test mode */}
          <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-gray-200">
            {onBack && (
              <button
                type="button"
                onClick={() => setShowPaymentSuccess(true)}
                className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={t('checkout.back')}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span className="font-semibold text-gray-900 truncate">{COMPANY_NAME}</span>
              {testMode && (
                <span className="shrink-0 px-2.5 py-0.5 bg-amber-400 text-amber-900 text-xs font-semibold rounded">
                  {t('checkout.testMode')}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: Order summary */}
            <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50/50">
              <p className="text-sm font-medium text-gray-600 mb-1">{t('checkout.pay')} {COMPANY_NAME}</p>
              <p className="text-3xl font-bold text-gray-900 mb-6">
                {priceDisplay.display} {priceDisplay.currency}
              </p>

              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">{orderTitle}</p>
                    <p className="text-sm text-gray-500">{orderDescription}</p>
                  </div>
                  <p className="font-semibold text-gray-900 shrink-0">
                    {priceDisplay.display} {priceDisplay.currency}
                  </p>
                </div>

                <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                  <span className="text-gray-600">{t('checkout.subtotal')}</span>
                  <span className="font-medium text-gray-900">
                    {priceDisplay.display} {priceDisplay.currency}
                  </span>
                </div>

                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  {t('checkout.addPromoCode')}
                </button>

                <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
                  <span className="text-gray-900">{t('checkout.totalDue')}</span>
                  <span className="text-gray-900">
                    {priceDisplay.display} {priceDisplay.currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Contact & payment form */}
            <div className="p-6 sm:p-8">
              <form onSubmit={handlePay} className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('checkout.contactInfo')}</h3>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('checkout.email')}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('checkout.emailPlaceholder')}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">{t('checkout.paymentMethod')}</h3>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('checkout.cardInfo')}</label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder={t('checkout.cardNumberPlaceholder')}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder={t('checkout.expiryPlaceholder')}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        placeholder={t('checkout.cvc')}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mt-3 mb-1.5">{t('checkout.cardholderName')}</label>
                  <input
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder={t('checkout.cardholderPlaceholder')}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <label className="block text-sm font-medium text-gray-700 mt-3 mb-1.5">{t('checkout.countryOrRegion')}</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Thailand">Thailand</option>
                    <option value="Myanmar">Myanmar</option>
                    <option value="United States">United States</option>
                    <option value="Singapore">Singapore</option>
                  </select>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveInfo}
                    onChange={(e) => setSaveInfo(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {t('checkout.saveInfo')}
                  </span>
                </label>
                <p className="text-xs text-gray-500 -mt-2">
                  {t('checkout.paySecurePrefix')} {COMPANY_NAME} {t('checkout.paySecureSuffix')}
                </p>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faCreditCard} className="w-5 h-4" />
                  {t('paymentModal.purchase') || 'Pay'}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                <span>{t('checkout.poweredBy')} <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">stripe</a></span>
                <a href="#" className="hover:text-gray-700">{t('checkout.terms')}</a>
                <a href="#" className="hover:text-gray-700">{t('checkout.privacy')}</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaymentSuccessModal
        isOpen={showPaymentSuccess}
        onClose={() => setShowPaymentSuccess(false)}
        onGoBack={onBack}
        pointsReceived={orderTitle}
        freeNoAdsLabel={freeNoAdsLabel}
      />
    </div>
  );
}
