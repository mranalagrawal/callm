<script>
export default {
  name: 'OrderCardSummary',
  props: {
    fulfillmentStatus: {
      type: String,
      required: true,
    },
    successfulFulfillments: {
      type: Object,
      default: () => {},
    },
    shippingAddress: {
      type: Object,
      required: true,
    },
  },
}
</script>

<template>
  <div class="text-left cmw-p-4 cmw-grid cmw-text-sm cmw-auto-rows-auto md:cmw-grid-cols-2 cmw-gap-4">
    <!-- Summary Section -->
    <div>
      <h5 v-text="$t('profile.orders.card.summary')" />
      <i18n
        path="profile.orders.card.fulfillmentStatus"
        tag="span"
        class="cmw-text-secondary-400"
      >
        <span
          class="cmw-font-sans cmw-text-body cmw-tracking-normal"
          v-text="$t(`enums.fulfillmentStatus.${fulfillmentStatus}`)"
        />
      </i18n>
      <div v-if="successfulFulfillments">
        <i18n
          path="profile.orders.card.shipment"
          tag="span"
          class="cmw-text-secondary-400"
        >
          <span class="cmw-font-sans cmw-text-body cmw-tracking-normal">{{ successfulFulfillments.trackingCompany }}
            <a
              v-if="successfulFulfillments.trackingInfo[0]"
              class="cmw-text-gray-dark hover:cmw-text-primary"
              :href="successfulFulfillments.trackingInfo[0].url"
              target="_blank"
            ><small> ({{ successfulFulfillments.trackingInfo[0].number }})</small></a>
          </span>
        </i18n>
      </div>
    </div>
    <!-- ShipmentAddress Section -->
    <div>
      <h5
        class="cmw-mb-0"
        v-text="$t('profile.orders.card.shipmentAddress')"
      />
      <address>
        <span
          class="cmw-block"
          v-text="shippingAddress.name"
        />
        <span
          class="cmw-block"
          v-text="shippingAddress.address1"
        />
        <span
          v-if="shippingAddress.address2"
          class="cmw-block"
          v-text="shippingAddress.address2"
        />
        <span
          v-if="shippingAddress.formattedArea"
          class="cmw-block"
        >{{
          shippingAddress.formattedArea
        }} {{ shippingAddress.zip }}</span>
        <a
          v-if="shippingAddress.phone"
          :href="`tel:${shippingAddress.phone}`"
          class="cmw-text-gray-dark hover:cmw-text-primary"
        >
          {{ shippingAddress.phone }}
        </a>
      </address>
    </div>
    <!-- TODO: Extra Notes Section -->
  </div>
</template>
