export default {
  fulfillmentStatus: {
    shopify: {
      FULFILLED: 'Rempli',
      IN_PROGRESS: 'En cours',
      ON_HOLD: 'En attente',
      OPEN: 'Ouvrir',
      PARTIALLY_FULFILLED: 'Partiellement rempli',
      PENDING_FULFILLMENT: 'En attente d\'exécution',
      RESTOCKED: 'Réapprovisionné',
      SCHEDULED: 'Programmé',
      UNFULFILLED: 'Insatisfait',
    },
    eventStatus: {
      // confirmed: SKIP
      // delayed: SKIP
      // failure: SKIP
      // label_printed: SKIP
      // label_purchased: SKIP
      // ready_for_pickup: SKIP
      ATTEMPTED_DELIVERY: 'Tentative de livraison',
      CARRIER_PICK_UP: 'Expédié',
      DELIVERED: 'Livré',
      FULFILLED: 'En préparation',
      IN_TRANSIT: 'En transit',
      NEW: 'Nouveau',
      OUT_FOR_DELIVERY: 'En transit',
      PICKED_UP: 'Expédié',
    },
  },
}
