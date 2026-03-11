import React, { useState, useEffect, useCallback, useContext } from 'react';
import PricingNavbar from './Components/PricingNavbar';
import Payment from './buy point page/Payment';
import PricingSections from './buy point page/PricingSections';
import PricingPageSkeleton from './buy point page/PricingPageSkeleton';
import { AuthContext } from '../../contexts/AuthContext';
import { getBotnoiToken } from '../../firebase/botnoi';
import { getPackages } from '../../firebase/voiceApi';
import Premiumpage from './Premium/Premiumpage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../hooks/useLanguage';
import Premiummembership from './Premium/Components/Premiummembership';
import { useAddOnPackages } from '../../hooks/useAddOnPackages';
import { useSubscriptionPackage } from '../../hooks/useSubscriptionPackage';

export default function PricingPage() {
  const [activeSection, setActiveSection] = useState('buyPoints');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [apiPackages, setApiPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { t } = useLanguage();
  const isPremium = activeSection === 'premium';

  const {
    packages: premiumAddOnPackages,
    loading: premiumAddOnLoading,
    error: premiumAddOnError,
  } = useAddOnPackages();

  const {
    package: starterSubscriptionPackage,
    loading: starterSubscriptionLoading,
    error: starterSubscriptionError,
  } = useSubscriptionPackage(38);
  const {
    package: proSubscriptionPackage,
    loading: proSubscriptionLoading,
    error: proSubscriptionError,
  } = useSubscriptionPackage(40);
  const {
    package: eliteSubscriptionPackage,
    loading: eliteSubscriptionLoading,
    error: eliteSubscriptionError,
  } = useSubscriptionPackage(44);
  const {
    package: trialPlusSubscriptionPackage,
    loading: trialPlusSubscriptionLoading,
    error: trialPlusSubscriptionError,
  } = useSubscriptionPackage(52);
  const {
    package: yearlyStarterSubscriptionPackage,
    loading: yearlyStarterSubscriptionLoading,
    error: yearlyStarterSubscriptionError,
  } = useSubscriptionPackage(53);
  const {
    package: yearlyProSubscriptionPackage,
    loading: yearlyProSubscriptionLoading,
    error: yearlyProSubscriptionError,
  } = useSubscriptionPackage(50);
  const {
    package: yearlyEliteSubscriptionPackage,
    loading: yearlyEliteSubscriptionLoading,
    error: yearlyEliteSubscriptionError,
  } = useSubscriptionPackage(45);

  const getBotnoiTokenHelper = useCallback(async () => {
    if (!user) return null;
    const firebaseToken = await user.getIdToken();
    const res = await getBotnoiToken(firebaseToken);
    
    if (typeof res === 'string') return res;
    if (res?.token) return res.token;
    if (res?.access_token) return res.access_token;
    if (res?.data?.token) return res.data.token;
    if (res?.data?.access_token) return res.data.access_token;
    if (typeof res?.data === 'string') return res.data; // 👈 ADD THIS
    return null;
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
      } catch {
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

  const handlePaymentSubmit = useCallback(async (payload) => {
    if (!user) return;
    const token = await getBotnoiTokenHelper();
    if (!token) throw new Error('Unable to authenticate');
      const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_APP_BASE_URL) || window.location.origin;
      const pricingPageUrl = `${String(baseUrl).replace(/\/$/, '')}/Pricing`;

      // More Text add-on: use stripe_add_on endpoint
      const isAddOn = payload.basePackage?.checkoutType === 'premium-add-on' || payload.basePackage?.addOnId != null;
      const addOnId = payload.basePackage?.add_id ?? payload.basePackage?.addOnId ?? 1;

      if (isAddOn) {
        const addOnUrl = new URL('https://api-voice-staging.botnoi.ai/api/stripe/stripe_add_on');
        addOnUrl.searchParams.set('add_id', String(addOnId));
        addOnUrl.searchParams.set('method', 'card');
        addOnUrl.searchParams.set('currency', 'usd');
        const addOnRes = await fetch(addOnUrl.toString(), {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        const addOnData = await addOnRes.json().catch(() => ({}));
        if (!addOnRes.ok) {
          const msg = addOnData?.message ?? addOnData?.error ?? addOnData?.data?.message ?? addOnData?.data?.error;
          throw new Error(typeof msg === 'string' ? msg : `Checkout failed (${addOnRes.status})`);
        }
        const findStripeUrlIn = (obj, seen = new Set()) => {
          if (obj == null || seen.has(obj)) return null;
          if (typeof obj === 'string') {
            const s = obj.trim();
            if (s.startsWith('http') && s.includes('checkout.stripe.com')) return s;
            if (/^cs_(test|live)_[a-zA-Z0-9]+$/.test(s)) return `https://checkout.stripe.com/c/pay/${s}`;
            return null;
          }
          if (typeof obj !== 'object') return null;
          seen.add(obj);
          if (Array.isArray(obj)) {
            for (const item of obj) {
              const u = findStripeUrlIn(item, seen);
              if (u) return u;
            }
            return null;
          }
          for (const key of Object.keys(obj)) {
            const u = findStripeUrlIn(obj[key], seen);
            if (u) return u;
          }
          return null;
        };
        const rawUrl =
          addOnData?.url ?? addOnData?.checkout_url ?? addOnData?.session_url ?? addOnData?.redirect_url ??
          addOnData?.stripe_url ?? addOnData?.data?.url ?? addOnData?.data?.checkout_url ?? findStripeUrlIn(addOnData);
        const sessionId = addOnData?.session_id ?? addOnData?.data?.session_id;
        const checkoutUrl =
          typeof rawUrl === 'string' && rawUrl.startsWith('http')
            ? rawUrl
            : typeof sessionId === 'string' && sessionId
              ? `https://checkout.stripe.com/c/pay/${sessionId}`
              : null;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
          return;
        }
        throw new Error(addOnData?.message ?? addOnData?.error ?? 'No checkout URL received. Please try again.');
      }

      // Regular packages: use custom_price endpoint
      const packId = payload.basePackageId ?? payload.basePackage?.package_id ?? 'pack_5000';
      const price = Number(payload.totalPrice);
      const body = {
        currency: 'usd',
        method: ['card'],
        pack_id: packId,
        price: Number.isFinite(price) ? price : 70.49,
        cancel_url: pricingPageUrl,
        return_url: pricingPageUrl,
        success_url: pricingPageUrl,
        redirect_url: pricingPageUrl,
      };
      const apiUrl = new URL('https://api-voice-staging.botnoi.ai/api/stripe/custom_price');
      apiUrl.searchParams.set('cancel_url', pricingPageUrl);
      apiUrl.searchParams.set('return_url', pricingPageUrl);
      const res = await fetch(apiUrl.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Cancel-URL': pricingPageUrl,
          'X-Return-URL': pricingPageUrl,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.message ?? data?.error ?? data?.data?.message ?? data?.data?.error;
        throw new Error(typeof msg === 'string' ? msg : `Checkout failed (${res.status})`);
      }
      // Helper: find first string that looks like a Stripe checkout URL anywhere in obj
      const findStripeUrlIn = (obj, seen = new Set()) => {
        if (obj == null || seen.has(obj)) return null;
        if (typeof obj === 'string') {
          const s = obj.trim();
          if (s.startsWith('http') && s.includes('checkout.stripe.com')) return s;
          if (/^cs_(test|live)_[a-zA-Z0-9]+$/.test(s)) return `https://checkout.stripe.com/c/pay/${s}`;
          return null;
        }
        if (typeof obj !== 'object') return null;
        seen.add(obj);
        if (Array.isArray(obj)) {
          for (const item of obj) {
            const u = findStripeUrlIn(item, seen);
            if (u) return u;
          }
          return null;
        }
        for (const key of Object.keys(obj)) {
          const u = findStripeUrlIn(obj[key], seen);
          if (u) return u;
        }
        return null;
      };
      const rawUrl =
        data?.url ??
        data?.checkout_url ??
        data?.session_url ??
        data?.redirect_url ??
        data?.stripe_url ??
        data?.redirectUrl ??
        data?.data?.url ??
        data?.data?.checkout_url ??
        data?.data?.session_url ??
        data?.data?.redirect_url ??
        data?.data?.stripe_url ??
        data?.result?.url ??
        data?.response?.url ??
        findStripeUrlIn(data);
      const sessionId = data?.session_id ?? data?.id ?? data?.data?.session_id ?? data?.data?.id ?? data?.result?.session_id ?? data?.result?.id ?? data?.data?.sessionId ?? data?.sessionId;
      const checkoutUrl =
        typeof rawUrl === 'string' && rawUrl.startsWith('http')
          ? rawUrl
          : typeof sessionId === 'string' && sessionId
            ? `https://checkout.stripe.com/c/pay/${sessionId}`
            : null;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }
      // Log response when URL is missing (helps debug backend response shape)
      if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
        console.warn('[Stripe custom_price] No checkout URL in response:', data);
      }
      const errMsg = data?.message ?? data?.error ?? data?.data?.message ?? data?.data?.error;
      const isGenericSuccess = typeof errMsg === 'string' && /^\s*success\s*$/i.test(errMsg.trim());
      throw new Error(
        isGenericSuccess
          ? 'Checkout link was not returned. Please try again or contact support.'
          : typeof errMsg === 'string'
            ? errMsg
            : 'No checkout URL received. Please try again.'
      );
  }, [user, getBotnoiTokenHelper]);

  const onClosePayment = () => {
    setIsPaymentOpen(false);
    setSelectedPackage(null);
  };

  if (packagesLoading && !isPremium) {
    return (
      <div className="w-full px-4 sm:px-8 py-6 bg-white">
        <PricingPageSkeleton />
      </div>
    );
  }

  return (
    <div
      className={`w-full px-4 sm:px-8 py-6 ${isPremium ? 'bg-gray-50' : 'bg-white'}`}
    >
      <PricingNavbar activeSection={activeSection} onSectionChange={setActiveSection} />
      {activeSection === 'premium' ? (
        <>
        <Premiummembership
          onJoin={handlePurchase}
          starterPackage={starterSubscriptionPackage}
          starterLoading={starterSubscriptionLoading}
          starterError={starterSubscriptionError}
          proPackage={proSubscriptionPackage}
          proLoading={proSubscriptionLoading}
          proError={proSubscriptionError}
          elitePackage={eliteSubscriptionPackage}
          eliteLoading={eliteSubscriptionLoading}
          eliteError={eliteSubscriptionError}
          trialPlusPackage={trialPlusSubscriptionPackage}
          trialPlusLoading={trialPlusSubscriptionLoading}
          trialPlusError={trialPlusSubscriptionError}
          yearlyStarterPackage={yearlyStarterSubscriptionPackage}
          yearlyStarterLoading={yearlyStarterSubscriptionLoading}
          yearlyStarterError={yearlyStarterSubscriptionError}
          yearlyProPackage={yearlyProSubscriptionPackage}
          yearlyProLoading={yearlyProSubscriptionLoading}
          yearlyProError={yearlyProSubscriptionError}
          yearlyElitePackage={yearlyEliteSubscriptionPackage}
          yearlyEliteLoading={yearlyEliteSubscriptionLoading}
          yearlyEliteError={yearlyEliteSubscriptionError}
        />
        <Premiumpage
          onJoin={handlePurchase}
          packages={premiumAddOnPackages}
          loading={premiumAddOnLoading}
          error={premiumAddOnError}
        />
        </>
        
      ) : (
        <PricingSections
          onPurchase={handlePurchase}
          apiPackages={apiPackages}
          packagesLoading={packagesLoading}
          onViewSubscriptions={() => setActiveSection('premium')}
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
        <div className="w-full bg-linear-to-br from-pink-100 to-purple-100 rounded-3xl shadow-lg border border-pink-200/50 px-6 sm:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-800 text-3xl sm:text-4xl" />
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{t('pricing.reportIssue')}</h1>
              </div>
              <p className="text-gray-600 text-base sm:text-lg ml-0 sm:ml-12">{t('pricing.reportIssueDesc')}</p>
            </div>
            <div className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-linear-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white font-semibold text-lg px-8 sm:px-12 py-3 sm:py-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">{t('pricing.contactSupport')}</button>
            </div>
          </div>
        </div>
      </div>
      </>
      
    </div>
  );
}
