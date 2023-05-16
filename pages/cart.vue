<script>
import { onMounted, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import { mapGetters } from 'vuex'
import CartLine from '../components/Cart/CartLine.vue'
import { addProductToCart, createCart, removeProductFromCart } from '~/utilities/cart'
import { getLocaleFromCurrencyCode } from '~/utilities/currency'
import locales from '~/locales-mapper'
import documents from '~/prismic-mapper'
import { SweetAlertConfirm } from '~/utilities/Swal'

export default {
  components: { CartLine },
  /* middleware: "auth", */
  layout(context) {
    return context.$config.STORE
  },
  setup() {
    const { $prismic, i18n, $config, store, $cmwGtmUtils } = useContext()
    const shipping = ref({})

    const { fetch } = useFetch(async () => {
      let lang = locales[i18n.locale]
      if (lang === 'en-gb' && $config.STORE === 'CMW')
        lang = 'en-eu'

      const { data } = await $prismic.api.getSingle(documents[$config.STORE].shipping, { lang })
      shipping.value = data
    })

    onMounted(() => {
      process.browser && $cmwGtmUtils.pushPage('product', {
        event: 'cartView',
        pageType: 'cart',
        ecommerce: {
          currencyCode: $config.STORE === 'CMW_UK' ? 'GBP' : 'EUR',
          checkout: {
            actionField: {
              step: '0',
            },
            products: store.state.userCart.userCart.map(p => p.gtmProductData),
          },
        },
      })
    })

    return { fetch, shipping, getLocaleFromCurrencyCode }
  },
  computed: {
    ...mapGetters({
      cartTotalAmountObj: 'userCart/cartTotalAmountObj',
      cartTotalAmount: 'userCart/getCartTotalAmount',
    }),
    cart() {
      return this.$store.state.cart.cart
    },
    userCart() {
      return this.$store.state.userCart.userCart
    },
    cartTotalQuantity() {
      const cart = this.$store.state.userCart.userCart
      const total = cart.reduce((t, n) => t + n.quantity, 0)

      return total
    },
  },

  methods: {
    async remove(lineId) {
      const domain = this.$config.DOMAIN
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN
      const cartId = this.$store.state.cart.cart.id

      // remove from shopify
      const cart = await removeProductFromCart(
        domain,
        access_token,
        cartId,
        lineId,
      )

      this.$store.commit('cart/setCart', cart)
    },
    emptyCart() {
      SweetAlertConfirm.fire({
        icon: 'warning',
        text: this.$i18n.t('common.confirm.deleteCart'),
        cancelButtonText: this.$t('common.cta.cancel'),
        confirmButtonText: this.$t('common.cta.confirm'),
        preConfirm: () => {
          this.$store.commit('userCart/resetCart')
        },
      })
    },
    async checkout() {
      // redirect if not user
      if (!this.$store.state.user.user) {
        // crea carrello su shop
        const domain = this.$config.DOMAIN
        const access_token = this.$config.STOREFRONT_ACCESS_TOKEN
        const user = this.$store.state.user.user || 'test'
        const cart = await createCart(domain, access_token, user)
        const cartId = cart.id

        // update in bulk del cart
        const lines = this.$store.state.userCart.userCart.map((el) => {
          return {
            merchandiseId: el.productVariantId,
            quantity: el.quantity,
            attributes: [
              {
                key: 'bundle',
                value: el.tag.includes('bundle'),
              },
            ],
          }
        })

        const cartFilled = await addProductToCart(
          domain,
          access_token,
          cartId,
          lines,
        )
        // crea checkoutUrl
        window.location = `${cartFilled.checkoutUrl}/?`
        return
      }

      // crea carrello su shop
      const domain = this.$config.DOMAIN
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN
      const user = this.$store.state.user.user
      const cart = await createCart(domain, access_token, user)
      const cartId = cart.id

      // update in bulk del cart
      const lines = this.$store.state.userCart.userCart.map((el) => {
        return {
          merchandiseId: el.productVariantId,
          quantity: el.quantity,
        }
      })

      const cartFilled = await addProductToCart(
        domain,
        access_token,
        cartId,
        lines,
      )

      // crea checkoutUrl
      let checkoutUrl = `${cartFilled.checkoutUrl}/?`
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
      if (process.client)
        window.location = checkoutUrl
    },
  },
}
</script>

<template>
  <div class="cmw-font-sans container-fluid">
    <div class="cmw-max-w-screen-xl cmw-mx-auto">
      <div class="container-fluid">
        <nav class="cmw-flex cmw-items-center cmw-gap-2 cmw-text-sm cmw-pt-1.875rem cmw-mt-2 cmw-mb-6 cmw-px-4">
          <NuxtLink
            class="cmw-text-primary-400"
            :to="localePath('/')"
          >
            {{ $t('home') }}
          </NuxtLink>
          <VueSvgIcon
            :data="require(`@/assets/svg/chevron-right.svg`)"
            width="12"
            height="12"
          />
          <span class="cmw-text-gray-dark">{{ $t('cart') }}</span>
        </nav>
      </div>

      <client-only>
        <div
          v-if="userCart && userCart.length > 0"
          class="container-fluid"
          style="min-height: 600px"
        >
          <div class="row my-5">
            <div class="col-12 mb-3">
              <h2 v-text="$t('cartDetails')" />
            </div>
            <div class="col-12 col-md-7">
              <div class="cmw-flex cmw-items-center cmw-justify-between cmw-border-b cmw-border-b-gray-light">
                <small><strong v-text="cartTotalQuantity" />
                  <span>{{ $tc('profile.orders.card.goods', cartTotalQuantity) }}</span>
                </small>
                <Button class="cmw-w-max cmw-ml-auto" variant="text" :label="$t('common.cta.emptyCart')" @click.native="emptyCart" />
              </div>
              <div class="cmw-my-4">
                <CartLine v-for="(item, i) in userCart" :key="item.id" :item="item" :is-last="(i + 1) >= userCart.length" />
              </div>
              <div class=" cmw-border-t cmw-border-t-gray-light">
                <p class="cmw-text-sm cmw-mt-2">
                  {{ $t('continueShopping') }}
                  <NuxtLink
                    class="cmw-font-bold cmw-text-primary-400 hover:(cmw-text-primary-400 cmw-no-underline)"
                    :to="localePath('/')"
                  >
                    {{ $t('common.cta.continueShopping') }}
                  </NuxtLink>
                </p>
              </div>
            </div>
            <div class="col-12 col-md-5 px-0 px-md-5">
              <div class="cmw-text-center cmw-my-2 cmw-overline-2 cmw-uppercase cmw-text-secondary-700">
                {{
                  cartTotalAmount < shipping.threshold ? shipping.threshold_not_reached : shipping.threshold_reached
                }}
              </div>
              <div class="shadow mx-auto cmw-border cmw-border-gray-light cmw-rounded cmw-overflow-hidden">
                <div class="card-body">
                  <h5 class="card-title font-weight-bold">
                    {{ $t('cartTotal') }}
                    <span class="float-right">{{
                      $n(Number(cartTotalAmountObj.value), 'currency', getLocaleFromCurrencyCode($config.STORE === "CMW_UK" ? "GBP" : "EUR"))
                    }}</span>
                  </h5>
                  <hr>
                  <p class="cmw-text-sm cmw-text-gray-darkest" v-html="$t('discountCode')" />
                  <p class="cmw-text-sm cmw-text-gray-darkest" v-html="$t('shippingCost')" />
                  <Button
                    type="button" variant="default"
                    @click.native="checkout()"
                  >
                    {{ $t('common.cta.goToCheckout') }}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="container">
            <div class="row mt-5">
              <div class="col-12">
                <h2 class="cmw-text-center">
                  {{ $t("navbar.cart.empty") }}
                </h2>
                <div class="cmw-text-center cmw-my-12">
                  <VueSvgIcon :data="require(`@/assets/svg/cart-empty.svg`)" width="200" height="200" original />
                </div>
                <div class="cmw-mt-8">
                  <Button :to="localePath('/')" class="cmw-w-max cmw-mx-auto" :label="$t('common.cta.continueShopping')" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </client-only>
    </div>
  </div>
</template>
