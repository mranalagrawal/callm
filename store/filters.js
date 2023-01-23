import { defineStore } from 'pinia'
import { markRaw } from '@nuxtjs/composition-api'

export const useFilters = defineStore({
  id: 'filters',
  state: () => ({
    // Todo: Implement pinia persistant, with nuxt 3 and VueUse is really easy, maybe we wait for Nuxt 3 stable version
    selectedLayout: 'grid', // grid | list
    availableLayouts: markRaw(['grid', 'list']),
  }),

})
