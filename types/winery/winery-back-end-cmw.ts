import type { ILocales } from '~/types/baseItem'

export interface ICmwWinery {
  address: string
  annualProduction: string
  brandCategories: string[]
  brandId: number
  code: string
  country: string
  handle: string
  hectares: Maybe<number>
  image: Maybe<string>
  isPartner: number
  listingText: ILocales
  name: string
  oenologist: Maybe<string>
  ownedGrapes: Maybe<number>
  productionTypes: string[]
  quote: Maybe<string>
  region: string
  subtitle: string
  url: string
  year: string
}
