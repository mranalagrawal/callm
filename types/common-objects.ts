import type { TISO639 } from '~/config/themeConfig'

export type CurrencyCode = 'GBP' | 'EUR'

export interface IMoneyV2 {
  amount: string | number
  currencyCode: CurrencyCode
}

export type ITranslations = {
  [key in TISO639]: string
}

export interface IAttribute {
  key: string
  value: string
}
