<template>
  <div class="product-card mx-auto mt-4" style="width: 94%">
    <div>
      <div v-if="details.promoTagIcon" class="ribbon">
        <VueSvgIcon :data="promoTagIcon" color="white" class="d-inline"/>
        <span class="text-uppercase" style="letter-spacing: 3px" v-text="$t('product.promo')" />
      </div>

      <div
        class="position-relative mx-0 mt-2 img-wrapper text-decoration-none text-dark"
      >
        <nuxt-link
          :to="`/${product.handle}-${product.tags[0]}`"
          draggable="false"
        >
          <img
            :src="product.images.nodes[0].url"
            alt=""
            class="d-block mx-auto"
            style="height: 300px; user-drag: none"
            draggable="false"
          />
        </nuxt-link>
        <div
          class="position-absolute"
          style="left: 0px; bottom: 10px; z-index: 10"
        >
          <div v-for="(award, i) in awards" :key="product.id + 'award_' + i">
            <AwardTooltip :award="award" />
          </div>
        </div>
        <div class="position-absolute" style="left: 0px; top: 0px; z-index: 10">
<!-- Todo: Find a better way to handle this data, agreed with BE to have some Arrays or use some _pick function -->
          <VueSvgIcon
            v-if="details.organic"
            color="#a3a3a3"
            :data="require(`@/assets/svg/selections/organic.svg`)"
            class="d-block mb-3"
            width="36" height="auto"
          />
          <VueSvgIcon
            v-if="details.favourite"
            color="#a3a3a3"
            :data="require(`@/assets/svg/selections/favourite.svg`)"
            class="d-block mb-3"
            width="36" height="auto"
          />
          <VueSvgIcon
            v-if="details.foreveryday"
            color="#a3a3a3"
            :data="require(`@/assets/svg/selections/foreveryday.svg`)"
            class="d-block mb-3"
            width="36" height="auto"
          />
          <VueSvgIcon
            v-if="details.isnew"
            color="#a3a3a3"
            :data="require(`@/assets/svg/selections/isnew.svg`)"
            class="d-block mb-3"
            width="36" height="auto"
          />
          <VueSvgIcon
            v-if="details.artisanal"
            color="#a3a3a3"
            :data="require(`@/assets/svg/selections/artisanal.svg`)"
            class="d-block mb-3"
            width="36" height="auto"
          />
          <VueSvgIcon
            v-if="details.togift"
            color="#a3a3a3"
            :data="require(`@/assets/svg/selections/togift.svg`)"
            class="d-block mb-3"
            width="36" height="auto"
          />
          <VueSvgIcon
            v-if="details.rarewine"
            color="#a3a3a3"
            :data="require(`@/assets/svg/selections/rarewine.svg`)"
            class="d-block mb-3"
            width="36" height="auto"
          />
          <VueSvgIcon
            v-if="details.unusualvariety"
            color="#a3a3a3"
            :data="require(`@/assets/svg/selections/unusualvariety.svg`)"
            class="d-block mb-3"
            width="36" height="auto"
          />
          <VueSvgIcon
            v-if="details.topsale"
            color="#a3a3a3"
            :data="require(`@/assets/svg/selections/topsale.svg`)"
            class="d-block mb-3"
            width="36" height="auto"
          />
        </div>
        <div style="position: absolute; bottom: 0px; right: 2px">
          <i
            class="text-light-secondary"
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
              class="text-light-secondary mr-2"
              :class="
                isInWishList ? 'fas fa-heart fa-2x' : 'fal fa-heart fa-2x '
              "
              @click.stop="toggleWishlist"
            ></i>
          </div>
        </div>
      </div> -->
      <div class="">
        <div class="prodotto-box__nome">
          {{ product.title }}
        </div>

        <div
          style="margin-top: 30px"
          class="d-flex justify-content-between align-items-end position-relative"
        >
          <div>
            <p
              class="mb-1"
              style="text-decoration: line-through; color: #8c8d8e"
              v-if="
                +product.variants.nodes[0].compareAtPriceV2.amount !==
                +product.variants.nodes[0].price
              "
            >
              {{
                (+product.variants.nodes[0].compareAtPriceV2.amount).toFixed(2)
              }}
              {{ product.variants.nodes[0].compareAtPriceV2.currencyCode }}
            </p>
            <p v-else class="mb-1">&nbsp;</p>
            <p class="mb-0">
              <span class="integer">{{
                product.variants.nodes[0].price.split(".")[0]
              }}</span
              >,<span>{{ product.variants.nodes[0].price.split(".")[1] }}</span>
              {{ product.variants.nodes[0].compareAtPriceV2.currencyCode }}
            </p>
          </div>

          <div class="position-relative" v-if="product.availableForSale">
            <button class="btn btn-cart" @click.stop="addToUserCart()"></button>
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
                <span style="font-size: 24px" @click.stop="removeFromUserCart()"
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
    </div>
  </div>
</template>

<script>
import AwardTooltip from "./UI/AwardTooltip.vue";
import promoTagIcon from 'assets/svg/promo-tag.svg'

export default {
  props: ["product"],
  name: "ProductCardVertical",
  components: { AwardTooltip },
  data() {
    return {
      promoTagIcon,
      details: JSON.parse(this.product.metafield1.value),
      isOpen: false,
      awards: JSON.parse(this.product.metafield1.value).awards.slice(0, 5),
    };
  },
  computed: {
    isInWishList() {
      if (!this.$store.state.user.user) return false;
      let wishlist = this.$store.state.user.user.customer.wishlist;

      // wishlist is null by default
      if (wishlist) {
        return JSON.parse(wishlist.value).includes(this.product.tags[0]);
      }

      return false;
    },
    userCartQuantity() {
      const productVariantId = this.product.variants.nodes[0].id;
      let isInCart = this.$store.state.userCart.userCart.find(
        (el) => el.productVariantId == productVariantId
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

      const elastic_url = this.$config.ELASTIC_URL;
      const STORE = this.$config.STORE;
      const response = await fetch(
        elastic_url +
          `customers/${STORE}/${userId}/wishlist/${this.product.tags[0]}`,
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
    async addToUserCart() {
      if (!this.isOpen) this.isOpen = true;

      const productVariantId = this.product.variants.nodes[0].id;
      const amount = Number(this.product.variants.nodes[0].price);
      const amountFullPrice = Number(
        this.product.variants.nodes[0].compareAtPriceV2.amount
      );
      const tag = this.product.tags[0];
      const image = this.product.images.nodes[0].url;
      const title = this.product.title;
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
        message: `${this.product.title} è stato aggiunto al carrello!`,
        icon: this.product.images.nodes[0].url,
        iconClass: "bg-transparent ",
        time: 8000,
        blockClass: "add-product-notification",
      });
    },
    async removeFromUserCart() {
      const productVariantId = this.product.variants.nodes[0].id;
      this.$store.commit("userCart/removeProduct", productVariantId);
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
  background-color: var(--light-secondary);
  width: 100%;
  border-radius: 12px 12px 0 0;
  z-index: 1;
  height: 0px;
  overflow: hidden;
  transition-duration: 0.2s;
}

.selection-svg {
  filter: brightness(0) opacity(0.4);
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
</style>
