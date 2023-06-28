<script lang="ts">
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import ratingEmpty from 'assets/svg/rating-empty.svg'
import ratingFilled from 'assets/svg/rating-filled.svg'
import { useCustomer } from '~/store/customer'

interface IRating {
  description: string | null
  id: number
  productFeId: number
  productId: number
  score: number | null
  shopifyCustomerId: number
  shopifyStoreId: number
}

export default defineComponent({
  props: {
    productId: {
      type: String,
      required: true,
    },
  },
  emits: ['click-star'],
  setup(props, { emit }) {
    const customerStore = useCustomer()
    const { customerWishlistProducts } = storeToRefs(customerStore)
    const currentHoveredStar = ref(0)

    const handleStarClick = (rating = 0) => {
      emit('click-star', rating)
    }

    const currentProduct = computed<IRating | undefined>(() => customerWishlistProducts.value.find(
      (w: Record<string, any>) => w.productFeId.toString() === props.productId.toString()))

    const currentRating = computed(() => currentProduct.value?.score || 0)

    return {
      currentHoveredStar,
      currentProduct,
      currentRating,
      customerWishlistProducts,
      handleStarClick,
      ratingEmpty,
      ratingFilled,
    }
  },
})
</script>

<template>
  <div>
    <div class="flex">
      <button
        v-for="n in 5" :key="n" class="text-primary-400" @click="() => handleStarClick(n)" @mouseenter="currentHoveredStar = n"
        @mouseleave="currentHoveredStar = 0"
      >
        <VueSvgIcon
          :data="(currentHoveredStar && currentHoveredStar >= n) || (!currentHoveredStar && currentRating >= n)
            ? ratingFilled : ratingEmpty" width="20" height="20"
        />
      </button>
    </div>
  </div>
</template>
