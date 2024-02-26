<script lang="ts">
import { computed, defineComponent, ref, useContext } from '@nuxtjs/composition-api'
import type { PropType } from '@nuxtjs/composition-api'
import { storeToRefs } from 'pinia'

import type { ILineItem, IOrder } from '~/types/order'

import chevronDownIcon from '~/assets/svg/chevron-down.svg'
import OrderCardLineItem from '~/components/UserProfile/OrderCardLineItem.vue'
import OrderCardSummary from '~/components/UserProfile/OrderCardSummary.vue'
import OrderReceiptPrint from '~/components/UserProfile/OrderReceiptPrint.vue'

import { getCountryFromStore, getLocaleFromCurrencyCode } from '~/utilities/currency'
import { generateKey } from '~/utilities/strings'
import { useCart } from '~/store/cart'
import { useCustomer } from '~/store/customer'
import { useCustomerOrders } from '~/store/customerOrders'
import { useSplash } from '~/store/splash'

export default defineComponent({
  components: {
    OrderReceiptPrint,
    OrderCardLineItem,
    OrderCardSummary,
  },
  props: {
    order: {
      type: Object as PropType<IOrder>,
      required: true,
    },
    activeOrder: {
      type: [Number, String],
      required: true,
    },
  },
  emits: ['update-order-id'],
  setup(props, { emit }) {
    const {
      i18n,
      $config,
      $productMapping,
      $cmwStore,
    } = useContext()

    const splash = useSplash()
    const { customer } = storeToRefs(useCustomer())
    const customerOrders = useCustomerOrders()
    const { cart } = storeToRefs(useCart())
    const { cartCreate, cartLinesAdd, cartLinesUpdate } = useCart()
    const upperButton = ref<HTMLElement | null>(null)
    const { iso } = i18n.localeProperties
    const isActive = computed(() => props.activeOrder === props.order.orderNumber)

    const orderLineItems = computed(() => {
      const lineItems = props.order?.lineItems && props.order.lineItems.nodes?.map(node => node)
      return lineItems.filter(lineItem => Number(lineItem.discountedTotalPrice.amount) > 0)
    })

    /* <pre class="text-xxs">{{ order.eventStatus }}</pre> */
    const orderFulfillmentStatus = computed(() => {
      const forbidden = [
        'confirmed',
        'delayed',
        'failure',
        'label_printed',
        'label_purchased',
        'ready_for_pickup',
      ]

      // If the order has an eventStatus and the key is different from a forbidden array, return the eventStatus
      return (props.order?.eventStatus?.value && !forbidden.includes(props.order.eventStatus.value))
        ? props.order.eventStatus.value
        : props.order?.fulfillmentStatus
    })

    const handleRequestAssistance = () => {
      splash.$patch({
        currentSplash: 'RequestOrderAssistance',
        title: i18n.t('profile.requestAssistanceTitle', { orderId: props.order.name || props.activeOrder }),
        subtitle: i18n.t('profile.requestAssistanceSubtitle'),
        size: 'lg',
      })

      customerOrders.$patch(
        {
          requestOrderAssistanceNumber: `${props.activeOrder}`,
          requestOrderAssistanceName: props.order.name,
        },
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
      document.title = `cmw-${props.order?.orderNumber}`
      window.onafterprint = () => {
        document.title = getTitle($config.STORE)
      }
      window.print()
    }

    const totalItems = computed(() => {
      return props.order?.lineItems.nodes
        .map(el => el.quantity)
        .reduce((t, n) => t + n)
    })

    const canBuyAgain = computed(() => {
      return props.order.lineItems && props.order.lineItems.nodes
        .map((el) => {
          if (el.variant) { return el.variant.product.availableForSale } else { return false }
        })
        .every(el => el === true)
    })

    const handleClick = (id: any) => {
      emit('update-order-id', id)
    }

    const afterEnter = (el: HTMLElement) => {
      el.style.height = ''

      if (!upperButton.value) { return }

      upperButton.value.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }

    const handleReorderProducts = async () => {
      // If there's no cart create one
      if (!cart.value?.id) {
        const cartInput = {
          buyerIdentity: {
            countryCode: getCountryFromStore($cmwStore.settings.store),
            ...(customer.value.email && { email: customer.value.email }),
          },
          lines: [],
        }
        await cartCreate(cartInput)
      }

      // Check every Item in orderLineItems,
      const lines = cart.value.lines || []

      // Separate line items into alreadyInCheckoutItems and notInCheckoutItems
      const { alreadyInCartItems, notInCheckoutItems } = orderLineItems.value.reduce(
        (result: any, orderLineItem: ILineItem) => {
          const checkoutLineItem = lines.find(
            checkoutItem => checkoutItem.merchandise.id === orderLineItem.variant.id,
          )

          if (checkoutLineItem) {
            // If the line item is the same, add it to alreadyInCartItems
            result.alreadyInCartItems.push({
              attributes: checkoutLineItem.attributes,
              id: checkoutLineItem.id,
              quantity: checkoutLineItem.quantity + orderLineItem.quantity,
              merchandiseId: checkoutLineItem.merchandise.id,
            })
          } else {
            // If the line item is not in the checkout, add it to notInCheckoutItems
            const gtmProductData = $productMapping.getGtmProductDataFromCartLine(orderLineItem.variant.product)
            result.notInCheckoutItems.push({
              attributes: [
                {
                  key: 'gtmProductData',
                  value: gtmProductData ? JSON.stringify(gtmProductData) : 'false',
                },
                {
                  key: 'bundle',
                  value: (orderLineItem.variant?.product?.tags) ? orderLineItem.variant.product.tags.includes('BUNDLE').toString() : 'false',
                },
              ],
              quantity: orderLineItem.quantity,
              merchandiseId: orderLineItem.variant.id,
            })
          }

          return result
        },
        { alreadyInCartItems: [], notInCheckoutItems: [] },
      )

      if (notInCheckoutItems.length) {
        await cartLinesAdd(cart.value.id, notInCheckoutItems)
      }

      if (alreadyInCartItems.length) {
        await cartLinesUpdate(cart.value.id, alreadyInCartItems)
      }
    }

    return {
      afterEnter,
      canBuyAgain,
      cartLinesAdd,
      cartLinesUpdate,
      chevronDownIcon,
      customer,
      handleClick,
      handlePrint,
      handleReorderProducts,
      handleRequestAssistance,
      isActive,
      iso,
      orderFulfillmentStatus,
      orderLineItems,
      totalItems,
      upperButton,
    }
  },
  methods: {
    generateKey,
    getLocaleFromCurrencyCode,
    start(el: { style: { height: string }; scrollHeight: any }) {
      el.style.height = `${el.scrollHeight}px`
    },

    end(el: { style: { height: string } }) {
      el.style.height = ''
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
              v-text="$d(new Date(order.processedAt), 'short', iso)"
            />
            <span
              class="font-sans text-body tracking-normal"
              v-text="order.shippingAddress?.name ? order.shippingAddress?.name : '-'"
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
              v-text="$t(`enums.fulfillmentStatus.${orderFulfillmentStatus}`)"
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
              :data="chevronDownIcon"
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
              v-text="$d(new Date(order.processedAt), 'short', iso)"
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
              v-text="$t(`enums.fulfillmentStatus.${orderFulfillmentStatus}`)"
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
              :fulfillment-status="orderFulfillmentStatus"
              :successful-fulfillments="order.successfulFulfillments[0] ? order.successfulFulfillments[0] : null"
              :shipping-address="order.shippingAddress"
              :source-tracking-number="order.sourceTrackingNumber?.value"
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
                <CmwButton
                  variant="text"
                  class="ml-auto"
                  :label="$t('common.cta.requestAssistance')"
                  @click.native="handleRequestAssistance"
                />
              </div>
              <div>
                <CmwButton
                  variant="default"
                  :label="$t('common.cta.reorderProducts')"
                  :disabled="!canBuyAgain"
                  @click.native="handleReorderProducts"
                />
              </div>
              <div>
                <CmwButton
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
            v-for="(lineItem, idx) in orderLineItems"
            :key="generateKey(`${lineItem.variant ? lineItem.variant.id : `m-${idx}`}-${lineItem.originalTotalPrice.amount}`)"
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
          :data="chevronDownIcon"
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
