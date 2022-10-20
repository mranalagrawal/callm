<template>
  <div class="px-4 pt-3 py-2 width">
    <p class="voice">
      <nuxt-link
        :to="localePath('/profile#orders')"
        class="text-decoration-none text-dark-red"
        >{{ $t("navbar.user.myOrders") }}</nuxt-link
      >
    </p>
    <p class="voice">
      <nuxt-link
        :to="localePath('/profile#buyagain')"
        class="text-decoration-none text-dark-red"
        >{{ $t("navbar.user.buyAgain") }}</nuxt-link
      >
    </p>
    <p class="voice">
      <nuxt-link
        :to="localePath('/profile#wishlist')"
        class="text-decoration-none text-dark-red"
        >{{ $t("navbar.user.favorites") }}</nuxt-link
      >
    </p>
    <p class="voice">
      <nuxt-link
        :to="localePath('/profile#addresses')"
        class="text-decoration-none text-dark-red"
        >{{ $t("navbar.user.addresses") }}</nuxt-link
      >
    </p>

    <p class="voice">
      <nuxt-link
        :to="localePath('/profile#accessData')"
        class="text-decoration-none text-dark-red"
        >{{ $t("navbar.user.accessData") }}</nuxt-link
      >
    </p>

    <div class="mt-5">
      <button @click="logout" class="btn btn-outline-light-red br-10 w-100">
        {{ $t("navbar.user.logout") }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
        remember: false,
      },
    };
  },
  methods: {
    logout() {
      this.$store.commit("user/setUser", null);
      this.$store.commit("cart/setCart", null);
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
:deep(form) {
  width: 340px;
}
.menu-link:hover {
  color: var(--dark-red);
  font-weight: bold;
}

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
