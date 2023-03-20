<script>
import promoTagIcon from 'assets/svg/promo-tag.svg'
import { storeToRefs } from 'pinia'
import AwardTooltip from './UI/AwardTooltip.vue'
import heartFullIcon from '~/assets/svg/heart-full.svg'
import heartIcon from '~/assets/svg/heart.svg'
import { useCustomer } from '~/store/customer'
import { regexRules } from '~/utilities/validators'
import { SweetAlertToast } from '~/utilities/Swal'

export default {
  name: 'ProductCardVertical',
  components: { AwardTooltip },
  props: ['product'],
  setup() {
    const customerStore = useCustomer()
    const { wishlistArr, getCustomerType } = storeToRefs(customerStore)
    const { handleWishlist } = customerStore

    return { wishlistArr, getCustomerType, handleWishlist }
  },
  data() {
    return {
      heartIcon,
      heartFullIcon,
      promoTagIcon,
      details: (this.product.metafield1 && this.product.metafield1.value) ? JSON.parse(this.product.metafield1.value) : {},
      isOpen: false,
      awards: (this.product.metafield1 && this.product.metafield1.value) ? JSON.parse(this.product.metafield1.value).awards.slice(0, 5) : [],
    }
  },
  computed: {
    backofficeId() {
      // Get the proper tag 🤦🏻
      return this.product.tags.find(tag => new RegExp(regexRules('isProduct')).test(tag))
    },
    isOnFavourite() {
      return this.wishlistArr.includes(this.backofficeId)
    },
    userCartQuantity() {
      const productVariantId = this.product.variants.nodes[0].id
      const isInCart = this.$store.state.userCart.userCart.find(
        el => el.productVariantId === productVariantId,
      )

      return isInCart ? isInCart.quantity : 0
    },
    cartQuantity() {
      if (!this.$store.state.cart.cart)
        return 0

      const cartList = this.$store.state.cart.cart.lines.edges.map(el => ({
        merchandise: el.node.merchandise.id,
        quantity: el.node.quantity,
      }))

      const isInCart = cartList.find(
        el => el.merchandise === this.product.variants.nodes[0].id,
      )

      if (isInCart)
        return isInCart.quantity
      else
        return 0
    },
    canAddMore() {
      return this.product.totalInventory - this.userCartQuantity > 0
    },
    finalPrice() {
      return this.details.priceLists[this.$config.SALECHANNEL][this.getCustomerType]
    },
  },
  methods: {
    async addToUserCart() {
      if (!this.isOpen)
        this.isOpen = true

      if (!this.canAddMore) {
        await SweetAlertToast.fire({
          icon: 'warning',
          text: this.$i18n.t('common.feedback.KO.addToCartReachLimit'),
        })
        return
      }

      const totalInventory = this.product.totalInventory
      const productVariantId = this.product.variants.nodes[0].id
      const amount = this.finalPrice
      const amountFullPrice = Number(
        this.product.variants.nodes[0].compareAtPriceV2.amount,
      )
      const tag = this.product.tags[0]
      const image = this.product.images.nodes[0] ? this.product.images.nodes[0].url : ''
      const title = this.product.title
      this.$store.commit('userCart/addProduct', {
        productVariantId,
        singleAmount: amount,
        singleAmountFullPrice: amountFullPrice,
        tag,
        image,
        title,
        totalInventory,
      })
      this.flashMessage.show({
        status: '',
        message: `${this.product.title} è stato aggiunto al carrello!`,
        icon: this.product.images.nodes[0].url,
        iconClass: 'bg-transparent ',
        time: 8000,
        blockClass: 'add-product-notification',
      })
    },
    async removeFromUserCart() {
      const productVariantId = this.product.variants.nodes[0].id
      this.$store.commit('userCart/removeProduct', productVariantId)
    },
  },
}
</script>

