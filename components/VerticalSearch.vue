<template>
  <div
    class="card mx-auto"
    :class="horizontal ? 'product-card-horizontal' : 'product-card-vertical'"
  >
    <!-- {{ product }} -->
    <div class="row h-100" v-if="STORE">
      <div v-if="product._source.inpromotion" class="ribbon">
        <span><i class="fal fa-tag"></i> PROMO</span>
      </div>
      <div class="position-relative" :class="horizontal ? 'col-4' : 'col-12'">
        <div
          class="position-absolute"
          style="left: 20px; top: 10px; z-index: 10"
        >
          <img
            title="Organic"
            v-if="product._source.organic"
            :src="require(`@/assets/images/selections/organic.svg`)"
            class="selection-svg d-block"
          />
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
        <div
          class="position-absolute"
          :class="horizontal ? 'horizontal-awards' : 'vertical-awards'"
        >
          <div
            v-for="(award, i) in product._source.awards.slice(0, 5)"
            :key="'award_' + i"
          >
            <AwardTooltip :award="award" />
          </div>
        </div>
        <div :class="horizontal ? 'heart-horizontal' : 'heart-vertical'">
          <i
            class="text-light-secondary"
            :class="isInWishList ? 'fas fa-heart fa-2x' : 'fal fa-heart fa-2x '"
            @click="toggleWishlist"
          ></i>
        </div>
        <nuxt-link
          :to="`/${product._source.handle}-P${product._source.id}`"
          class="row mx-0 mt-2 text-decoration-none text-dark d-none d-lg-block"
        >
          <img
            v-if="!product._source.shopifyImageUrl[STORE]"
            :src="require(`~/assets/images/img-test.jpeg`)"
            :style="{ width: horizontal ? '180px' : '140px' }"
            class="d-block mx-auto"
            loading="lazy"
            alt=""
          />
          <img
            v-else
            :src="product._source.shopifyImageUrl[STORE]"
            :style="{ width: horizontal ? '180px' : '140px' }"
            class="d-block mx-auto"
            loading="lazy"
            alt=""
          />
        </nuxt-link>
        <nuxt-link
          :to="`/${product._source.handle}-P${product._source.id}`"
          class="row mx-0 mt-2 text-decoration-none text-dark d-lg-none"
        >
          <img
            v-if="!product._source.shopifyImageUrl[STORE]"
            :src="require(`~/assets/images/img-test.jpeg`)"
            :style="{ width: horizontal ? '180px' : '100px' }"
            class="d-block mx-auto"
            loading="lazy"
            alt=""
          />
          <img
            v-else
            :src="product._source.shopifyImageUrl[STORE]"
            :style="{ width: horizontal ? '180px' : '100px' }"
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
            SALEPRICE{{
              product._source.saleprice[$config.SALECHANNEL]
            }}
            PRICE{{ product._source.price[$config.SALECHANNEL] }}
            <p class="mb-0 text-muted">
              <span
                style="text-decoration: line-through"
                v-if="
                  product._source.saleprice[$config.SALECHANNEL].toFixed(2) !==
                  product._source.price[$config.SALECHANNEL].toFixed(2)
                "
                >{{ product._source.price[$config.SALECHANNEL].toFixed(2) }}
                {{ $config.STORE == "CMW_UK" ? "£" : "€" }}</span
              >
              <span v-else>&nbsp;</span>
            </p>
            <div
              class="d-flex justify-content-between align-items-center position-relative"
            >
              <div>
                <p class="mb-0">
                  <span class="integer">{{
                    product._source.saleprice[$config.SALECHANNEL]
                      .toFixed(2)
                      .split(".")[0]
                  }}</span
                  >,<span>{{
                    product._source.saleprice[$config.SALECHANNEL]
                      .toFixed(2)
                      .split(".")[1]
                  }}</span>
                  {{ $config.STORE == "CMW_UK" ? "£" : "€" }}
                </p>
              </div>

              <div
                class="position-relative"
                v-if="product._source.quantity[$config.STORE] > 0"
              >
                <button
                  class="btn btn-cart"
                  @click.stop="addToUserCart()"
                ></button>
                <span v-show="userCartQuantity > 0" class="cart-quantity">
                  {{ userCartQuantity }}
                </span>
                <div
                  v-show="isOpen"
                  class="cart-dropup"
                  @mouseleave="isOpen = false"
                >
                  <div class="btn text-white">
                    <span style="font-size: 24px" @click.stop="addToUserCart()"
                      >+</span
                    >
                  </div>
                  <p class="mb-0 text-white text-center py-2">
                    {{ userCartQuantity }}
                  </p>
                  <div class="btn text-white">
                    <span
                      style="font-size: 24px"
                      @click.stop="removeFromUserCart()"
                      >-</span
                    >
                  </div>
                </div>
              </div>
              <div v-else class="position-relative">
                <button class="btn btn-cart disabled" disabled></button>
              </div>
            </div>
          </div>
          <div v-else class="row">
            <div class="col-6">
              <p class="mb-0">
                <strong>{{ $t("product.producer") }}</strong
                >: {{ product._source.brandname }}
              </p>
              <p class="mb-0">
                <strong>{{ $t("product.region") }}</strong
                >: {{ product._source.regionname }}
                <span v-if="product._source.areas.name"
                  >({{ product._source.areas.name }})</span
                >
              </p>
              <p class="mb-0">
                <strong>{{ $t("product.format") }}</strong
                >: {{ product._source.sizes.name }}
              </p>
              <p class="mb-0">
                <strong>{{ $t("product.mainWines") }}</strong
                >: {{ product._source.grapes }}
              </p>
            </div>
            <div class="col-6">
              <p
                class="text-light-primary text-center text-uppercase mt-5"
                v-if="product._source.quantity > 0"
              >
                {{ $t("product.available") }}
              </p>
              <p
                class="text-light-primary text-center text-uppercase mt-5"
                v-else
              >
                {{ $t("product.notAvailable") }}
              </p>
              <p class="mb-0 text-center">
                <span class="integer">{{
                  product._source.saleprice[SALECHANNEL].toFixed(2).split(
                    "."
                  )[0]
                }}</span
                >,<span>{{
                  product._source.saleprice[SALECHANNEL].toFixed(2).split(
                    "."
                  )[1]
                }}</span>
                {{ $config.STORE == "CMW_UK" ? "£" : "€" }}
              </p>

              <div
                class="position-relative"
                v-if="product._source.quantity > 0"
              >
                <button
                  class="btn bg-light-secondary text-white text-uppercase w-100 br-10 mt-3"
                  @click.stop="isOpen = true"
                  v-show="!isOpen"
                >
                  <i class="fal fa-shopping-cart"></i>
                  {{ $t("product.addToCart") }}
                </button>
                <span v-show="userCartQuantity > 0" class="cart-quantity">
                  {{ userCartQuantity }}
                </span>
                <div v-show="isOpen" class="" @mouseleave="isOpen = false">
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <button
                      class="btn bg-light-secondary text-white px-5"
                      @click.stop="removeFromUserCart()"
                    >
                      -
                    </button>
                    {{ userCartQuantity }}
                    <button
                      class="btn bg-light-secondary text-white px-5"
                      @click.stop="addToUserCart()"
                    >
                      +
                    </button>
                  </div>
                </div>
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
import { queryProductByIdAsTag } from "../utilities/productQueries";
import AwardTooltip from "../components/UI/AwardTooltip.vue";

