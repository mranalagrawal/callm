import { kv } from '@vercel/kv'
import { findSlice } from '~/utilities/prismic'

export const state = () => ({
  megaMenu: [],
  footerData: {
    paymentMethods: [],
    socialLinks: [],
    mobileApps: [],
  },
})

export const mutations = {
  SET_MEGA_MENU(state, payload) {
    state.megaMenu = payload
  },
  SET_FOOTER_DATA(state, payload) {
    state.footerData = payload
  },
}

export const actions = {
  async nuxtServerInit({ dispatch }, { req }) {
    await dispatch('headers/setFromApp', req.headers['user-agent']?.includes('CMW-App'))
    await dispatch('loadMenu')
    await dispatch('loadFooter')
  },

  async loadMenu({ commit }) {
    const locale = this.$i18n.locale
    const prismicLocale = this.$cmwStore.prismicSettings.isoCode[locale]
    const megaMenuData = await kv.get(`prismic/menu/menu-${prismicLocale}`)
    commit('SET_MEGA_MENU', megaMenuData)
  },

  async loadFooter({ commit }) {
    const locale = this.$i18n.locale
    const prismicLocale = this.$cmwStore.prismicSettings.isoCode[locale]
    const footerData = await kv.get(`prismic/footer/footer-${prismicLocale}`)

    const paymentMethodsSlice = await findSlice('payment-methods', footerData)
    footerData.paymentMethods = paymentMethodsSlice?.items || []

    const socialLinksSlice = await findSlice('social-links', footerData)
    footerData.socialLinks = socialLinksSlice?.items || []

    const mobileAppsSlice = await findSlice('mobile-apps', footerData)
    footerData.mobileApp = mobileAppsSlice?.items || []

    commit('SET_FOOTER_DATA', footerData)
  },
}
