import { defineStore } from 'pinia'

export const useCustomerOrders = defineStore({
  id: 'customerOrders',
  state: () => ({
    id: '',
    /** @Type: {OrderType.Order[]} */
    orders: [],
    requestOrderAssistanceNumber: '',
  }),

  actions: {
    async getOrders(query = 'processed_at:>2020-01-01') {
      await this.$nuxt.$cmwRepo.orders.getAll(query)
        .then(({ customer }) => {
          this.$patch({
            id: customer.id,
            orders: customer.orders.nodes,
          })
        })
        .catch(() => {
        })
    },
  },
})
