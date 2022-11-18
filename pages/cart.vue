<template>
  <div class="container-fluid mt-5 pt-5">
    <div class="container-fluid px-md-5">
      <div class="row">
        <div class="col-12">
          <nuxt-link class="text-dark-secondary" to="/">Home</nuxt-link>
          <i class="fal fa-chevron-right mx-2"></i>
          Carrello
        </div>
      </div>
    </div>

    <client-only>
      <div
        class="container-fluid px-md-5"
        style="min-height: 600px"
        v-show="userCart && userCart.length > 0"
      >
        <div class="row my-5">
          <div class="col-12 mb-3">
            <h2>Dettaglio carrello</h2>
          </div>
          <div class="col-12 col-md-7">
            <div class="row">
              <div class="col-6">
                <p class="font-weight-bold mb-0">
                  {{ cartTotalQuantity }} articoli
                </p>
              </div>
              <div class="col-6 text-right">
                <p class="text-light-secondary pointer" @click="showModal">
                  Svuota carrello
                </p>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <hr class="" />
              </div>
            </div>
            <div v-for="item in userCart" :key="item.id">
              <CardLine :item="item" />
            </div>
          </div>
          <div class="col-12 col-md-5 px-0 px-md-5">
            <div class="card shadow border-0 mx-auto">
              <div class="card-body">
                <h5 class="card-title font-weight-bold">
                  Totale carrello
                  <span class="float-right">{{ cartTotalAmount }} GBP</span>
                </h5>
                <hr />
                <p>
                  Le <strong>spese di spedizione</strong> verranno aggiunte alla
                  cassa, dopo aver scelto la modalità.
                </p>
                <button
                  @click="checkout()"
                  class="btn w-100 text-white br-10 text-uppercase text-decoration-none text-center"
                  style="background: #d94965"
                >
                  Vai alla cassa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </client-only>

    <b-modal ref="modal" hide-header centered title="">
      <p class="text-center my-5 lead">Cancellare carrello?</p>
      <template #modal-footer class="border-0">
        <div class="w-100 d-flex justify-content-between">
          <button class="btn btn-outline-dark-secondary" @click="hideModal">
            Annulla
          </button>
          <button class="btn btn-dark-secondary" @click="removeCart">
            Si, cancella
          </button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import {
  createCart,
  addProductToCart,
  removeProductFromCart,
} from "../utilities/cart";
import CardLine from "../components/Cart/CardLine.vue";

export default {
  /* middleware: "auth", */
  layout(context) {
    return context.$config.STORE;
  },
  components: { CardLine },
  computed: {
    cart() {
      return this.$store.state.cart.cart;
    },
    userCart() {
      return this.$store.state.userCart.userCart;
    },
    cartTotalAmount() {
      const cart = this.$store.state.userCart.userCart;
      const total = cart
        .reduce((t, n) => t + n.quantity * n.singleAmount, 0)
        .toFixed(2);

      return total;
    },
    cartTotalQuantity() {
      const cart = this.$store.state.userCart.userCart;
      const total = cart.reduce((t, n) => t + n.quantity, 0);

      return total;
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
      this.$store.commit("userCart/resetCart");

      this.$refs["modal"].hide();
    },
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
      if (process.client) window.location = checkoutUrl;
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
