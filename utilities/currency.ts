const getCurrencySymbol = (k = '') => ({
  GBP: '£',
  EUR: '€',
})[k]

const getLocaleFromCurrencyCode = (code = '') => ({
  GBP: 'en-GB',
  EUR: 'it-IT',
})[code]

const getPercent = (x = 0, y = 0) => {
  return Math.round(Math.abs(((x - y) / y) * 100))
}

const getCountryFromStore = (store = '') => ({
  CMW: 'IT',
  B2B: 'IT',
  CMW_UK: 'GB',
  CMW_FR: 'FR',
  CMW_DE: 'DE',
})[store] || ''

export { getCurrencySymbol, getLocaleFromCurrencyCode, getPercent, getCountryFromStore }
