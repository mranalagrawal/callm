export default {
  fulfillmentStatus: {
    shopify: {
      FULFILLED: 'Erfüllt',
      IN_PROGRESS: 'In Bearbeitung',
      ON_HOLD: 'In Wartestellung',
      OPEN: 'Offen',
      PARTIALLY_FULFILLED: 'Teilweise erfüllt',
      PENDING_FULFILLMENT: 'Bis zur Erfüllung',
      RESTOCKED: 'Aufgefüllt',
      SCHEDULED: 'Geplant',
      UNFULFILLED: 'Unerfüllt',
    },
    eventStatus: {
      // confirmed: SKIP
      // delayed: SKIP
      // failure: SKIP
      // label_printed: SKIP
      // label_purchased: SKIP
      // ready_for_pickup: SKIP
      ATTEMPTED_DELIVERY: 'Lieferversuch',
      CARRIER_PICK_UP: 'Versendet',
      DELIVERED: 'Geliefert',
      FULFILLED: 'In Vorbereitung',
      IN_TRANSIT: 'Auf dem Transportweg',
      NEW: 'Neu',
      OUT_FOR_DELIVERY: 'Auf dem Transportweg',
      PICKED_UP: 'Versendet',
    },
  },
}
