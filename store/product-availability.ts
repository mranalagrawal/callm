import { defineStore } from 'pinia'

interface IState {
  productId: string | number | null
}

export const useProductAvailability = defineStore({
  id: 'productAvailability',
  state: () => <IState> ({
    productId: null,
  }),
})
