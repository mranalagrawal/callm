<script lang="ts">
import { computed, defineComponent, toRefs, useContext } from '@nuxtjs/composition-api'
import type { PropType } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import { useCart } from '~/store/cart'
import { useCustomer } from '~/store/customer'

import addIcon from '~/assets/svg/add.svg'
import deleteIcon from '~/assets/svg/delete.svg'
import toGiftIcon from '~/assets/svg/feature-to-gift.svg'
import subtractIcon from '~/assets/svg/subtract.svg'

import type { ICartLinesMapped } from '~/types/cart'
import type { IMoneyV2 } from '~/types/common-objects'
import type { IProductPriceList } from '~/types/product'
import { getLocaleFromCurrencyCode } from '~/utilities/currency'

export default defineComponent({
  name: 'CartLine',
  props: {
    cartLineItem: {
      type: Object as PropType<ICartLinesMapped>,
      required: true,
    },
    isLast: Boolean,
  },
  setup(props) {
    const { i18n, $productMapping, $cmwStore: { settings: { salesChannel } } } = useContext()
    const { customerId, getCustomerType } = storeToRefs(useCustomer())
    const { cart } = storeToRefs(useCart())
    const { cartLinesRemove, cartLinesUpdate } = useCart()

    const { product, quantityAvailable } = toRefs(props.cartLineItem.merchandise)
    const productDetails = computed(() => product.value?.details?.value ? JSON.parse(product.value.details.value) : undefined)
    const cartQuantity = computed(() => props.cartLineItem.quantity)
    const canRemoveOne = computed(() => props.cartLineItem.quantity > 0)

    const priceLists: Maybe<Partial<IProductPriceList>> = props.cartLineItem.priceLists ? props.cartLineItem.priceLists[getCustomerType.value] : null
    const availableFeatures = Object.keys(productDetails.value).length ? $productMapping.availableFeatures(productDetails.value) : []

    const amountMax = computed(() => {
      if (!productDetails.value) { return 0 }

      return (productDetails.value.amountMax[salesChannel]
          && productDetails.value.amountMax[salesChannel] <= quantityAvailable.value)
        ? productDetails.value.amountMax[salesChannel]
        : (quantityAvailable.value || 0)
    })

    const canAddMore = computed(() => product.value.isGiftCard
        || (amountMax.value - cartQuantity.value) > 0)

    const finalPrice = computed<IMoneyV2>(() => !product.value.isGiftCard
      ? priceLists?.price
      : props.cartLineItem.merchandise.price)

    const compareAtPrice = computed<IMoneyV2>(() => !product.value.isGiftCard
      ? priceLists?.compareAtPrice
      : props.cartLineItem.merchandise.compareAtPrice)

    const isSuitableGift = computed(() => props.cartLineItem.attributes.some(attr => attr.key === 'gift'))

    const isOnSale = computed(() => availableFeatures?.includes('isInPromotion'))

    const productUrl = computed(() =>
      !product.value.isGiftCard
        ? `/${productDetails.value?.handle[i18n.locale]}-${productDetails.value?.key}.htm`
        : `/${productDetails.value?.handle[i18n.locale]}`,
    )

    const updateLineItemQuantity = async (quantity: number, isRemoving = false) => {
      const lines = [{
        attributes: props.cartLineItem.attributes,
        id: props.cartLineItem.id,
        quantity,
        merchandiseId: props.cartLineItem.merchandise.id,
      }]

      await cartLinesUpdate(cart.value.id, lines, isRemoving)
    }

    const addQuantity = async () => {
      if (!canAddMore.value) { return }

      const updatedQuantity = props.cartLineItem.quantity + 1
      await updateLineItemQuantity(updatedQuantity, false)
    }

    const subtractQuantity = async () => {
      if (!canRemoveOne.value) { return }

      const updatedQuantity = props.cartLineItem.quantity - 1
      await updateLineItemQuantity(updatedQuantity, true)
    }

    const removeLineItem = async () => {
      await cartLinesRemove(cart.value.id, [props.cartLineItem])
    }

    return {
      addIcon,
      addQuantity,
      amountMax,
      canAddMore,
      cartLinesUpdate,
      compareAtPrice,
      customerId,
      deleteIcon,
      finalPrice,
      isOnSale,
      isSuitableGift,
      product,
      productDetails,
      productUrl,
      removeLineItem,
      subtractIcon,
      subtractQuantity,
      toGiftIcon,
    }
  },
  methods: {
    getLocaleFromCurrencyCode,
  },
})
</script>

