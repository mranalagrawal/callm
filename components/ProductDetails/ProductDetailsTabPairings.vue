<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

import { getUniqueListBy } from '~/utilities/arrays'
import { generateKey } from '~/utilities/strings'

export default defineComponent({
  props: {
    productDetails: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const productDetailsFoodPairings = computed(() => props.productDetails && getUniqueListBy(props.productDetails.foodPairings, 'id'))
    return { productDetailsFoodPairings }
  },
  methods: { generateKey },
})
</script>

<template>
  <div class="mt-6">
    <h3 class="mb-5">
      {{ $t('product.pairingsTitle') }}
    </h3>

    <div v-if="productDetailsFoodPairings.length" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div
        v-for="pairing in productDetailsFoodPairings"
        :key="generateKey(`food-pairing-${pairing.id}`)"
      >
        <img
          :src="pairing.image"
          class="w-full rounded"
          style="border-radius: 10px"
          alt="alt text"
        >
        <p>{{ pairing.name[$i18n.locale] }}</p>
      </div>
    </div>
  </div>
</template>
