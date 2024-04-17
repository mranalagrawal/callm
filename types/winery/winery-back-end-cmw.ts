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
  listingText: string
  name: string
  oenologist: Maybe<string>
  ownedGrapes: Maybe<string>
  productionTypes: string[]
  quote: Maybe<string>
  region: string
  subtitle: string
  url: string
  year: string
}
