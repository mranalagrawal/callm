import { markRaw } from '@nuxtjs/composition-api'
import { defineStore } from 'pinia'

import gridIcon from '~/assets/svg/layout-grid.svg'
import listIcon from '~/assets/svg/layout-list.svg'

type TLayoutKey = 'grid' | 'list'

interface TLayout {
  icon: string
  key: TLayoutKey
}

interface IState {
  availableLayouts: TLayout[]
  selectedLayout: TLayoutKey
}
export const useFilters = defineStore({
  id: 'filters',
  state: () => <IState>({
    // Todo: Implement pinia persistant, with nuxt 3 and VueUse is really easy, maybe we wait for Nuxt 3 stable version
    selectedLayout: 'grid',
    availableLayouts: markRaw([
      {
        icon: gridIcon,
        key: 'grid',
      },
      {
        icon: listIcon,
        key: 'list',
      },
    ]),
  }),

})