export default {
  props: ["product", "horizontal"],
  name: "ProductCardVertical",
  components: { AwardTooltip },
  data() {
    return { quantity: 0, isOpen: false };
  },
  computed: {
    STORE() {
      return this.$config.STORE;
    },
    SALECHANNEL() {
      return this.$config.SALECHANNEL;
    },
    salePrice() {
      return this.product._source.saleprice[this.$config.STORE];
    },
    filteredAwards() {
      return this.product._source.awards.filter((el) => el.title);
    },
    isInWishList() {
      if (!this.$store.state.user.user) return null;
      let wishlist = this.$store.state.user.user.customer.wishlist;

      // wishlist is null by default
      if (wishlist) {
        return JSON.parse(wishlist.value).includes(
          "P" + this.product._source.id
        );
      }

      return null;
    },
    userCartQuantity() {
      const productVariantId = this.product._source.variantId[this.STORE];
      let isInCart = this.$store.state.userCart.userCart.find((el) =>
        el.productVariantId.includes(productVariantId)
      );

      return isInCart ? isInCart.quantity : 0;
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
        (el) =>
          el.merchandise.split("/ProductVariant/")[1] ==
          this.product._source.variantId[this.STORE]
      );

      if (isInCart) {
        return isInCart.quantity;
      } else {
        return 0;
      }
    },
  },

  methods: {
    async addToUserCart() {
      if (!this.isOpen) this.isOpen = true;

      const productVariantId =
        "gid://shopify/ProductVariant/" +
        this.product._source.variantId[this.STORE];
      const amount = Number(this.product._source.saleprice[this.STORE]);
      const amountFullPrice = Number(this.product._source.price[this.STORE]);
      const tag = "P" + this.product._source.id;
      const image = this.product._source.shopifyImageUrl[this.STORE];
      const title = this.product._source.shortName;
      this.$store.commit("userCart/addProduct", {
        productVariantId: productVariantId,
        singleAmount: amount,
        singleAmountFullPrice: amountFullPrice,
        tag: tag,
        image: image,
        title: title,
      });

      this.flashMessage.show({
        status: "",
        message: this.product._source.shortName + " aggiunto!",
        icon: this.product._source.shopifyImageUrl[this.STORE],
        iconClass: "bg-transparent ",
        time: 1000,
        blockClass: "add-product-notification",
      });
    },
    async removeFromUserCart() {
      const productVariantId =
        "gid://shopify/ProductVariant/" +
        this.product._source.variantId[this.STORE];
      this.$store.commit("userCart/removeProduct", productVariantId);
    },
    async toggleWishlist() {
      if (!this.$store.state.user.user) {
        this.$router.push("/login");
        return;
      }

      console.log(this.product);

      const userId =
        this.$store.state.user.user.customer.id.split("Customer/")[1];

      const variantId = this.product._source.variantId[this.STORE];

      const tag = "P" + this.product._source.id;

      const elastic_url = this.$config.ELASTIC_URL;
      const STORE = this.$config.STORE;
      const response = await fetch(
        elastic_url + `customers/${STORE}/${userId}/wishlist/${tag}`,
        { async: true, crossDomain: true, method: "POST" }
      );
      const updatedWishlist = await response.text();

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
.horizontal-awards {
  left: 30px;
  bottom: 30px;
  z-index: 10;
}
.vertical-awards {
  left: 20px;
  bottom: 10px;
  z-index: 10;
}

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

/* .btn-cart {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  color: white;
  background: #da4865;
  position: relative;
} */

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
  filter: brightness(0) opacity(0.4);
  width: 36px;
}
.integer {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1.5rem;
}

@media screen and (max-width: 768px) {
  .integer {
    font-size: 2rem;
  }
}
</style>
