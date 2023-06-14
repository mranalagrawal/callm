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
      <div v-if="successfulFulfillments">
        <i18n
          path="profile.orders.card.shipment"
          tag="span"
          class="text-secondary-400"
        >
          <span class="font-sans text-body tracking-normal">{{ successfulFulfillments.trackingCompany }}
            <a
              v-if="successfulFulfillments.trackingInfo[0]"
              class="text-gray-dark hover:text-primary"
              :href="successfulFulfillments.trackingInfo[0].url"
              target="_blank"
            ><small> ({{ successfulFulfillments.trackingInfo[0].number }})</small></a>
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
          v-text="shippingAddress.name"
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
