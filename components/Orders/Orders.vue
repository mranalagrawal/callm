<template>
  <div>
    <div v-if="orders">
      <div v-if="orders.length > 0">
        <div class="row mt-5 mb-3 text-light-green d-none d-md-flex">
          <div class="col-1">Order</div>
          <div class="col-2">Date</div>
          <div class="col-2">Products</div>
          <div class="col-2">Total</div>
          <div class="col-2">Fullfillment Status</div>
          <div class="col-2">Financial Status</div>
          <div class="col-1"></div>
        </div>
        <div v-for="item in orders" :key="item.id">
          <Order :order="item.node" />
        </div>
      </div>
      <div v-else>
        <p class="lead">{{ $t("profile.noOrder") }}</p>
      </div>
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
    const customerAccessToken = this.$store.state.user.user.token;

    const domain = this.$config.DOMAIN;
    const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;

    const orders = await getUserOrders(
      domain,
      access_token,
      customerAccessToken
    );

    this.orders = orders.edges.reverse();
  },
};
</script>
