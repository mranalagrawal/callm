export const getCurrencySymbol = (k) => ({
  GBP: '£',
  EUR: '€',
})[k]

export const getLocaleFromCurrencyCode = (code) => ({
  GBP: 'en-GB',
  EUR: 'it-IT',
})[code]
