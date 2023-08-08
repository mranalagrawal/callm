<script>
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import checkCircularIcon from 'assets/svg/check-circular.svg'
import deliveryIcon from 'assets/svg/delivery.svg'
import locales from '../../locales-mapper'
import documents from '../../prismic-mapper'
import { useShopifyCart } from '~/store/shopifyCart'
import { generateKey } from '~/utilities/strings'

export default defineComponent({
  name: 'HeaderMiniCart',
  props: {
    show: {
      type: [Boolean],
    },
  },
  setup() {
    const { $config } = useContext()
    const shopifyCartStore = useShopifyCart()
    const checkout = shopifyCartStore.checkout
    const { shopifyCart, cartTotal } = storeToRefs(shopifyCartStore)

    const computedCartTotal = computed(() => cartTotal.value($config.SALECHANNEL))

    return {
      cartTotal,
      computedCartTotal,
      checkCircularIcon,
      checkout,
      customer,
      customerId,
      deliveryIcon,
      shopifyCart,
    }
  },
  data() {
    return {
      shipping: null,
    }
  },
  async fetch() {
    // TODO: move this to setup()
    let lang = locales[this.$i18n.locale]

    if (lang === 'en-gb' && this.$config.STORE === 'CMW')
      lang = 'en-eu'

    if (this.$config.STORE === 'B2B')
      lang = 'it-br'

    const response = await this.$prismic.api.getSingle(
      documents[this.$config.STORE].shipping,
      {
        lang,
      },
    )
    this.shipping = response.data
  },
  methods: { generateKey },
})
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
