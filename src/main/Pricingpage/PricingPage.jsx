import React, { useState, useEffect, useCallback, useContext } from 'react';
import PricingNavbar from './Components/PricingNavbar';
import Payment from './Components/Payment';
import PricingSections from './Components/PricingSections';
import PricingPageSkeleton from './Components/PricingPageSkeleton';
import CheckoutPage from './Components/CheckoutPage';
import { AuthContext } from '../../contexts/AuthContext';
import { getBotnoiToken } from '../../firebase/botnoi';
import { getPackages } from '../../firebase/voiceApi';
import Premiumpage from './Premium/Premiumpage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../hooks/useLanguage';
import Premiummembership from './Premium/Components/Premiummembership';
import { useAddOnPackages } from '../../hooks/useAddOnPackages';

const PACKAGE_DESCRIPTION = 'Botnoi voice platform Package';

export default function PricingPage() {
  const [activeSection, setActiveSection] = useState('buyPoints');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);
  const [apiPackages, setApiPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { t} = useLanguage();
  const {
    packages: premiumAddOnPackages,
    loading: premiumAddOnLoading,
    error: premiumAddOnError,
  } = useAddOnPackages('More Text');

  const getBotnoiTokenHelper = useCallback(async () => {
    if (!user) return null;
    const firebaseToken = await user.getIdToken();
    const res = await getBotnoiToken(firebaseToken);
    if (typeof res === 'string') return res;
    if (res?.token) return res.token;
    if (res?.access_token) return res.access_token;
    if (res?.data?.token) return res.data.token;
    return res?.data?.access_token ?? null;
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user) {
        setPackagesLoading(false);
        return;
      }
      try {
        setPackagesLoading(true);
        const token = await getBotnoiTokenHelper();
        if (!token || cancelled) return;
        const list = await getPackages(token);
        if (!cancelled) setApiPackages(Array.isArray(list) ? list : []);
      } catch (err) {
        if (!cancelled) setApiPackages([]);
      } finally {
        if (!cancelled) setPackagesLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [user, getBotnoiTokenHelper]);

  const handlePurchase = (pkg) => {
    setSelectedPackage(pkg);
    setIsPaymentOpen(true);
  };

  const handlePaymentSubmit = (payload) => {
    // Payload includes basePackage, basePackageId, selectedAddOnPackageIds (e.g. ['pack_x3_1'] for BOGO), totalPoints, totalPrice, freeNoAdsLabel
    const orderTitle = payload.totalPoints != null
      ? `${Number(payload.totalPoints).toLocaleString()} PT`
      : payload.basePackage?.name ?? 'pack 200000 pt';
    const orderDescription = payload.basePackage?.description ?? PACKAGE_DESCRIPTION;
    setCheckoutData({
      orderTitle,
      orderDescription,
      totalPrice: payload.totalPrice ?? 70.49,
      freeNoAdsLabel: payload.freeNoAdsLabel ?? null,
    });
    // Payment modal calls onClose() after this, so modal will close automatically
  };

  const onClosePayment = () => {
    setIsPaymentOpen(false);
    setSelectedPackage(null);
  };

  if (packagesLoading) {
    return (
      <div className="w-full px-4 sm:px-8 py-6">
        <PricingPageSkeleton />
      </div>
    );
  }

  if (checkoutData) {
    return (
      <div className="w-full">
        <CheckoutPage
          onBack={() => setCheckoutData(null)}
          orderTitle={checkoutData.orderTitle}
          orderDescription={checkoutData.orderDescription}
          totalPrice={checkoutData.totalPrice}
          freeNoAdsLabel={checkoutData.freeNoAdsLabel}
          testMode={true}
        />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-8 py-6">
      <PricingNavbar activeSection={activeSection} onSectionChange={setActiveSection} />
      {activeSection === 'premium' ? (
        <>
        <Premiummembership
          onJoin={handlePurchase}
          packages={premiumAddOnPackages}
          loading={premiumAddOnLoading}
          error={premiumAddOnError}
        />
        <Premiumpage />
        </>
        
      ) : (
        <PricingSections
          onPurchase={handlePurchase}
          apiPackages={apiPackages}
          packagesLoading={packagesLoading}
        />
      )}

      <Payment
        isOpen={isPaymentOpen}
        onClose={onClosePayment}
        selectedPackage={selectedPackage}
        onPurchase={handlePaymentSubmit}
      />
      <>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="w-full bg-white rounded-3xl shadow-lg px-6 sm:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-800 text-3xl sm:text-4xl" />
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{t('pricing.reportIssue')}</h1>
              </div>
              <p className="text-gray-500 text-base sm:text-lg ml-0 sm:ml-12">{t('pricing.reportIssueDesc')}</p>
            </div>
            <div className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white font-semibold text-lg px-8 sm:px-12 py-3 sm:py-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">{t('pricing.contactSupport')}</button>
            </div>
          </div>
        </div>
      </div>
      </>
      
    </div>
  );
}
