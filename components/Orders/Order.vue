<template>
  <div class="mb-3 order-line" :class="visible ? 'shadow' : ''">
    <div
      class="d-flex flex-row py-4 pointer bg-light"
      :class="visible ? '' : 'collapsed'"
      @click="visible = !visible"
    >
      <div class="col-1">
        <strong>{{ order.orderNumber }}</strong>
      </div>
      <div class="col-2">{{ order.processedAt.split("T")[0] }}</div>
      <div class="col-2">
        {{ totalItems }}
      </div>
      <div class="col-2">
        {{ order.totalPrice }}
      </div>
      <div class="col-2">
        {{ order.fulfillmentStatus }}
      </div>
      <div class="col-2">
        {{ order.financialStatus }}
      </div>
      <div class="col-1 text-right">
        <i
          class="fal fa-chevron-down text-dark-red"
          :class="visible ? 'fa-rotate-180' : ''"
        ></i>
      </div>
    </div>

    <b-collapse v-model="visible" class="row px-5 mt-5">
      <div class="col-12">
        <div class="row bg-light pt-3">
          <div class="col-12 col-md-4">
            <p class="font-weight-bold lead">Riepilogo</p>
            <p class="text-light-green">Stato dell'ordine: XXX</p>
            <p class="text-light-green">Spedizione: XXX</p>
            <p class="text-light-green">Telefono: XXX</p>
          </div>
          <div class="col-12 col-md-4">
            <p class="font-weight-bold lead">Indirizzo di spedizione</p>
            <p>Lorem ipsum dolor sit amet consectetur.</p>
          </div>
          <div class="col-12 col-md-4">
            <p class="font-weight-bold lead">Note di consegna</p>
            <p>Lorem ipsum dolor sit.</p>
          </div>
        </div>
      </div>
      <div class="col-12 mt-5">
        <div class="row">
          <div class="col-12 col-md-4">
            <p v-if="order.lineItems.edges.length == 1">
              <strong>{{ order.lineItems.edges.length }}</strong> articolo
            </p>
            <p v-else>
              <strong>{{ order.lineItems.edges.length }}</strong> articoli
            </p>
          </div>
          <div class="col-12 col-md-8 text-right">
            <button class="btn text-light-red" @click="showModal">
              RICHIEDI ASSISTENZA
            </button>
            <button class="btn btn-light-red" @click="orderAgain">
              ORDINA DI NUOVO
            </button>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div
          class="row align-items-center mb-3"
          v-for="item in order.lineItems.edges"
          :key="item.node.variant.id"
        >
          <div class="col-1">
            <img
              :src="item.node.variant.product.images.nodes[0].url"
              alt=""
              style="width: 40px"
            />
          </div>
          <div class="col-8">
            <strong>{{ item.node.title }}</strong>
          </div>
          <div class="col-1">x{{ item.node.quantity }}</div>
          <div class="col-2 text-right">
            <!-- <p class="text-barred mb-0 text-muted">
              {{
                Number(
                  item.node.variant.product.compareAtPriceRange.maxVariantPrice
                    .amount * item.node.quantity
                ).toFixed(2)
              }}
            </p>
            <p class="mb-0">
              {{ Number(item.node.originalTotalPrice.amount).toFixed(2) }}
            </p> -->
          </div>
          <div class="col-12">
            <hr class="mb-0 mt-2" />
          </div>
        </div>
      </div>
    </b-collapse>

    <b-modal ref="modal" size="lg" hide-header centered title="">
      <p class="text-center mt-5 mb-2 lead text-light-green">
        Richiedi assistenza per l'ordine N° {{ order.orderNumber }}
      </p>
      <p class="text-center">
        Inviaci un messaggio e se necessario allega la documentazione in tuo
        possesso. <br />
        Ti risponderemo prima possibile.
      </p>

      <form @submit="onSubmit" class="px-4 pt-3 py-2 w-75 mx-auto">
        <b-form-group class="my-4">
          <label class="custom-label" for="input-1">Email</label>
          <b-form-textarea
            class="custom-input"
            v-model="form.message"
            required
            rows="3"
            max-rows="6"
          ></b-form-textarea>
          <!-- <b-form-input
            id="name"
            class="custom-input"
            v-model="form.message"
            type="text"
            required
          ></b-form-input> -->
        </b-form-group>
      </form>

      {{ form }}

      <template #modal-footer class="border-0">
        <div class="w-100 text-center">
          <button class="btn btn-light-red btn-lg px-5">INVIA</button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { createCart, addProductToCart } from "../../utilities/cart";

export default {
  props: ["order"],
  data() {
    return {
      visible: false,
      form: {
        message: "",
        sender: {
          firstName: this.$store.state.user.user.customer.firstName,
          lastName: this.$store.state.user.user.customer.lastName,
          email: this.$store.state.user.user.customer.email,
        },
        order: this.order.orderNumber,
      },
    };
  },
  computed: {
    totalItems() {
      return this.order.lineItems.edges
        .map((el) => el.node.quantity)
        .reduce((t, n) => t + n);
    },
  },
  methods: {
    async onSubmit(e) {
      e.preventDefault();
    },
    showModal() {
      this.$refs["modal"].show();
    },
    hideModal() {
      this.$refs["modal"].hide();
    },
    async orderAgain() {
      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;

      console.log(this.order.lineItems.edges);

      const variantIds = this.order.lineItems.edges.map(
        (el) => el.node.variant.id
      );

      const quantities = this.order.lineItems.edges.map(
        (el) => el.node.quantity
      );

      console.log(quantities);
      const lines = this.order.lineItems.edges.map((el) => {
        return {
          quantity: el.node.quantity,
          merchandiseId: el.node.variant.id,
        };
      });

      console.log(lines);

      if (!this.$store.state.cart.cart) {
        /* alert("creo carrello"); */
        // crea cart su shopify
        const user = this.$store.state.user.user;
        const cart = await createCart(domain, access_token, user);

        // crea cart su vuex
        this.$store.commit("cart/setCart", cart);
      }

      const cartId = this.$store.state.cart.cart.id;

      const all = await addProductToCart(domain, access_token, cartId, lines);

      this.$store.commit("cart/setCart", all);
      this.flashMessage.show({
        status: "",
        message: "Prodotto aggiunto!",
        time: 1000,
        blockClass: "add-product-notification",
      });
    },
  },
};
</script>

<style scoped>
.order-line {
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
}
.order-line:hover {
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 15%) !important;
}
:deep(.modal-footer),
:deep(.modal-header) {
  border: 0px;
}
.custom-label {
  position: relative;
  bottom: -11px;
  left: 12px;
  padding: 0px 4px;
  background: white;
  color: var(--light-green);
}
.custom-input {
  border-radius: 10px;
  border-color: var(--light-green);
  border-width: 2px;
}
</style>
