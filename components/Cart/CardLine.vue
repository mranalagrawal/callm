<template>
  <div class="px-3 bg-white">
    <div class="row align-items-center">
      <div class="col-7 d-flex align-items-center">
        <img :src="item.image" alt="" style="width: 50px" />
        <p class="small font-weight-bold">
          {{ item.title }}
        </p>
      </div>
      <div class="col-2 d-flex justify-content-center align-items-center">
        <button class="btn btn-change-quantity" @click="decreaseQuantity">
          <i class="fal fa-minus"></i>
        </button>
        <p class="mb-0 mx-3">{{ userCartQuantity }}</p>
        <button class="btn btn-change-quantity" @click="increaseQuantity">
          <i class="fal fa-plus"></i>
        </button>
      </div>
      <div class="col-2">
        <p
          v-if="item.singleAmount !== item.singleAmountFullPrice"
          class="mb-0 small text-right text-muted"
          style="text-decoration: line-through"
        >
          {{ (item.quantity * item.singleAmountFullPrice).toFixed(2) }} €
        </p>

        <p class="mb-0 font-weight-bold text-right">
          {{ (item.quantity * item.singleAmount).toFixed(2) }} €
        </p>
      </div>
      <div class="col-1 text-right">
        <button class="btn">
          <i class="fal fa-trash-alt text-light-red" @click="remove()"></i>
        </button>
      </div>
      <div class="col-12">
        <hr class="w-75" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["item"],
  data() {
    return {
      quantity: this.item.quantity,
    };
  },
  computed: {
    userCartQuantity() {
      let isInCart = this.$store.state.userCart.userCart.find((el) =>
        el.productVariantId.includes(this.item.productVariantId)
      );

      return isInCart ? isInCart.quantity : 0;
    },
  },
  methods: {
    async increaseQuantity() {
      this.$store.commit("userCart/addProduct", {
        productVariantId: this.item.productVariantId,
      });
    },
    async decreaseQuantity() {
      this.$store.commit("userCart/removeProduct", this.item.productVariantId);
    },
    async remove() {
      this.$store.commit("userCart/removeLine", this.item.productVariantId);
    },
  },
};
</script>

<style scoped>
.btn-change-quantity {
  border-radius: 10px;
  width: 32px;
  height: 32px;
  border: 2px solid;
  background: white;
  color: #d94965;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
