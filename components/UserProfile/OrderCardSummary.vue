<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import type { PropType } from '@nuxtjs/composition-api'

import type { IMailingAddress } from '~/types/mailingAddress'
import type { IFulfillment } from '~/types/order'

export default defineComponent({
  name: 'OrderCardSummary',
  props: {
    fulfillmentStatus: {
      type: String,
      required: true,
    },
    successfulFulfillment: {
      type: Object as PropType<IFulfillment>,
    },
    shippingAddress: {
      type: Object as PropType<IMailingAddress>,
      required: true,
    },
    trackingUrl: {
      type: String,
    },
    sourceTrackingNumber: {
      type: String,
    },
  },
  setup() {
    return {}
  },
})
</script>

<template>
  <div class="text-left p-4 grid text-sm auto-rows-auto md:grid-cols-2 gap-4">
    <!-- Summary Section -->
    <div>
      <h5 v-text="$t('profile.orders.card.summary')" />
      <i18n
        path="profile.orders.card.fulfillmentStatus"
        tag="span"
        class="text-secondary-400"
      >
        <span
          class="font-sans text-body tracking-normal"
          v-text="$t(`enums.fulfillmentStatus.${fulfillmentStatus}`)"
        />
      </i18n>
      <div v-if="successfulFulfillment">
        <i18n
          path="profile.orders.card.shipment"
          tag="span"
          class="flex gap-2 items-center text-secondary-400"
        >
          <span class="font-sans text-body tracking-normal">
            <span>{{ successfulFulfillment.trackingCompany }}</span>
            <a
              v-if="trackingUrl"
              class="text-gray-dark hover:text-primary"
              :href="trackingUrl"
              target="_blank"
            >
              <small class="underline">({{ sourceTrackingNumber }})</small>
            </a>
          </span>
        </i18n>
      </div>
    </div>
    <!-- ShipmentAddress Section -->
    <div class="print:hidden">
      <h5
        class="mb-0"
        v-text="$t('profile.orders.card.shipmentAddress')"
      />
      <address>
        <span
          class="block"
          v-text="shippingAddress?.name ? shippingAddress.name : '-'"
        />
        <span
          class="block"
          v-text="shippingAddress.address1"
        />
        <span
          v-if="shippingAddress.address2"
          class="block"
          v-text="shippingAddress.address2"
        />
        <span
          v-if="shippingAddress.formattedArea"
          class="block"
        >{{
          shippingAddress.formattedArea
        }} {{ shippingAddress.zip }}</span>
        <a
          v-if="shippingAddress.phone"
          :href="`tel:${shippingAddress.phone}`"
          class="text-gray-dark hover:text-primary"
        >
          {{ shippingAddress.phone }}
        </a>
      </address>
    </div>
    <!-- TODO: Extra Notes Section -->
  </div>
</template>
