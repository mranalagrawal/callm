<template>
  <div>
    <div v-if="products && products.length > 0" class="row mt-5">
      <div
        v-for="item in products"
        :key="item.id"
        class="col-12 col-md-6 col-lg-3"
      >
        <ProductCardVertical :product="item.product" />
      </div>
    </div>
    <div v-else>
      <p class="lead">Non hai ancora nessun ordine.</p>
    </div>
  </div>
</template>
<script>
import { getUserOrders } from "../utilities/orders";

export default {
  data() {
    return {
      products: null,
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

    let products = orders.edges
      .map((el) => el.node.lineItems.edges)
      .flat()
      .map((el) => el.node.variant);

    let ids = [...new Set(products.map((el) => el.id))];

    let uniqueProducts = ids.map((el) => {
      return products.find((x) => x.id == el);
    });

    this.products = uniqueProducts;
  },
};
</script>
