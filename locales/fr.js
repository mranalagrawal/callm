import * as enums from '@/locales/fr/enums'
import * as common from '@/locales/fr/common'
import * as pages from '@/locales/fr/pages'

export default {
  ...common.validations,
  head: {
    description: 'Vin en ligne à vendre sur Callmewine, votre boutique de vins en ligne: la meilleure façon d\'acheter des vins, du champagne et distillé à des prix exceptionnels!',
  },
  enums: {
    ...enums.Accessibility,
    ...enums.OrderFinancialStatus,
    ...enums.OrderFulfillmentStatus,
  },
  common: {
    ...common.confirm,
    ...common.cta,
    ...common.features,
    ...common.feedback,
    ...common.filters,
    ...common.forms,
    ...common.info,
    carousel: {
      recommendedProducts: 'Souvent achetés ensemble',
    },
  },
  pages: {
    ...pages.notFound,
    ...pages.gone,
    ...pages.billing,
  },
  giftCards: 'Chèque cadeau',
  chooseGiftCard: 'Choisissez votre chèque cadeau',
  searchResultLabel: 'Les résultats de votre recherche',
  loading: 'Récupération des données...',
  fetchError: 'Une erreur s\'est produite',
  save: 'Sauvegarder',
  phone: 'Téléphone',
  phoneNote: 'Votre numéro de téléphone sera utilisé pour vous contacter lors de l\'expédition',
  phonePlaceholder: 'ex. +442035190811',
  note: 'Les éventuels bordereaux de livraison {0}',
  noteDesktop: '(At, Interne, Interphone uniquement si différent, Conciergerie)',
  country: 'Choisissez le pays',
  recentlySeen: 'Vu récemment ',
  sameProducer: 'Du même producteur',
  viewMore: 'En voir plus',
  cart: 'Panier',
  cartDetails: 'Détail du panier',
  continueShopping: 'Vous souhaitez ajouter d\'autres produits à votre shopping ?',
  discountCode: 'Si vous avez un <strong>code de réduction</strong>, vous pouvez le saisir plus tard, avant de payer.',
  shippingCost: 'Les <strong>frais d\'expédition</strong> seront ajoutés à la caisse, après avoir choisi la méthode.',
  home: 'Maison',
  cartTotal: 'Total du panier\n',
  createYourAccount: 'Créez votre compte',
  city: 'Ville',
  civic: 'Adresse et numéro civique',
  zip: 'Code postal',
  province: 'Province * ANTIBES FRANCE',
  firstName: 'Prénom',
  lastName: 'Nom de famille',
  businessName: 'Nom de l\'entreprise',
  vatNumber: 'numéro de TVA',
  businessType: 'Secteur d\'activité',
  email: 'Email',
  emailPlaceholder: 'Courriel de l\'utilisateur',
  password: 'Mot de passe',
  passwordPlaceholder: 'Mot de passe de l\'utilisateur',
  passwordConfirm: 'Confirmer le mot de passe',
  passwordConfirmPlaceholder: 'Confirmer le mot de passe',
  newsletter: {
    label: 'Newsletter',
    subscribed: 'abonné',
    unsubscribed: 'désabonné',
    offer: 'Abonnez-vous à notre newsletter et recevez une remise de {discount}% sur votre première commande !',
    headline: 'Newsletter avec promotions et nouveautés sur tout le catalogue Callmewine',
    frequency: {
      DAILY: 'Quotidien',
      WEEKLY: 'Hebdomadaire',
    },
    splash: {
      headline: 'Abonnez-vous à notre newsletter pour recevoir des réductions, des promotions et des nouvelles tous les jours !',
      offer: 'Profitez de la réduction de {discount}% su votre premiére commande. La valeur totale du panier doit être d\'au moins {goal}',
      acceptMarketing: 'J\'accepte de recevoir des newsletters et des communications promotionnelles de Callmewine, comme l\'exige le {0}.',
      profiling: 'Je consens à l\'utilisation de mes données pour des activités de profilage visant à améliorer mon expérience de navigation et à recevoir des offres liées à mes intérêts et à mes habitudes d\'achat, comme l\'exige le {0}.',
      readMore: 'Pour plus d\'informations, veuillez lire notre {0}',
      privacyPolicy: 'politique de confidentialité',
    },
  },
  loginFailed: 'Oops! Il semble que le nom d\'utilisateur ou le mot de passe soient incorrects!',
  birthday: 'Anniversaire',
  privacyPolicy: 'Je déclare avoir lu la politique de confidentialité de Callmewine',
  acceptMarketing: 'J\'accepte de recevoir des newsletters et des communications promotionnelles de Callmewine, comme l\'exige la politique de confidentialité.',
  footer: {
    company: 'Société',
    who: 'Qui Nous Sommes',
    sustainability: 'Durabilité',
    services: 'Nos Services',
    restaurantsAndWineShops: 'Bar à vins & Restaurants',
    corporateGifts: 'Cadeaux d\'entreprise',
    guideToOurWines: 'Guide de nos vins',
    giftCards: 'Chèques-cadeaux',
    support: 'Service Client',
    shipping: 'Livraisons',
    payments: 'Paiements',
    termsOfSales: 'Conditions de Vente',
    contacts: 'Contacts',
    explore: 'Explorez Notre Catalogue',
    paymentMethods: 'Moyen de paiement',
    privacyPolicy: 'En cliquant sur {label}, je déclare avoir lu la {link}.',
  },
  navbar: {
    search: 'Recherche ?',
    favorites: 'Favoris',
    promotions: 'Promotions',
    cart: {
      total: 'Total',
      detail: 'Détail du panier',
      checkout: 'Aller à la caisse',
      empty: 'Votre panier est vide !',
      startFromMessage: 'Vous ne savez pas par où commencer ?',
      cta: 'Découvrez nos promos',
    },
    user: {
      myOrders: 'Mes commandes',
      buyAgain: 'Acheter à nouveau',
      favorites: 'Mes favoris',
      addresses: 'Adresses de livraison',
      accessData: 'Données d\'accès',
      billing: 'Facturation',
      cards: 'Cartes enregistrées',
      notRegisteredYet: 'Vous n\'avez pas encore de profil ?',
      alreadyRegistered: 'J\'ai déjà un compte',
      socialLogin: 'Connexion sociale',
      socialRegister: 'Connexion sociale',
      forgotPassword: 'Avez-vous oublié votre mot de passe?',
      orLoginWith: 'Ou connectez-vous avec',
      orRegisterWith: 'Ou inscrivez-vous avec',
      facebookLogin: 'Se connecter avec Google',
      googleLogin: 'Se connecter avec Google',
    },
  },
  profile: {
    orders: {
      print: {
        invoiceNumber: 'Facture n° {0}',
        tableHeaders: {
          code: 'Code',
          description: 'Description',
          quantity: 'Quantité',
          price: 'prix',
        },
      },
      tableHeaders: {
        order: 'Ordre',
        date: 'Date',
        recipient: 'Destinataire',
        products: 'Des produits',
        total: 'Total',
        financialStatus: 'Statut financier',
        fulfillmentStatus: 'Statut d\'exécution',
      },
      card: {
        order: 'Ordre: {0}',
        date: 'Date {0}',
        recipient: 'Destinataire: {0}',
        products: 'Produit: | Produits:',
        total: 'Total: {0}',
        financialStatus: 'Paiement: {0}',
        fulfillmentStatus: 'Statut de la commande: {0}',
        summary: 'Résumé',
        shipment: 'Expédition: {0}',
        shipmentAddress: 'Adresse de livraison',
        billingAddress: 'Adresse de facturation',
        businessAddress: 'Adresse d\'affaires',
        goods: 'objet | éléments',
        productsTotal: 'Produits totaux',
        shipmentCost: 'Frais de port',
        shipmentCostFree: 'Gratuite',
        orderTotal: 'Commande totale',
        quantity: 'Quantité',
      },
    },
    greeting: 'Bonjour {name}',
    noOrder: 'Vous n\'avez pas encore de commande',
    noFavourite: 'Vous n\'avez pas encore de favori',
    noProducts: 'Vous n\'avez pas encore acheté de produit',
    myAccount: 'Mon compte',
    myOrders: 'Mes commandes',
    buyAgain: 'Acheter à nouveau',
    favorites: 'Mes favoris',
    addresses: 'Adresses de livraison',
    accessData: 'Données d\'accès',
    billing: 'Informations de facturation',
    cards: 'Cartes enregistrées',
    logout: 'Se déconnecter',
    editAddress: 'Changement d\'adresse',
    deleteAddress: 'Supprimer',
    defaultAddress: 'Défaut',
    addAddress: 'Ajouter une adresse',
    addNewAddress: 'Ajouter une nouvelle adresse',
    setAsDefaultLabel: 'Enregistrer comme adresse par défaut',
    personalData: 'Données personnelles',
    setAsDefaultAddress: 'Définir par défaut',
    setNewEmailAddress: 'Définir un nouvel e-mail',
    setNewPassword: 'Définir un nouveau mot de passe',
    setNewPersonalData: 'Définir de nouvelles données personnelles',
    message: 'Message',
    messagePlaceholder: 'Bonjour, je voudrais une mise à jour sur l\'état de mon envoi, merci.',
    ratingMessage: 'Ma note (non visible par les autres utilisateurs)',
    ratingDescriptionPlaceholder: 'Ex. Excellent vin bio.',
    requestAssistanceTitle: 'Demander de l\'aide pour la commande {orderId}',
    requestAssistanceSubtitle: 'Envoyez-nous un message et, si nécessaire, joignez la documentation en votre possession. Nous vous répondrons dès que possible.',
    newPassword: 'Nouveau mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
  },
  collections: {
    breadcrumb: 'Toutes les sélections',
  },
  search: {
    search: 'Recherche',
    showMore: 'Montre plus',
    showLess: 'Montrer moins',
    showFilters: 'Afficher les filtres',
    showResults: 'Montrer les résultats ({count})',
    products: 'Des produits',
    selections: 'Nos Sélections',
    productionTypes: 'Types de fabrication',
    regions: 'Régions',
    country: 'Pays',
    categories: 'Catégories',
    winelists: 'Cartes des vins',
    pairings: 'Accords',
    dosagecontents: 'Contenu posologique',
    bodystyles: 'style du vin',
    boxes: 'coffret',
    areas: 'Domaines',
    provenience: 'Provenance',
    brands: 'Marques',
    noBrands: 'Essayez notre meilleure liste',
    countries: 'Des pays',
    sizes: 'Tailles',
    vintages: 'Millésimes',
    awards: 'Prix',
    agings: 'Vieillissements',
    philosophies: 'Philosophies',
    price: 'Prix',
    priceFromTo: 'Tarif de {from} à {to}',
    results: 'Résultats',
    noResultsAlert: 'Il n\'y a aucun résultat pour votre recherche',
    noResultsMessage: `
        <p class="lead">Suggestions pour votre recherche:</p>
         <ul>
           <li>Vérifier les éventuelles erreurs de frappe</li>
           <li>Essayez de rechercher un mot similaire ou d'utiliser moins de mots</li>
           <li>Essayez d'utiliser un mot plus générique, vous pourrez ensuite affiner votre recherche à l'aide des filtres</li>
           <li>Utilisez les menus principaux et filtrez votre recherche à l'aide des filtres qui apparaissent à gauche</li>
         </ul>`,
    activeFilters: 'Filtres actifs',
    removeAll: 'Enlever tout',
    removeFilters: 'Supprimer les filtres',
  },
  product: {
    otherVintages: 'Autres millésimes :',
    tooltip: {
      guide: 'Guide {guide}',
      score: 'note {value} sur {maxValue}',
      year: 'Année : {year}',
    },
    promoLabel: 'Promo',
    notifyMeTitle: 'Avertissez-moi quand il arrive',
    notifyMeSubtitle: 'Entrez votre e-mail et nous vous informerons lorsque le produit sera disponible',
    notifyMeNote: 'Vous recevrez un e-mail lorsque le produit sera disponible',
    promo: 'promotion',
    notAvailable: 'Non disponible',
    notAvailable2: 'Produit non disponible',
    available: 'Disponibilité Immédiate',
    description: 'Description',
    toEnjoyBetter: 'Pour le mieux goûter',
    awardsAndAcknowledgments: 'Prix et distinctions',
    producer: 'Producteur',
    pairings: 'Accords mets et vins',
    pairingsTitle: 'Parfait à boire avec',
    temperature: 'Température de service',
    whenOpen: 'Débouchage',
    whenDrink: 'Quand le boire',
    glass: 'Verre',
    longevity: 'Longevity',
    guide: 'Guide',
    year: 'Vintage',
    score: 'Marque',
    quote: 'Citation',
    recommendedByCallmewine: 'Recommandé par Callmewine',
    mainWines: 'Vins principaux',
    foundation: 'Année de fondation',
    vineyardHectares: 'Hectares de vignoble',
    ownGrapes: 'Raisins propriétaires',
    annualProduction: 'Production annuelle',
    winemaker: 'Œnologue',
    address: 'Adresse',
    features: 'Caractéristiques',
    denomination: 'Appellation',
    grapes: 'Cépages',
    regionCountry: 'Région',
    alcoholContent: 'Degré alcoolique',
    size: 'Format',
    winemaking: 'Vinification',
    vineyards: 'Vignobles',
    agingDescription: 'Élevage',
    productInformations: 'Notes supplémentaires',
    proprietaryGrapes: 'Raisins propriétaires',
    productionPhilosophies: 'Philosophie de production',
    tipology: 'Catégorie',
    color: 'Couleur',
    taste: 'Au nez',
    aroma: 'Goût',
    collectionBottle: 'Bouteille de collection, non soumise à promotion',
    bioInfo: 'da agricoltura Italia o EU',
    bioOperator: 'Codice Operatore nr.',
    subCategory: 'Tipologia',
  },
  recoverPwd: {
    title: 'Réinitialiser le mot de passe',
    paragraph: 'Entrez l\'e-mail avec lequel vous vous êtes inscrit. Vous recevrez un message dans votre boîte de réception avec des instructions pour changer votre mot de passe.',
    feedback: 'Si l\'adresse {0} est associée à un profil enregistré, vous recevrez un lien par e-mail pour réinitialiser le mot de passe de votre compte.',
    feedbackFooter: {
      text: 'Votre profil est enregistré et vous n\'avez pas reçu l\'e-mail ? Recherchez dans vos courriers indésirables ou {0}',
      link: 'demandez un renvoi',
    },
  },
  contactForm: {
    motivation: 'Raison du contact',
    loginRequired: 'nécessite une connexion',
    selectOrder: 'Sélectionnez la commande',
    selectedOrder: 'Commande n {orderNumber} du {date}, par {name} pour {total}',
    choices: {
      PAYMENT: 'Notifications relatives au paiement d\'une commande',
      ORDER_SHIPMENT: 'Demander des informations sur l\'expédition d\'une commande',
      ORDER_RECEIVED: 'Rapports concernant une commande reçue',
      PURCHASE_SUGGEST: 'Demande de suggestion d\'achat',
      SITE_IMPROVEMENT: 'Suggestions de produits à ajouter sur Callmewine ou améliorations du site',
      OTHER: 'Autres questions ou rapports',
    },
  },
  waitingForConfirmation: {
    msg: 'Merci d\'avoir envoyé vos données, un de nos opérateurs vous contactera dans les plus brefs délais.',
    alreadyApproved: 'Vous êtes déjà approuvé, vous pouvez effectuer une recherche dans tout notre site.',
  },
  bundle: {
    whatIsInTheBox: 'Les produits que vous recevrez:',
  },
  productDescriptionTab: 'DESCRIPTION DU {productTitle}',
  eventTitle: 'Le Calendrier de l\'Avent de Callmewine',
  eventProductsTitle: 'Essayez également nos coffrets de vin de l\'Avent',
  eventUpcomingText: `The promotion of this day is not yet available!.
    Click on the cell corresponding to today's date to discover new and fantastic surprises signed Callmewine!`,
  eventCancelButton: 'Back to calendar',
  eventNote: `With the Callmewine Advent Calendar every day is a surprise! Behind each box are discounted
      bottles, gadgets, free samples and much more: for an advent made of great toasts with Callmewine!`,
}
