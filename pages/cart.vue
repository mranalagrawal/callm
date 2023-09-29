<script lang="ts">
import { computed, defineComponent, onMounted, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import CartLine from '../components/Cart/CartLine.vue'
import type { IProductBreadcrumbs } from '~/types/product'
import { useShopifyCart } from '~/store/shopifyCart'

import { getLocaleFromCurrencyCode } from '~/utilities/currency'
import { generateKey } from '~/utilities/strings'
import { SweetAlertConfirm } from '~/utilities/Swal'
import { useCustomer } from '~/store/customer'

export default defineComponent({
  components: { CartLine },
  setup() {
    const { $cookies, $config, $cmwGtmUtils, i18n } = useContext()
    const shipping = ref({})
    const shopifyCartStore = useShopifyCart()
    const { checkout } = useShopifyCart()
    const { shopifyCart, cartTotal } = storeToRefs(useShopifyCart())
    const customerStore = useCustomer()
    const { customer, customerId } = storeToRefs(customerStore)
    // @ts-expect-error we need to define shopifyCart type
    const orderNote = ref(shopifyCart.value?.note)
    const breadcrumb: IProductBreadcrumbs[] = [
      { handle: '/', label: i18n.t('home'), to: '/' },
      { handle: '/cart', label: i18n.t('cart'), to: '/cart' },
    ]

    const { fetch } = useFetch(async ({ $cmwRepo }) => {
      shipping.value = await $cmwRepo.prismic.getSingle('shipping')
    })

    const emptyCart = () => {
      SweetAlertConfirm.fire({
        icon: 'warning',
        text: i18n.t('common.confirm.deleteCart'),
        cancelButtonText: i18n.t('common.cta.cancel'),
        confirmButtonText: i18n.t('common.cta.confirm'),
        preConfirm: () => {
          $cookies.remove('cartId')
          shopifyCart.value = null
        },
      })
    }

    const handleKeyUp = () => {
      shopifyCartStore.$patch({
        shopifyCart: {
          ...shopifyCart.value as any,
          note: orderNote.value,
        },
      })
    }

    const computedCartTotal = computed(() => cartTotal.value($config.SALECHANNEL))

    onMounted(() => {
      // @ts-expect-error we need to define shopifyCart type
      const products = shopifyCart.value?.lines?.nodes?.map(
        (node: { attributes: any[]; quantity: any }) => {
          const gtmProductData = node.attributes.find(v => v.key === 'gtmProductData')
          const productDataJson = gtmProductData?.value ?? null
          return productDataJson
            ? {
                ...JSON.parse(productDataJson),
                quantity: node.quantity,
              }
            : {}
        },
      )

      process.browser && $cmwGtmUtils.pushPage('product', {
        event: 'cartView',
        pageType: 'cart',
        ecommerce: {
          currencyCode: $config.STORE === 'CMW_UK' ? 'GBP' : 'EUR',
          checkout: {
            actionField: {
              step: '0',
            },
            products,
          },
        },
      })
    })

    return {
      breadcrumb,
      cartTotal,
      checkout,
      computedCartTotal,
      customer,
      customerId,
      emptyCart,
      fetch,
      handleKeyUp,
      orderNote,
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
    getLocaleFromCurrencyCode,
  },
})
</script>

<template>
  <div class="font-sans">
    <div class="max-w-screen-xl mx-auto py-4 px-4 min-h-[600px]">
      <TheBreadcrumbs
        :breadcrumbs="breadcrumb"
      />

      <pre>{{ shopifyCart.note }}</pre>
      <ClientOnly>
        <div v-if="cart && computedCartTotal > 0">
          <h1 class="h2 my-4" v-text="$t('cartDetails')" />
          <div class="grid md:(gap-8 grid-cols-[8fr_4fr]) my-4">
            <div class="">
              <div class="flex items-center justify-between border-b border-b-gray mt-4">
                <small><strong v-text="cart.totalQuantity" />
                  <span>{{ $tc('profile.orders.card.goods', computedCartTotal) }}</span>
                </small>
                <Button class="w-max ml-auto" variant="text" :label="$t('common.cta.emptyCart')" @click.native="emptyCart" />
              </div>
              <div v-for="item in cart.lines.edges" :key="generateKey(`cart-${item.node.id}`)">
                <CartLine :item="item.node" />
              </div>
              <div v-if="!$cmwStore.isUk" class="my-8">
                <div class="h4">
                  Aggiungi una nota (optional)
                </div>
                <div class="relative">
                  <textarea
                    id="order-note"
                    v-model="orderNote"
                    :placeholder="$t('profile.ratingMessage')"
                    rows="3"
                    class="
              px-4 text-sm py-3 w-full bg-info/15 border border-info/15 placeholder-gray-dark
              focus:(outline-none border-info)
              autofill:(text-body border-info text-sm)
"
                    @keyup="handleKeyUp"
                  />
                  <label
                    for="order-note"
                    class="sr-only"
                  >{{ $t('profile.ratingMessage') }}</label>
                </div>
              </div>
              <div class="my-4">
                <p class="text-sm mt-2">
                  {{ $t('continueShopping') }}
                  <NuxtLink
                    class="cmw-font-bold text-primary-400"
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
                  computedCartTotal < shipping.threshold ? shipping.threshold_not_reached : shipping.threshold_reached
                }}
              </div>
              <div class="shadow mx-auto border border-gray-light rounded overflow-hidden">
                <div class="p-4">
                  <div class="h5">
                    {{ $t('cartTotal') }}
                    <span class="float-right">{{
                      $n(Number(computedCartTotal), 'currency', getLocaleFromCurrencyCode($config.STORE === "CMW_UK" ? "GBP" : "EUR"))
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
