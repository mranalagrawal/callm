import getPage from '@/graphql/queries/getPage.graphql'

export default ctx => ({
  getPageByHandle({ handle = '' }) {
    return ctx.$graphql.default.request(getPage, {
      lang: ctx.i18n.locale.toUpperCase(),
      handle,
    })
  },
})
