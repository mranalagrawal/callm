<template>
  <div class="position-relative">
    <div>
      <button class="btn" @click="onSubmit" @mouseenter="show = true">
        <p class="mb-0">
          <b-icon icon="cart" aria-hidden="true"></b-icon>
        </p>
        <p class="mb-0" style="font-size: 12px">€ 500</p>
      </button>
      <div v-if="show" @mouseleave="show = false" class="content">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione
        commodi, incidunt tenetur itaque nostrum nam tempore minima distinctio
        omnis eligendi ut, debitis voluptatibus optio! Quo est natus sunt
        deleniti officia!
      </div>
    </div>
  </div>
</template>

<script>
import createCart from "../utilities/cart";

export default {
  data() {
    return {
      show: false,
    };
  },
  methods: {
    onSubmit(event) {
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
          .then((res) => console.log(res));
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
