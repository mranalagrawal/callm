import getProducts from '@/graphql/queries/getProducts'
import getGiftCardQuery from '@/graphql/queries/getGiftCard'

export default ctx => ({
  getAll({ first = 10, reverse = false, query = 'tag:undefined' }) {
    return ctx.$graphql.default.request(getProducts, {
      lang: ctx.i18n.locale.toUpperCase(),
      first,
      reverse,
      query,
    })
  },
  getGiftCardByHandle({ handle = '', lang }) {
    return ctx.$graphql.default.request(getGiftCardQuery, {
      handle,
      lang: lang.toUpperCase(),
    })
  },
})
