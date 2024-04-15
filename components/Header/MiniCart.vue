<script lang="ts">
import { computed, defineComponent, onMounted, useContext } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import { useCart } from '~/store/cart'
import { useCustomer } from '~/store/customer'

import checkCircularIcon from '~/assets/svg/check-circular.svg'
import deliveryIcon from '~/assets/svg/delivery.svg'

import { getLocaleFromCurrencyCode } from '~/utilities/currency'
import { generateKey } from '~/utilities/strings'

export default defineComponent({
  name: 'HeaderMiniCart',
  setup() {
    const {
      $cmwStore,
      $cookies,
      i18n,
    } = useContext()
    const { getCustomerType } = storeToRefs(useCustomer())
    const {
      cart,
      cartTotalPrice,
      cartTotalQuantity,
      shippingThresholdHasBeenReached,
      shippingThresholdRemaining,
    } = storeToRefs(useCart())
    const {
      getCartById,
      goToCheckout,
    } = useCart()

    const computedCartTotalPrice = computed(() => cartTotalPrice.value(getCustomerType.value))

    const { shippingThreshold } = $cmwStore.settings

    const shippingThresholdNotReached = computed(
      () => (shippingThreshold - Number(computedCartTotalPrice.value)).toFixed(2))

    const shippingThresholdNotReachedLabel
        = computed(() => i18n.n(
          shippingThresholdRemaining.value(getCustomerType.value),
          'currency',
          getLocaleFromCurrencyCode($cmwStore.isUk ? 'GBP' : 'EUR'),
        ).replace(/\u00A0/g, ''))

    const shippingThresholdLabel
        = computed(() => i18n.n(shippingThreshold,
          'currency',
          getLocaleFromCurrencyCode($cmwStore.isUk ? 'GBP' : 'EUR'),
        ).replace(/\u00A0/g, ''))

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
      getCustomerType,
      goToCheckout,
      shippingThreshold,
      shippingThresholdHasBeenReached,
      shippingThresholdLabel,
      shippingThresholdNotReached,
      shippingThresholdNotReachedLabel,
      shippingThresholdRemaining,
    }
  },
  methods: {
    getLocaleFromCurrencyCode,
    generateKey,
  },
})
</script>

<template>
  <div>
    <div class="border-t-4 border-t-primary-900 pt-4">
      <div>
        <div v-if="shippingThreshold">
          <div v-if="cartTotalQuantity > 0" class="min-w-[640px]">
            <div
              class="text-secondary-700 flex items-center justify-center gap-2 text-sm uppercase pb-4"
            >
              <VueSvgIcon
                :data="shippingThresholdHasBeenReached(getCustomerType) ? deliveryIcon : checkCircularIcon"
                width="24"
                height="24"
              />
              <span>{{
                shippingThresholdHasBeenReached(getCustomerType)
                  ? $t('shipping.threshold.reached')
                  : $t('shipping.threshold.info', { amount: shippingThresholdLabel })
              }}</span>
            </div>
            <div class="px-4">
              <hr class="border-gray-light">
            </div>
            <div class="c-miniCart__itemsBox max-h-[360px] overflow-y-auto overflow-x-hidden">
              <div v-for="line in cart.lines" :key="generateKey(`mini-cart-${line.id}`)">
                <CartLine :cart-line-item="line" />
              </div>
            </div>
            <ThresholdProgressBar class="px-4 mt-3" />
            <div class="grid grid-cols-2 gap-4 bg-gray-lightest p-4">
              <CmwButton
                class="js-go-to-cart" variant="ghost" :to="localePath('/cart')"
                :label="$t('navbar.cart.detail')"
              />
              <CmwButton :label="$t('navbar.cart.checkout')" @click.native="goToCheckout" />
            </div>
          </div>
          <div v-else class="min-w-[425px] text-center px-6 pb-4">
            <div class="text-secondary-700 flex items-center justify-center gap-2 text-sm uppercase pb-4">
              <VueSvgIcon :data="deliveryIcon" width="24" height="24" />
              <i18n
                path="shipping.threshold.remaining"
              >
                <template #amount>
                  <strong>{{ shippingThresholdNotReachedLabel }}</strong>
                </template>
              </i18n>
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

<style scoped>
.c-miniCart__itemsBox::-webkit-scrollbar {
  width: 3px;
}
</style>
