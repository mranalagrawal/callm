import type { IShopifyPage } from '~/types/shopifyPage'

const initialShopifyPageData: IShopifyPage = {
  body: '',
  filters: { value: '' },
  id: '',
  rewriteUrl: { value: '' },
  shortDescription: { value: '' },
  title: '',
  seo: {
    title: '',
    description: '',
  },
}

export { initialShopifyPageData }
