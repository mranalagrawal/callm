<script>
import { computed, useContext } from '@nuxtjs/composition-api'

import { getLocaleFromCurrencyCode } from '~/utilities/currency'
import OrderCardSummary from '~/components/UserProfile/OrderCardSummary.vue'
import OrderCardProductRow from '~/components/UserProfile/OrderCardProductRow.vue'
import { isObject } from '~/utilities/validators'
import { useSplash } from '~/store/splash'
import { useCustomerOrders } from '~/store/customerOrders'

export default {
  components: { OrderCardProductRow, OrderCardSummary },
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
    const { i18n } = useContext()
    const splash = useSplash()
    const customerOrders = useCustomerOrders()
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

    /* const handleReorderProducts = () => {

    } */

    const isActive = computed(() => props.activeOrder === props.order.orderNumber)
    return { isActive, handleRequestAssistance }
  },
  computed: {
    orderLineItems() {
      const lineItems = this.order.lineItems && this.order.lineItems.edges

      const newMap = []
      if (lineItems) {
        lineItems.forEach((l) => {
          if (l.node.variant)
            newMap.push(l)
        })
      }

      return newMap
    },
    totalItems() {
      return this.order.lineItems.edges
        .map(el => el.node.quantity)
        .reduce((t, n) => t + n)
    },
    canBuyAgain() {
      return this.order.lineItems && this.order.lineItems.edges
        .map((el) => {
          if (el.node.variant)
            return el.node.variant.product.availableForSale
          else
            return false
        })
        .every(el => el === true)
    },
  },
  methods: {
    getLocaleFromCurrencyCode(code) {
      return getLocaleFromCurrencyCode(code)
    },
    async handleReorderProducts() {
      this.order.lineItems.edges
        .map(el => el.node)
        .forEach((el) => {
          const productVariantId = el.variant.id
          const amount = Number(el.variant.product.variants.nodes[0].price)
          const amountFullPrice = Number(
            el.variant.product.variants.nodes[0].compareAtPriceV2.amount,
          )
          const tag = el.variant.product.tags[0]
          const image = el.variant.product.images.nodes[0].url

          const title = el.title
          this.$store.commit('userCart/addProduct', {
            productVariantId,
            singleAmount: amount,
            singleAmountFullPrice: amountFullPrice,
            tag,
            image,
            title,
          })
        })
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
}
</script>

<template>
  <div
    class="cmw-font-sans cmw-mb-3 cmw-rounded cmw-border cmw-border-gray-light cmw-overflow-hidden hover:cmw-shadow-elevation"
    :class="{ 'cmw-shadow-elevation': isActive }"
  >
    <div>
      <div
        ref="upperButton"
        class=""
      >
        <!-- Desktop Top Card -->
        <div class="<md:cmw-hidden cmw-grid cmw-grid-cols-[auto_90px] cmw-h-90px cmw-text-sm">
          <button
            class="cmw-grid cmw-grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] cmw-items-center"
            @click="handleClick(order.orderNumber)"
          >
            <strong
              class="cmw-font-sans cmw-font-bold cmw-text-body cmw-tracking-normal"
              v-text="order.orderNumber"
            />
            <span
              class="cmw-font-sans cmw-text-body cmw-tracking-normal"
              v-text="$d(new Date(order.processedAt), 'short', $i18n.localeProperties.iso)"
            />
            <span
              class="cmw-font-sans cmw-text-body cmw-tracking-normal"
              v-text="order.shippingAddress.name"
            />
            <span
              class="cmw-font-sans cmw-text-body cmw-tracking-normal"
              v-text="totalItems"
            />
            <span
              class="cmw-font-sans cmw-text-body cmw-tracking-normal"
              v-text="$n(Number(order.totalPriceV2.amount), 'currency', getLocaleFromCurrencyCode(order.totalPriceV2.currencyCode))"
            />
            <span
              class="cmw-font-sans cmw-text-body cmw-tracking-normal"
              v-text="$t(`enums.financialStatus.${order.financialStatus}`)"
            />
            <span
              class="cmw-font-sans cmw-text-body cmw-tracking-normal"
              v-text="$t(`enums.fulfillmentStatus.${order.fulfillmentStatus}`)"
            />
          </button>
          <button
            :class="isActive ? 'cmw-bg-gray-white' : 'cmw-bg-gray-lightest'"
            class="<md:cmw-hidden cmw-block cmw-w-full cmw-py-2"
            type="button"
            @click="handleClick(order.orderNumber)"
          >
            <VueSvgIcon
              class="cmw-transform cmw-transition-transform"
              color="#d94965"
              :class="isActive ? 'cmw-rotate-180' : 'cmw-rotate-0'"
              width="18"
              height="18"
              :data="require(`@/assets/svg/chevron-down.svg`)"
            />
          </button>
        </div>

        <!-- Mobile Top Card -->
        <button
          class="md:cmw-hidden cmw-grid cmw-text-sm cmw-auto-rows-auto cmw-w-full cmw-text-left cmw-py-8 cmw-px-4"
          type="button"
          @click="handleClick(order.orderNumber)"
        >
          <i18n
            path="profile.orders.card.order"
            tag="span"
            class="cmw-overline-2 cmw-uppercase cmw-text-secondary-400 cmw-mb-4"
          >
            <strong
              class="cmw-font-sans cmw-font-bold cmw-text-body cmw-tracking-normal"
              v-text="order.orderNumber"
            />
          </i18n>

          <i18n
            path="profile.orders.card.date"
            tag="span"
            class="cmw-text-secondary-400"
          >
            <span
              class="cmw-font-sans cmw-text-body cmw-tracking-normal"
              v-text="$d(new Date(order.processedAt), 'short', $i18n.localeProperties.iso)"
            />
          </i18n>

          <i18n
            path="profile.orders.card.recipient"
            tag="span"
            class="cmw-text-secondary-400"
          >
            <span
              class="cmw-font-sans cmw-text-body cmw-tracking-normal"
              v-text="order.shippingAddress.name"
            />
          </i18n>

          <span class="cmw-text-secondary-400">
            {{ $tc('profile.orders.card.products', totalItems) }}
            <span
              class="cmw-font-sans cmw-text-body cmw-tracking-normal"
              v-text="totalItems"
            />
          </span>

          <i18n
            path="profile.orders.card.total"
            tag="span"
            class="cmw-text-secondary-400"
          >
            <span
              class="cmw-font-sans cmw-text-body cmw-tracking-normal"
              v-text="$n(Number(order.totalPriceV2.amount), 'currency', getLocaleFromCurrencyCode(order.totalPriceV2.currencyCode))"
            />
          </i18n>

          <i18n
            path="profile.orders.card.financialStatus"
            tag="span"
            class="cmw-text-secondary-400"
          >
            <span
              class="cmw-font-sans cmw-text-body cmw-tracking-normal"
              v-text="$t(`enums.financialStatus.${order.financialStatus}`)"
            />
          </i18n>

          <i18n
            path="profile.orders.card.fulfillmentStatus"
            tag="span"
            class="cmw-text-secondary-400"
          >
            <span
              class="cmw-font-sans cmw-text-body cmw-tracking-normal"
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
          <div class="cmw-bg-gray-lightest md:(cmw-m-4 cmw-rounded)">
            <OrderCardSummary
              :fulfillment-status="order.fulfillmentStatus"
              :successful-fulfillments="order.successfulFulfillments[0] ? order.successfulFulfillments[0] : null"
              :shipping-address="order.shippingAddress"
            />
            <!-- Note: ?? doesn't work well on the current configuration :successful-fulfillments="order.successfulFulfillments[0] ?? null" -->
          </div>
          <!-- <div> TODO: Gift Notes Section </div> -->
          <div class="cmw-flex cmw-items-end cmw-justify-between cmw-px-4 md:cmw-items-center">
            <div>
              <small><strong v-text="order.lineItems.edges.length" />
                <span>{{ $tc('profile.orders.card.goods', order.lineItems.edges.length) }}</span>
              </small>
            </div>
            <!-- Cta Section -->
            <div class="md:cmw-flex">
              <div>
                <Button
                  variant="text"
                  class="cmw-ml-auto"
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
            </div>
          </div>
          <hr class="cmw-mx-4">
          <!-- Products Section -->
          <OrderCardProductRow
            v-for="lineItem in orderLineItems"
            :key="`${lineItem.node.variant.sku}-${lineItem.node.originalTotalPrice.amount}`"
            :order-line-item="lineItem.node"
          />
          <!-- Total Section -->
          <div class="cmw-grid cmw-grid-cols-2 cmw-justify-between cmw-px-6 cmw-mb-8 md:(cmw-px-0 cmw-mr-18 cmw-ml-75px)">
            <div
              class="h5"
              v-text="$t('profile.orders.card.productsTotal')"
            />
            <div
              class="h5 cmw-place-self-end"
              v-text="$n(Number(order.subtotalPriceV2.amount), 'currency', getLocaleFromCurrencyCode(order.subtotalPriceV2.currencyCode))"
            />
            <div
              class="cmw-text-base cmw-font-regular"
              v-text="$t('profile.orders.card.shipmentCost')"
            />
            <div
              v-if="order.totalShippingPriceV2.amount > 0"
              class="cmw-place-self-end"
              v-text="$n(Number(order.totalShippingPriceV2.amount), 'currency', getLocaleFromCurrencyCode(order.totalShippingPriceV2.currencyCode))"
            />
            <div v-else class="cmw-place-self-end">
              {{ $t('profile.orders.card.shipmentCostFree') }}
            </div>
            <div class="cmw-border-t cmw-border-t-secondary-400 cmw-w-full cmw-mt-4" />
            <div class="cmw-border-t cmw-border-t-secondary-400 cmw-w-full cmw-mt-4" />
            <div
              class="cmw-text-xl cmw-font-bold cmw-my-4 cmw-text-secondary-400"
              v-text="$t('profile.orders.card.orderTotal')"
            />
            <div
              class="cmw-text-xl cmw-font-bold cmw-my-4 cmw-place-self-end cmw-text-secondary-400"
              v-text="$n(Number(order.totalPriceV2.amount), 'currency', getLocaleFromCurrencyCode(order.totalPriceV2.currencyCode))"
            />
          </div>
        </div>
      </transition>
      <!-- Mobile Botton CTA Card -->
      <button
        class="md:cmw-hidden cmw-block cmw-bg-gray-lightest cmw-w-full cmw-py-2"
        type="button"
        @click="handleClick(order.orderNumber)"
      >
        <VueSvgIcon
          class="cmw-transform cmw-transition-transform"
          color="#d94965"
          :class="isActive ? 'cmw-rotate-180' : 'cmw-rotate-0'"
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
