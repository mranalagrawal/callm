<script lang="ts">
import type { PropType } from '@nuxtjs/composition-api'
import { computed, defineComponent, toRefs } from '@nuxtjs/composition-api'
import addIcon from 'assets/svg/add.svg'
import deleteIcon from 'assets/svg/delete.svg'
import subtractIcon from 'assets/svg/subtract.svg'
import { storeToRefs } from 'pinia'
import { useCustomer } from '~/store/customer'
import { useCustomerOrders } from '~/store/customerOrders'
import { useShopifyCart } from '~/store/shopifyCart'
import type { ICartLineItem } from '~/types/order'
import { getLocaleFromCurrencyCode } from '~/utilities/currency'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<ICartLineItem>,
      required: true,
    },
    isLast: Boolean,
  },
  setup(props) {
    const { customerId } = storeToRefs(useCustomer())
    const { shopifyCart } = storeToRefs(useShopifyCart())
    const { getCanOrder } = useCustomerOrders()
    const { merchandise } = toRefs(props.item)
    const {
      cartLinesAdd,
      getFinalPrice,
      cartLinesRemove,
      cartLinesUpdate,
    } = useShopifyCart()

    const finalPrice = getFinalPrice(props.item)

    const cartQuantity = computed(() => props.item.quantity)
    const canAddMore = computed(() => merchandise.value.product.isGiftCard
      || merchandise.value.product.totalInventory - cartQuantity.value > 0)
    const isOnSale = computed(() => finalPrice < +merchandise.value.price.amount)

    const increaseQuantity = async () => {
      if (!canAddMore.value) { return }

      await cartLinesAdd(props.item, true)
    }

    const decreaseQuantity = async () => {
      if (props.item.quantity === 0) { return }

      await cartLinesUpdate(props.item, props.item.quantity - 1, true)
    }

    return {
      addIcon,
      canAddMore,
      cartLinesAdd,
      cartLinesRemove,
      cartLinesUpdate,
      cartQuantity,
      customerId,
      decreaseQuantity,
      deleteIcon,
      finalPrice,
      getCanOrder,
      getFinalPrice,
      increaseQuantity,
      isOnSale,
      shopifyCart,
      subtractIcon,
    }
  },
  methods: {
    getLocaleFromCurrencyCode,
  },
})
</script>

<template>
  <div
    v-if="item?.quantity > 0"
    class="c-cartLineItem mx-3 bg-white py-4 border-b border-b-gray-light"
  >
    <div class="c-cartLineItem__image">
      <img :src="item.merchandise.product.featuredImage.url" alt="" style="height: 50px">
    </div>
    <div class="c-cartLineItem__description">
      <p class="text-sm cmw-font-bold">
        {{ item.merchandise.product.title }}
      </p>
    </div>
    <div class="c-cartLineItem__quantity">
      <div class="grid grid-cols-[32px_40px_32px] h-[32px] items-center">
        <button
          class="flex transition-colors w-full h-full bg-white rounded-sm border-2 border-primary
            disabled:(border-gray-light opacity-50 cursor-not-allowed)"
          :aria-label="$t('enums.accessibility.role.REMOVE_FROM_CART')"
          @click="decreaseQuantity"
        >
          <VueSvgIcon class="m-auto" :data="subtractIcon" width="14" height="14" color="#992545" />
        </button>
        <span class="text-center">{{ item.quantity }}</span>
        <button
          class="flex transition-colors w-full h-full bg-white rounded-sm border-2 border-primary
               disabled:(border-gray-light opacity-50 cursor-not-allowed)"
          :disabled="!canAddMore"
          :aria-label="!canAddMore ? '' : $t('enums.accessibility.role.ADD_TO_CART')"
          @click="increaseQuantity"
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
          $n(Number(item.quantity * +item.merchandise.price.amount), 'currency', getLocaleFromCurrencyCode(item.merchandise.price.currencyCode))
        }}
      </span>
      <i18n-n
        v-if="finalPrice"
        class="block text-right" :value="item.quantity * finalPrice" :format="{ key: 'currency' }"
        :locale="getLocaleFromCurrencyCode(item.merchandise.price.currencyCode)"
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
    <div class="c-cartLineItem__cta absolute md:relative top-0 right-0">
      <ButtonIcon class="m-auto" :icon="deleteIcon" variant="icon" :size="28" @click.native="cartLinesRemove([item])" />
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
  width: 50px;
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
