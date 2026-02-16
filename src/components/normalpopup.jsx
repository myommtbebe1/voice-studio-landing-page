import { useLanguage } from "../hooks/useLanguage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";

export default function PremiumPopup({ isOpen, onClose, onPurchase }) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative animate-scale-in">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-5 h-5 transition-colors flex items-center justify-center"
          >
            <span className="material-icons-round text-gray-600"><FontAwesomeIcon icon={faXmark} /></span>
          </button>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center mb-2">
            {t("normal.want")}
            <span className="inline-flex items-center gap-1">
              <span className="text-pink-500">😊 {t("normal.style")}</span>
            </span>{" "}
            {t("normal.voices")}
          </h2>
          <p className="text-2xl font-bold text-center mb-6">
          {t("normal.use")} <span className="text-orange-500">{t("normal.premium")}</span> {t("normal.now")}
          </p>

          {/* Description */}
          <p className="text-center text-gray-600 mb-4">
          {t("normal.high")}
            <br />
            {t("normal.full")}
          </p>

          {/* Badge Info */}
          <p className="text-center text-sm text-gray-500 mb-6">
          {t("normal.voice")}{" "}
            <span className="inline-flex items-center gap-1 text-pink-500 font-semibold">
              😊 {t("normal.smile")}
            </span>{" "}
            {t("normal.after")}
          </p>

          {/* Pricing Card */}
          <div className="border-2 border-blue-200 rounded-2xl p-6 mb-6 bg-gradient-to-br from-blue-50 to-purple-50">
            <p className="text-center text-gray-600 font-semibold mb-4">
            {t("normal.trial")}
            </p>
            
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl font-bold text-orange-500">{t("normal.฿350")}</span>
              <span className="text-gray-400 text-lg">{t("normal.month")}</span>
              <span className="text-gray-400">|</span>
              <div className="flex items-center gap-1">
                <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  P
                </span>
                <span className="text-3xl font-bold text-gray-800">28,000</span>
              </div>
              <span className="text-sm text-gray-500">· {t("normal.noAds")}</span>
            </div>

            <button
              onClick={() => {
                onPurchase?.();
                onClose();
              }}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {t("normal.purchase")}
            </button>
          </div>

          {/* Footer Text */}
          <p className="text-center text-sm text-gray-500">
          {t("normal.free")}{" "}
            <span className="font-semibold text-gray-700">{t("normal.3times")}</span>{t("normal.get")}
            {t("normal.unlimited")}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}