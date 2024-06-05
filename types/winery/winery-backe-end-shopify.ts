import type { TImage } from '~/types/types'
import type { SEO } from '~/types/winery/winery-front-end'

export interface IWineryShopify {
  contentHtml: string
  details: { value: string }
  handle: string
  id: string
  image: Pick<TImage, 'id' | 'url' | 'altText'>
  seo: SEO
  title: string
}

export interface IGraphQLArticlesResponse {
  articles: { nodes: IWineryShopify[] }
}
