<template>
  <div class="position-relative text-dark bg-light">
    <div v-if="cart && cart.lines.edges.length > 0">
      <div v-if="cartTotalAmount < 49">
        <p class="text-light-green small text-center text-uppercase py-3 mb-0">
          <i class="fal fa-truck mr-2"></i> Spedizione in Italia in 1 - 2 giorni
          lavorativi
        </p>
      </div>
      <div v-else>
        <p class="text-light-green small text-center text-uppercase py-3 mb-0">
          <i class="fal fa-check-circle mr-2"></i> hai diritto alla spedizione
          gratuita
        </p>
      </div>

      <div v-for="item in cart.lines.edges" :key="item.node.id">
        <CartLine :item="item" />
      </div>
      <div class="row py-4 px-md-5">
        <div class="col-6">
          <nuxt-link class="btn btn-detail w-100" to="/cart">{{
            $t("navbar.cart.detail")
          }}</nuxt-link>
        </div>
        <div class="col-6">
          <a class="btn btn-checkout w-100" :href="checkoutUrl">{{
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
    return {
      data: null,
    };
  },
  computed: {
    cart() {
      return this.$store.state.cart.cart;
    },
    cartTotalAmount() {
      if (this.$store.state.cart.cart) {
        return this.$store.state.cart.cart.cost.totalAmount.amount;
      } else {
        return 0;
      }
    },
    checkoutUrl() {
      let baseUrl = this.cart.checkoutUrl + "/?";

      this.$store.state.user.user.customer.email &&
        (baseUrl += `&checkout[email]=${this.$store.state.user.user.customer.email}`);

      this.$store.state.user.user.customer.defaultAddress?.firstName &&
        (baseUrl += `&checkout[shipping_address][first_name]=${this.$store.state.user.user.customer.defaultAddress.firstName}`);

      this.$store.state.user.user.customer.defaultAddress?.lastName &&
        (baseUrl += `&checkout[shipping_address][last_name]=${this.$store.state.user.user.customer.defaultAddress.lastName}`);

      this.$store.state.user.user.customer.defaultAddress?.address1 &&
        (baseUrl += `&checkout[shipping_address][address1]=${this.$store.state.user.user.customer.defaultAddress.address1}`);

      this.$store.state.user.user.customer.defaultAddress?.address2 &&
        (baseUrl += `&checkout[shipping_address][address2]=${this.$store.state.user.user.customer.defaultAddress.address2}`);

      this.$store.state.user.user.customer.defaultAddress?.country &&
        (baseUrl += `&checkout[shipping_address][country]=${this.$store.state.user.user.customer.defaultAddress.country}`);

      this.$store.state.user.user.customer.defaultAddress?.province &&
        (baseUrl += `&checkout[shipping_address][province]=${this.$store.state.user.user.customer.defaultAddress.province}`);

      this.$store.state.user.user.customer.defaultAddress?.city &&
        (baseUrl += `&checkout[shipping_address][city]=${this.$store.state.user.user.customer.defaultAddress.city}`);

      this.$store.state.user.user.customer.defaultAddress?.zip &&
        (baseUrl += `&checkout[shipping_address][zip]=${this.$store.state.user.user.customer.defaultAddress.zip}`);

      return baseUrl;
    },
  },
  async fetch() {
    let lang = "";
    if (this.$i18n.locale == "en") {
      lang = "en-gb";
    } else {
      lang = "it-it";
    }
    const response = await this.$prismic.api.getSingle("shipping", {
      lang: lang,
    });
    const data = response.data.body;
    this.data = data;

    console.log(data, "datas");
  },
};
</script>

<style scoped>
.btn-detail {
  border: 2px solid #da4865;
  border-radius: 12px;
  color: #da4865;
  text-transform: uppercase;
  font-weight: bold;
}

.btn-checkout {
  border: 2px solid #da4865;
  background: #da4865;
  border-radius: 12px;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
}

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
