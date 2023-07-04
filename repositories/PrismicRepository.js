import prismicConfig from '~/config/prismicConfig'
// import {TISO639, TStores} from '~/config/themeConfig';

export default ctx => ({
  getSingle({ page = '' }) {
    return ctx.$prismic.api.getSingle(page, {
      lang: prismicConfig[ctx.$config.STORE].isoCode[ctx.i18n.locale],
    })
  },

  // TODO: Implement TS
  /* getSingle({ page = '' }) {
    const store = ctx.$config.STORE as TStores || 'CMW_UK'
    const locale = ctx.i18n.locale as TISO639

    return ctx.$prismic.api.getSingle(page, {
      lang: prismicConfig[store]?.isoCode[locale],
    })
      .then(({ data }: any) => data)
      .catch((err: Error) => {
        ctx.$handleApiErrors(`Catch getting page (${page}) from Shopify: ${err}`)
        return {}
      })
  }, */

  /* try {
    const { customer } = await ctx.$graphql.default.request(getCustomer, {
      lang: ctx.i18n.locale.toUpperCase(),
      customerAccessToken: ctx.$cookieHelpers.getToken(),
    })

    return { customer }
  } catch (e) {
    // TODO: maybe implement sentry in the future
    throw new Error(ctx.$i18n.t('feedback.KO.unknown').toString())
  } */
})
