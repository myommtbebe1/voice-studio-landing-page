/** 1 USD = 2100 Kyats (Myanmar currency) */
export const USD_TO_KYATS = 2100;

/**
 * Returns { display, currency } for showing price. Always displays in USD.
 * @param {number|string} price - Price in USD
 * @param {string} language - 'en' | 'my'
 * @param {function} t - Translation function t(key)
 */
export function formatPriceDisplay(price, language, t) {
  const num = Number(price);
  return { display: num.toFixed(2), currency: t('pricing.currencyUsd') };
}
