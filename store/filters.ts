import { defineStore } from 'pinia'
import { markRaw } from '@nuxtjs/composition-api'

type TLayout = 'grid' | 'list'
interface IState {
  availableLayouts: TLayout[]
  selectedLayout: TLayout
}
export const useFilters = defineStore({
  id: 'filters',
  state: () => <IState>({
    // Todo: Implement pinia persistant, with nuxt 3 and VueUse is really easy, maybe we wait for Nuxt 3 stable version
    selectedLayout: 'grid',
    availableLayouts: markRaw(['grid', 'list']),
  }),

})
