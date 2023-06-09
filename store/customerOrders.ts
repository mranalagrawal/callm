import { defineStore } from 'pinia'
import type { IOrder } from '~/types/order'

interface IState {
  id: string
  orders: IOrder[]
  requestOrderAssistanceNumber: string
}
export const useCustomerOrders = defineStore({
  id: 'customerOrders',
  state: () => <IState>({
    id: '',
    /** @Type: {OrderType.Order[]} */
    orders: [],
    requestOrderAssistanceNumber: '',
  }),

  actions: {
    async getOrders(query = 'processed_at:>2020-01-01') {
      await this.$nuxt.$cmwRepo.orders.getAll(query)
        // @ts-expect-error we need to define customer type
        .then(({ customer }) => {
          this.$patch({
            id: customer.id,
            orders: customer.orders.nodes,
          })
        })
        .catch((err: Error) => this.$nuxt.$handleApiErrors(`Catch on getOrders from Shopify: ${err}`))
    },
  },
})
