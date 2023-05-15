export type CurrencyCode = 'GBP' | 'EUR'

export interface IMoneyV2 {
  amount: string | number
  currencyCode: CurrencyCode
}
