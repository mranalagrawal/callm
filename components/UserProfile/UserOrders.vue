<script>
import { ref } from '@nuxtjs/composition-api'
import OrderCard from '~/components/UserProfile/OrderCard.vue'

export default {
  components: { OrderCard },
  props: {
    orders: {
      type: [Array, Object],
      required: true,
    },
  },
  setup() {
    const tableHeaders = ['order', 'date', 'recipient', 'products', 'total', 'financialStatus', 'fulfillmentStatus']
    const activeOrder = ref(0)
    const updateOrderId = (id) => {
      activeOrder.value = activeOrder.value === id ? 0 : id
    }

    return { tableHeaders, activeOrder, updateOrderId }
  },
}
</script>

<template>
  <div>
    <div
      v-if="orders.length > 0"
      class="cmw-p-4 md:cmw-max-w-10/12 cmw-pt-0 print:cmw-max-w-12/12"
    >
      <div
        class="c-tableHeaders print:cmw-hidden cmw-backdrop-filter cmw-backdrop-blur cmw-bg-gray-lightest cmw-rounded
         <md:cmw-hidden cmw-grid cmw-grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_90px]
       cmw-items-center cmw-justify-items-center cmw-text-center cmw-mb-6 cmw-py-6 cmw-sticky"
      >
        <div
          v-for="header in tableHeaders"
          :key="header"
          class="cmw-overline-2 cmw-uppercase cmw-text-secondary-400"
        >
          {{ $t(`profile.orders.tableHeaders.${header}`) }}
        </div>
      </div>
      <div
        v-for="item in orders"
        :key="item.id"
      >
        <OrderCard
          :order="item"
          :active-order="activeOrder"
          @update-order-id="updateOrderId"
        />
      </div>
    </div>
    <div v-else class="print:cmw-hidden">
      <p class="lead">
        {{ $t("profile.noOrder") }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.c-tableHeaders {
  top: calc(var(--cmw-header-height) + 106px);
}
</style>
