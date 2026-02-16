import React, { useState, useEffect, useCallback, useContext } from 'react';
import PricingNavbar from './Components/PricingNavbar';
import Payment from './Components/Payment';
import PricingSections from './Components/PricingSections';
import PricingPageSkeleton from './Components/PricingPageSkeleton';
import CheckoutPage from './Components/CheckoutPage';
import { AuthContext } from '../../contexts/AuthContext';
import { getBotnoiToken } from '../../firebase/botnoi';
import { getPackages } from '../../firebase/voiceApi';

const PACKAGE_DESCRIPTION = 'Botnoi voice platform Package';

export default function PricingPage() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);
  const [apiPackages, setApiPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const { user } = useContext(AuthContext);

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
      <PricingNavbar />
      <PricingSections
        onPurchase={handlePurchase}
        apiPackages={apiPackages}
        packagesLoading={packagesLoading}
      />
      <Payment
        isOpen={isPaymentOpen}
        onClose={onClosePayment}
        selectedPackage={selectedPackage}
        onPurchase={handlePaymentSubmit}
      />
    </div>
  );
}
