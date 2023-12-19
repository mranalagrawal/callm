<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import heartIcon from '~/assets/svg/heart.svg'
import heartFullIcon from '~/assets/svg/heart-full.svg'
import { useCustomerWishlist } from '~/store/customerWishlist'
import type { ILineItem } from '~/types/order'
import { getLocaleFromCurrencyCode } from '~/utilities/currency'
import { regexRules } from '~/utilities/validators'

export default defineComponent({
  props: {
    orderLineItem: {
      type: Object as PropType<ILineItem>,
      required: true,
    },
  },
  setup(props) {
    const customerWishlist = useCustomerWishlist()
    const { filteredWishlistArr } = storeToRefs(customerWishlist)
    const { handleWishlist } = customerWishlist

    const isOnSale = computed(() => {
      // Note: for gift cards compareAtPrice sometimes is null, so we need to check
      if (!props.orderLineItem.variant?.compareAtPrice) { return false }

      return Number(props.orderLineItem.originalTotalPrice.amount) > Number(props.orderLineItem.discountedTotalPrice.amount)
    })

    const backofficeId = computed<string>(() => {
      // Get the proper tag 🤦🏻
      return props.orderLineItem.variant?.product?.tags?.length
        ? props.orderLineItem.variant.product.tags.find((tag: string) => new RegExp(regexRules('isProduct')).test(tag))
        : 'probably-a-gift-card'
    })

    const isOnFavourite = computed(() => filteredWishlistArr.value.includes(`'${backofficeId.value}'`))

    return {
      backofficeId,
      filteredWishlistArr,
      handleWishlist,
      heartFullIcon,
      heartIcon,
      isOnFavourite,
      isOnSale,
    }
  },
  methods: {
    regexRules,
    getLocaleFromCurrencyCode,
  },
})
</script>

<template>
  <div class="text-left p-4 grid text-sm auto-rows-auto gap-4 print:hidden">
    <div class="grid grid-cols-[75px_auto_32px] grid-rows-auto md:(grid-cols-[75px_auto_100px_32px] grid-rows-1) items-center px-2">
      <div class="order-1">
        <img
          v-if="orderLineItem.variant?.image"
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
          {{ $n(Number(orderLineItem.originalTotalPrice.amount), 'currency', getLocaleFromCurrencyCode(orderLineItem.originalTotalPrice.currencyCode)) }}
        </div>
        <div class="cmw-font-bold">
          {{ $n(Number(orderLineItem.discountedTotalPrice.amount), 'currency', getLocaleFromCurrencyCode(orderLineItem.discountedTotalPrice.currencyCode)) }}
        </div>
      </div>
      <div class="order-4">
        <button
          v-if="backofficeId !== 'probably-a-gift-card'"
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
    <hr class="border-gray-light">
  </div>
</template>
