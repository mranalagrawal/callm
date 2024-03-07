<script lang="ts">
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import OrderCard from '~/components/UserProfile/OrderCard.vue'

export default defineComponent({
  components: { OrderCard },
  props: {
    orders: {
      type: [Array, Object],
      required: true,
    },
  },
  setup(props) {
    const tableHeaders = ['order', 'date', 'recipient', 'products', 'total', 'financialStatus', 'fulfillmentStatus']
    const activeOrder = ref<number>(0)
    const updateOrderId = (id: number) => {
      activeOrder.value = activeOrder.value === id ? 0 : id
    }

    const filteredOrders = computed(() => {
      return props.orders.filter((order: any) => !order.canceledAt)
    })

    return {
      activeOrder,
      filteredOrders,
      tableHeaders,
      updateOrderId,
    }
  },
})
</script>

<template>
  <div>
    <div
      v-if="orders.length > 0"
      class="p-4 md:max-w-10/12 pt-0 print:max-w-12/12"
    >
      <div
        class="c-tableHeaders print:hidden backdrop-filter backdrop-blur bg-gray-lightest rounded
         <md:hidden grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_160px_90px]
       items-center justify-items-center text-center mb-6 py-6 sticky"
        :class="{ '-fromApp': $store.state.headers.fromApp }"
      >
        <div
          v-for="header in tableHeaders"
          :key="header"
          class="overline-2 uppercase text-secondary-400"
        >
          {{ $t(`profile.orders.tableHeaders.${header}`) }}
        </div>
      </div>
      <div
        v-for="item in filteredOrders"
        :key="item.id"
      >
        <OrderCard
          :order="item"
          :active-order="activeOrder"
          @update-order-id="updateOrderId"
        />
      </div>
    </div>
    <div v-else class="print:hidden">
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

.c-tableHeaders.-fromApp {
  top: 106px;
}
</style>
