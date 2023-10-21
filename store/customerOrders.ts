import { defineStore } from 'pinia'
import type { IOrder } from '~/types/order'

interface IState {
  id: string
  orders: IOrder[]
  requestOrderAssistanceNumber: string
  requestOrderAssistanceName: string
}

export const useCustomerOrders = defineStore({
  id: 'customerOrders',
  state: () => <IState>({
    id: '',
    orders: [],
    requestOrderAssistanceNumber: '',
    requestOrderAssistanceName: '',
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
    async getCanOrder(variantId: string, amountMax: number, query = 'processed_at:>2020-01-01') {
      return await this.$nuxt.$cmwRepo.orders.getAll(query)
        // @ts-expect-error we need to define customer type
        .then((response) => {
          const nodes = response.customer.orders.nodes
          const previousOrderQuantity = nodes
            .map((el: { lineItems: { nodes: any } }) => el.lineItems.nodes)
            .flat()
            .filter((el: { variant: { id: string } }) => el.variant.id === variantId)
            .reduce((t: number, n: any) => {
              t += n.quantity
              return t
            }, 0)
          return {
            canOrder: previousOrderQuantity < amountMax,
            orderableQuantity: amountMax - previousOrderQuantity,
          }
        })
        .catch((err: Error) => this.$nuxt.$handleApiErrors(`Catch on getCanOrder from Shopify: ${err}`))
    },
  },
})
