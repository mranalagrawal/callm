<template>
  <div
    class="card mx-auto"
    :class="horizontal ? 'product-card-horizontal' : 'product-card-vertical'"
  >
    <div class="row h-100">
      <div v-if="product._source.inpromotion" class="ribbon-1">
        <span><i class="fal fa-tag"></i> PROMO</span>
      </div>
      <div class="position-relative" :class="horizontal ? 'col-4' : 'col-12'">
        <div
          class="position-absolute"
          style="left: 20px; top: 10px; z-index: 10"
        >
          <img
            title="Favoriti"
            v-if="product._source.favourite"
            :src="require(`@/assets/images/selections/favourite.svg`)"
            class="selection-svg d-block"
          />
          <img
            title="Every day"
            v-if="product._source.foreveryday"
            :src="require(`@/assets/images/selections/foreveryday.svg`)"
            class="selection-svg d-block"
          />
          <img
            title="Novità"
            v-if="product._source.isnew"
            :src="require(`@/assets/images/selections/isnew.svg`)"
            class="selection-svg d-block"
          />
          <img
            title="Novità"
            v-if="product._source.artisanal"
            :src="require(`@/assets/images/selections/artisanal.svg`)"
            class="selection-svg d-block"
          />
          <img
            title="To gift"
            v-if="product._source.togift"
            :src="require(`@/assets/images/selections/togift.svg`)"
            class="selection-svg d-block"
          />
          <img
            title="Rare"
            v-if="product._source.rarewine"
            :src="require(`@/assets/images/selections/rarewine.svg`)"
            class="selection-svg d-block"
          />
          <img
            title="Rare"
            v-if="product._source.unusualvariety"
            :src="require(`@/assets/images/selections/unusualvariety.svg`)"
            class="selection-svg d-block"
          />
          <img
            title="Rare"
            v-if="product._source.topsale"
            :src="require(`@/assets/images/selections/topsale.svg`)"
            class="selection-svg d-block"
          />
        </div>
        <div :class="horizontal ? 'heart-horizontal' : 'heart-vertical'">
          <i
            class="text-light-red"
            :class="isInWishList ? 'fas fa-heart fa-2x' : 'fal fa-heart fa-2x '"
            @click="toggleWishlist"
          ></i>
        </div>
        <nuxt-link
          :to="`/${product._source.handle}-P${product._source.id}`"
          class="row mx-0 mt-2 text-decoration-none text-dark"
        >
          <img
            v-if="!product._source.shopifyImageUrl"
            :src="require(`~/assets/images/img-test.jpeg`)"
            :style="{ width: horizontal ? '180px' : '140px' }"
            class="d-block mx-auto"
            loading="lazy"
            alt=""
          />
          <img
            v-else
            :src="product._source.shopifyImageUrl"
            :style="{ width: horizontal ? '180px' : '140px' }"
            class="d-block mx-auto"
            loading="lazy"
            alt=""
          />
        </nuxt-link>
      </div>
      <div :class="horizontal ? 'col-8' : 'col-12'">
        <div class="p-2">
          <div style="height: 60px" class="">
            <p
              class="font-weight-bold mb-0"
              :title="product._source.id"
              :class="horizontal ? 'pt-2' : 'small'"
            >
              {{ product._source.shortName }}
            </p>
          </div>
          <div v-if="!horizontal">
            <p class="mb-0 text-muted">
              <span
                style="text-decoration: line-through"
                v-if="
                  product._source.saleprice.toFixed(2) !==
                  product._source.price.toFixed(2)
                "
                >{{ product._source.price.toFixed(2) }}€</span
              >
              <span v-else>&nbsp;</span>
            </p>
            <div
              class="d-flex justify-content-between align-items-center position-relative"
            >
              <div>
                <p class="mb-0">
                  <span class="integer">{{
                    product._source.saleprice.toFixed(2).split(".")[0]
                  }}</span
                  >,<span>{{
                    product._source.saleprice.toFixed(2).split(".")[1]
                  }}</span>
                  €
                </p>
              </div>

              <div
                v-if="cartQuantity > 0"
                style="
                  width: 42px;
                  border-radius: 10px;
                  background: darkred;
                  position: absolute;
                  bottom: 2px;
                  right: 2px;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                "
              >
                <div class="btn text-white">
                  <i class="fas fa-minus" @click.stop="decreaseQuantity()"></i>
                </div>
                <p class="mb-0 text-white text-center">{{ cartQuantity }}</p>
                <div class="btn text-white">
                  <i class="fas fa-plus" @click.stop="addToCart()"></i>
                </div>
              </div>
              <div v-else>
                <button class="btn btn-cart" @click="addToCart()">
                  <i class="fal fa-shopping-cart text-white"></i>
                </button>
              </div>
            </div>
          </div>
          <div v-else class="row">
            <div class="col-6">
              <p>Produttore: {{ product._source.brandname }}</p>
              <p>
                Regione: {{ product._source.regionname }}
                <span v-if="product._source.areas.name"
                  >({{ product._source.areas.name }})</span
                >
              </p>
              <p>Size: {{ product._source.sizes.name }}</p>
            </div>
            <div class="col-6">
              <p class="text-light-green text-center text-uppercase mt-5">
                Disponibilità immediata
              </p>
              <p class="h2 mb-5 text-center">
                € {{ product._source.saleprice.toFixed(2) }}
              </p>
              <button
                class="btn bg-light-red text-white text-uppercase mx-auto d-block mt-5"
                @click="addToCart()"
              >
                <i class="fal fa-shopping-cart text-white"></i> aggiungi al
                carrello
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  createCart,
  addProductToCart,
  updateItemInCart,
} from "../utilities/cart";
import { queryProductByIdAsTag } from "../utilities/productQueries";

