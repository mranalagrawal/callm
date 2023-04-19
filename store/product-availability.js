import { defineStore } from 'pinia'

export const useProductAvailability = defineStore({
  id: 'productAvailability',
  state: () => ({
    productId: null,
  }),

})
