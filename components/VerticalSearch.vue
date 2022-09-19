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
        <!-- <div :class="horizontal ? 'heart-horizontal' : 'heart-vertical'">
          <i class="fas fa-heart fa-2x text-light-red"></i>
        </div> -->
        <nuxt-link
          :to="`/${product._source.handle}-P${product._source.id}`"
          class="row mx-0 mt-2 text-decoration-none text-dark"
        >
          <img
            v-if="!product._source.shopifyImageUrl"
            :src="require(`~/assets/images/img-test.jpeg`)"
            :style="{ width: horizontal ? '180px' : '140px' }"
            class="d-block mx-auto"
            alt=""
          />
          <img
            v-else
            :src="product._source.shopifyImageUrl"
            :style="{ width: horizontal ? '180px' : '140px' }"
            class="d-block mx-auto"
            alt=""
          />
        </nuxt-link>
      </div>
      <div :class="horizontal ? 'col-8' : 'col-12'">
        <div class="p-2">
          <div style="height: 60px">
            <p class="font-weight-bold mb-0 small" :title="product._source.id">
              {{ product._source.shortName }}
            </p>
          </div>
          <!-- {{ product._source.awardcount }} -->
          <p class="mb-0 text-muted" style="text-decoration: line-through">
            {{ product._source.price.toFixed(2) }}
          </p>
          <div
            class="d-flex justify-content-between align-items-center position-relative"
          >
            <div>
              <p class="h2">€ {{ product._source.saleprice.toFixed(2) }}</p>
            </div>
            <!-- <nuxt-link :to="`/product/${product.handle}`">detail</nuxt-link> -->
            <!-- {{ cartQuantity }} -->
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

export default {
  props: ["product", "horizontal"],
  name: "ProductCardVertical",
  data() {
    return { quantity: 0 };
  },
  computed: {
    cartQuantity() {
      if (!this.$store.state.cart.cart) {
        return 0;
      }

      let cartList = this.$store.state.cart.cart.lines.edges.map((el) => ({
        merchandise: el.node.merchandise.id,
        quantity: el.node.quantity,
      }));

      console.log(
        this.product._source.shortName,
        " >>> ",
        this.product._source.variantId
      );
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

      if (!this.$store.state.user.user) {
        this.$router.push("/login");
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

/* .dropdown-cart:hover .dropdown-cart-content {
  transition-duration: 0.2s;
  height: 120px;
  overflow: auto;
} */

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
  z-index: 2;
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

.selection-svg {
  filter: brightness(0.7);
  width: 36px;
}
</style>
