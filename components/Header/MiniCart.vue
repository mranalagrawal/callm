<script>
import checkCircularIcon from 'assets/svg/check-circular.svg'
import deliveryIcon from 'assets/svg/delivery.svg'
import { storeToRefs } from 'pinia'
import locales from '../../locales-mapper'
import documents from '../../prismic-mapper'
import { useShopifyCart } from '~/store/shopifyCart'
import { generateKey } from '~/utilities/strings'

export default {
  name: 'HeaderMiniCart',
  props: {
    show: {
      type: [Boolean],
    },
  },
  setup() {
    const { shopifyCart, cartTotal } = storeToRefs(useShopifyCart())
    return {
      cartTotal,
      shopifyCart,
    }
  },
  data() {
    return {
      deliveryIcon,
      checkCircularIcon,
      data: null,
      shipping: null,
    }
  },
  async fetch() {
    let lang = locales[this.$i18n.locale]

    if (lang === 'en-gb' && this.$config.STORE === 'CMW')
      lang = 'en-eu'

    const response = await this.$prismic.api.getSingle(
      documents[this.$config.STORE].shipping,
      {
        lang,
      },
    )
    this.shipping = response.data
  },
  computed: {
    checkoutUrl() {
      let baseUrl = `${this.shopifyCart.checkoutUrl}/?`

      this.$store.state.user.user.customer.email
      && (baseUrl += `&checkout[email]=${this.$store.state.user.user.customer.email}`)

      this.$store.state.user.user.customer.defaultAddress?.firstName
      && (baseUrl += `&checkout[shipping_address][first_name]=${this.$store.state.user.user.customer.defaultAddress.firstName}`)

      this.$store.state.user.user.customer.defaultAddress?.lastName
      && (baseUrl += `&checkout[shipping_address][last_name]=${this.$store.state.user.user.customer.defaultAddress.lastName}`)

      this.$store.state.user.user.customer.defaultAddress?.address1
      && (baseUrl += `&checkout[shipping_address][address1]=${this.$store.state.user.user.customer.defaultAddress.address1}`)

      this.$store.state.user.user.customer.defaultAddress?.address2
      && (baseUrl += `&checkout[shipping_address][address2]=${this.$store.state.user.user.customer.defaultAddress.address2}`)

      this.$store.state.user.user.customer.defaultAddress?.country
      && (baseUrl += `&checkout[shipping_address][country]=${this.$store.state.user.user.customer.defaultAddress.country}`)

      this.$store.state.user.user.customer.defaultAddress?.province
      && (baseUrl += `&checkout[shipping_address][province]=${this.$store.state.user.user.customer.defaultAddress.province}`)

      this.$store.state.user.user.customer.defaultAddress?.city
      && (baseUrl += `&checkout[shipping_address][city]=${this.$store.state.user.user.customer.defaultAddress.city}`)

      this.$store.state.user.user.customer.defaultAddress?.zip
      && (baseUrl += `&checkout[shipping_address][zip]=${this.$store.state.user.user.customer.defaultAddress.zip}`)

      return baseUrl
    },
  },

  methods: {
    generateKey,
    async checkout() {
      if (!this.$store.state.user.user) {
        // crea checkoutUrl
        window.location = this.shopifyCart.checkoutUrl
        return
      }
      // crea checkoutUrl
      let checkoutUrl = `${this.shopifyCart.checkoutUrl}/?`
      this.$store.state.user.user.customer.email
      && (checkoutUrl += `&checkout[email]=${this.$store.state.user.user.customer.email}`)

      this.$store.state.user.user.customer.defaultAddress?.firstName
      && (checkoutUrl += `&checkout[shipping_address][first_name]=${this.$store.state.user.user.customer.defaultAddress.firstName}`)

      this.$store.state.user.user.customer.defaultAddress?.lastName
      && (checkoutUrl += `&checkout[shipping_address][last_name]=${this.$store.state.user.user.customer.defaultAddress.lastName}`)

      this.$store.state.user.user.customer.defaultAddress?.address1
      && (checkoutUrl += `&checkout[shipping_address][address1]=${this.$store.state.user.user.customer.defaultAddress.address1}`)

      this.$store.state.user.user.customer.defaultAddress?.address2
      && (checkoutUrl += `&checkout[shipping_address][address2]=${this.$store.state.user.user.customer.defaultAddress.address2}`)

      this.$store.state.user.user.customer.defaultAddress?.country
      && (checkoutUrl += `&checkout[shipping_address][country]=${this.$store.state.user.user.customer.defaultAddress.country}`)

      this.$store.state.user.user.customer.defaultAddress?.province
      && (checkoutUrl += `&checkout[shipping_address][province]=${this.$store.state.user.user.customer.defaultAddress.province}`)

      this.$store.state.user.user.customer.defaultAddress?.city
      && (checkoutUrl += `&checkout[shipping_address][city]=${this.$store.state.user.user.customer.defaultAddress.city}`)

      this.$store.state.user.user.customer.defaultAddress?.zip
      && (checkoutUrl += `&checkout[shipping_address][zip]=${this.$store.state.user.user.customer.defaultAddress.zip}`)
      // redirect al checkoutUrl

      window.location = checkoutUrl
    },
  },
}
</script>

<template>
  <div>
    <div class="border-t-4 border-t-primary-900 pt-4">
      <div>
        <div v-if="shipping">
          <div v-if="shopifyCart && shopifyCart.totalQuantity > 0" class="min-w-[640px]">
            <div
              class="text-secondary-700 flex items-center justify-center gap-2 text-sm uppercase pb-4"
            >
              <VueSvgIcon :data="cartTotal < shipping.threshold ? deliveryIcon : checkCircularIcon" width="24" height="24" />
              <span>{{ cartTotal < shipping.threshold ? shipping.threshold_not_reached : shipping.threshold_reached }}</span>
            </div>
            <div class="px-4">
              <hr class="border-gray-light">
            </div>
            <div class="max-h-[360px] overflow-y-auto overflow-x-hidden">
              <div v-for="item in shopifyCart.lines.edges" :key="generateKey(`mini-cart-${item.node.id}`)">
                <CartLine :item="item.node" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 bg-gray-lightest p-4">
              <Button variant="ghost" :to="localePath('/cart')">
                {{
                  $t("navbar.cart.detail")
                }}
              </Button>
              <Button @click.native="checkout()">
                {{ $t("navbar.cart.checkout") }}
              </Button>
            </div>
          </div>
          <div v-else class="min-w-[425px] text-center px-6 pb-4">
            <div
              class="text-secondary-700 flex items-center justify-center gap-2 text-sm uppercase py-0"
            >
              <VueSvgIcon :data="deliveryIcon" width="24" height="24" />
              <span>{{ shipping.threshold_not_reached }}</span>
            </div>
            <hr>
            <strong class="block">{{ $t("navbar.cart.empty") }}</strong>
            <p class="pt-4">
              {{ $t("navbar.cart.startFromMessage") }}
            </p>
            <Button class="py-4" to="/">
              <span>{{ $t("navbar.cart.cta") }}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
