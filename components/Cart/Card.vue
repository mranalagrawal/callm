<template>
  <div class="position-relative text-dark bg-light">
    <div v-if="data && data.length > 0" style="width: 640px">
      <div v-if="cartTotalAmount < 49">
        <p class="text-light-green small text-center text-uppercase py-3 mb-0">
          <i class="fal fa-truck mr-2"></i>
          Spedizione gratuita oltre i 49 €
        </p>
      </div>
      <div v-else>
        <p class="text-light-green small text-center text-uppercase py-3 mb-0">
          <i class="fal fa-check-circle mr-2"></i>
          hai diritto alla spedizione gratuita
        </p>
      </div>
      <div>
        <div v-for="item in data" :key="item.id">
          <CardLine :item="item" />
        </div>
      </div>
      <div class="row py-4 px-md-5">
        <div class="col-6">
          <nuxt-link class="btn btn-detail w-100" to="/cart">{{
            $t("navbar.cart.detail")
          }}</nuxt-link>
        </div>
        <div class="col-6">
          <button class="btn btn-checkout w-100" @click="checkout()">
            {{ $t("navbar.cart.checkout") }}
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-dark p-2" style="width: 440px">
      <p class="text-light-green small text-center text-uppercase py-3 mb-0">
        <i class="fal fa-truck mr-2"></i>
        Spedizione gratuita oltre i 49 €
      </p>
      <hr />
      <strong>{{ $t("navbar.cart.empty") }}</strong>
      <p class="my-4">{{ $t("navbar.cart.startFromMessage") }}</p>
      <nuxt-link to="/" class="btn btn-checkout text-uppercase w-100">{{
        $t("navbar.cart.cta")
      }}</nuxt-link>
    </div>
  </div>
</template>

<script>
import CardLine from "./CardLine.vue";
import { createCart, addProductToCart } from "../../utilities/cart";

export default {
  data() {
    return {
      data: null,
    };
  },
  components: { CardLine },
  computed: {
    cart() {
      return this.$store.state.cart.cart;
    },
    cartTotalAmount() {
      const cart = this.$store.state.userCart.userCart;
      const total = cart
        .reduce((t, n) => t + n.quantity * n.singleAmount, 0)
        .toFixed(2);

      return total;
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
    const userCart = this.$store.state.userCart.userCart;
    this.data = userCart;
  },
  methods: {
    async checkout() {
      // redirect if not user
      if (!this.$store.state.user.user) {
        this.$router.push("/login");
        return;
      }

      // crea carrello su shop
      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;
      const user = this.$store.state.user.user;
      const cart = await createCart(domain, access_token, user);
      const cartId = cart.id;

      // update in bulk del cart
      const lines = this.$store.state.userCart.userCart.map((el) => {
        return {
          merchandiseId: el.productVariantId,
          quantity: el.quantity,
        };
      });

      const cartFilled = await addProductToCart(
        domain,
        access_token,
        cartId,
        lines
      );
      // crea checkoutUrl
      let checkoutUrl = cartFilled.checkoutUrl + "/?";
      this.$store.state.user.user.customer.email &&
        (checkoutUrl += `&checkout[email]=${this.$store.state.user.user.customer.email}`);

      this.$store.state.user.user.customer.defaultAddress?.firstName &&
        (checkoutUrl += `&checkout[shipping_address][first_name]=${this.$store.state.user.user.customer.defaultAddress.firstName}`);

      this.$store.state.user.user.customer.defaultAddress?.lastName &&
        (checkoutUrl += `&checkout[shipping_address][last_name]=${this.$store.state.user.user.customer.defaultAddress.lastName}`);

      this.$store.state.user.user.customer.defaultAddress?.address1 &&
        (checkoutUrl += `&checkout[shipping_address][address1]=${this.$store.state.user.user.customer.defaultAddress.address1}`);

      this.$store.state.user.user.customer.defaultAddress?.address2 &&
        (checkoutUrl += `&checkout[shipping_address][address2]=${this.$store.state.user.user.customer.defaultAddress.address2}`);

      this.$store.state.user.user.customer.defaultAddress?.country &&
        (checkoutUrl += `&checkout[shipping_address][country]=${this.$store.state.user.user.customer.defaultAddress.country}`);

      this.$store.state.user.user.customer.defaultAddress?.province &&
        (checkoutUrl += `&checkout[shipping_address][province]=${this.$store.state.user.user.customer.defaultAddress.province}`);

      this.$store.state.user.user.customer.defaultAddress?.city &&
        (checkoutUrl += `&checkout[shipping_address][city]=${this.$store.state.user.user.customer.defaultAddress.city}`);

      this.$store.state.user.user.customer.defaultAddress?.zip &&
        (checkoutUrl += `&checkout[shipping_address][zip]=${this.$store.state.user.user.customer.defaultAddress.zip}`);
      // redirect al checkoutUrl

      window.location = checkoutUrl;
    },
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
