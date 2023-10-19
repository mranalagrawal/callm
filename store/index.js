import { kv } from '@vercel/kv'

export const state = () => ({
  megaMenu: [],
})

export const mutations = {
  SET_MEGA_MENU(state, payload) {
    state.megaMenu = payload
  },
}

export const actions = {
  async nuxtServerInit({ dispatch }, { req }) {
    await dispatch('headers/setFromApp', req.headers['user-agent']?.includes('CMW-App'))
    await dispatch('loadMenu')
  },

  async loadMenu({ commit }) {
    const locale = this.$i18n.locale
    const prismicLocale = this.$cmwStore.prismicSettings.isoCode[locale]
    const megaMenuData = await kv.get(`prismic/menu/menu-${prismicLocale}`)
    commit('SET_MEGA_MENU', megaMenuData)
  },
}
