<script lang="ts">
import { computed, defineComponent, onMounted, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import type { IProductBreadcrumbs } from '~/types/product'

import addIcon from '~/assets/svg/add.svg'
import cartEmptyIcon from '~/assets/svg/cart-empty.svg'
import toGiftIcon from '~/assets/svg/feature-to-gift.svg'

import { getCountryFromStore, getLocaleFromCurrencyCode } from '~/utilities/currency'
import { generateKey } from '~/utilities/strings'
import { SweetAlertConfirm } from '~/utilities/Swal'
import { useCart } from '~/store/cart'
import { useCustomer } from '~/store/customer'

export default defineComponent({
  setup() {
    const { $cookies, $cmwStore, $cmwGtmUtils, i18n } = useContext()
    const customerStore = useCustomer()
    const shipping = ref<any>({})
    const { getCustomerType } = storeToRefs(useCustomer())
    const cartStore = useCart()
    const { cart, suitableGift, cartTotalPrice, cartTotalQuantity } = storeToRefs(cartStore)
    const { getCartById, cartLinesRemove, cartLinesAdd, goToCheckout } = cartStore
    const { customer, customerId } = storeToRefs(customerStore)
    const orderNote = ref(cart.value?.note)
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
          cartLinesRemove(cart.value.id, cart.value.lines)
          $cookies.remove('cartId')
          cartStore.$reset()
        },
      })
    }

    const handleKeyUp = () => {
      cartStore.$patch({
        cart: {
          ...cart.value,
          note: orderNote.value,
        },
      })
    }

    const suitableGiftIsOnCart = computed(() =>
      cart.value?.lines?.some(item => item.merchandise.id === suitableGift.value?.shopify_product_variant_id))

    const handleAddGift = async () => {
      const cartInput = {
        buyerIdentity: {
          countryCode: getCountryFromStore($cmwStore.settings.store),
          ...(customer.value.email && { email: customer.value.email }),
        },
        note: cart.value.note,
        lines: [
          {
            merchandiseId: suitableGift.value?.shopify_product_variant_id,
            quantity: 1,
            attributes: [
              {
                key: 'gift',
                value: 'true',
              },
              {
                key: 'gtmProductData',
                value: suitableGift.value?.gtmProductData ? JSON.stringify(suitableGift.value.gtmProductData) : 'false',
              },
              {
                key: 'bundle',
                value: 'false',
              },
            ],
          },
        ],
      }

      await cartLinesAdd(cart.value.id, cartInput.lines)
    }

    const computedCartTotalPrice = computed(() => cartTotalPrice.value($cmwStore.settings.salesChannel, getCustomerType.value))

    onMounted(async () => {
      const cartIdCookie = $cookies.get('cartId')

      if (cartIdCookie) {
        await getCartById(cartIdCookie)
        orderNote.value = cart.value?.note
      }

      const products = cart.value?.lines?.map((node) => {
        const gtmProductData = node.attributes.find(v => v.key === 'gtmProductData')
        const productDataJson = gtmProductData?.value ?? null
        return productDataJson
          ? {
              ...JSON.parse(productDataJson),
              quantity: node.quantity,
            }
          : {}
      })

      process.browser && $cmwGtmUtils.pushPage('product', {
        event: 'cartView',
        pageType: 'cart',
        ecommerce: {
          currencyCode: $cmwStore.isUk ? 'GBP' : 'EUR',
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
      addIcon,
      breadcrumb,
      cart,
      cartEmptyIcon,
      cartTotalPrice,
      cartTotalQuantity,
      computedCartTotalPrice,
      customer,
      customerId,
      emptyCart,
      fetch,
      goToCheckout,
      handleAddGift,
      handleKeyUp,
      orderNote,
      shipping,
      suitableGift,
      suitableGiftIsOnCart,
      toGiftIcon,
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
        <div v-if="cart && computedCartTotalPrice > 0">
          <h1 class="h2 my-4" v-text="$t('cartDetails')" />
          <div class="grid md:(gap-8 grid-cols-[8fr_4fr]) my-4">
            <div class="">
              <div class="flex items-center justify-between border-b border-b-gray mt-4">
                <small><strong v-text="cartTotalQuantity" />
                  <span>{{ $tc('profile.orders.card.goods', computedCartTotalPrice) }}</span>
                </small>
                <CmwButton class="w-max ml-auto" variant="text" :label="$t('common.cta.emptyCart')" @click.native="emptyCart" />
              </div>
              <div v-if="suitableGift?.id && !suitableGiftIsOnCart">
                <div class="bg-secondary-50 rounded my-2 mx-3 grid grid-cols-[70px_1fr_40px] gap-4 items-center justify-start md:(grid-cols-[70px_1fr_auto])">
                  <div class="w-70px p-2">
                    <img
                      v-show="suitableGift.image?.source?.url"
                      :src="suitableGift.image.source.url"
                      :alt="suitableGift.image.source.altText" class="max-h-90px mix-blend-darken"
                    >
                  </div>
                  <div class="py-2">
                    <div class="text-sm leading-snug">
                      {{ suitableGift?.title }}
                    </div>
                    <div class="flex items-center gap-1 my-1">
                      <VueSvgIcon :data="toGiftIcon" class="flex-shrink-0" width="20" height="20" color="#134c45" />
                      {{ $t('eventGiftNote') }}
                    </div>
                  </div>
                  <CmwButton variant="text" class="mr-8" @click.native="handleAddGift">
                    <VueSvgIcon :data="addIcon" width="18" height="18" color="#d94965" />
                    <span class="ml-2 <md:hidden">{{ $t('common.cta.add') }}</span>
                  </CmwButton>
                </div>
              </div>
              <div v-for="line in cart.lines" :key="generateKey(`checkout-${line.id}`)">
                <CartLine :cart-line-item="line" />
              </div>
              <div v-if="!$cmwStore.isUk" class="my-8">
                <div class="h4" v-text="$t('common.forms.cart.cart_order_note_title')" />
                <div class="relative">
                  <textarea
                    id="order-note"
                    v-model="orderNote"
                    :placeholder="$t('common.forms.cart.cart_order_note_placeholder')"
                    rows="4"
                    maxlength="50"
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
                  computedCartTotalPrice < shipping.threshold ? shipping?.threshold_not_reached : shipping?.threshold_reached
                }}
              </div>
              <div class="shadow mx-auto border border-gray-light rounded overflow-hidden">
                <div class="p-4">
                  <div class="h5">
                    {{ $t('cartTotal') }}
                    <span class="float-right">{{
                      $n(Number(computedCartTotalPrice), 'currency', getLocaleFromCurrencyCode($cmwStore.isUk ? "GBP" : "EUR"))
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
    </div>
  </div>
</template>
