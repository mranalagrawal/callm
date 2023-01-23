<script>
import { storeToRefs } from 'pinia'
// noinspection ES6UnusedImports
import * as LineItemType from '~/types/lineItem'
import heartIcon from '~/assets/svg/heart.svg'
import heartFullIcon from '~/assets/svg/heart-full.svg'
import { getLocaleFromCurrencyCode } from '~/utilities/currency'
import { useCustomer } from '~/store/customer'
import { isObject, regexRules } from '~/utilities/validators'

export default {
  name: 'OrderCardProductRow',
  props: {
    /** @Type: {LineItemType.LineItem} */
    orderLineItem: {
      required: true,
      validator(value) {
        return isObject(value)
      },
    },
  },
  setup() {
    const customerStore = useCustomer()
    const { wishlistArr } = storeToRefs(customerStore)
    const { handleWishlist } = customerStore

    return { wishlistArr, handleWishlist, heartIcon, heartFullIcon }
  },
  computed: {
    isOnSale() {
      return Number(this.orderLineItem.variant.compareAtPriceV2.amount) > Number(this.orderLineItem.variant.priceV2.amount)
    },
    backofficeId() {
      // Get the proper tag 🤦🏻
      return this.orderLineItem.variant.product.tags.find(tag => new RegExp(regexRules('isProduct')).test(tag))
    },
    isOnFavourite() {
      return this.wishlistArr.includes(this.backofficeId)
    },
  },
  methods: {
    getLocaleFromCurrencyCode(code) {
      return getLocaleFromCurrencyCode(code)
    },
  },
}
</script>

<template>
  <div class="text-left cmw-p-4 cmw-grid cmw-text-sm cmw-auto-rows-auto cmw-gap-4">
    <div class="cmw-grid cmw-grid-cols-[75px_auto_32px] cmw-grid-rows-auto md:(cmw-grid-cols-[75px_auto_100px_32px] cmw-grid-rows-1) cmw-items-center cmw-px-2">
      <div class="cmw-order-1">
        <img
          :src="orderLineItem.variant.image.url"
          :alt="orderLineItem.variant.image.altText"
        >
      </div>
      <div class="cmw-order-2 cmw-pr-4">
        <div>{{ orderLineItem.title }}</div>
        <small class="cmw-text-gray-dark">{{ $t('profile.orders.card.quantity') }} {{ orderLineItem.quantity }}</small>
      </div>
      <div class="<md:(cmw-row-start-2 cmw-col-span-full cmw-place-self-end) md:(cmw-order-3 cmw-place-self-auto cmw-text-right cmw-pr-4)">
        <div
          v-if="isOnSale"
          class="cmw-line-through cmw-text-gray cmw-text-sm"
        >
          {{ $n(Number(orderLineItem.variant.compareAtPriceV2.amount), 'currency', getLocaleFromCurrencyCode(orderLineItem.variant.compareAtPriceV2.currencyCode)) }}
        </div>
        <div class="cmw-font-bold">
          {{ $n(Number(orderLineItem.variant.priceV2.amount), 'currency', getLocaleFromCurrencyCode(orderLineItem.variant.compareAtPriceV2.currencyCode)) }}
        </div>
      </div>
      <div class="cmw-order-4">
        <button
          type="button"
          @click="handleWishlist({ id: orderLineItem.variant.product.tags[0], isOnFavourite })"
        >
          <VueSvgIcon
            color="#d94965"
            width="32"
            height="32"
            :data="isOnFavourite ? heartFullIcon : heartIcon"
          />
        </button>
      </div>
    </div>
    <hr>
  </div>
</template>
