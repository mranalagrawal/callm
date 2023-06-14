<script>
import { storeToRefs } from 'pinia'
// noinspection ES6UnusedImports
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
      return Number(this.orderLineItem.variant.compareAtPriceV2.amount) > Number(this.orderLineItem.variant.price.amount)
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
    regexRules,
    getLocaleFromCurrencyCode(code) {
      return getLocaleFromCurrencyCode(code)
    },
  },
}
</script>

<template>
  <div class="text-left p-4 grid text-sm auto-rows-auto gap-4 print:hidden">
    <div class="grid grid-cols-[75px_auto_32px] grid-rows-auto md:(grid-cols-[75px_auto_100px_32px] grid-rows-1) items-center px-2">
      <div class="order-1">
        <img
          :src="orderLineItem.variant.image.url"
          :alt="orderLineItem.variant.image.altText"
        >
      </div>
      <div class="order-2 pr-4">
        <div>{{ orderLineItem.title }}</div>
        <small class="text-gray-dark">{{ $t('profile.orders.card.quantity') }} {{ orderLineItem.quantity }}</small>
      </div>
      <div class="<md:(row-start-2 col-span-full place-self-end) md:(order-3 place-self-auto text-right pr-4)">
        <div
          v-if="isOnSale"
          class="line-through text-gray text-sm"
        >
          {{ $n(Number(orderLineItem.variant.compareAtPriceV2.amount), 'currency', getLocaleFromCurrencyCode(orderLineItem.variant.compareAtPriceV2.currencyCode)) }}
        </div>
        <div class="font-bold">
          {{ $n(Number(orderLineItem.variant.price.amount), 'currency', getLocaleFromCurrencyCode(orderLineItem.variant.compareAtPriceV2.currencyCode)) }}
        </div>
      </div>
      <div class="order-4">
        <button
          type="button"
          :aria-label="isOnFavourite ? $t('enums.accessibility.role.REMOVE_FROM_WISHLIST') : $t('enums.accessibility.role.ADD_TO_WISHLIST')"
          @click="handleWishlist({ id: orderLineItem.variant.product.tags.find(tag => new RegExp(regexRules('isProduct')).test(tag)).replace('P', ''), isOnFavourite })"
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
