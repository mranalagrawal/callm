<template>
  <div class="position-relative text-dark">
    <div v-if="cart && cart.lines.edges.length > 0">
      <div v-for="item in cart.lines.edges" :key="item.node.id">
        <CartLine :item="item" />
      </div>
      <div class="row mt-4">
        <div class="col-6">
          <nuxt-link class="btn btn-outline-dark-red w-100" to="/cart">{{
            $t("navbar.cart.detail")
          }}</nuxt-link>
        </div>
        <div class="col-6">
          <a class="btn btn-dark-red w-100" :href="cart.checkoutUrl">{{
            $t("navbar.cart.checkout")
          }}</a>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-dark">
      <strong>{{ $t("navbar.cart.empty") }}</strong>
      <p class="my-4">{{ $t("navbar.cart.startFromMessage") }}</p>
      <nuxt-link to="/" class="btn btn-light-red text-uppercase w-100">{{
        $t("navbar.cart.cta")
      }}</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    cart() {
      return this.$store.state.cart.cart;
    },
  },
};
</script>

<style scoped>
:deep(.dropdown-toggle::after) {
  display: none;
}
:deep(.btn-secondary) {
  background-color: var(--dark-red) !important;
  border-color: var(--dark-red) !important;
}
.content {
  position: absolute;
  /* left: -275px; */
  width: 320px;
  transform: translate(-240px, 20px);
  z-index: 99;
  border-top: 4px solid var(--dark-red);
  padding-bottom: 0px;
  background: white;
}
</style>
