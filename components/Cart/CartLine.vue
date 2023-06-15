<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import type { PropType } from '@nuxtjs/composition-api'
import deleteIcon from 'assets/svg/delete.svg'
import addIcon from 'assets/svg/add.svg'
import subtractIcon from 'assets/svg/subtract.svg'
import type { ICartLineItem } from '~/types/order'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<ICartLineItem>,
      required: true,
    },
    isLast: Boolean,
  },
  setup() {
    return {
      deleteIcon,
      addIcon,
      subtractIcon,
    }
  },
  computed: {
    userCartQuantity() {
      const isInCart = this.$store.state.userCart.userCart.find((el: { productVariantId: (string | undefined)[] }) =>
        el.productVariantId?.includes(this.item?.productVariantId),
      )

      return isInCart ? isInCart.quantity : 0
    },
    canAddMore() {
      return Number(this.item.totalInventory) - this.userCartQuantity > 0
    },
  },
  methods: {
    async increaseQuantity() {
      if (this.item.totalInventory === this.userCartQuantity)
        return

      this.$store.commit('userCart/addProduct', {
        id: this.item.productVariantId,
        gtmProductData: this.item.gtmProductData || {},
      })
    },
    async decreaseQuantity() {
      this.$store.commit('userCart/removeProduct', {
        id: this.item.productVariantId,
        gtmProductData: this.item.gtmProductData || {},
      })
    },
    async removeLine() {
      this.$store.commit('userCart/removeLine', {
        id: this.item.productVariantId,
        gtmProductData: !this.item.gtmProductData
          ? {}
          : {
              ...this.item.gtmProductData,
              quantity: this.item.quantity,
            },
      })
    },
  },
})
</script>

<template>
  <div
    class="c-cartLineItem mx-3 bg-white py-4 border-b border-b-gray-light"
  >
    <div class="c-cartLineItem__image">
      <img class="w-[min(100%,_46px)] m-inline-auto" :src="item.image" :alt="item.image">
    </div>
    <div class="c-cartLineItem__description">
      <p class="text-sm font-bold">
        {{ item.title }}
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
        <span class="text-center">{{ userCartQuantity }}</span>
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
        v-if="item.singleAmount !== item.singleAmountFullPrice"
        class="text-sm text-right text-gray"
        style="text-decoration: line-through"
      >
        {{ (item.quantity * item.singleAmountFullPrice).toFixed(2) }}
        {{ $config.STORE === 'CMW_UK' ? '£' : '€' }}
      </div>

      <div class="font-bold text-lg text-right">
        {{ (item.quantity * item.singleAmount).toFixed(2) }}
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
