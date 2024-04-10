import { useContext } from '@nuxtjs/composition-api'
import { kv } from '@vercel/kv'
import { defineStore } from 'pinia'

import type { TISO639 } from '~/config/themeConfig'
import type { TPrismicIsoCodes } from '~/types/prismic'

interface IState {
  megaMenu: any[]
}

export const useVercelKv = defineStore({
  id: 'vercelKv',
  state: () => <IState>({
    megaMenu: [],
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

      await kv
        .get(`prismic/menu/menu-${prismicLocale}`)
        .then((megaMenu: any) => {
          this.$patch({
            megaMenu,
          })
        })
        .catch((err) => {
          this.$nuxt.$handleApiErrors(`Catch on loadMenu from KV Vercel: ${err}`)
        })
    },
  },
})
