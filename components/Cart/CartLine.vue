<script>
import deleteIcon from 'assets/svg/delete.svg'
import addIcon from 'assets/svg/add.svg'
import subtractIcon from 'assets/svg/subtract.svg'

export default {
  name: 'CartLine',
  props: {
    item: Object,
    isLast: Boolean,
  },
  data() {
    return {
      deleteIcon,
      addIcon,
      subtractIcon,
      quantity: this.item.quantity,
    }
  },
  computed: {
    userCartQuantity() {
      const isInCart = this.$store.state.userCart.userCart.find(el =>
        el.productVariantId?.includes(this.item.productVariantId),
      )

      return isInCart ? isInCart.quantity : 0
    },
    canAddMore() {
      return this.item.totalInventory - this.userCartQuantity > 0
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
}
</script>

<template>
  <div class="px-3 bg-white">
    <div class="row align-items-md-center">
      <div class="col-10 col-md-7 d-flex align-items-md-center mb-3 mb-md-0">
        <img :src="item.image" alt="" style="width: 50px">
        <p class="small font-weight-bold">
          {{ item.title }}
        </p>
      </div>
      <div class="col-2 d-md-none mb-3">
        <ButtonIcon :icon="deleteIcon" variant="icon" :size="22" @click.native="removeLine" />
      </div>
      <div
        class="col-4 offset-2 offset-md-0 col-md-2"
      >
        <div class="cmw-grid cmw-grid-cols-[32px_auto_32px] cmw-h-[32px] cmw-items-center">
          <button
            class="cmw-flex cmw-transition-colors cmw-w-full cmw-h-full cmw-bg-white cmw-rounded-sm cmw-border-2 cmw-border-primary
            disabled:(cmw-border-gray-light cmw-opacity-50 cmw-cursor-not-allowed)"
            :aria-label="$t('enums.accessibility.role.REMOVE_FROM_CART')"
            @click="decreaseQuantity"
          >
            <VueSvgIcon class="cmw-m-auto" :data="subtractIcon" width="14" height="14" color="#992545" />
          </button>
          <span class="mb-0 mx-3">{{ userCartQuantity }}</span>
          <button
            class="cmw-flex cmw-transition-colors cmw-w-full cmw-h-full cmw-bg-white cmw-rounded-sm cmw-border-2 cmw-border-primary
               disabled:(cmw-border-gray-light cmw-opacity-50 cmw-cursor-not-allowed)"
            :disabled="!canAddMore"
            :aria-label="!canAddMore ? '' : $t('enums.accessibility.role.ADD_TO_CART')"
            @click="increaseQuantity"
          >
            <VueSvgIcon class="cmw-m-auto" :data="addIcon" width="14" height="14" color="#992545" />
          </button>
        </div>
      </div>
      <div class="col-6 col-md-2">
        <p
          v-if="item.singleAmount !== item.singleAmountFullPrice"
          class="mb-0 small text-right text-muted"
          style="text-decoration: line-through"
        >
          {{ (item.quantity * item.singleAmountFullPrice).toFixed(2) }}
          {{ $config.STORE === 'CMW_UK' ? '£' : '€' }}
        </p>

        <p class="mb-0 font-weight-bold text-right">
          {{ (item.quantity * item.singleAmount).toFixed(2) }}
          {{ $config.STORE === 'CMW_UK' ? '£' : '€' }}
        </p>
      </div>
      <div class="d-none d-md-block col-md-1 text-right">
        <ButtonIcon :icon="deleteIcon" variant="icon" :size="22" @click.native="removeLine" />
      </div>
      <div v-if="!isLast" class="col-12">
        <hr class="cmw-w-11/12 ml-auto">
      </div>
    </div>
  </div>
</template>
