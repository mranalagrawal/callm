<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useCustomer } from '~/store/customer'

export default defineComponent({
  setup() {
    const customerStore = useCustomer()
    const { logout } = customerStore
    return { logout }
  },
})
</script>

<template>
  <div class="px-4 py-2">
    <NuxtLink
      exact-active-class="text-primary-400"
      :to="localePath('/profile/my-orders')"
      class="block py-4 border-b border-b-gray-light"
    >
      {{ $t("navbar.user.myOrders") }}
    </NuxtLink>
    <NuxtLink
      exact-active-class="text-primary-400"
      :to="localePath('/profile/buy-again')"
      class="block py-4 border-b border-b-gray-light"
    >
      {{ $t("navbar.user.buyAgain") }}
    </NuxtLink>
    <NuxtLink
      exact-active-class="text-primary-400"
      :to="localePath('/profile/wishlist')"
      class="block py-4 border-b border-b-gray-light"
    >
      {{ $t("navbar.user.favorites") }}
    </NuxtLink>
    <NuxtLink
      exact-active-class="text-primary-400"
      :to="localePath('/profile/addresses')"
      class="block py-4 border-b border-b-gray-light"
    >
      {{ $t("navbar.user.addresses") }}
    </NuxtLink>
    <NuxtLink
      exact-active-class="text-primary-400"
      :to="localePath('/profile/access-data')"
      class="block py-4 border-b border-b-gray-light"
    >
      {{ $t("navbar.user.accessData") }}
    </NuxtLink>
    <NuxtLink
      exact-active-class="text-primary-400"
      :to="localePath('/profile/billing')"
      class="block py-4 border-b border-b-gray-light"
    >
      {{ $t("navbar.user.billing") }}
    </NuxtLink>
    <CmwButton
      variant="ghost"
      class="mt-10"
      :label="$t('common.cta.logout')"
      @click.native="logout"
    />
  </div>
</template>
