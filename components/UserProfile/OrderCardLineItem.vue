<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import type { PropType } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import { useCustomerWishlist } from '~/store/customerWishlist'

import heartFullIcon from '~/assets/svg/heart-full.svg'
import heartIcon from '~/assets/svg/heart.svg'

import type { ILineItem } from '~/types/order'
import { getLocaleFromCurrencyCode } from '~/utilities/currency'
import { regexRules } from '~/utilities/validators'

export default defineComponent({
  name: 'OrderCardLineItem',
  props: {
    orderLineItem: {
      type: Object as PropType<ILineItem>,
      required: true,
    },
  },
  setup(props) {
    const customerWishlist = useCustomerWishlist()
    const { wishlistArr } = storeToRefs(customerWishlist)
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

    const isOnFavourite = computed(() => wishlistArr.value.includes(`'${backofficeId.value}'`))
    const productDetails = computed(() => JSON.parse(props.orderLineItem.variant?.product?.details?.value || ''))

    return {
      backofficeId,
      handleWishlist,
      heartFullIcon,
      heartIcon,
      isOnFavourite,
      isOnSale,
      productDetails,
      wishlistArr,
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
        <component
          :is="orderLineItem.variant?.product?.handle ? 'NuxtLink' : 'div'"
          :to="orderLineItem.variant?.product?.handle ? localePath(`/${orderLineItem.variant?.product?.handle}-P${productDetails?.feId}.htm`) : null"
        >
          {{ orderLineItem.title }}
        </component>
        <small class="text-gray-dark">{{ $t('profile.orders.card.quantity') }} {{ orderLineItem.quantity }}</small>
      </div>
      <div class="<md:(row-start-2 col-span-full place-self-end) md:(order-3 place-self-auto text-right pr-4)">
        <div
          v-if="isOnSale"
          class="line-through text-gray text-sm"
        >
          {{ $n(Number(orderLineItem.originalTotalPrice.amount),
                'currency', getLocaleFromCurrencyCode(orderLineItem.originalTotalPrice.currencyCode)) }}
        </div>
        <div class="cmw-font-bold">
          {{ $n(Number(orderLineItem.discountedTotalPrice.amount), 'currency', getLocaleFromCurrencyCode(orderLineItem.discountedTotalPrice.currencyCode)) }}
        </div>
      </div>
      <div class="order-4">
        <button
          v-if="backofficeId !== 'probably-a-gift-card'"
          type="button"
          :class="isOnFavourite ? 'js-remove-from-wishlist' : 'js-add-to-wishlist'"
          :aria-label="isOnFavourite ? $t('enums.accessibility.role.REMOVE_FROM_WISHLIST').toString()
            : $t('enums.accessibility.role.ADD_TO_WISHLIST').toString()"
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
