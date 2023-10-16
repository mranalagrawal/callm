<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api'
import type { ICompanyAddress, TStores } from '~/config/themeConfig'
import themeConfig from '~/config/themeConfig'
import { getLocaleFromCurrencyCode } from '~/utilities/currency'
import logo from '~/assets/svg/logo-call-me-wine.svg'
import type { IOrder } from '~/types/order'
import { generateKey } from '~/utilities/strings'

export default defineComponent({
  props: {
    order: {
      type: Object as PropType<IOrder>,
    },
  },
  setup(props) {
    const { $config } = useContext()
    const orderLineItems = computed(() => props.order?.lineItems && props.order.lineItems.nodes?.map(node => node))
    const store = $config.STORE as TStores || 'CMW_UK'
    const storeConfig = themeConfig[store]
    const companyAddress: ICompanyAddress | undefined = storeConfig?.address
    return { companyAddress, logo, orderLineItems }
  },
  computed: {
    themeConfig() {
      return themeConfig
    },
  },
  methods: { generateKey, getLocaleFromCurrencyCode },
})
</script>

<template>
  <div class="relative hidden p-8 print:block">
    <div v-if="order && !!Object.keys(order).length" class="flex justify-between">
      <div>
        <VueSvgIcon
          :data="logo"
          width="200"
          height="auto"
          original
        />
      </div>
      <div>
        <div class="text-right">
          Data {{ $d(new Date(order.processedAt), 'short', $i18n.localeProperties.iso) }}
        </div>
      </div>
    </div>

    <i18n
      v-if="order"
      path="profile.orders.print.invoiceNumber"
      tag="h1"
      class="overline-2 uppercase text-secondary-400 mt-12"
    >
      <strong
        class="font-sans cmw-font-bold text-body tracking-normal"
        v-text="order.name"
      />
    </i18n>

    <div v-if="order" class="grid gap-4 grid-cols-3 mt-16 mb-8">
      <address v-if="order.billingAddress">
        <strong>{{ $t('profile.orders.card.billingAddress') }}</strong>
        <span class="block" v-text="order.billingAddress.name" />
        <span class="block" v-text="order.billingAddress.address1" />
        <span class="block" v-text="order.billingAddress.phone" />
        <span class="block" v-text="order.billingAddress.city" />
      </address>
      <address v-if="order.shippingAddress">
        <strong>{{ $t('profile.orders.card.shipmentAddress') }}</strong>
        <span class="block" v-text="order.shippingAddress.name" />
        <span class="block" v-text="order.shippingAddress.address1" />
        <span class="block" v-text="order.shippingAddress.phone" />
        <span class="block" v-text="order.shippingAddress.city" />
      </address>
      <address>
        <strong>{{ $t('profile.orders.card.businessAddress') }}</strong>
        <span class="block" v-text="companyAddress?.name" />
        <span class="block" v-text="companyAddress?.street" />
        <span class="block" v-text="companyAddress?.city" />
      </address>
    </div>

    <table v-if="order" class="w-full">
      <tr class="text-lg">
        <td>{{ $t('profile.orders.print.tableHeaders.code') }}</td>
        <td>{{ $t('profile.orders.print.tableHeaders.description') }}</td>
        <td class="text-center">
          {{ $t('profile.orders.print.tableHeaders.quantity') }}
        </td>
        <td class="text-right">
          {{ $t('profile.orders.print.tableHeaders.price') }}
        </td>
      </tr>
      <tbody class="border-y border-gray">
        <tr v-for="(lineItem) in orderLineItems" :key="generateKey(lineItem.title)" class="leading-loose even:bg-gray-lightest">
          <td class="text-sm">
            {{ lineItem.variant?.sku ? lineItem.variant.sku : '-' }}
          </td><!-- <td>{{ $orderItem->product->sku }}</td> -->
          <td>{{ lineItem.title || '-' }}</td><!-- <td>{{ $orderItem->product->name }}</td> -->
          <td class="text-center">
            {{ lineItem.quantity }}
          </td><!-- <td>{{ $orderItem->amount }}</td> -->
          <!-- Todo: Add isOnSaleLogic? Which price do we want to show here? -->
          <td class="text-right">
            {{ $n(Number(lineItem.discountedTotalPrice.amount),
                  'currency',
                  getLocaleFromCurrencyCode(lineItem.discountedTotalPrice.currencyCode),
            ) }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="border-t border-t-secondary-400">
          <td colspan="2">
            <span
              class="text-xl cmw-font-bold my-4 text-secondary-400"
              v-text="$t('profile.orders.card.orderTotal')"
            />
          </td>
          <td colspan="2" class="mt-4 text-right">
            <span
              class="text-xl cmw-font-bold my-4 place-self-end text-secondary-400"
              v-text="$n(Number(order.totalPrice.amount), 'currency', getLocaleFromCurrencyCode(order.totalPrice.currencyCode))"
            />
          </td>
        </tr>
      </tfoot>
    </table>
    <small class="fixed bottom-4 left-0 text-center pt-4 border-t border-t-gray" v-text="companyAddress?.footer" />
  </div>
</template>
