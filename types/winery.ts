import type { TImage } from '~/types/types'

export interface IWineryBackEnd {
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

/**
 * The IWinery interface represents a winery in the system.
 * It contains all the necessary properties that a winery should have.
 */
export interface IWinery {
  /**
   * The country where the winery is located.
   */
  country: string
  /**
   * A brief description of the winery.
   */
  description: string

  /**
   * A unique identifier for the winery.
   */
  handle: string

  /**
   * The ID of the winery.
   */
  id: string

  /**
   * The image of the winery.
   */
  image: Pick<TImage, 'url' | 'altText'>
  /**
   * Indicates whether the winery is a partner.
   */
  isPartner: boolean

  /**
   * The logo of the winery.
   */
  logo: Pick<TImage, 'url' | 'altText'>

  /**
   * The name of the winery.
   */
  name: string

  /**
   * The region where the winery is located.
   */
  region: string

  /**
   * The zone where the winery is located (listingText on BackEnd).
   */
  zone: string
}