export default {
  props: ["product", "horizontal"],
  name: "ProductCardVertical",
  data() {
    return { quantity: 0 };
  },
  computed: {
    isInWishList() {
      if (!this.$store.state.user.user) return null;
      let wishlist = this.$store.state.user.user.customer.wishlist;

      // wishlist is null by default
      if (wishlist) {
        return JSON.parse(wishlist.value).includes(
          String(this.product._source.variantId)
        );
      }

      return null;
    },
    cartQuantity() {
      if (!this.$store.state.cart.cart) {
        return 0;
      }

      let cartList = this.$store.state.cart.cart.lines.edges.map((el) => ({
        merchandise: el.node.merchandise.id,
        quantity: el.node.quantity,
      }));

      /* console.log(
        this.product._source.shortName,
        " >>> ",
        this.product._source.variantId
      ); */
      let isInCart = cartList.find(
        (el) =>
          el.merchandise.split("/ProductVariant/")[1] ==
          this.product._source.variantId
      );

      if (isInCart) {
        return isInCart.quantity;
      } else {
        return 0;
      }
    },
  },

  methods: {
    addToCart: async function () {
      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;

      /* if (this.product._source.quantity < 1) {
        return;
      } */

      if (!this.$store.state.user.user) {
        this.$router.push("/login");
        return;
      }

      console.log("P" + this.product._id);

      // check if product is available in shopify
      const productQuery = queryProductByIdAsTag("P" + this.product._id);
      const GRAPHQL_BODY = {
        async: true,
        crossDomain: true,
        method: "POST",
        headers: {
          "X-Shopify-Storefront-Access-Token": access_token,
          "Content-Type": "application/graphql",
        },
        body: productQuery,
      };
      const availability = await fetch(domain, GRAPHQL_BODY).then((res) =>
        res.json()
      );

      console.log(availability.data.products.edges[0], "SS");

      if (!availability.data.products.edges[0]) {
        alert("Prodotto non disponibile su STOREFRONT");
        return;
      }
      /* return; */
      if (availability.data.products.edges[0].node.totalInventory == 0) {
        alert("Prodotto esaurito");
        return;
      }

      // se non c'è cart
      if (!this.$store.state.cart.cart) {
        /* alert("creo carrello"); */
        // crea cart su shopify
        const user = this.$store.state.user.user;
        const cart = await createCart(domain, access_token, user);

        // crea cart su vuex
        this.$store.commit("cart/setCart", cart);
      }

      // ora cart esiste sicuro

      const cartId = this.$store.state.cart.cart.id;

      const producVariantId = this.product._source.variantId;
      console.clear();
      console.log(this.product);
      /* return; */
      const lines = [
        {
          quantity: 1,
          merchandiseId: "gid://shopify/ProductVariant/" + producVariantId,
        },
      ];

      const all = await addProductToCart(domain, access_token, cartId, lines);

      this.$store.commit("cart/setCart", all);

      this.flashMessage.show({
        status: "",
        message: this.product._source.shortName + " aggiunto!",
        icon: this.product._source.shopifyImageUrl,
        iconClass: "bg-transparent ",
        time: 1000,
        blockClass: "add-product-notification",
      });
    },
    async decreaseQuantity() {
      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;
      const cartId = this.$store.state.cart.cart.id;

      const lineId = this.$store.state.cart.cart.lines.edges
        .map((el) => el.node)
        .find(
          (el) =>
            el.merchandise.id.split("/ProductVariant/")[1] ==
            this.product._source.variantId
        ).id;

      const cart = await updateItemInCart(
        domain,
        access_token,
        lineId,
        cartId,
        this.cartQuantity - 1
      );
      this.$store.commit("cart/setCart", cart);

      this.flashMessage.show({
        status: "",
        message: "Prodotto rimosso!",
        time: 1000,
        blockClass: "remove-product-notification",
      });
    },
    async toggleWishlist() {
      if (!this.$store.state.user.user) {
        this.$router.push("/login");
        return;
      }

      const userId =
        this.$store.state.user.user.customer.id.split("Customer/")[1];

      const variantId = this.product._source.variantId;

      const response = await fetch(
        `https://callmewine-api.dojo.sh/api/customers/${userId}/wishlist/${variantId}`,
        { async: true, crossDomain: true, method: "POST" }
      );
      const updatedWishlist = await response.text();
      console.log(updatedWishlist);

      this.$store.commit("user/updateWishlist", updatedWishlist);

      if (this.isInWishList) {
        this.flashMessage.show({
          status: "",
          message: "Aggiunto ai preferiti!",
          time: 1000,
          blockClass: "add-product-notification",
        });
      } else {
        this.flashMessage.show({
          status: "",
          message: "Rimosso preferiti!",
          time: 1000,
          blockClass: "add-product-notification",
        });
      }
    },
  },
};
</script>
<style scoped>
.product-card-vertical {
  /* height: 420px; */
  height: auto;
  width: 230px;
  transition: 0.4s;
  margin-bottom: 48px;
  position: relative;
}

@media screen and (max-width: 768px) {
  .product-card-vertical {
    width: 90%;
  }
}

.product-card-horizontal {
  height: 350px;
  width: 100%;
  transition: 0.4s;
  margin-bottom: 48px;
  position: relative;
}

.product-card-vertical:hover,
.product-card-horizontal:hover {
  box-shadow: 0 20px 36px 3px rgb(51 51 51 / 20%);
}

.heart-vertical {
  position: absolute;
  bottom: 10px;
  right: 20px;
}

.heart-horizontal {
  position: absolute;
  top: 10px;
  right: 20px;
}

.btn-cart {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  color: white;
  background: #da4865;
  position: relative;
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
  transition-duration: 0.2s;
}

.img-wrapper {
  height: 320px;
  background-image: url(~/assets/images/img-test.jpeg);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  /* border: 1px solid red; */
}

.selection-svg {
  filter: brightness(0.7);
  width: 36px;
}
.integer {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1.5rem;
}
</style>
