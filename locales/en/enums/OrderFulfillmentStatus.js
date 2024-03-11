export default {
  fulfillmentStatus: {
    shopify: {
      FULFILLED: 'Fulfilled',
      IN_PROGRESS: 'In progress',
      ON_HOLD: 'On hold',
      OPEN: 'Open',
      PARTIALLY_FULFILLED: 'Partially fulfilled',
      PENDING_FULFILLMENT: 'Pending fulfillment',
      RESTOCKED: 'Restocked',
      SCHEDULED: 'Scheduled',
      UNFULFILLED: 'Unfulfilled',
    },
    eventStatus: {
      // confirmed: SKIP
      // delayed: SKIP
      // failure: SKIP
      // label_printed: SKIP
      // label_purchased: SKIP
      // ready_for_pickup: SKIP
      NEW: 'New',
      ATTEMPTED_DELIVERY: 'Attempted delivery',
      CARRIER_PICK_UP: 'Shipped',
      DELIVERED: 'Delivered',
      IN_TRANSIT: 'In transit',
      OUT_FOR_DELIVERY: 'In transit',
      PICKED_UP: 'Shipped',
      FULFILLED: 'In progress',
    },
  },
}