<template>
  <div v-if="cartLineItem?.quantity > 0">
    <template v-if="!isSuitableGift">
      <div class="c-cartLineItem mx-3 py-4 bg-white border-b border-b-gray-light">
        <div class="c-cartLineItem__image">
          <component
            :is="productUrl ? 'NuxtLink' : 'div'"
            :to="productUrl ? localePath(productUrl) : null"
          >
            <img
              v-show="product.featuredImage?.url"
              :src="product.featuredImage?.url"
              :alt="product.featuredImage?.altText" class="max-h-90px"
            >
          </component>
        </div>
        <div class="c-cartLineItem__description">
          <component
            :is="productUrl ? 'NuxtLink' : 'div'" :to="productUrl ? localePath(productUrl) : null"
            class="text-sm cmw-font-bold leading-none"
          >
            {{ product.title }}
          </component>
        </div>
        <div class="c-cartLineItem__quantity">
          <div class="grid grid-cols-[32px_40px_32px] h-[32px] items-center">
            <button
              class="flex transition-colors w-full h-full bg-white rounded-sm border-2 border-primary
            disabled:(border-gray-light opacity-50 cursor-not-allowed)"
              :aria-label="$t('enums.accessibility.role.REMOVE_FROM_CART').toString()"
              @click="subtractQuantity"
            >
              <VueSvgIcon class="m-auto" :data="subtractIcon" width="14" height="14" color="#992545" />
            </button>
            <span class="text-center">{{ cartLineItem.quantity }}</span>
            <button
              class="flex transition-colors w-full h-full bg-white rounded-sm border-2 border-primary
               disabled:(border-gray-light opacity-50 cursor-not-allowed)"
              :disabled="!canAddMore"
              :aria-label="!canAddMore ? '' : $t('enums.accessibility.role.ADD_TO_CART').toString()"
              @click="addQuantity"
            >
              <VueSvgIcon class="m-auto" :data="addIcon" width="14" height="14" color="#992545" />
            </button>
          </div>
        </div>
        <div class="c-cartLineItem__price">
          <span
            v-if="isOnSale"
            class="block line-through text-gray text-sm text-right"
          >
            {{
              $n(Number(cartLineItem.quantity * +compareAtPrice.amount),
                 'currency',
                 getLocaleFromCurrencyCode(compareAtPrice.currencyCode))
            }}
          </span>
          <i18n-n
            v-if="finalPrice"
            class="block text-right" :value="cartLineItem.quantity * Number(finalPrice.amount)" :format="{ key: 'currency' }"
            :locale="getLocaleFromCurrencyCode(finalPrice.currencyCode)"
          >
            <template #currency="slotProps">
              <span class="text-lg cmw-font-bold !leading-none">{{ slotProps.currency }}</span>
            </template>
            <template #integer="slotProps">
              <span class="text-lg cmw-font-bold !leading-none">{{ slotProps.integer }}</span>
            </template>
            <template #group="slotProps">
              <span class="text-lg cmw-font-bold !leading-none">{{ slotProps.group }}</span>
            </template>
            <template #fraction="slotProps">
              <span class="text-lg cmw-font-bold !leading-none">{{ slotProps.fraction }}</span>
            </template>
          </i18n-n>
        </div>
        <div class="c-cartLineItem__cta absolute top-4 right-0 md:(relative top-0)">
          <ButtonIcon class="m-auto" :icon="deleteIcon" variant="icon" size="28" @click.native="removeLineItem" />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="bg-secondary-50 rounded my-2 mx-3 grid grid-cols-[70px_1fr_60px] items-center justify-start md:(grid-cols-[70px_1fr_120px_60px] gap-4)">
        <component :is="productUrl ? 'NuxtLink' : 'div'" :to="productUrl ? localePath(productUrl) : null" class="w-70px p-2">
          <img
            v-show="product.featuredImage?.url"
            :src="product.featuredImage?.url"
            :alt="product.featuredImage?.altText"
            class="max-h-90px mix-blend-darken"
          >
        </component>
        <div class="text-sm leading-snug">
          <component :is="productUrl ? 'NuxtLink' : 'div'" :to="productUrl ? localePath(productUrl) : null">
            <span>{{ product.title }}</span>
          </component>
          <div class="flex items-center gap-1 my-1">
            <VueSvgIcon :data="toGiftIcon" class="flex-shrink-0" width="20" height="20" color="#134c45" />
            {{ $t('eventGiftNote') }}
          </div>
        </div>
        <span class="<md:hidden text-right overline-2 text-secondary-700 uppercase">{{ $t('eventGiftFree') }}</span>
        <ButtonIcon class="m-inline-auto" :icon="deleteIcon" variant="icon" size="28" @click.native="removeLineItem" />
      </div>
    </template>
  </div>
</template>

<style>
.c-cartLineItem {
  position: relative;
  display: grid;
  grid-template-areas:
    "image description description"
    "empty quantity price";
  grid-template-columns: 70px auto auto;
  grid-template-rows: 100px 70px;
  align-items: center;

  /* CSS Nesting is not yet support by firefox @06/06/2023 https://caniuse.com/css-nesting Can't wait for it 😎 */
  /*&__image {
    ...
  }*/

}

.c-cartLineItem__image {
  max-width: 70px;
  grid-area: image;
  justify-self: center;
}

.c-cartLineItem__description {
  grid-area: description;
  padding-right: 60px;
}

.c-cartLineItem__quantity {
  grid-area: quantity;
}

.c-cartLineItem__price {
  grid-area: price;
}

.c-cartLineItem__cta {
  grid-area: cta;
}

@screen md {
  .c-cartLineItem {
    grid-gap: 1rem;
    grid-template-areas:
    "image description quantity price cta";
    grid-template-columns: 70px auto 110px 120px 60px;
    grid-template-rows: auto;
  }

  .c-cartLineItem__description {
    padding-right: 0;
  }
}
</style>
