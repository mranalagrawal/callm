import { defineStore } from 'pinia'

interface Banner {
  id: string
  backgroundColor: string
  image: string
  link: string
  text: string
  title: string
}

interface HeroState {
  banners: Banner[]
}

export const useHeroStore = defineStore({
  id: 'hero',
  state: (): HeroState => ({
    banners: [],
  }),
  actions: {
    setBanners(bannersData: any[]) {
      this.banners = bannersData.map(item => ({
        id: item.id,
        backgroundColor: item.backgroundColor || '',
        image: item.image || '',
        link: item.link || '',
        text: item.text || '',
        title: item.title || '',
      }))
    },
  },
})
