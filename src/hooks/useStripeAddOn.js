import { useCallback, useState } from 'react';

const API_BASE_URL = 'https://api-voice-staging.botnoi.ai/api/stripe/stripe_add_on';

export function useStripeAddOn({
  authToken = '',
  returnUrl = '',
  currency = 'usd',
  locale = 'en',
} = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkout = useCallback(async (addOnId, options = {}) => {
    if (!addOnId) {
      setError('Add-on ID is required.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const headers = { 'Content-Type': 'application/json' };
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      let normalizedReturnUrl = returnUrl || window.location.href;
      try {
        normalizedReturnUrl = new URL(normalizedReturnUrl, window.location.origin).toString();
      } catch {
        normalizedReturnUrl = window.location.href;
      }

      const successUrl = `${normalizedReturnUrl}${normalizedReturnUrl.includes('?') ? '&' : '?'}stripe_status=success`;
      const cancelUrl = `${normalizedReturnUrl}${normalizedReturnUrl.includes('?') ? '&' : '?'}stripe_status=cancel`;

      const query = new URLSearchParams({
        add_id: String(addOnId),
        method: 'card',
        currency: String(currency).toLowerCase(),
        locale: String(locale).toLowerCase(),
        return_url: normalizedReturnUrl,
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      const expectedTotalUsd = Number(options?.expectedTotalUsd ?? 0);
      if (Number.isFinite(expectedTotalUsd) && expectedTotalUsd > 0) {
        query.set('expected_total_usd', String(expectedTotalUsd));
        query.set('expected_total_cents', String(Math.round(expectedTotalUsd * 100)));
      }

      const url = `${API_BASE_URL}?${query.toString()}`;
      const response = await fetch(url, { method: 'GET', headers });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const redirectUrl =
        data?.url ||
        data?.checkout_url ||
        data?.redirect_url ||
        data?.data;

      if (!redirectUrl) {
        throw new Error('Unexpected API response: no checkout URL found.');
      }

      window.location.href = redirectUrl;
    } catch (err) {
      setError(err?.message || 'Failed to start Stripe add-on checkout.');
    } finally {
      setLoading(false);
    }
  }, [authToken, returnUrl, currency, locale]);

  return {
    checkout,
    loading,
    error,
  };
}
