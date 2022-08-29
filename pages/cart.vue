<template>
  <div class="container-fluid mt-5 pt-5">
    <div class="container-fluid px-md-5">
      <div class="row">
        <div class="col-12">
          <nuxt-link class="text-dark-red" to="/">Home</nuxt-link>
          <i class="fal fa-chevron-right mx-2"></i>
          Carrello
        </div>
      </div>
    </div>
    <div class="container-fluid px-md-5">
      <div class="row my-5">
        <div class="col-12 mb-3">
          <h2>Dettaglio carrello</h2>
        </div>
        <div class="col-12 col-md-7" v-if="cart">
          <div class="row">
            <div class="col-6">
              <p class="font-weight-bold mb-0">
                {{ cart.totalQuantity }} articoli
              </p>
            </div>
            <div class="col-6 text-right">
              <p class="text-light-red pointer" @click="showModal">
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
        <div class="col-12 col-md-5">
          <div class="card shadow border-0 w-75 mx-auto">
            <div class="card-body">
              <h5 class="card-title font-weight-bold">
                Totale carrello
                <span class="float-right">{{
                  Number(cart.cost.totalAmount.amount).toFixed(2)
                }}</span>
              </h5>
              <hr />
              <p>
                Se hai un <strong>codice sconto</strong> potrai inserirlo in
                seguito, prima del pagamento.
              </p>
              <p>
                Le <strong>spese di spedizione</strong> verranno aggiunte alla
                cassa, dopo aver scelto la modalità.
              </p>
              <a
                :href="cart.checkoutUrl"
                class="btn btn-light-red w-100 text-uppercase text-decoration-none text-center"
              >
                Vai alla cassa
              </a>
            </div>
          </div>
        </div>
      </div>
      <!-- {{ cart }} -->
    </div>

    <b-modal ref="modal" hide-header centered title="">
      <p class="text-center my-5 lead">Cancellare carrello?</p>
      <template #modal-footer class="border-0">
        <div class="w-100 d-flex justify-content-between">
          <button class="btn btn-outline-dark-red" @click="hideModal">
            Annulla
          </button>
          <button class="btn btn-dark-red" @click="removeCart">
            Si, cancella
          </button>
        </div>
      </template>
    </b-modal>
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
    showModal() {
      this.$refs["modal"].show();
    },
    hideModal() {
      this.$refs["modal"].hide();
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

      this.$refs["modal"].hide();
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

:deep(.modal-footer),
:deep(.modal-header) {
  border: 0px;
}
</style>
