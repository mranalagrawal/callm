import type { Context } from '@nuxt/types'
import getProducts from '@/graphql/queries/getProducts.graphql'
import getGiftCardQuery from '@/graphql/queries/getGiftCard.graphql'
import getCollection from '@/graphql/queries/getCollection.graphql'
import type { ICollection } from '~/types/collection'

export default (ctx: Context) => ({
  getAll({ first = 10, reverse = false, query = 'tag:undefined' }) {
    return ctx.$graphql.default.request(getProducts, {
      lang: ctx.i18n.locale.toUpperCase(),
      first,
      reverse,
      query,
    })
  },
  getGiftCardByHandle({ handle = '' }) {
    return ctx.$graphql.default.request(getGiftCardQuery, {
      lang: ctx.i18n.locale.toUpperCase(),
      handle,
    })
  },
  async getCollectionsByHandle({ handle = '' }): Promise<ICollection> {
    return ctx.$graphql.default.request(getCollection, {
      lang: ctx.i18n.locale.toUpperCase(),
      handle,
    })
      .then(({ collection }) => {
        if (collection) {
          return {
            ...collection,
            products: collection?.products?.nodes?.length && ctx.$productMapping.fromShopify(collection.products.nodes),
          }
        } else {
          return {}
        }
      })
      .catch((err: Error) => {
        ctx.$handleApiErrors(`Catch getting ${handle} from Shopify: ${err}`)
        return {}
      })
  },

})
