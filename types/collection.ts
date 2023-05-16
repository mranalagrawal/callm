import type { TImage } from '~/types/types'

export interface ICollection {
  description: string
  descriptionHtml: string
  handle?: string
  // id: string
  image: TImage
  // metafield: Metafield
  // metafields: Metafield[]
  // onlineStoreUrl:URL
  // seo: string // SEO!
  title: string
  // updatedAt:DateTime!
  // # Connections
  // products(first: Int, reverse: Boolean): ProductConnection
  link: { value: '' }
  products: []

}

export const initialCollectionData: ICollection = {
  description: '',
  descriptionHtml: '',
  link: { value: '' },
  products: [],
  title: '',
  image: {
    altText: '',
    width: 0,
    height: 0,
    id: '',
    url: '',
  },
}
