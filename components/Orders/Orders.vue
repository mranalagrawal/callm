<template>
  <div>
    <div class="row mt-5 mb-3 text-light-green">
      <div class="col-1">N° ordine</div>
      <div class="col-2">Data</div>
      <div class="col-2">Prodotti</div>
      <div class="col-2">Totale</div>
      <div class="col-2">fulfillmentStatus</div>
      <div class="col-2">financialStatus</div>
      <div class="col-1"></div>
    </div>
    <div v-for="item in orders" :key="item.id">
      <Order :order="item.node" />
    </div>
  </div>
</template>
<script>
import Order from "./Order.vue";
export default {
  components: { Order },
  props: ["orders"],
  data() {
    return {
      userOrders: null,
    };
  },
  mounted() {
    // arriveranno da shopify
    this.userOrders = [1, 2];
  },
};
</script>
