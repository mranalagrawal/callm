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
  <div class="cmw-relative cmw-hidden cmw-p-8 print:cmw-block">
    <div v-if="order && !!Object.keys(order).length" class="cmw-flex cmw-justify-between">
      <div>
        <VueSvgIcon
          :data="logo"
          width="200"
          height="auto"
          original
        />
      </div>
      <div>
        <div class="cmw-text-right">
          Data {{ $d(new Date(order.processedAt), 'short', $i18n.localeProperties.iso) }}
        </div>
      </div>
    </div>

    <i18n
      v-if="order"
      path="profile.orders.print.invoiceNumber"
      tag="h1"
      class="cmw-overline-2 cmw-uppercase cmw-text-secondary-400 cmw-mt-12"
    >
      <strong
        class="cmw-font-sans cmw-font-bold cmw-text-body cmw-tracking-normal"
        v-text="order.orderNumber"
      />
    </i18n>

    <div v-if="order" class="cmw-grid cmw-gap-4 cmw-grid-cols-3 cmw-mt-16 cmw-mb-8">
      <address v-if="order.billingAddress">
        <strong>{{ $t('profile.orders.card.billingAddress') }}</strong>
        <span class="cmw-block" v-text="order.billingAddress.name" />
        <span class="cmw-block" v-text="order.billingAddress.address1" />
        <span class="cmw-block" v-text="order.billingAddress.phone" />
        <span class="cmw-block" v-text="order.billingAddress.city" />
      </address>
      <address v-if="order.shippingAddress">
        <strong>{{ $t('profile.orders.card.shipmentAddress') }}</strong>
        <span class="cmw-block" v-text="order.shippingAddress.name" />
        <span class="cmw-block" v-text="order.shippingAddress.address1" />
        <span class="cmw-block" v-text="order.shippingAddress.phone" />
        <span class="cmw-block" v-text="order.shippingAddress.city" />
      </address>
      <address>
        <strong>{{ $t('profile.orders.card.businessAddress') }}</strong>
        <span class="cmw-block" v-text="companyAddress?.name" />
        <span class="cmw-block" v-text="companyAddress?.street" />
        <span class="cmw-block" v-text="companyAddress?.city" />
      </address>
    </div>

    <table v-if="order" class="cmw-w-full">
      <tr class="cmw-text-lg">
        <td>{{ $t('profile.orders.print.tableHeaders.code') }}</td>
        <td>{{ $t('profile.orders.print.tableHeaders.description') }}</td>
        <td class="cmw-text-center">
          {{ $t('profile.orders.print.tableHeaders.quantity') }}
        </td>
        <td class="cmw-text-right">
          {{ $t('profile.orders.print.tableHeaders.price') }}
        </td>
      </tr>
      <tbody class="cmw-border-y cmw-border-gray">
        <tr v-for="(lineItem) in orderLineItems" :key="generateKey(lineItem.title)" class="cmw-leading-loose even:cmw-bg-gray-lightest">
          <td class="cmw-text-sm">
            {{ lineItem.variant.sku }}
          </td><!-- <td>{{ $orderItem->product->sku }}</td> -->
          <td>{{ lineItem.variant.product.title }}</td><!-- <td>{{ $orderItem->product->name }}</td> -->
          <td class="cmw-text-center">
            {{ lineItem.quantity }}
          </td><!-- <td>{{ $orderItem->amount }}</td> -->
          <!-- Todo: Add isOnSaleLogic? Which price do we want to show here? -->
          <td class="cmw-text-right">
            {{ $n(Number(lineItem.variant.compareAtPriceV2.amount),
                  'currency',
                  getLocaleFromCurrencyCode(lineItem.variant.compareAtPriceV2.currencyCode),
            ) }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="cmw-border-t cmw-border-t-secondary-400">
          <td colspan="2">
            <span
              class="cmw-text-xl cmw-font-bold cmw-my-4 cmw-text-secondary-400"
              v-text="$t('profile.orders.card.orderTotal')"
            />
          </td>
          <td colspan="2" class="cmw-mt-4 cmw-text-right">
            <span
              class="cmw-text-xl cmw-font-bold cmw-my-4 cmw-place-self-end cmw-text-secondary-400"
              v-text="$n(Number(order.totalPrice.amount), 'currency', getLocaleFromCurrencyCode(order.totalPrice.currencyCode))"
            />
          </td>
        </tr>
      </tfoot>
    </table>
    <small class="cmw-fixed cmw-bottom-4 cmw-left-0 cmw-text-center cmw-pt-4 cmw-border-t cmw-border-t-gray" v-text="companyAddress?.footer" />
  </div>
</template>
