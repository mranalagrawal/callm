<script lang="ts">
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import { useCustomer } from '~/store/customer'

import type { ICollection } from '~/types/collection'
import { initialCollectionData } from '~/types/collection'

export default defineComponent({
  setup() {
    const { getCustomerType } = storeToRefs(useCustomer())
    const collectionRef = ref<ICollection>(initialCollectionData)

    useFetch(async ({ $cmwRepo }) => {
      collectionRef.value = await $cmwRepo.products.getCollectionsByHandle({
        handle: 'prosegui-i-tuoi-acquisti-con',
        first: 12,
      })
    })

    return {
      collectionRef,
      getCustomerType,
    }
  },
})
</script>

<template>
  <div>
    <p v-if="$fetchState.pending" class="px-4">
      {{ $t("loading") }}
    </p>
    <template v-else>
      <CarouselProducts
        v-if="!!collectionRef.products?.length" :products="collectionRef.products"
        :title="$t('common.carousel.emptyCart')"
      />
    </template>
  </div>
</template>
