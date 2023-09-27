<script>
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'
import OrderReceiptPrint from '~/components/UserProfile/OrderReceiptPrint.vue'
import { useShopifyCart } from '~/store/shopifyCart'

import { getLocaleFromCurrencyCode } from '~/utilities/currency'
import OrderCardSummary from '~/components/UserProfile/OrderCardSummary.vue'
import OrderCardLineItem from '~/components/UserProfile/OrderCardLineItem.vue'
import { isObject } from '~/utilities/validators'
import { useSplash } from '~/store/splash'
import { useCustomerOrders } from '~/store/customerOrders.ts'

export default defineComponent({
  components: {
    OrderReceiptPrint,
    OrderCardLineItem,
    OrderCardSummary,
  },
  props: {
    /** @Type: {OrderType.Order} */
    order: {
      required: true,
      validator(value) {
        return isObject(value)
      },
    },
    activeOrder: {
      type: Number,
      required: true,
    },
  },
  emits: ['update-order-id'],
  setup(props) {
    const {
      i18n,
      $config,
      $productMapping,
    } = useContext()
    const splash = useSplash()
    const customerOrders = useCustomerOrders()
    const { shopifyCart } = storeToRefs(useShopifyCart())
    const { cartLinesAdd, cartLinesUpdateV2, createShopifyCart } = useShopifyCart()

    const orderLineItems = computed(() => {
      const lineItems = props.order?.lineItems && props.order.lineItems.nodes?.map(node => node)
      return lineItems.filter(lineItem => Number(lineItem.discountedTotalPrice.amount) > 0)
    })
    const isActive = computed(() => props.activeOrder === props.order.orderNumber)

    const handleRequestAssistance = () => {
      splash.$patch({
        currentSplash: 'RequestOrderAssistance',
        title: i18n.t('profile.requestAssistanceTitle', { orderId: props.activeOrder }),
        subtitle: i18n.t('profile.requestAssistanceSubtitle'),
        size: 'lg',
      })

      customerOrders.$patch(
        { requestOrderAssistanceNumber: props.activeOrder },
      )
    }

    const getTitle = (key = 'CMW') => ({
      CMW: 'Callmewine',
      B2B: 'Callmewine B2B',
      CMW_UK: 'Callmewine UK',
      CMW_FR: 'Callmewine FR',
      CMW_DE: 'Callmewine DE',
    })[key] || 'Callmewine'

    const handlePrint = () => {
      document.title = `cmw-${props.order.orderNumber}`
      window.onafterprint = () => {
        document.title = getTitle($config.STORE)
      }
      window.print()
    }

    const handleReorderProducts = async () => {
      // If there's no cart create one
      if (!shopifyCart.value?.id) { await createShopifyCart() }

      // Check every Item in orderLineItems,
      for (const orderLine of orderLineItems.value) {
        const isOnCart = shopifyCart.value.lines?.nodes?.some(shopifyCartLine => shopifyCartLine.merchandise.id === orderLine.variant.id)

        if (isOnCart) {
          const shopifyCartLine = shopifyCart.value.lines.nodes.find(shopifyCartLine => shopifyCartLine.merchandise.id === orderLine.variant.id)
          // Todo: handle this in bulk, shopify accepts an array of lines, so, we can group all existing lines and later edit them in bulk
          // if the item is already on the cart then use the cartLineUpdate method

          // Fixme: there's a shopify bug using cartLinesUpdate when the user add more than 1 it creates 2 or more cartLines

          const lines = [
            {
              attributes: [
                {
                  key: 'gtmProductData',
                  value: shopifyCartLine.attributes.find(el => el.key === 'gtmProductData').value,
                },
                {
                  key: 'bundle',
                  value: shopifyCartLine.merchandise.product.tags.includes('BUNDLE').toString(),
                },
              ],
              id: shopifyCartLine.id,
              merchandiseId: orderLine.variant.id,
              quantity: shopifyCartLine.quantity + orderLine.quantity,
            },
          ]

          await cartLinesUpdateV2(lines)
        } else {
          // if it is not on cart use the addCartLine method
          const gtmProductData = $productMapping.getGtmProductDataFromCartLine(orderLine.variant.product)
          await cartLinesAdd({
            shopify_product_variant_id: orderLine.variant.id,
            quantity: orderLine.quantity,
            gtmProductData,
            tags: orderLine.variant.product.tags,
          })
        }
      }
    }

    return {
      cartLinesAdd,
      cartLinesUpdateV2,
      createShopifyCart,
      handlePrint,
      handleReorderProducts,
      handleRequestAssistance,
      isActive,
      orderLineItems,
    }
  },
  computed: {
    totalItems() {
      return this.order.lineItems.nodes
        .map(el => el.quantity)
        .reduce((t, n) => t + n)
    },
    canBuyAgain() {
      return this.order.lineItems && this.order.lineItems.nodes
        .map((el) => {
          if (el.variant) { return el.variant.product.availableForSale } else { return false }
        })
        .every(el => el === true)
    },
  },
  methods: {
    getLocaleFromCurrencyCode(code) {
      return getLocaleFromCurrencyCode(code)
    },
    handleClick(id) {
      this.$emit('update-order-id', id)
    },
    start(el) {
      el.style.height = `${el.scrollHeight}px`
    },

    end(el) {
      el.style.height = ''
    },
    afterEnter(el) {
      el.style.height = ''
      this.$refs.upperButton && this.$refs.upperButton.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    },
  },
})
</script>

