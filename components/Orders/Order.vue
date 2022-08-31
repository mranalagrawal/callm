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
      <div class="col-12 mt-4">
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
            <p class="text-barred mb-0 text-muted">
              {{
                Number(
                  item.node.variant.product.compareAtPriceRange.maxVariantPrice
                    .amount * item.node.quantity
                ).toFixed(2)
              }}
            </p>
            <p class="mb-0">
              {{ Number(item.node.originalTotalPrice.amount).toFixed(2) }}
            </p>
          </div>
          <div class="col-12">
            <hr class="mb-0 mt-2" />
          </div>
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script>
export default {
  props: ["order"],
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    totalItems() {
      return this.order.lineItems.edges
        .map((el) => el.node.quantity)
        .reduce((t, n) => t + n);
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
</style>
