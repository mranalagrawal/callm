<script>
import { useCustomer } from '~/store/customer'

export default {
  setup() {
    const customerStore = useCustomer()
    const { logout } = customerStore
    return { logout }
  },
}
</script>

<template>
  <div class="px-4 pt-3 py-2 width">
    <p class="voice">
      <nuxt-link
        :to="localePath('/profile/my-orders')"
        class="text-decoration-none text-dark-secondary"
      >
        {{ $t("navbar.user.myOrders") }}
      </nuxt-link>
    </p>
    <p class="voice">
      <nuxt-link
        :to="localePath('/profile/buy-again')"
        class="text-decoration-none text-dark-secondary"
      >
        {{ $t("navbar.user.buyAgain") }}
      </nuxt-link>
    </p>
    <p class="voice">
      <nuxt-link
        :to="localePath('/profile/wishlist')"
        class="text-decoration-none text-dark-secondary"
      >
        {{ $t("navbar.user.favorites") }}
      </nuxt-link>
    </p>
    <p class="voice">
      <nuxt-link
        :to="localePath('/profile/addresses')"
        class="text-decoration-none text-dark-secondary"
      >
        {{ $t("navbar.user.addresses") }}
      </nuxt-link>
    </p>

    <p class="voice">
      <nuxt-link
        :to="localePath('/profile/access-data')"
        class="text-decoration-none text-dark-secondary"
      >
        {{ $t("navbar.user.accessData") }}
      </nuxt-link>
    </p>

    <div class="mt-5">
      <button
        class="btn btn-outline-light-secondary br-10 w-100"
        @click="logout"
      >
        {{ $t("navbar.user.logout") }}
      </button>
    </div>
  </div>
</template>

<style scoped>
@media screen and (max-width: 768px) {
  .voice {
    padding-bottom: 18px;
    border-bottom: 1px solid #ddd;
  }
}

@media screen and (min-width: 768px) {
  .width {
    width: 340px;
  }
}
</style>
