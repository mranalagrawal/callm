<script>
import { computed, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import { useCustomerOrders } from '@/store/customerOrders'

export default {
  setup() {
    const { $dayjs, i18n } = useContext()
    const customerOrders = useCustomerOrders()
    const { orders } = storeToRefs(customerOrders)
    const selectedFilter = ref($dayjs().subtract(6, 'months').format('YYYY-MM-DD'))
    const periods = ref([
      {
        label: i18n.t('common.filters.periods.period.all'),
        value: '2010-01-01',
      },
      {
        label: i18n.t('common.filters.periods.period.6'),
        value: $dayjs().subtract(6, 'months').format('YYYY-MM-DD'),
      },
      {
        label: i18n.t('common.filters.periods.period.12'),
        value: $dayjs().subtract(12, 'months').format('YYYY-MM-DD'),
      },
    ]) // processed_at:>2022-12-01
    const selectedLabel = computed(() => periods.value.find(period => period.value === selectedFilter.value).label)
    const { fetch } = useFetch(async () => {
      await customerOrders.getOrders(`processed_at:>${selectedFilter.value}`)
    })

    const handleUpdateValue = (value) => {
      selectedFilter.value = value
      fetch()
    }

    return { orders, periods, selectedFilter, selectedLabel, handleUpdateValue }
  },
}
</script>

<template>
  <div>
    <!-- Todo: add some skeleton loader, maybe inside the UserOrders Component -->
    <div class="cmw-p-4 md:cmw-max-w-10/12">
      <CmwSelect
        v-model="selectedFilter"
        :options="periods"
        @update-value="handleUpdateValue"
      >
        <span><strong>{{ $t('common.filters.periods.prefix') }}</strong>{{ selectedLabel }}</span>
      </CmwSelect>
    </div>
    <p v-if="$fetchState.pending" class="px-4">
      {{ $t("loading") }}
    </p>
    <div v-else>
      <UserOrders
        v-if="!!orders"
        :orders="orders"
      />
    </div>
  </div>
</template>