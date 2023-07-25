<script lang="ts">
import { defineComponent, onMounted, useContext } from '@nuxtjs/composition-api'
import { useShopifyCart } from '~/store/shopifyCart'

export default defineComponent({
  layout({ $config }) {
    return $config.STORE
  },
  setup() {
    const { $cookies } = useContext()

    const shopifyCart = useShopifyCart()

    onMounted(() => {
      $cookies.set('cartId', '')
      shopifyCart.$reset()
    })
  },
})
</script>

<template>
  <div class="mt-12 max-w-screen-xl mx-auto <md:px-4">
    <h1>Thank you for your order!</h1>
  </div>
</template>
