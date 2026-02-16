import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../../hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

const INVOICE_EMAIL = 'admin@botnoigroup.com';

export default function PaymentSuccessModal({
  isOpen,
  onClose,
  pointsReceived = '260,000 PT',
  freeNoAdsLabel = null,
  onGoBack,
}) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleClose = () => {
    onClose?.();
    onGoBack?.();
  };

  const handleStudio = () => {
    onClose?.();
    onGoBack?.();
    navigate('/VoiceStudio');
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={t('paymentSuccess.close')}
          >
            <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
          </button>

          {/* Token icon - point/coin */}
          <div className="flex justify-center mb-4">
            <img
              src="https://voice-staging.botnoi.ai/assets/shared/point.png"
              alt={t('paymentSuccess.pointIconAlt') || 'double coin point botnoi voice'}
              className="w-30 h-20 object-contain"
            />
          </div>

          <h2 className="text-xl font-bold text-center text-gray-900 mb-4">
            {t('paymentSuccess.title')}
          </h2>

          <p className="text-center text-gray-700 mb-1">
            {t('paymentSuccess.youReceived')}{' '}
            <span className="font-semibold text-blue-600">{pointsReceived}</span>
          </p>
          <p className="text-center text-gray-700 mb-6">
            {t('paymentSuccess.andGranted')}{' '}
            <span className="font-semibold text-blue-600">
              {freeNoAdsLabel ?? t('paymentSuccess.freeNoAds1Month')}
            </span>
          </p>

          <div className="text-sm text-gray-700 mb-6 p-3 bg-gray-50 rounded-lg">
            <p className="font-semibold text-gray-900 mb-1">
              {t('paymentSuccess.taxInvoiceNote')}{' '}
              <a
                href={`mailto:${INVOICE_EMAIL}`}
                className="text-blue-600 hover:underline"
              >
                {INVOICE_EMAIL}
              </a>
            </p>
            <p className="text-gray-600">{t('paymentSuccess.taxInvoiceDeadline')}</p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 px-4 rounded-lg border-2 border-orange-400 bg-white text-blue-600 font-medium hover:bg-orange-50 transition-colors"
            >
              {t('paymentSuccess.close')}
            </button>
            <button
              type="button"
              onClick={handleStudio}
              className="flex-1 py-2.5 px-4 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
            >
              {t('paymentSuccess.studio')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
