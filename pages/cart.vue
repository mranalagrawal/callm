<template>
  <div class="container-fluid mt-5 pt-5">
    {{ cart }}
    <div class="row my-5">
      <div class="col-6" v-if="cart">
        <div v-for="item in cart.lines.edges" :key="item.node.id">
          <CartLine :item="item" />
        </div>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-6" v-if="cart">{{ cart.lines.edges }}</div>
      <div class="col-6" v-if="cart">
        <div
          class="row align-items-center"
          v-for="item in cart.lines.edges"
          :key="item.node.id"
        >
          <div class="col-4 d-flex">
            <img
              :src="item.node.merchandise.product.images.nodes[0].url"
              alt=""
              style="width: 40px"
            />
            <p class="">{{ item.node.merchandise.product.title }}</p>
          </div>
          <div class="col-4 d-flex justify-content-center align-items-center">
            <button class="btn btn-sm btn-outline-light-red">
              <i class="fal fa-plus"></i>
            </button>
            <p class="mb-0 mx-2">{{ item.node.quantity }}</p>
            <button class="btn btn-sm btn-outline-light-red">
              <i class="fal fa-minus"></i>
            </button>
          </div>
          <div class="col-2">
            <p class="mb-0 font-weight-bold text-right">
              {{
                (item.node.merchandise.price * item.node.quantity).toFixed(2)
              }}
            </p>
          </div>
          <div class="col-2 text-right">
            <button class="btn">
              <i
                class="fas fa-trash text-light-red"
                @click="remove(item.node.id)"
              ></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { removeProductFromCart } from "../utilities/cart";

export default {
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

      // remove from state
      // this.$store.commit("cart/removeLineFromCart", e);

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
