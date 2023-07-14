<script>
import { onMounted, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import CartLine from '../components/Cart/CartLine.vue'
import { generateKey } from '~/utilities/strings'
import prismicConfig from '~/config/prismicConfig'

import { getLocaleFromCurrencyCode } from '~/utilities/currency'
import { SweetAlertConfirm } from '~/utilities/Swal'
import { useShopifyCart } from '~/store/shopifyCart'

export default {
  components: { CartLine },
  layout(context) {
    return context.$config.STORE
  },
  setup() {
    const { $config, $cmwGtmUtils } = useContext()
    const shipping = ref({})
    const { shopifyCart, cartTotal } = storeToRefs(useShopifyCart())

    const { fetch } = useFetch(async ({ $config, $cmwRepo }) => {
      shipping.value = await $cmwRepo.prismic.getSingle({ page: prismicConfig[$config.STORE]?.components.shipping })
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
            products: [], // FixMe: fix this, store.state.userCart.userCart.map(p => p.gtmProductData),
          },
        },
      })
    })

    return {
      cartTotal,
      fetch,
      getLocaleFromCurrencyCode,
      shipping,
      shopifyCart,
    }
  },
  computed: {
    cart() {
      return this.shopifyCart ? this.shopifyCart : null
    },
  },

  methods: {
    generateKey,
    emptyCart() {
      SweetAlertConfirm.fire({
        icon: 'warning',
        text: this.$i18n.t('common.confirm.deleteCart'),
        cancelButtonText: this.$t('common.cta.cancel'),
        confirmButtonText: this.$t('common.cta.confirm'),
        preConfirm: () => {
          this.$cookies.set('cartId', '')
          this.shopifyCart = null
        },
      })
    },
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
  <div class="font-sans">
    <div class="max-w-screen-xl mx-auto py-4 px-4 min-h-[600px]">
      <TheBreadcrumbs
        :breadcrumbs="[
          { handle: '/', label: $t('home'), to: '/' },
          { handle: '/cart', label: $t('cart'), to: '/cart' },
        ]"
      />

      <ClientOnly>
        <div v-if="cart && cartTotal > 0">
          <h1 class="h2 my-4" v-text="$t('cartDetails')" />
          <div class="grid md:(gap-8 grid-cols-[8fr_4fr]) my-4">
            <div class="">
              <div class="flex items-center justify-between border-b border-b-gray mt-4">
                <small><strong v-text="cart.totalQuantity" />
                  <span>{{ $tc('profile.orders.card.goods', cartTotal) }}</span>
                </small>
                <Button class="w-max ml-auto" variant="text" :label="$t('common.cta.emptyCart')" @click.native="emptyCart" />
              </div>
              <div v-for="item in cart.lines.edges" :key="generateKey(`cart-${item.node.id}`)">
                <CartLine :item="item.node" />
              </div>
              <div class="my-4">
                <p class="text-sm mt-2">
                  {{ $t('continueShopping') }}
                  <NuxtLink
                    class="font-bold text-primary-400"
                    :to="localePath('/')"
                  >
                    {{ $t('common.cta.continueShopping') }}
                  </NuxtLink>
                </p>
              </div>
            </div>
            <div>
              <div class="text-center my-2 overline-2 uppercase text-secondary-700">
                {{
                  cartTotal < shipping.threshold ? shipping.threshold_not_reached : shipping.threshold_reached
                }}
              </div>
              <div class="shadow mx-auto border border-gray-light rounded overflow-hidden">
                <div class="p-4">
                  <div class="h5">
                    {{ $t('cartTotal') }}
                    <span class="float-right">{{
                      $n(Number(cartTotal), 'currency', getLocaleFromCurrencyCode($config.STORE === "CMW_UK" ? "GBP" : "EUR"))
                    }}</span>
                  </div>
                  <hr>
                  <p class="text-sm text-gray-darkest" v-html="$t('discountCode')" />
                  <p class="text-sm text-gray-darkest" v-html="$t('shippingCost')" />
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
          <h1 class="h2 my-4" v-text="$t('navbar.cart.empty')" />
          <div class="text-center my-12">
            <VueSvgIcon :data="require(`@/assets/svg/cart-empty.svg`)" width="200" height="200" original />
          </div>
          <div class="mt-8">
            <Button :to="localePath('/')" class="w-max mx-auto" :label="$t('common.cta.continueShopping')" />
          </div>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>
