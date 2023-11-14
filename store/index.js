import { kv } from '@vercel/kv'

export const state = () => ({
  megaMenu: [],
  preFooterData: [],
  footerData: {
    copyright: [],
    mobileApps: [],
    paymentMethods: [],
    socialLinks: [],
  },
})

export const mutations = {
  SET_MEGA_MENU(state, payload) {
    state.megaMenu = payload
  },
  SET_PRE_FOOTER_DATA(state, payload) {
    state.preFooterData = payload
  },
  SET_FOOTER_DATA(state, payload) {
    state.footerData = payload
  },
}

export const actions = {
  async nuxtServerInit({ dispatch }, { req }) {
    // Todo: Remove this dispatch in about 3 months from today (March 2024)
    await dispatch('user/setUser', null)
    await dispatch('headers/setFromApp', req.headers['user-agent']?.includes('CMW-App'))
    await dispatch('loadMenu')
    await dispatch('loadFooter')
    await dispatch('loadPreFooter')
  },

  async loadMenu({ commit }) {
    const locale = this.$i18n.locale
    const prismicLocale = this.$cmwStore.prismicSettings.isoCode[locale]
    const megaMenuData = await kv.get(`prismic/menu/menu-${prismicLocale}`)
    commit('SET_MEGA_MENU', megaMenuData)
  },

  async loadPreFooter({ commit }) {
    const locale = this.$i18n.locale
    const prismicLocale = this.$cmwStore.prismicSettings.isoCode[locale]
    const preFooterData = await kv.get(`prismic/pre-footer/pre-footer-${prismicLocale}`)
    commit('SET_PRE_FOOTER_DATA', preFooterData)
  },

  async loadFooter({ commit }) {
    const footerData = {
      copyright: [],
      mobileApps: [],
      paymentMethods: [],
      socialLinks: [],
    }
    const locale = this.$i18n.locale
    const prismicLocale = this.$cmwStore.prismicSettings.isoCode[locale]
    const footerDataFetch = await kv.get(`prismic/footer/footer-${prismicLocale}`)

    footerData.paymentMethods = (footerDataFetch['payment-methods'] ? footerDataFetch['payment-methods'][0]?.items : []) || []
    footerData.socialLinks = (footerDataFetch['social-links'] ? footerDataFetch['social-links'][0]?.items : []) || []
    footerData.mobileApps = (footerDataFetch['mobile-apps'] ? footerDataFetch['mobile-apps'][0]?.items : []) || []
    footerData.copyright = footerDataFetch.copyright
    commit('SET_FOOTER_DATA', footerData)
  },
}

// TODO: Create a getter for the prismic locale
/* export const getters = {
  prismicLocale() {
    console.log(cmwProjectConfig.prismicSettings)
    return cmwProjectConfig.prismicLocale
    // return this.$cmwStore.prismicSettings.isoCode[this.$i18n.locale]
  },
} */
