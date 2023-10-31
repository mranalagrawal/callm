<script lang="ts">
import { computed, defineComponent, onMounted, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import cartEmptyIcon from 'assets/svg/cart-empty.svg'
import CheckoutLine from '../components/Checkout/CheckoutLine.vue'
import { useCheckout } from '~/store/checkout'
import type { IProductBreadcrumbs } from '~/types/product'

import { getLocaleFromCurrencyCode } from '~/utilities/currency'
import { generateKey } from '~/utilities/strings'
import { SweetAlertConfirm } from '~/utilities/Swal'
import { useCustomer } from '~/store/customer'

export default defineComponent({
  components: { CheckoutLine },
  setup() {
    const { $cookies, $cmwStore, $config, $cmwGtmUtils, i18n } = useContext()
    const shipping = ref<any>({})
    const { getCustomerType } = storeToRefs(useCustomer())
    const checkoutStore = useCheckout()
    const { checkout, checkoutTotalPrice, checkoutTotalQuantity } = storeToRefs(checkoutStore)
    const { goToCheckout } = checkoutStore
    const customerStore = useCustomer()
    const { customer, customerId } = storeToRefs(customerStore)
    const orderNote = ref(checkout.value?.note)
    const breadcrumb: IProductBreadcrumbs[] = [
      { handle: '/', label: i18n.t('home'), to: '/' },
      { handle: '/cart', label: i18n.t('cart'), to: '/cart' },
    ]

    const { fetch } = useFetch(async ({ $cmwRepo }) => {
      shipping.value = await $cmwRepo.prismic.getSingle('shipping')
    })

    const emptyCart = () => {
      // Todo: use checkoutLineItemsRemove mutation
      SweetAlertConfirm.fire({
        icon: 'warning',
        text: i18n.t('common.confirm.deleteCart'),
        cancelButtonText: i18n.t('common.cta.cancel'),
        confirmButtonText: i18n.t('common.cta.confirm'),
        preConfirm: () => {
          $cookies.remove('cartId')
          checkoutStore.$reset()
        },
      })
    }

    const handleKeyUp = () => {
      checkoutStore.$patch({
        checkout: {
          ...checkout.value,
          note: orderNote.value,
        },
      })
    }

    const computedCheckoutTotalPrice = computed(() => checkoutTotalPrice.value($cmwStore.settings.salesChannel, getCustomerType.value))

    onMounted(() => {
      const products = checkout.value?.lineItems?.map((node) => {
        const gtmProductData = node.customAttributes.find(v => v.key === 'gtmProductData')
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
      cartEmptyIcon,
      checkout,
      checkoutTotalPrice,
      checkoutTotalQuantity,
      computedCheckoutTotalPrice,
      customer,
      customerId,
      emptyCart,
      fetch,
      goToCheckout,
      handleKeyUp,
      orderNote,
      shipping,
    }
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

      <ClientOnly>
        <div v-if="checkout && computedCheckoutTotalPrice > 0">
          <h1 class="h2 my-4" v-text="$t('cartDetails')" />
          <div class="grid md:(gap-8 grid-cols-[8fr_4fr]) my-4">
            <div class="">
              <div class="flex items-center justify-between border-b border-b-gray mt-4">
                <small><strong v-text="checkoutTotalQuantity" />
                  <span>{{ $tc('profile.orders.card.goods', computedCheckoutTotalPrice) }}</span>
                </small>
                <CmwButton class="w-max ml-auto" variant="text" :label="$t('common.cta.emptyCart')" @click.native="emptyCart" />
              </div>
              <div v-for="lineItem in checkout.lineItems" :key="generateKey(`checkout-${lineItem.id}`)">
                <CheckoutLine :checkout-line-item="lineItem" />
              </div>
              <div v-if="!$cmwStore.isUk" class="my-8">
                <div class="h4" v-text="$t('common.forms.cart.cart_order_note_title')" />
                <div class="relative">
                  <textarea
                    id="order-note"
                    v-model="orderNote"
                    :placeholder="$t('common.forms.cart.cart_order_note_placeholder')"
                    rows="4"
                    class="
              peer px-4 text-gray-dark py-3 w-full bg-transparent border border-gray-light
              rounded transition-colors
              hover:(border-gray)
              focus:(outline-none border-gray-dark placeholder-gray-light)
              autofill:(text-body border-info text-base)
              disabled:(border-gray-light/70 cursor-not-allowed)
"
                    :class="orderNote ? 'placeholder-gray-light' : 'placeholder-transparent'"
                    @keyup="handleKeyUp"
                  />
                  <label
                    for="message"
                    class="absolute m-0 left-4 transition-all select-none pointer-events-none truncate
               peer-focus:(text-[0.775rem] px-2 top-[-0.4rem] bg-white w-auto)
               peer-disabled:(text-gray-light/70) peer-focus:bg-white -bg-white"
                    :class="[
                      orderNote ? `text-[0.775rem] px-2 top-[-0.4rem] bg-white w-auto` : 'top-[0.75rem] w-full pr-8',
                    ]"
                  >{{ $t('common.forms.cart.cart_order_note') }}</label>
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
                  computedCheckoutTotalPrice < shipping.threshold ? shipping.threshold_not_reached : shipping.threshold_reached
                }}
              </div>
              <div class="shadow mx-auto border border-gray-light rounded overflow-hidden">
                <div class="p-4">
                  <div class="h5">
                    {{ $t('cartTotal') }}
                    <span class="float-right">{{
                      $n(Number(computedCheckoutTotalPrice), 'currency', getLocaleFromCurrencyCode($cmwStore.isUk ? "GBP" : "EUR"))
                    }}</span>
                  </div>
                  <hr>
                  <p class="text-sm text-gray-darkest" v-html="$t('discountCode')" />
                  <p class="text-sm text-gray-darkest" v-html="$t('shippingCost')" />
                  <CmwButton
                    type="button" variant="default"
                    @click.native="goToCheckout"
                  >
                    {{ $t('common.cta.goToCheckout') }}
                  </CmwButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <h1 class="h2 my-4" v-text="$t('navbar.cart.empty')" />
          <div class="text-center my-12">
            <VueSvgIcon :data="cartEmptyIcon" width="200" height="200" original />
          </div>
          <div class="mt-8">
            <CmwButton :to="localePath('/')" class="w-max mx-auto" :label="$t('common.cta.continueShopping')" />
          </div>
        </div>
      </ClientOnly>
      <pre class="text-xs">{{ checkout }}</pre>
    </div>
  </div>
</template>
