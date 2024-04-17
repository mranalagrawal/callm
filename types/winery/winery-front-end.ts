import type { IBaseItem } from '~/types/baseItem'
import type { TImage } from '~/types/types'

// Todo: this type is also on Sommelier branch
export interface SEO {
  description: string
  title: string
}

interface IWineryAddress {
  /**
   * The country where the winery is located.
   */
  country: string

  /**
   * The formatted address of the winery.
   */
  formattedAddress: string

  /**
   * The region where the winery is located.
   */
  region: string

  /**
   * The zone where the winery is located (listingText on BackEnd).
   */
  zone: string
}

/**
 * The IWinery interface represents a winery in the system.
 * It contains all the necessary properties that a winery should have.
 */
export interface IWineryMapped extends Pick<IBaseItem,
    | 'handle'
    | 'id'
    | 'name'
    | 'title'
> {
  address: IWineryAddress
  /**
   * The production types of the winery.
   */
  annualProduction: string

  /**
   * A brief description of the winery.
   */
  description: string

  /**
   * A detailed description of the winery.
   */
  descriptionHtml: HTMLElement | string

  /**
   * The image of the winery.
   */
  featureImage: Pick<TImage, 'url' | 'altText'>

  /**
   * The hectares of the winery.
   */
  hectares: number

  /**
   * The images of the winery.
   */
  images: Pick<TImage, 'url' | 'altText'>[]

  /**
   * Indicates whether the winery is a partner.
   */
  isPartner: boolean

  /**
   * The logo of the winery.
   */
  logo: Pick<TImage, 'url' | 'altText'>

  /**
   * The categories of the winery.
   */
  masterDistiller: string

  /**
   * The categories of the winery.
   */
  oenologist: string

  /**
   * The grapes owned by the winery.
   */
  ownedGrapes: string

  /**
   * The article’s SEO information.
   */
  seo: SEO

  /**
   * The subtitle of the winery.
   */
  subtitle: string

  /**
   * The year on which the winery was founded.
   */
  year: string
}

export interface IWineryShort extends Pick<IWineryMapped,
    | 'address'
    | 'handle'
    | 'id'
    | 'featureImage'
    | 'isPartner'
    | 'logo'
    | 'name'
> {
}
