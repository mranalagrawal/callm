import { ref, useContext, watch } from '@nuxtjs/composition-api'
import { defineStore } from 'pinia'

export const useRecentProductsStore = defineStore('recentProductsStore', () => {
  const recentProducts = ref([])
  const { $cookies } = useContext()

  if ($cookies.get('recentProducts'))
    recentProducts.value = $cookies.get('recentProducts')

  watch(recentProducts.value, (val) => {
    $cookies.set('recentProducts', val)
  })

  return { recentProducts }
})
