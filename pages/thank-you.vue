<template>
  <div class="container mt-5">
    <div class="row" v-if="order">
      <div class="col-12">
        <h1>Ordine completato!</h1>
        <p>Ti confermiamo che il pagamento è andato a buon fine.</p>
        <p>
          Riceverai una mail di conferma d'ordine e il riepilogo dei tuoi
          acquisti. <br />
          Inoltre riceverai una email di conferma spedizione e una del corriere
          con il tracking del tuo acquisto.
        </p>
        <p>
          Per vedere i dettagli dell'ordine, vai al riepilogo d'ordine del tuo
          account
        </p>
      </div>
      <div class="col-12 mt-5">
        <nuxt-link
          :to="localePath('/profile')"
          class="btn btn-light-red px-3 text-uppercase"
          style="border-radius: 10px"
          >vai al tuo profilo</nuxt-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getUserOrders } from "../utilities/orders";
export default {
  data() {
    return {
      order: null,
    };
  },
  async mounted() {
    /* const domain = this.$config.DOMAIN;
    const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;
    const cartId = this.$store.state.cart.cart.id;
    const lineIds = this.cart.lines.edges.map((el) => el.node.id);
    const cart = await removeProductFromCart(
      domain,
      access_token,
      cartId,
      lineIds
    ); */

    this.$store.commit("cart/setCart", null);
    const customerAccessToken = this.$store.state.user.user.token;

    const domain = this.$config.DOMAIN;
    const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;

    const orders = await getUserOrders(
      domain,
      access_token,
      customerAccessToken
    );

    console.log(orders);
    const ords = orders.edges
      .map((el) => {
        return {
          name: el.node.name,
          date: el.node.processedAt,
        };
      })
      .at(-1);

    this.order = ords;
    console.log(ords);
  },
};
</script>
