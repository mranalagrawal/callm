<template>
  <div class="">
    <div class="row align-items-center">
      <div class="col-4 d-flex align-items-center">
        <img
          :src="item.node.merchandise.product.images.nodes[0].url"
          alt=""
          style="width: 40px"
        />
        <p class="">{{ item.node.merchandise.product.title }}</p>
      </div>
      <div class="col-4 d-flex justify-content-center align-items-center">
        <button
          class="btn btn-sm btn-outline-light-red"
          @click="increaseQuantity"
        >
          <i class="fal fa-plus"></i>
        </button>
        <p class="mb-0 mx-2 small">{{ quantity }}</p>
        <button
          class="btn btn-sm btn-outline-light-red"
          @click="decreaseQuantity"
        >
          <i class="fal fa-minus"></i>
        </button>
      </div>
      <div class="col-2">
        <p class="mb-0 small font-weight-bold text-right">
          {{ (item.node.merchandise.price * quantity).toFixed(2) }}
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
</template>

<script>
import { removeProductFromCart, updateItemInCart } from "../../utilities/cart";

export default {
  props: ["item"],
  data() {
    return {
      quantity: this.item.node.quantity,
    };
  },

  methods: {
    async increaseQuantity() {
      this.quantity++;
      // update shopify
      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;
      const cartId = this.$store.state.cart.cart.id;
      const lineId = this.item.node.id;
      console.log(lineId, "lineId");

      const cart = await updateItemInCart(
        domain,
        access_token,
        lineId,
        cartId,
        this.quantity
      );
      this.$store.commit("cart/setCart", cart);
    },
    async decreaseQuantity() {
      if (this.quantity == 1) return;
      this.quantity--;

      // update shopify
      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;
      const cartId = this.$store.state.cart.cart.id;
      const lineId = this.item.node.id;
      console.log(lineId, "lineId");

      const cart = await updateItemInCart(
        domain,
        access_token,
        lineId,
        cartId,
        this.quantity
      );
      this.$store.commit("cart/setCart", cart);
    },
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
      this.flashMessage.show({
        status: "",
        message: "Prodotto rimosso!",
        time: 1000,
        blockClass: "remove-product-notification",
      });
    },
  },
};
</script>

<style scoped></style>
