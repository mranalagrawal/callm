export const getCurrencySymbol = (k = '') => ({
  GBP: '£',
  EUR: '€',
})[k]

export const getLocaleFromCurrencyCode = (code = '') => ({
  GBP: 'en-GB',
  EUR: 'it-IT',
})[code]

export const getPercent = (x = 0, y = 0) => {
  return Math.round(Math.abs(((x - y) / y) * 100))
}
