import { computed, ref } from '@nuxtjs/composition-api'
import { defineStore } from 'pinia'

export const useHeaderSize = defineStore('headerSize', () => {
  const topBarHeight = ref(0)
  const navbarHeight = ref(0)
  const megaMenuHeight = ref(0)
  const getTopBarHeight = computed(() => `${topBarHeight.value}px`)

  return { topBarHeight, navbarHeight, megaMenuHeight, getTopBarHeight }
})
