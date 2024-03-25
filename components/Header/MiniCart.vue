<script lang="ts">
import { computed, defineComponent, onMounted, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import type { IPrismicPageData } from '~/types/prismic'

import { generateKey } from '~/utilities/strings'
import { initialPageData } from '~/config/prismicConfig'
import { useCart } from '~/store/cart'
import { useCustomer } from '~/store/customer'

import checkCircularIcon from '~/assets/svg/check-circular.svg'
import deliveryIcon from '~/assets/svg/delivery.svg'

export default defineComponent({
  name: 'HeaderMiniCart',
  setup() {
    const { $cmwStore, $cookies } = useContext()
    const { getCustomerType } = storeToRefs(useCustomer())
    const { cart, cartTotalQuantity, cartTotalPrice } = storeToRefs(useCart())
    const { getCartById, goToCheckout } = useCart()

    const shipping = ref<IPrismicPageData>(initialPageData)

    useFetch(async ({ $cmwRepo }) => {
      shipping.value = await $cmwRepo.prismic.getSingle('shipping')
    })

    const computedCartTotalPrice = computed(() => cartTotalPrice.value($cmwStore.settings.salesChannel, getCustomerType.value))

    onMounted(async () => {
      const cartIdCookie = $cookies.get('cartId')

      if (cartIdCookie) {
        await getCartById(cartIdCookie)
      }
    })

    return {
      cart,
      cartTotalPrice,
      cartTotalQuantity,
      checkCircularIcon,
      computedCartTotalPrice,
      deliveryIcon,
      goToCheckout,
      shipping,
    }
  },
  methods: { generateKey },
})
</script>

<template>
  <div>
    <div class="border-t-4 border-t-primary-900 pt-4">
      <div>
        <div v-if="shipping?.threshold">
          <div v-if="cartTotalQuantity > 0" class="min-w-[640px]">
            <div
              class="text-secondary-700 flex items-center justify-center gap-2 text-sm uppercase pb-4"
            >
              <VueSvgIcon
                :data="computedCartTotalPrice < shipping.threshold ? deliveryIcon : checkCircularIcon" width="24"
                height="24"
              />
              <span>{{
                computedCartTotalPrice < shipping.threshold ? shipping.threshold_not_reached : shipping.threshold_reached
              }}</span>
            </div>
            <div class="px-4">
              <hr class="border-gray-light">
            </div>
            <div class="max-h-[360px] overflow-y-auto overflow-x-hidden">
              <div v-for="line in cart.lines" :key="generateKey(`mini-cart-${line.id}`)">
                <CartLine :cart-line-item="line" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 bg-gray-lightest p-4">
              <CmwButton class="js-go-to-cart" variant="ghost" :to="localePath('/cart')" :label="$t('navbar.cart.detail')" />
              <CmwButton :label="$t('navbar.cart.checkout')" @click.native="goToCheckout" />
            </div>
          </div>
          <div v-else class="min-w-[425px] text-center px-6 pb-4">
            <div class="text-secondary-700 flex items-center justify-center gap-2 text-sm uppercase pb-4">
              <VueSvgIcon :data="deliveryIcon" width="24" height="24" />
              <span v-text="shipping.threshold_not_reached" />
            </div>
            <hr>
            <strong class="block" v-text="$t('navbar.cart.empty')" />
            <p class="pt-4" v-text="$t('navbar.cart.startFromMessage')" />
            <CmwButton class="py-4" to="/catalog?inpromotion=true">
              <span v-text="$t('navbar.cart.cta')" />
            </CmwButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
