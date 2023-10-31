<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { computed, defineComponent, toRefs, useContext } from '@nuxtjs/composition-api'
import addIcon from 'assets/svg/add.svg'
import deleteIcon from 'assets/svg/delete.svg'
import subtractIcon from 'assets/svg/subtract.svg'
import { storeToRefs } from 'pinia'
import { useCheckout } from '~/store/checkout'
import { useCustomer } from '~/store/customer'
import type { ICheckoutLineItemMapped } from '~/types/checkout'
import { getLocaleFromCurrencyCode } from '~/utilities/currency'

export default defineComponent({
  props: {
    checkoutLineItem: {
      type: Object as PropType<ICheckoutLineItemMapped>,
      required: true,
    },
    isLast: Boolean,
  },
  setup(props) {
    const { i18n, $cmwStore } = useContext()
    const { customerId, getCustomerType } = storeToRefs(useCustomer())
    const { checkout } = storeToRefs(useCheckout())
    const { checkoutLineItemsUpdate, checkoutLineItemsRemove } = useCheckout()
    const { $cmwStore: { settings: { salesChannel } } } = useContext()

    const { product, quantityAvailable } = toRefs(props.checkoutLineItem.variant)
    const productDetails = computed(() => product.value?.details?.value ? JSON.parse(product.value.details.value) : undefined)
    const cartQuantity = computed(() => props.checkoutLineItem.quantity)
    const canRemoveOne = computed(() => props.checkoutLineItem.quantity > 0)

    const amountMax = computed(() => {
      if (!productDetails.value) { return 0 }

      return (productDetails.value.amountMax[salesChannel]
          && productDetails.value.amountMax[salesChannel] <= quantityAvailable.value)
        ? productDetails.value.amountMax[salesChannel]
        : (quantityAvailable.value || 0)
    })

    const canAddMore = computed(() => product.value.isGiftCard
        || (amountMax.value - cartQuantity.value) > 0)

    const finalPrice = computed(() => !product.value.isGiftCard
      ? JSON.parse(product.value.details.value).priceLists[$cmwStore.settings.salesChannel][getCustomerType.value]
      : props.checkoutLineItem.variant.price.amount)

    const isOnSale = computed(() => finalPrice.value < +props.checkoutLineItem.variant.price.amount)
    const productUrl = computed(() => `/${productDetails.value?.handle[i18n.locale]}-${productDetails.value?.key}.htm`)

    const updateLineItemQuantity = async (quantity: number, isRemoving = false) => {
      const lineItems = [{
        customAttributes: props.checkoutLineItem.customAttributes,
        id: props.checkoutLineItem.id,
        quantity,
        variantId: props.checkoutLineItem.variant.id,
      }]

      await checkoutLineItemsUpdate(checkout.value.id, lineItems, isRemoving)
    }

    const addQuantity = async () => {
      if (!canAddMore.value) { return }

      const updatedQuantity = props.checkoutLineItem.quantity + 1
      await updateLineItemQuantity(updatedQuantity, false)
    }

    const subtractQuantity = async () => {
      if (!canRemoveOne.value) { return }

      const updatedQuantity = props.checkoutLineItem.quantity - 1
      await updateLineItemQuantity(updatedQuantity, true)
    }

    const removeLineItem = async () => {
      await checkoutLineItemsRemove(checkout.value.id, [props.checkoutLineItem])
    }

    return {
      addIcon,
      addQuantity,
      canAddMore,
      customerId,
      deleteIcon,
      finalPrice,
      isOnSale,
      product,
      productDetails,
      productUrl,
      removeLineItem,
      subtractIcon,
      subtractQuantity,
      amountMax,
    }
  },
  methods: {
    getLocaleFromCurrencyCode,
  },
})
</script>

<template>
  <div
    v-if="checkoutLineItem?.quantity > 0"
    class="c-cartLineItem mx-3 bg-white py-4 border-b border-b-gray-light"
  >
    <div class="c-cartLineItem__image">
      <NuxtLink v-if="productUrl" :to="localePath(productUrl)">
        <img
          v-show="product.featuredImage?.url"
          :src="product.featuredImage?.url"
          :alt="product.featuredImage?.altText" class="max-h-90px"
        >
      </NuxtLink>
    </div>
    <div class="c-cartLineItem__description">
      <NuxtLink v-if="productUrl" :to="localePath(productUrl)" class="text-sm cmw-font-bold leading-none">
        {{ product.title }}
      </NuxtLink>
    </div>
    <div class="c-cartLineItem__quantity">
      <div class="grid grid-cols-[32px_40px_32px] h-[32px] items-center">
        <button
          class="flex transition-colors w-full h-full bg-white rounded-sm border-2 border-primary
            disabled:(border-gray-light opacity-50 cursor-not-allowed)"
          :aria-label="$t('enums.accessibility.role.REMOVE_FROM_CART')"
          @click="subtractQuantity"
        >
          <VueSvgIcon class="m-auto" :data="subtractIcon" width="14" height="14" color="#992545" />
        </button>
        <span class="text-center">{{ checkoutLineItem.quantity }}</span>
        <button
          class="flex transition-colors w-full h-full bg-white rounded-sm border-2 border-primary
               disabled:(border-gray-light opacity-50 cursor-not-allowed)"
          :disabled="!canAddMore"
          :aria-label="!canAddMore ? '' : $t('enums.accessibility.role.ADD_TO_CART')"
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
          $n(Number(checkoutLineItem.quantity * +checkoutLineItem.variant.price.amount),
             'currency',
             getLocaleFromCurrencyCode(checkoutLineItem.variant.price.currencyCode))
        }}
      </span>
      <i18n-n
        v-if="finalPrice"
        class="block text-right" :value="checkoutLineItem.quantity * finalPrice" :format="{ key: 'currency' }"
        :locale="getLocaleFromCurrencyCode(checkoutLineItem.variant.price.currencyCode)"
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
