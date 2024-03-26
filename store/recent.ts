import { ref, useContext, watch } from '@nuxtjs/composition-api'
import { defineStore } from 'pinia'

export const useRecentProductsStore = defineStore('recentProductsStore', () => {
  const recentProducts = ref<string[]>([])
  const { $cookies } = useContext()

  if ($cookies.get('recentProducts')) { recentProducts.value = $cookies.get('recentProducts') }

  watch(recentProducts, (val) => {
    $cookies.set('recentProducts', val, {
      sameSite: 'none',
      secure: true,
    })
  })

  return { recentProducts }
})