<template>
  <div class="product-card mx-auto mt-4" style="width: 94%;">
    <div v-if="details">
      <div v-if="details.inpromotion" class="ribbon">
        <VueSvgIcon :data="promoTagIcon" color="white" class="cmw-mt-1" style="line-height: 0.875rem" />
        <span class="text-uppercase cmw-text-sm cmw-mb-2" style="letter-spacing: 3px;" v-text="$t('product.promoLabel')" />
      </div>

      <div
        class="position-relative mx-0 mt-2 img-wrapper text-decoration-none text-dark"
      >
        <nuxt-link
          :to="`/${product.handle}-${backofficeId}.htm`"
          draggable="false"
        >
          <LoadingImage
            v-if="product.images.nodes[0]"
            class="cmw-h-full"
            img-classes="d-block mx-auto cmw-w-auto cmw-h-[300px]"
            :thumbnail="{
              url: `${product.images.nodes[0].url}?&width=20&height=36`,
              width: 20,
              height: 36,
              altText: details ? details.name[$i18n.locale] : 'missing',
            }"
            :source="{
              url: `${product.images.nodes[0].url}?&width=300&height=540&crop=center`,
              width: 300,
              height: 540,
              altText: details ? details.name[$i18n.locale] : 'missing',
            }"
          />
        </nuxt-link>
        <div
          class="position-absolute"
          style="left: 0px; bottom: 10px; z-index: 10"
        >
          <div v-for="(award, i) in awards" :key="`${product.id}award_${i}`">
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
        <div class="cmw-absolute cmw-bottom-0 cmw-right-0">
          <button
            type="button"
            :aria-label="isOnFavourite ? $t('enums.accessibility.role.REMOVE_FROM_WISHLIST') : $t('enums.accessibility.role.ADD_TO_WISHLIST')"
            @click="handleWishlist({ id: backofficeId, isOnFavourite })"
          >
            <VueSvgIcon color="#d94965" width="32" height="32" :data="isOnFavourite ? heartFullIcon : heartIcon" />
          </button>
        </div>
      </div>

      <div class="">
        <div class="prodotto-box__nome">
          <nuxt-link
            draggable="false"
            :to="localePath(`/${product.handle}-${backofficeId}.htm`)"
            class="cmw-text-body hover:(cmw-text-primary-400 cmw-no-underline)"
          >
            {{ product.title }}
          </nuxt-link>
        </div>

        <div
          style="margin-top: 30px"
          class="d-flex justify-content-between align-items-end position-relative"
        >
          <div>
            <p
              v-if="
                +product.variants.nodes[0].compareAtPriceV2.amount
                  !== +product.variants.nodes[0].price
              "
              class="mb-1"
              style="text-decoration: line-through; color: #8c8d8e"
            >
              {{
                (+product.variants.nodes[0].compareAtPriceV2.amount).toFixed(2)
              }}
              {{ product.variants.nodes[0].compareAtPriceV2.currencyCode }}
            </p>
            <p v-else class="mb-1">
              &nbsp;
            </p>
            <p class="mb-0">
              <span class="integer">{{
                String(finalPrice).split(".")[0]
              }}</span>,<span>{{ String(finalPrice).split(".")[1] }}</span>
              {{ product.variants.nodes[0].compareAtPriceV2.currencyCode }}
            </p>
          </div>

          <div v-if="product.availableForSale" class="position-relative">
            <button class="btn btn-cart" :aria-label="$t('enums.accessibility.role.ADD_TO_CART')" @click.stop="addToUserCart" />
            <span v-show="userCartQuantity > 0" class="cart-quantity">
              {{ userCartQuantity }}
            </span>
            <div
              v-show="isOpen"
              class="cart-dropup"
              @mouseleave="isOpen = false"
            >
              <button class="btn text-white" :disabled="!canAddMore">
                <span style="font-size: 24px" @click.stop="addToUserCart()">+</span>
              </button>
              <p class="mb-0 text-white text-center py-2">
                {{ userCartQuantity }}
              </p>
              <button class="btn text-white">
                <span style="font-size: 24px" @click.stop="removeFromUserCart()">-</span>
              </button>
            </div>
          </div>
          <div v-else class="position-relative">
            <button class="btn btn-cart disabled" disabled />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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
