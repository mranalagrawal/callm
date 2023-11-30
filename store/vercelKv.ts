import { useContext } from '@nuxtjs/composition-api'
import { kv } from '@vercel/kv'
import { defineStore } from 'pinia'
import type { TISO639 } from '~/config/themeConfig'
import type { TPrismicIsoCodes } from '~/types/prismic'

interface IState {
  megaMenu: any[]
  // TODO: Complete these and remove Vuex
  /* preFooterData: any[]
  footerData: {
    paymentMethods: any[]
    mobileApps: any[]
    socialLinks: any[]
  } */
}

export const useVercelKv = defineStore({
  id: 'vercelKv',
  state: () => <IState>({
    megaMenu: [],
    /* preFooterData: [],
    footerData: {
      copyright: [],
      mobileApps: [],
      paymentMethods: [],
      socialLinks: [],
    }, */
  }),

  getters: {
    filteredMegaMenu: state => state.megaMenu.filter(item => !item.hide_menu_item),

    getPrismicLocale: (): TPrismicIsoCodes => {
      const { i18n, $cmwStore } = useContext()
      const locale = i18n.locale as TISO639

      return $cmwStore.prismicSettings.isoCode[locale] as TPrismicIsoCodes
    },
  },

  actions: {
    async loadMenu(prismicLocale?: TPrismicIsoCodes) {
      if (!prismicLocale) {
        prismicLocale = this.getPrismicLocale
      }

      const megaMenuData: any = await kv.get(`prismic/menu/menu-${prismicLocale}`)

      this.$patch({
        megaMenu: megaMenuData,
      })
    },
  },
})
