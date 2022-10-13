<template>
  <div class="product-card mx-auto mt-4" style="width: 94%">
    <div>
      <div v-if="details.inpromotion" class="ribbon-1">
        <span style="letter-spacing: 3px">
          <img
            :src="require(`@/assets/images/selections/inpromotion.svg`)"
            class="text-white d-inline icon-promo"
          />PROMO</span
        >
      </div>

      <div
        :to="`/${product.handle}-${product.tags[0]}`"
        class="position-relative row mx-0 mt-2 img-wrapper text-decoration-none text-dark"
        :style="{ backgroundImage: 'url(' + product.images.nodes[0].url + ')' }"
      >
        <div class="position-absolute" style="left: 0px; top: 0px; z-index: 10">
          <img
            title="Favoriti"
            v-if="details.favourite"
            :src="require(`@/assets/images/selections/favourite.svg`)"
            class="selection-svg d-block"
          />
          <img
            title="Every day"
            v-if="details.foreveryday"
            :src="require(`@/assets/images/selections/foreveryday.svg`)"
            class="selection-svg d-block"
          />
          <img
            title="Novità"
            v-if="details.isnew"
            :src="require(`@/assets/images/selections/isnew.svg`)"
            class="selection-svg d-block"
          />
          <img
            title="Novità"
            v-if="details.artisanal"
            :src="require(`@/assets/images/selections/artisanal.svg`)"
            class="selection-svg d-block"
          />
          <img
            title="To gift"
            v-if="details.togift"
            :src="require(`@/assets/images/selections/togift.svg`)"
            class="selection-svg d-block"
          />
          <img
            title="Rare"
            v-if="details.rarewine"
            :src="require(`@/assets/images/selections/rarewine.svg`)"
            class="selection-svg d-block"
          />
          <img
            title="Rare"
            v-if="details.unusualvariety"
            :src="require(`@/assets/images/selections/unusualvariety.svg`)"
            class="selection-svg d-block"
          />
          <img
            title="Rare"
            v-if="details.topsale"
            :src="require(`@/assets/images/selections/topsale.svg`)"
            class="selection-svg d-block"
          />
        </div>
        <div style="position: absolute; bottom: 0px; right: 2px">
          <i
            class="text-light-red"
            style="font-size: 26px"
            :class="isInWishList ? 'fas fa-heart ' : 'fal fa-heart  '"
            @click.stop="toggleWishlist"
          ></i>
        </div>
      </div>

      <!-- <div class="row">
        <div class="col-12">
          <div class="text-right">
            <i
              class="text-light-red mr-2"
              :class="
                isInWishList ? 'fas fa-heart fa-2x' : 'fal fa-heart fa-2x '
              "
              @click.stop="toggleWishlist"
            ></i>
          </div>
        </div>
      </div> -->
      <div class="">
        <nuxt-link
          :to="`/${product.handle}-${product.tags[0]}`"
          class="prodotto-box__nome"
        >
          {{ product.title }}
        </nuxt-link>

        <div
          style="margin-top: 30px"
          class="d-flex justify-content-between align-items-end position-relative"
        >
          <div>
            <p
              class="mb-1"
              style="text-decoration: line-through; color: #8c8d8e"
              v-if="
                product.variants.nodes[0].compareAtPrice !==
                product.variants.nodes[0].price
              "
            >
              {{ product.variants.nodes[0].compareAtPrice }} €
            </p>
            <p v-else class="mb-1">&nbsp;</p>
            <p class="mb-0">
              <span class="integer">{{
                product.variants.nodes[0].price.split(".")[0]
              }}</span
              >,<span>{{ product.variants.nodes[0].price.split(".")[1] }}</span>
              €
            </p>
          </div>

          <div class="position-relative">
            <button class="btn btn-cart" @click.stop="addToCart()"></button>
            <span v-show="cartQuantity > 0" class="cart-quantity">
              {{ cartQuantity }}
            </span>
            <div
              v-show="isOpen"
              class="cart-dropup"
              @mouseleave="isOpen = false"
            >
              <div class="btn text-white">
                <span style="font-size: 24px" @click.stop="addToCart()">+</span>
              </div>
              <p class="mb-0 text-white text-center py-2">{{ cartQuantity }}</p>
              <div class="btn text-white">
                <span style="font-size: 24px" @click.stop="decreaseQuantity()"
                  >-</span
                >
              </div>
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
  props: ["product"],
  name: "ProductCardVertical",
  data() {
    return {
      quantity: 0,
      details: JSON.parse(this.product.metafield1.value),
      isOpen: false,
    };
  },
  computed: {
    isInWishList() {
      if (!this.$store.state.user.user) return false;
      let wishlist = this.$store.state.user.user.customer.wishlist;

      // wishlist is null by default
      if (wishlist) {
        /* console.log(wishlist); */
        return JSON.parse(wishlist.value).includes(
          String(this.product.variants.nodes[0].id.split("ProductVariant/")[1])
        );
      }

      return false;
    },
    cartQuantity() {
      if (!this.$store.state.cart.cart) {
        return 0;
      }
      let cartList = this.$store.state.cart.cart.lines.edges.map((el) => ({
        merchandise: el.node.merchandise.id,
        quantity: el.node.quantity,
      }));

      let isInCart = cartList.find(
        (el) => el.merchandise == this.product.variants.nodes[0].id
      );

      if (isInCart) {
        return isInCart.quantity;
      } else {
        return 0;
      }
    },
  },
  methods: {
    async toggleWishlist() {
      if (!this.$store.state.user.user) {
        this.$router.push("/login");
        return;
      }

      const userId =
        this.$store.state.user.user.customer.id.split("Customer/")[1];

      const variantId =
        this.product.variants.nodes[0].id.split("ProductVariant/")[1];

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
    addToCart: async function () {
      this.isOpen = true;
      /* console.log(JSON.parse(this.product.metafield1.value), "this.product");
      return; */
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

      const productVariantId = this.product.variants.nodes[0].id;

      const lines = [
        {
          quantity: 1,
          merchandiseId: productVariantId,
        },
      ];

      const all = await addProductToCart(domain, access_token, cartId, lines);

      this.$store.commit("cart/setCart", all);

      this.flashMessage.show({
        status: "",
        message: `N° ${this.cartQuantity} - ${this.product.title} è stata modificata la quantità`,
        icon: this.product.images.nodes[0].url,
        iconClass: "bg-transparent ",
        time: 8000,
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
          (el) => el.merchandise.id == this.product.variants.nodes[0].id
        ).id;

      const cart = await updateItemInCart(
        domain,
        access_token,
        lineId,
        cartId,
        this.cartQuantity - 1
      );
      this.$store.commit("cart/setCart", cart);

      if (this.cartQuantity > 0) {
        this.flashMessage.show({
          status: "",
          message: `N° ${this.cartQuantity} - ${this.product.title} è stata modificata la quantità`,
          icon: this.product.images.nodes[0].url,
          iconClass: "bg-transparent ",
          time: 8000,
          blockClass: "add-product-notification",
        });
      } else {
        this.flashMessage.show({
          status: "",
          message: `N° ${this.cartQuantity} - ${this.product.title} è stato rimosso dal carrello`,
          icon: this.product.images.nodes[0].url,
          iconClass: "bg-transparent ",
          time: 8000,
          blockClass: "add-product-notification",
        });
      }
      /* this.flashMessage.show({
        status: "",
        message: "Prodotto rimosso!",
        time: 1000,
        blockClass: "remove-product-notification",
      }); */
    },
  },
};
</script>
<style scoped>
.integer {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1.5rem;
}

.product-card {
  position: relative;
  padding: 8px 23px 14px;
  border: 1px solid #e1e2e3;
  border-radius: 8px;
  /* height: 550px; */
  /* width: 313px; */

  transition: 0.4s;
  margin-bottom: 48px;
}

.prodotto-box__nome {
  overflow: hidden;
  height: 4.4rem;
  margin-bottom: 0;
  font-family: "Open Sans", Arial, "Helvetica Neue", Helvetica, sans-serif;
  font-size: 16px;
  font-size: 1rem;
  color: #000;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: normal;
  font-style: normal;
  display: block;
}

.product-card:hover {
  /* box-shadow: 0 20px 36px 3px rgb(51 51 51 / 20%); */
  box-shadow: 5px 5px 8px 1px rgb(120 120 120 / 50%);
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

.selection-svg {
  filter: brightness(0.7);
  width: 36px;
}

.img-wrapper {
  height: 300px;
  background-image: url(~/assets/images/img-test.jpeg);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  /* border: 1px solid red; */
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