<template>
  <div
    class="font-sans mb-3 rounded border border-gray-light overflow-hidden hover:shadow-elevation"
    :class="isActive ? 'shadow-elevation' : 'print:border-white'"
  >
    <div>
      <div
        ref="upperButton"
        class="print:hidden"
      >
        <!-- Desktop Top Card -->
        <div class="<md:hidden grid grid-cols-[auto_90px] h-90px text-sm">
          <button
            class="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center"
            @click="handleClick(order.orderNumber)"
          >
            <strong
              class="font-sans cmw-font-bold text-body tracking-normal"
              v-text="order.name"
            />
            <span
              class="font-sans text-body tracking-normal"
              v-text="$d(new Date(order.processedAt), 'short', $i18n.localeProperties.iso)"
            />
            <span
              class="font-sans text-body tracking-normal"
              v-text="order.shippingAddress.name"
            />
            <span
              class="font-sans text-body tracking-normal"
              v-text="totalItems"
            />
            <span
              class="font-sans text-body tracking-normal"
              v-text="$n(Number(order.totalPrice.amount), 'currency', getLocaleFromCurrencyCode(order.totalPrice.currencyCode))"
            />
            <span
              class="font-sans text-body tracking-normal"
              v-text="$t(`enums.financialStatus.${order.financialStatus}`)"
            />
            <span
              class="font-sans text-body tracking-normal"
              v-text="$t(`enums.fulfillmentStatus.${order.fulfillmentStatus}`)"
            />
          </button>
          <button
            :class="isActive ? 'bg-gray-white' : 'bg-gray-lightest'"
            class="<md:hidden block w-full py-2"
            type="button"
            @click="handleClick(order.orderNumber)"
          >
            <VueSvgIcon
              class="transform transition-transform"
              color="#d94965"
              :class="isActive ? 'rotate-180' : 'rotate-0'"
              width="18"
              height="18"
              :data="require(`@/assets/svg/chevron-down.svg`)"
            />
          </button>
        </div>

        <!-- Mobile Top Card -->
        <button
          class="md:hidden grid text-sm auto-rows-auto w-full text-left py-8 px-4"
          type="button"
          @click="handleClick(order.orderNumber)"
        >
          <i18n
            path="profile.orders.card.order"
            tag="span"
            class="overline-2 uppercase text-secondary-400 mb-4"
          >
            <strong
              class="font-sans cmw-font-bold text-body tracking-normal"
              v-text="order.name"
            />
          </i18n>

          <i18n
            path="profile.orders.card.date"
            tag="span"
            class="text-secondary-400"
          >
            <span
              class="font-sans text-body tracking-normal"
              v-text="$d(new Date(order.processedAt), 'short', $i18n.localeProperties.iso)"
            />
          </i18n>

          <i18n
            path="profile.orders.card.recipient"
            tag="span"
            class="text-secondary-400"
          >
            <span
              class="font-sans text-body tracking-normal"
              v-text="order.shippingAddress.name"
            />
          </i18n>

          <span class="text-secondary-400">
            {{ $tc('profile.orders.card.products', totalItems) }}
            <span
              class="font-sans text-body tracking-normal"
              v-text="totalItems"
            />
          </span>

          <i18n
            path="profile.orders.card.total"
            tag="span"
            class="text-secondary-400"
          >
            <span
              class="font-sans text-body tracking-normal"
              v-text="$n(Number(order.totalPrice.amount), 'currency', getLocaleFromCurrencyCode(order.totalPrice.currencyCode))"
            />
          </i18n>

          <i18n
            path="profile.orders.card.financialStatus"
            tag="span"
            class="text-secondary-400"
          >
            <span
              class="font-sans text-body tracking-normal"
              v-text="$t(`enums.financialStatus.${order.financialStatus}`)"
            />
          </i18n>

          <i18n
            path="profile.orders.card.fulfillmentStatus"
            tag="span"
            class="text-secondary-400"
          >
            <span
              class="font-sans text-body tracking-normal"
              v-text="$t(`enums.fulfillmentStatus.${order.fulfillmentStatus}`)"
            />
          </i18n>
        </button>
      </div>

      <!-- Middle Section -->
      <transition
        name="accordion"
        @enter="start"
        @after-enter="afterEnter"
        @before-leave="start"
        @after-leave="end"
      >
        <div v-if="activeOrder === order.orderNumber">
          <div class="bg-gray-lightest md:(m-4 rounded) print:hidden">
            <OrderCardSummary
              :fulfillment-status="order.fulfillmentStatus"
              :successful-fulfillments="order.successfulFulfillments[0] ? order.successfulFulfillments[0] : null"
              :shipping-address="order.shippingAddress"
            />
            <!-- Note: ?? doesn't work well on the current configuration :successful-fulfillments="order.successfulFulfillments[0] ?? null" -->
          </div>
          <!-- <div> TODO: Gift Notes Section </div> -->
          <div class="flex items-end justify-between px-4 md:items-center print:hidden">
            <div>
              <small><strong v-text="order.lineItems.nodes.length" />
                <span>{{ $tc('profile.orders.card.goods', order.lineItems.nodes.length) }}</span>
              </small>
            </div>
            <!-- Cta Section -->
            <div class="flex gap-2 flex-col my-4 md:(flex-row) print:hidden">
              <div>
                <Button
                  variant="text"
                  class="ml-auto"
                  :label="$t('common.cta.requestAssistance')"
                  @click.native="handleRequestAssistance"
                />
              </div>
              <div>
                <Button
                  variant="default"
                  :label="$t('common.cta.reorderProducts')"
                  :disabled="!canBuyAgain"
                  @click.native="handleReorderProducts"
                />
              </div>
              <div>
                <Button
                  :label="$t('common.cta.print')"
                  @click.native="handlePrint"
                />
              </div>
            </div>
          </div>
          <OrderReceiptPrint :order="order" />
          <hr class="print:hidden mx-4 border-gray-light">
          <!-- Products Section -->
          <OrderCardLineItem
            v-for="lineItem in orderLineItems"
            :key="`${lineItem.variant.sku}-${lineItem.originalTotalPrice.amount}`"
            :order-line-item="lineItem"
            :discount-applications="order.discountApplications"
          />
          <!-- Total Section -->
          <div class="grid grid-cols-2 justify-between px-6 mb-8 md:(px-0 mr-18 ml-75px) print:hidden">
            <div
              class="h5"
              v-text="$t('profile.orders.card.productsTotal')"
            />
            <div
              class="h5 place-self-end"
              v-text="$n(Number(order.subtotalPrice.amount), 'currency', getLocaleFromCurrencyCode(order.subtotalPrice.currencyCode))"
            />
            <div
              class="text-base font-regular"
              v-text="$t('profile.orders.card.shipmentCost')"
            />
            <div
              v-if="order.totalShippingPrice.amount > 0"
              class="place-self-end"
              v-text="$n(Number(order.totalShippingPrice.amount), 'currency', getLocaleFromCurrencyCode(order.totalShippingPrice.currencyCode))"
            />
            <div v-else class="place-self-end">
              {{ $t('profile.orders.card.shipmentCostFree') }}
            </div>
            <div class="border-t border-t-secondary-400 w-full mt-4" />
            <div class="border-t border-t-secondary-400 w-full mt-4" />
            <div
              class="text-xl cmw-font-bold my-4 text-secondary-400"
              v-text="$t('profile.orders.card.orderTotal')"
            />
            <div
              class="text-xl cmw-font-bold my-4 place-self-end text-secondary-400"
              v-text="$n(Number(order.totalPrice.amount), 'currency', getLocaleFromCurrencyCode(order.totalPrice.currencyCode))"
            />
          </div>
        </div>
      </transition>
      <!-- Mobile Botton CTA Card -->
      <button
        class="md:hidden print:hidden block bg-gray-lightest w-full py-2"
        type="button"
        @click="handleClick(order.orderNumber)"
      >
        <VueSvgIcon
          class="transform transition-transform"
          color="#d94965"
          :class="isActive ? 'rotate-180' : 'rotate-0'"
          width="18"
          height="18"
          :data="require(`@/assets/svg/chevron-down.svg`)"
        />
      </button>
    </div>
  </div>
</template>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  will-change: height;
  transition: height 0.3s ease;
  overflow: hidden;
}

.accordion-enter, .accordion-leave-to {
  height: 0 !important;
}
</style>
