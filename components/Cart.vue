<template>
  <div class="position-relative">
    <div>
      <button class="btn" @click="createCart">Crea</button>
      <button class="btn" @click="getCart">Get cart</button>
    </div>
  </div>
</template>

<script>
import { createCart, getCart } from "../utilities/cart";

export default {
  data() {
    return {
      show: false,
    };
  },
  methods: {
    createCart(event) {
      event.preventDefault();
      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;
      if (process.client) {
        const user = JSON.parse(localStorage.getItem("call-me-wine-user"));
        console.log(user.token);
        const cartQuery = createCart(user.token);
        console.log(cartQuery);

        const GRAPHQL_BODY_USER = {
          async: true,
          crossDomain: true,
          method: "POST",
          headers: {
            "X-Shopify-Storefront-Access-Token": access_token,
            "Content-Type": "application/json",
          },
          body: cartQuery,
        };

        fetch(domain, GRAPHQL_BODY_USER)
          .then((res) => res.json())
          .then((res) => {
            const cartId = res.data.cartCreate.cart.id;
            if (process.client) {
              console.log(res, "cartId from create");
              localStorage.setItem("call-me-wine-cart", JSON.stringify(cartId));
            }
          });
      }
    },
    getCart(event) {
      event.preventDefault();
      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;
      if (process.client) {
        const cartId = JSON.parse(localStorage.getItem("call-me-wine-cart"));
        console.log(cartId, "cartId from storage");
        const retrievedCart = getCart(cartId);
        console.log(retrievedCart, "Retrieved Cart");

        const GRAPHQL_BODY_CART = {
          async: true,
          crossDomain: true,
          method: "POST",
          headers: {
            "X-Shopify-Storefront-Access-Token": access_token,
            "Content-Type": "application/graphql",
          },
          body: retrievedCart,
        };

        fetch(domain, GRAPHQL_BODY_CART)
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
          });
        /* const cartQuery = createCart(user.token);
        console.log(cartQuery);

        const GRAPHQL_BODY_USER = {
          async: true,
          crossDomain: true,
          method: "POST",
          headers: {
            "X-Shopify-Storefront-Access-Token": access_token,
            "Content-Type": "application/json",
          },
          body: cartQuery,
        };

        fetch(domain, GRAPHQL_BODY_USER)
          .then((res) => res.json())
          .then((res) => console.log(res)); */
      }
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
