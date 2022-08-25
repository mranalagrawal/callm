<template>
  <div class="card product-card mx-auto justify-content-between">
    <!-- {{ product.variants.nodes[0].id }} -->
    <div>
      <div class="ribbon-1">
        <span><i class="fal fa-tag"></i> PROMO</span>
      </div>

      <nuxt-link
        :to="`/product/${product.handle}`"
        class="row mx-0 mt-2 img-wrapper text-decoration-none text-dark"
        :style="{ backgroundImage: 'url(' + product.images.nodes[0].url + ')' }"
      >
        <div
          class="col-2 pl-2 h-100 d-flex justify-content-end align-items-center flex-column"
        >
          <div class="">
            <i class="fal fa-user"></i>
          </div>

          <div class="">
            <i class="fal fa-users"></i>
          </div>
        </div>
        <div
          class="col-2 offset-8 pr-2 h-100 d-flex justify-content-end align-items-center flex-column"
        >
          <div class="">
            <i class="fal fa-heart fa-2x text-light-red"></i>
          </div>
        </div>
      </nuxt-link>
      <div class="p-3">
        <p class="font-weight-bold">{{ product.title }}</p>
        <p class="mb-0 text-muted" style="text-decoration: line-through">
          € {{ product.variants.nodes[0].compareAtPrice }}
        </p>
        <div class="d-flex justify-content-between">
          <div>
            <p class="h2">€ {{ product.variants.nodes[0].price }}</p>
          </div>
          <!-- <nuxt-link :to="`/product/${product.handle}`">detail</nuxt-link> -->
          <div>
            <button class="btn btn-cart" @click="addToCart">
              <b-icon icon="cart" aria-hidden="true"></b-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addItem } from "../utilities/cart";
export default {
  props: ["product"],
  name: "ProductCardVertical",
  methods: {
    addToCart() {
      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;

      const cartId = localStorage.getItem("call-me-wine-cart");
      console.log(cartId);

      const cartMutation = addItem(cartId, this.product.variants.nodes[0].id);

      console.log(JSON.parse(cartMutation));

      const GRAPHQL_BODY_CART = {
        async: true,
        crossDomain: true,
        method: "POST",
        headers: {
          "X-Shopify-Storefront-Access-Token": access_token,
          "Content-Type": "application/json",
        },
        body: cartMutation,
      };

      fetch(domain, GRAPHQL_BODY_CART)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
        });
    },
  },
};
</script>
<style scoped>
.product-card {
  height: 500px;
  width: 300px;
  transition: 0.4s;
  margin-bottom: 48px;
}

.product-card:hover {
  box-shadow: 0 20px 36px 3px rgb(51 51 51 / 20%);
}

.btn-cart {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  color: white;
  background: #da4865;
}

.img-wrapper {
  height: 320px;
  background-image: url(~/assets/images/img-test.jpeg);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  /* border: 1px solid red; */
}

.ribbon1 {
  position: absolute;
  width: 90px;
  top: -6.1px;
  right: 10px;
}
.ribbon1:after {
  position: absolute;
  content: "";
  width: 0;
  height: 0;
  border-left: 45px solid transparent;
  border-right: 45px solid transparent;
  border-top: 10px solid var(--dark-green);
}
.ribbon1 span {
  position: relative;
  display: block;
  text-align: center;

  font-size: 14px;
  line-height: 1;
  padding: 12px 8px 10px;
  border-top-right-radius: 8px;
}
.ribbon1 span:before,
.ribbon1 span:after {
  position: absolute;
  content: "";
}
.ribbon1 span:before {
  height: 6px;
  width: 6px;
  left: -6px;
  top: 0;
  background: black;
}
.ribbon1 span:after {
  height: 6px;
  width: 8px;
  left: -8px;
  top: 0;
  border-radius: 8px 8px 0 0;
  background: black;
}

.ribbon-1 {
  position: absolute;
  width: 90px;
  height: 30px;
  background: var(--dark-green);
  color: white;
  top: -6px;
  right: 25px;
  font-size: 12px;
  border-radius: 0px 0px 15px 15px;
}

.ribbon-1 span {
  padding-left: 8px;
  position: relative;
  top: 8px;
}
.ribbon-1:before {
  content: "";
  position: absolute;
  height: 0;
  width: 0;
  border-bottom: 6px solid #081815;
  border-right: 6px solid transparent;
  right: -6px;
}
.ribbon-1:after {
  content: "";
  position: absolute;
  height: 0;
  width: 0;
  border-bottom: 6px solid #081815;
  border-left: 6px solid transparent;
  left: -6px;
}
/* .ribbon-1:after {
  height: 0;
  width: 0;
  border-left: 30px solid #ee583a;
  border-right: 30px solid #ee583a;
  border-bottom: 30px solid transparent;
  bottom: -30px;
} */
</style>
