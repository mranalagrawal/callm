<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import addIcon from 'assets/svg/add.svg'
import deleteIcon from 'assets/svg/delete.svg'
import subtractIcon from 'assets/svg/subtract.svg'
import { storeToRefs } from 'pinia'
import { useCustomer } from '~/store/customer'
import { useCustomerOrders } from '~/store/customerOrders.ts'
import { useShopifyCart } from '~/store/shopifyCart'
import { getLocaleFromCurrencyCode } from '~/utilities/currency'

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: true,
    },
    isLast: Boolean,
  },
  setup(props) {
    const customerStore = useCustomer()
    const customerOrders = useCustomerOrders()

    const { customerId } = storeToRefs(customerStore)
    const { getCanOrder } = customerOrders
    const { shopifyCart } = storeToRefs(useShopifyCart())
    const {
      addProductToCart,
      getFinalPrice,
      updateItemInCart,
    } = useShopifyCart()

    const finalPrice = getFinalPrice(props.item)

    const cartQuantity = computed(() => props.item.quantity)
    const canAddMore = computed(() => props.item.merchandise.product.isGiftCard
      || props.item.merchandise.product.totalInventory - cartQuantity.value > 0)
    const isOnSale = computed(() => finalPrice < +props.item.merchandise.price.amount)

    return {
      addIcon,
      addProductToCart,
      canAddMore,
      cartQuantity,
      customerId,
      deleteIcon,
      finalPrice,
      getCanOrder,
      getFinalPrice,
      isOnSale,
      shopifyCart,
      subtractIcon,
      updateItemInCart,
    }
  },
  methods: {
    getLocaleFromCurrencyCode,
    async increaseQuantity() {
      if (!this.canAddMore)
        return

      // const amountMax = JSON.parse(this.item.merchandise.product.details.value).amountMax[this.$config.SALECHANNEL]
      // const variantId = this.item.merchandise.id
      // const query = `processed_at:>${this.$dayjs().subtract(4, 'weeks').format('YYYY-MM-DD')}`
      // const { orderableQuantity } = await this.getCanOrder(variantId, amountMax, query)

      /* if (this.cartQuantity === orderableQuantity) {
        await SweetAlertToast.fire({
          icon: 'warning',
          text: this.$i18n.t('common.feedback.KO.maxQuantityReached'),
        })
        return
      } */

      this.shopifyCart = await this.addProductToCart(this.item, true)
    },
    async decreaseQuantity() {
      if (this.item.quantity === 0)
        return

      this.shopifyCart = await this.updateItemInCart(this.item, this.item.quantity - 1, true)
    },
    async removeLine() {
      this.shopifyCart = await this.updateItemInCart(this.item, 0, true)
    },
  },
})
</script>

<template>
  <div
    class="c-cartLineItem mx-3 bg-white py-4 border-b border-b-gray-light"
  >
    <div class="c-cartLineItem__image">
      <img :src="item.merchandise.product.featuredImage.url" alt="" style="height: 50px">
    </div>
    <div class="c-cartLineItem__description">
      <p class="text-sm font-bold">
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
          <span class="text-lg font-bold !leading-none">{{ slotProps.currency }}</span>
        </template>
        <template #integer="slotProps">
          <span class="text-lg font-bold !leading-none">{{ slotProps.integer }}</span>
        </template>
        <template #group="slotProps">
          <span class="text-lg font-bold !leading-none">{{ slotProps.group }}</span>
        </template>
        <template #fraction="slotProps">
          <span class="text-lg font-bold !leading-none">{{ slotProps.fraction }}</span>
        </template>
      </i18n-n>
    </div>
    <div class="c-cartLineItem__cta absolute md:relative top-0 right-0">
      <ButtonIcon class="m-auto" :icon="deleteIcon" variant="icon" :size="28" @click.native="removeLine" />
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
