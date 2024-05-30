import { defineStore } from 'pinia'

interface HeroState {
  ids: string[]
}

export const useHomeStore = defineStore({
  id: 'hero',
  state: (): HeroState => ({
    ids: [],
  }),
  actions: {
    setIds(idsData: string[]) {
      this.ids = idsData
    },
  },
})
