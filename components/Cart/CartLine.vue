<script>
import { defineComponent } from '@nuxtjs/composition-api'
import deleteIcon from 'assets/svg/delete.svg'
import addIcon from 'assets/svg/add.svg'
import subtractIcon from 'assets/svg/subtract.svg'
import { useShopifyCart } from '~/store/shopifyCart'

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: true,
    },
    isLast: Boolean,
  },
  setup() {
    const shopifyCart = useShopifyCart()
    return { shopifyCart, deleteIcon, addIcon, subtractIcon }
  },
  data() {
    return { quantity: this.item.quantity }
  },
  computed: {
    cartQuantity() {
      return this.item.quantity
    },
    canAddMore() {
      return this.item.merchandise.product.totalInventory - this.cartQuantity > 0
    },
    finalPrice() {
      return this.shopifyCart.getFinalPrice(this.item)
    },
  },
  methods: {
    async increaseQuantity() {
      if (!this.canAddMore)
        return

      const updated = await this.shopifyCart.addProductToCart(this.item, true)
      this.shopifyCart.shopifyCart = updated
    },
    async decreaseQuantity() {
      if (this.item.quantity === 0)
        return

      const updated = await this.shopifyCart.updateItemInCart(this.item, this.item.quantity - 1, true)
      this.shopifyCart.shopifyCart = updated
    },
    async removeLine() {
      const updated = await this.shopifyCart.updateItemInCart(this.item, 0, true)
      this.shopifyCart.shopifyCart = updated
    },
  },
})
</script>

<template>
  <div
    class="c-cartLineItem mx-3 bg-white py-4 border-b border-b-gray-light"
  >
    <div class="c-cartLineItem__image">
      <img :src="item.merchandise.product.images.nodes[0].url" alt="" style="height: 50px">
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
      <div
        v-if="finalPrice !== +item.merchandise.price.amount"
        class="text-sm text-right text-gray"
        style="text-decoration: line-through"
      >
        {{ (item.quantity * +item.merchandise.price.amount).toFixed(2) }}
        {{ $config.STORE === 'CMW_UK' ? '£' : '€' }}
      </div>

      <div class="font-bold text-lg text-right">
        {{ (item.quantity * finalPrice).toFixed(2) }}
        {{ $config.STORE === 'CMW_UK' ? '£' : '€' }}
      </div>
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
