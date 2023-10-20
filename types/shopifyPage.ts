export interface IShopifyPage {
  body: string // HTML!
  filters: { value: string }
  id: string // ID!
  rewriteUrl: { value: string }
  shortDescription: { value: string }
  title: string // String!
  seo: {
    description: string
    title: string
  }
}
