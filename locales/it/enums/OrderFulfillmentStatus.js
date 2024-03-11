export default {
  fulfillmentStatus: {
    shopify: {
      FULFILLED: 'Evaso',
      IN_PROGRESS: 'In corso',
      ON_HOLD: 'In attesa',
      OPEN: 'Aperto',
      PARTIALLY_FULFILLED: 'Parzialmente evaso',
      PENDING_FULFILLMENT: 'In attesa di essere evaso',
      RESTOCKED: 'Restock',
      SCHEDULED: 'Programmato',
      UNFULFILLED: 'Inevaso',
    },
    eventStatus: {
      // confirmed: SKIP
      // delayed: SKIP
      // failure: SKIP
      // label_printed: SKIP
      // label_purchased: SKIP
      // ready_for_pickup: SKIP
      ATTEMPTED_DELIVERY: 'Tentata consegna',
      CARRIER_PICK_UP: 'Spedito',
      DELIVERED: 'Consegnato',
      FULFILLED: 'In preparazione',
      IN_TRANSIT: 'In consegna',
      NEW: 'Nuovo',
      OUT_FOR_DELIVERY: 'In consegna',
      PICKED_UP: 'Spedito',
    },
  },
}
