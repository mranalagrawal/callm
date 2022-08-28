<template>
  <div class="container-fluid mt-5 pt-5">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <nuxt-link class="text-dark-red" to="/">Home</nuxt-link>
          <i class="fal fa-chevron-right mx-2"></i>
          Carrello
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row my-5">
        <div class="col-12 mb-3">
          <h2>Dettaglio carrello</h2>
        </div>
        <div class="col-12 col-md-8" v-if="cart">
          <div class="row">
            <div class="col-6">
              <p class="font-weight-bold mb-0">
                {{ cart.totalQuantity }} articoli
              </p>
            </div>
            <div class="col-6 text-right">
              <p class="text-light-red pointer" @click="removeCart">
                Svuota carrello
              </p>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <hr class="" />
            </div>
          </div>
          <div v-for="item in cart.lines.edges" :key="item.node.id">
            <CartLine :item="item" />
            <hr />
          </div>
        </div>
        <div class="col-12 col-md-4"></div>
      </div>
      {{ cart }}
    </div>
  </div>
</template>

<script>
import { removeProductFromCart } from "../utilities/cart";

export default {
  middleware: "auth",
  computed: {
    cart() {
      return this.$store.state.cart.cart;
    },
  },

  methods: {
    async remove(lineId) {
      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;
      const cartId = this.$store.state.cart.cart.id;

      // remove from shopify
      const cart = await removeProductFromCart(
        domain,
        access_token,
        cartId,
        lineId
      );

      this.$store.commit("cart/setCart", cart);
    },
    async removeCart() {
      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;
      const cartId = this.$store.state.cart.cart.id;
      const lineIds = this.cart.lines.edges.map((el) => el.node.id);

      console.log(lineIds);
      // remove from shopify
      const cart = await removeProductFromCart(
        domain,
        access_token,
        cartId,
        lineIds
      );

      this.$store.commit("cart/setCart", cart);
    },
  },
};
</script>

<style scoped>
.btn-cart {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  color: white;
  background: #da4865;
}

.dropdown-cart {
  position: relative;
  display: inline-block;
}

.dropdown-cart-content {
  /* display: none; */
  position: absolute;
  bottom: 36px;
  background-color: #da4865;
  width: 100%;
  border-radius: 12px 12px 0 0;
  z-index: 1;
  height: 0px;
  overflow: hidden;
}

.dropdown-cart:hover .dropdown-cart-content {
  transition-duration: 0.4s;
  height: 120px;
  overflow: auto;
}
</style>
