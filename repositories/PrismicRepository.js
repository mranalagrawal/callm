import prismicConfig from '~/config/prismicConfig'

export default ctx => ({
  getSingle({ page = '' }) {
    return ctx.$prismic.api.getSingle(page, {
      lang: prismicConfig[ctx.$config.STORE].isoCode[ctx.i18n.locale],
    })
  },
})
