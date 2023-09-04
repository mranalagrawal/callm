<script lang="ts">
import { computed, defineComponent, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import type { IPrismicPageData } from '~/types/prismic'
import { useShopifyCart } from '~/store/shopifyCart'
import { initialPageData } from '~/config/prismicConfig'
import { generateKey } from '~/utilities/strings'
import deliveryIcon from '~/assets/svg/delivery.svg'
import checkCircularIcon from '~/assets/svg/check-circular.svg'

export default defineComponent({
  name: 'HeaderMiniCart',
  setup() {
    const { $cmwStore } = useContext()
    const { checkout } = useShopifyCart()
    const { shopifyCart, cartTotal } = storeToRefs(useShopifyCart())

    const shipping = ref<IPrismicPageData>(initialPageData)

    useFetch(async ({ $cmwRepo }) => {
      shipping.value = await $cmwRepo.prismic.getSingle('shipping')
    })

    const computedCartTotal = computed(() => cartTotal.value($cmwStore.settings.salesChannel))

    return {
      cartTotal,
      checkCircularIcon,
      checkout,
      computedCartTotal,
      deliveryIcon,
      shipping,
      shopifyCart,
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
          <div v-if="shopifyCart && shopifyCart.totalQuantity > 0" class="min-w-[640px]">
            <div
              class="text-secondary-700 flex items-center justify-center gap-2 text-sm uppercase pb-4"
            >
              <VueSvgIcon
                :data="computedCartTotal < shipping.threshold ? deliveryIcon : checkCircularIcon" width="24"
                height="24"
              />
              <span>{{
                computedCartTotal < shipping.threshold ? shipping.threshold_not_reached : shipping.threshold_reached
              }}</span>
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
              <Button variant="ghost" :to="localePath('/cart')" :label="$t('navbar.cart.detail')" />
              <Button :label="$t('navbar.cart.checkout')" @click.native="checkout" />
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
            <Button class="py-4" to="/catalog?inpromotion=true">
              <span v-text="$t('navbar.cart.cta')" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
