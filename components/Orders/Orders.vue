<template>
  <div>
    <div v-if="orders && orders.length > 0">
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
    <div v-else>
      <p class="lead">Non hai ancora nessun ordine.</p>
    </div>
  </div>
</template>
<script>
import Order from "./Order.vue";
import { getUserOrders } from "../../utilities/orders";

export default {
  components: { Order },
  data() {
    return {
      orders: null,
    };
  },
  async mounted() {
    // arriveranno da shopify
    /* console.log(this.$store.state.user.user.token); */
    const customerAccessToken = this.$store.state.user.user.token;

    const domain = this.$config.DOMAIN;
    const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;

    const orders = await getUserOrders(
      domain,
      access_token,
      customerAccessToken
    );

    console.log(orders);
    this.orders = orders.edges;
  },
};
</script>
