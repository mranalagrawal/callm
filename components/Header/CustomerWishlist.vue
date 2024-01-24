<script lang="ts">
import { defineComponent, onMounted } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import heartIcon from '~/assets/svg/heart.svg'
import { useCustomer } from '~/store/customer'
import { useCustomerWishlist } from '~/store/customerWishlist'

export default defineComponent({
  name: 'CustomerWishlist',
  setup() {
    const { getCustomerWishlist } = useCustomerWishlist()
    const { customerId } = storeToRefs(useCustomer())
    const { favoritesCount } = storeToRefs(useCustomerWishlist())

    onMounted(async () => {
      // Todo: this implementation has an issue, mobile apps will not be able to use this
      if (customerId.value) {
        await getCustomerWishlist(customerId.value)
      }
    })

    return { customerId, favoritesCount, heartIcon }
  },
})
</script>

<template>
  <div class="relative hidden md:block">
    <div class="relative flex">
      <NuxtLink
        :to="localePath('/profile/wishlist')"
        class="peer transition-colors rounded py-3 px-6 bg-white text-center text-body hover:(bg-primary-900 text-white)"
      >
        <span class="relative">
          <VueSvgIcon
            class="block"
            :data="heartIcon"
            width="32px"
            height="32px"
          />
          <span
            class="block my-0 cmw-font-light text-sm"
            v-text="$t('navbar.favorites')"
          />
          <Badge
            v-if="favoritesCount"
            :qty="favoritesCount"
            bg-color="primary-400"
            class="transform absolute top-[-6px] right-[-4px]"
          />
        </span>
      </NuxtLink>
    </div>
  </div>
</template>
