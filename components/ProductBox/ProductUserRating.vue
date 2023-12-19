<script lang="ts">
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import ratingEmpty from 'assets/svg/rating-empty.svg'
import ratingFilled from 'assets/svg/rating-filled.svg'
import { useCustomerWishlist } from '~/store/customerWishlist'
import type { IProductRating } from '~/types/product'

export default defineComponent({
  name: 'ProductUserRating',
  props: {
    productId: {
      type: [Number, String],
      required: true,
    },
  },
  emits: ['click-star'],
  setup(props, { emit }) {
    const customerWishlist = useCustomerWishlist()
    const { elements } = storeToRefs(customerWishlist)
    const currentHoveredStar = ref(0)

    const currentProduct = computed<IProductRating | undefined>(() => elements.value.find(
      (w: Record<string, any>) => `'P${props.productId}'` === `'P${w.productFeId}'`))

    const currentRating = computed(() => currentProduct.value?.score || 0)

    const handleStarClick = (score = 0) => {
      emit('click-star', {
        score,
        description: currentProduct.value?.description || '',
      })
    }

    return {
      currentHoveredStar,
      currentProduct,
      currentRating,
      elements,
      handleStarClick,
      ratingEmpty,
      ratingFilled,
    }
  },
})
</script>

<template>
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
</template>
