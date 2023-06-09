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
  <div class="cmw-px-4 cmw-py-2">
    <NuxtLink
      :to="localePath('/profile/my-orders')"
      class="cmw-block cmw-py-4 cmw-no-underline cmw-text-primary-900 cmw-border-b cmw-border-b-gray-light"
    >
      {{ $t("navbar.user.myOrders") }}
    </NuxtLink>
    <NuxtLink
      :to="localePath('/profile/buy-again')"
      class="cmw-block cmw-py-4 cmw-no-underline cmw-text-primary-900 cmw-border-b cmw-border-b-gray-light"
    >
      {{ $t("navbar.user.buyAgain") }}
    </NuxtLink>
    <NuxtLink
      :to="localePath('/profile/wishlist')"
      class="cmw-block cmw-py-4 cmw-no-underline cmw-text-primary-900 cmw-border-b cmw-border-b-gray-light"
    >
      {{ $t("navbar.user.favorites") }}
    </NuxtLink>
    <NuxtLink
      :to="localePath('/profile/addresses')"
      class="cmw-block cmw-py-4 cmw-no-underline cmw-text-primary-900 cmw-border-b cmw-border-b-gray-light"
    >
      {{ $t("navbar.user.addresses") }}
    </NuxtLink>
    <NuxtLink
      :to="localePath('/profile/access-data')"
      class="cmw-block cmw-py-4 cmw-no-underline cmw-text-primary-900 cmw-border-b cmw-border-b-gray-light"
    >
      {{ $t("navbar.user.accessData") }}
    </NuxtLink>
    <Button
      variant="ghost"
      class="cmw-mt-10"
      :label="$t('navbar.user.logout')"
      @click.native="logout"
    />
  </div>
</template>
