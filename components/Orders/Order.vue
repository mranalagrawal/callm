<template>
  <div class="mb-3 order-line" :class="visible ? 'shadow' : ''">
    <div
      class="d-none d-md-flex flex-row py-4 pointer bg-light"
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
          class="fal fa-chevron-down text-dark-secondary"
          :class="visible ? 'fa-rotate-180' : ''"
        ></i>
      </div>
    </div>

    <div
      class="d-md-none pt-4 pointer bg-light"
      :class="visible ? '' : 'collapsed'"
      @click="visible = !visible"
    >
      <div class="px-3">
        <p class="text-light-primary">
          ORDINE: <strong class="text-dark">{{ order.orderNumber }}</strong>
        </p>
        <p class="text-light-primary">
          Data: {{ order.processedAt.split("T")[0] }}
        </p>
        <p class="text-light-primary">Pagamento: {{ order.financialStatus }}</p>
        <p class="text-light-primary">
          Stato dell'ordine: {{ order.fulfillmentStatus }}
        </p>
        <p class="text-light-primary">Totale: {{ order.totalPrice }}</p>
      </div>

      <div
        class="text-center py-2"
        style="background: #ddd"
        :class="visible ? 'd-none' : ''"
      >
        <i class="fal fa-chevron-down fa-2x text-light-secondary"></i>
      </div>
    </div>

    <b-collapse v-model="visible" class="row px-5 mt-5" v-if="order">
      <div class="col-12">
        <div class="row bg-light pt-3">
          <div class="col-12 col-md-6">
            <p class="font-weight-bold lead">Riepilogo</p>
            <p class="text-light-primary">
              Stato dell'ordine: {{ order?.fulfillmentStatus }}
            </p>
            <p class="text-light-primary">
              Spedizione:
              {{
                order.successfulFulfillments.trackingCompany || "Non inserita"
              }}
            </p>
            <p class="text-light-primary">
              Telefono:
              {{ order.successfulFulfillments.trackingInfo || "Non inserito" }}
            </p>
          </div>
          <div class="col-12 col-md-6">
            <p class="font-weight-bold lead">Indirizzo di spedizione</p>
            <p>{{ order.shippingAddress?.name }}</p>
            <p>
              {{ order.shippingAddress?.address1 }}
              {{ order.shippingAddress?.address2 }}
            </p>
            <p>
              {{ order.shippingAddress?.zip }}
              {{ order.shippingAddress?.city }}
              {{ order.shippingAddress?.country }}
            </p>
            <p>{{ order.shippingAddress?.phone }}</p>
          </div>
          <!-- <div class="col-12 col-md-4">
            <p class="font-weight-bold lead">Note di consegna</p>
            <p>METAFIELD?</p>
          </div> -->
        </div>
      </div>
      <div class="col-12 mt-5">
        <div class="row align-items-end">
          <div class="col-4 col-md-4 px-0">
            <p class="small" v-if="order.lineItems.edges.length == 1">
              <strong>{{ order.lineItems.edges.length }}</strong> articolo
            </p>
            <p class="small" v-else>
              <strong>{{ order.lineItems.edges.length }}</strong> articoli
            </p>
          </div>
          <div class="col-8 col-md-8 text-right px-0">
            <button
              class="btn text-light-secondary d-block ml-auto fs-14"
              @click="showModal"
            >
              Richiedi assistenza
            </button>
            <button
              class="btn text-white d-block ml-auto fs-14"
              style="background: #da4865; border-radius: 10px"
              @click="orderAgain"
              :class="canBuyAgain ? '' : 'disabled'"
            >
              ORDINA DI NUOVO
            </button>
          </div>
        </div>
      </div>
      <div class="col-12 px-0" v-if="order.lineItems.edges">
        <div
          class="row mt-2 mb-3"
          v-for="(item, i) in order.lineItems.edges"
          :key="i"
        >
          <!-- {{ order.lineItems.edges[0].node.variant.id }} -->
          <div class="col-2">
            <nuxt-link :to="`/product/${item.node.variant.product.handle}`">
              <img
                :src="item.node.variant.product.images.nodes[0].url"
                alt=""
                class="img-fluid"
                style="max-width: 60px"
              />
            </nuxt-link>
          </div>
          <div class="col-8 col-md-7">
            <p class="mb-0 fs-14">{{ item.node.title }}</p>
          </div>
          <div class="d-none d-md-block col-md-1">
            <span class="">x{{ item.node.quantity }}</span>
          </div>
          <div class="col-2 col-md-2 text-right px-0">
            <p class="text-barred mb-0 text-muted small text-">
              {{
                Number(
                  item.node.variant.product.variants.nodes[0].compareAtPriceV2
                    .amount * item.node.quantity
                ).toFixed(2)
              }}
            </p>
            <p class="mb-0 font-weight-bold">
              {{
                Number(
                  item.node.variant.product.variants.nodes[0].price *
                    item.node.quantity
                ).toFixed(2)
              }}
            </p>
          </div>
          <div class="col-12">
            <hr class="mb-0 mt-2" />
          </div>
        </div>
      </div>
    </b-collapse>

    <b-modal ref="modal" size="lg" hide-header hide-footer centered title="">
      <p class="text-center mt-5 mb-2 lead text-light-primary">
        Richiedi assistenza per l'ordine N° {{ order.orderNumber }}
      </p>

      <form @submit="onSubmit" class="px-4 pt-3 py-2 w-75 mx-auto">
        <b-form-group class="my-4">
          <label class="custom-label" for="input-1">Il tuo messaggio</label>
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

        <div class="w-100 text-center">
          <button
            class="btn btn-lg px-5 text-white"
            style="background: #da4865; border-radius: 10px"
          >
            INVIA
          </button>
        </div>
      </form>
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
        order: this.order.orderNumber,
        fullname:
          this.$store.state.user.user.customer.firstName +
          this.$store.state.user.user.customer.lastName,
        email: this.$store.state.user.user.customer.email,
        store: this.$config.STORE,
      },
    };
  },
  computed: {
    totalItems() {
      return this.order.lineItems.edges
        .map((el) => el.node.quantity)
        .reduce((t, n) => t + n);
    },
    canBuyAgain() {
      return this.order.lineItems.edges
        .map((el) => el.node.variant.product.availableForSale)
        .every((el) => el == true);
    },
  },
  methods: {
    async onSubmit(e) {
      e.preventDefault();

      const elastic_url = this.$config.ELASTIC_URL;

      const response = await fetch(elastic_url + "send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        crossDomain: true,
        body: JSON.stringify(this.form),
      });
      const responseJSON = await response.json();

      if (responseJSON.status == 200) {
        this.hideModal();
        this.flashMessage.show({
          status: "",
          message: "Messaggio inviato!",
          time: 1000,
          blockClass: "add-product-notification",
        });
      }
    },
    showModal() {
      this.$refs["modal"].show();
    },
    hideModal() {
      this.$refs["modal"].hide();
    },
    async orderAgain() {
      const items = [];
      this.order.lineItems.edges
        .map((el) => el.node)
        .forEach((el) => {
          const productVariantId = el.variant.id;
          const amount = Number(el.variant.product.variants.nodes[0].price);
          const amountFullPrice = Number(
            el.variant.product.variants.nodes[0].compareAtPriceV2.amount
          );
          const tag = el.variant.product.tags[0];
          const image = el.variant.product.images.nodes[0].url;

          const title = el.title;
          this.$store.commit("userCart/addProduct", {
            productVariantId: productVariantId,
            singleAmount: amount,
            singleAmountFullPrice: amountFullPrice,
            tag: tag,
            image: image,
            title: title,
          });
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
  color: var(--light-primary);
}
.custom-input {
  border-radius: 10px;
  border-color: var(--light-primary);
  border-width: 2px;
}
</style>
