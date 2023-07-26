import * as enums from '@/locales/en/enums'
import * as common from '@/locales/en/common'

export default {
  head: {
    description: 'Online wine for sale on Callmewine, your online wine shop: the best way to buy wines, champagne and distilled on offer at exceptional prices!',
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
    carousel: {
      recommendedProducts: 'Often bought together',
    },
  },
  searchResultLabel: 'The results of your search',
  notFoundTitle: 'We are sorry',
  notFoundLine: 'We didn\'t find anything with these characteristics, try searching for these suggestions',
  loading: 'Fetching data...',
  fetchError: 'An error occurred',
  save: 'Save',
  phone: 'Phone',
  phoneNote: 'Your phone number will be used to contact you during shipping',
  phonePlaceholder: 'es. +442035190811',
  note: 'Any delivery notes {0}',
  noteDesktop: '(At, Internal, Intercom only if different, Concierge)',
  country: 'Choose Country',
  recentlySeen: 'Recently seen',
  sameProducer: 'From the same producer',
  viewMore: 'View more',
  cart: 'Cart',
  cartDetails: 'Shopping cart detail',
  continueShopping: 'Do you want to add other products to your shopping?',
  discountCode: 'If you have a <strong>discount code</strong> you can enter it later, before paying',
  shippingCost: 'The <strong>shipping costs</strong> will be added to the checkout, after choosing the method.',
  home: 'Home',
  cartTotal: 'Cart Total',
  createYourAccount: 'Create your account',
  city: 'City',
  civic: 'Address and civic number',
  zip: 'Postal Code',
  province: 'Province',
  firstName: 'First name',
  lastName: 'Last name',
  businessName: 'Business name',
  vatNumber: 'VAT number',
  businessType: 'Activity sector',
  email: 'Email',
  emailPlaceholder: 'E-mail dell\'utente',
  password: 'Password',
  passwordPlaceholder: 'Password utente',
  passwordConfirm: 'Confirm Password',
  passwordConfirmPlaceholder: 'Confirm Password',
  newsletter: {
    label: 'Newsletter',
    subscribed: 'subscribed',
    unsubscribed: 'unsubscribed',
    headline: 'Newsletter with promotions and news on the entire Callmewine catalogue',
    frequency: {
      DAILY: 'Daily',
      WEEKLY: 'Weekly',
    },
    splash: {
      headline: 'Subscribe to our newsletter to receive discounts, promotions and news every day!',
      offer: 'Immediately for you a 5% discount on your first order!',
      acceptMarketing: 'I agree to receive newsletters and promotional communications from Callmewine, as required by the {0}.',
      profiling: 'I consent to the use of my data for profiling activities aimed at improving my browsing experience and receiving offers related to my interests and my purchasing habits, as required by the {0}.',
      readMore: 'For more information, please read our {0}',
      privacyPolicy: 'Privacy Policy',
    },
  },
  loginFailed: 'Oops! It seems that username or password are incorrect!',
  birthday: 'Birthday',
  privacyPolicy: 'I declare that I have read the Callmewine Privacy Policy',
  acceptMarketing:
    'I agree to receive newsletters and promotional communications from Callmewine, as required by the Privacy Policy.',
  footer: {
    company: 'The Company',
    who: 'About Us',
    sustainability: 'Sustainability',
    services: 'Our Services',
    restaurantsAndWineshops: 'Wine Shops & Restaurants',
    giftCards: 'Gift Card',
    support: 'Support',
    shipping: 'Shipping',
    payments: 'Payments',
    termsOfSales: 'Terms of Sales',
    contacts: 'Contacts',
    explore: 'Explore Our Catalog',
    paymentMethods: 'Payment Methods',
  },
  navbar: {
    search: 'What are you looking for?',
    favorites: 'Favorites',
    promotions: 'Promotions',
    cart: {
      total: 'Total',
      detail: 'Cart detail',
      checkout: 'Go to checkout',
      empty: 'Your cart is empty!',
      startFromMessage: 'Not sure where to start?',
      cta: 'Discover our promos',
    },
    user: {
      myOrders: 'My orders',
      buyAgain: 'Buy again',
      favorites: 'My favorites',
      addresses: 'Shipping addresses',
      accessData: 'Access Data',
      cards: 'Saved cards',
      logout: 'Logout',
      signIn: 'Sign in',
      register: 'Register',
      notRegisteredYet: 'Don\'t have a profile yet?',
      alreadyRegistered: 'I already have an account',
      forgotPassword: 'Did you forget your password?',
    },
  },
  profile: {
    orders: {
      print: {
        invoiceNumber: 'Invoice #{0}',
        tableHeaders: {
          code: 'Code',
          description: 'Description',
          quantity: 'Amount',
          price: 'Price',
        },
      },
      tableHeaders: {
        order: 'Order',
        date: 'Date',
        recipient: 'Recipient',
        products: 'Products',
        total: 'Total',
        financialStatus: 'Financial Status',
        fulfillmentStatus: 'Fulfillment Status',
      },
      card: {
        order: 'Order: {0}',
        date: 'Date {0}',
        recipient: 'Recipient: {0}',
        products: 'Product: | Products:',
        total: 'Total: {0}',
        financialStatus: 'Payment: {0}',
        fulfillmentStatus: 'Order status: {0}',
        summary: 'Summary',
        shipment: 'Shipment: {0}',
        shipmentAddress: 'Shipping address',
        billingAddress: 'Billing address',
        businessAddress: 'Business address',
        goods: 'item | items',
        productsTotal: 'Total products',
        shipmentCost: 'Shipping cost',
        shipmentCostFree: 'Free',
        orderTotal: 'Total order',
        quantity: 'Amount',
      },
    },
    greeting: 'Hello {name}',
    noOrder: 'You have no order yet',
    noFavourite: 'You have no favourite yet',
    noProducts: 'You have not purchased any products yet',
    myAccount: 'My account',
    myOrders: 'My orders',
    buyAgain: 'Buy again',
    favorites: 'My favorites',
    addresses: 'Shipping addresses',
    accessData: 'Access Data',
    cards: 'Saved cards',
    logout: 'Logout',
    editAddress: 'Change address',
    deleteAddress: 'Delete',
    defaultAddress: 'Default',
    addAddress: 'Add address',
    addNewAddress: 'Add new address',
    setAsDefaultLabel: 'Save as default address',
    personalData: 'Personal data',
    setAsDefaultAddress: 'Set as default',
    setNewEmailAddress: 'Set new email address',
    setNewPassword: 'Set new password',
    setNewPersonalData: 'Set new personal data',
    message: 'Message',
    messagePlaceholder: 'Good morning, I would like an update on my shipment status, thank you.',
    ratingMessage: 'My rating (not visible to other users)',
    ratingDescriptionPlaceholder: 'Ex. Excellent organic wine.',
    requestAssistanceTitle: 'Request assistance for order No. {orderId}',
    requestAssistanceSubtitle: 'Send us a message and, if necessary, attach the documentation in your possession. We will reply as soon as possible.',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
  },
  collections: {
    breadcrumb: 'All Selections',
  },
  selections: {
    favourite: 'Callmewine\'s Favourites',
    rarewine: 'Rare Wines',
    foreveryday: 'Everyday Wines',
    artisanal: 'Natural Wines',
    unusualvariety: 'Unusual variety',
    isnew: 'New',
    togift: 'Perfect Gift Ideas',
    inpromotion: 'On Sale',
    topsale: 'Top Sales',
    organic: 'Organic Wines',
  },
  search: {
    search: 'Search',
    showMore: 'Show more',
    showLess: 'Show less',
    showFilters: 'Show filters',
    showResults: 'Show Results ({count})',
    products: 'Products',
    selections: 'Our Selections',
    productionTypes: 'Production Types',
    regions: 'Regions',
    country: 'Country',
    categories: 'Categories',
    winelists: 'Wine lists',
    pairings: 'Pairings',
    dosagecontents: 'Dosage Contents',
    bodystyles: 'body styles',
    boxes: 'boxes',
    areas: 'areas',
    provenience: 'Provenance',
    brands: 'brands',
    noBrands: 'Try our finest list',
    countries: 'countries',
    sizes: 'sizes',
    vintages: 'vintages',
    awards: 'awards',
    agings: 'agings',
    philosophies: 'philosophies',
    price: 'price',
    priceFromTo: 'Price from {0} to {1}',
    results: 'results',
    noResultsAlert: 'There are no results for your search',
    noResultsMessage: `
      <p class="lead">Suggestions for your search:</p>
      <ul>
        <li>Check possible typing mistakes</li>
        <li>Try to search a similar word or to use less words</li>
        <li>Try to use a more generic word, you can then refine your search using the filters</li>
        <li>Use the main menus and filter your search using the filters that appear on the left</li>
      </ul>`,
    activeFilters: 'Active filters',
    removeAll: 'Remove all',
    removeFilters: 'Remove filters',
    sortBy: 'Sort by',
    sort: {
      name: 'Name',
      price: 'Price',
    },
    highestPopularity: 'Highest popularity',
    lowestPopularity: 'Lowest popularity',
    highestPrice: 'Highest price',
    lowestPrice: 'Lowest price',
    mostAwarded: 'Most awarded',
    newArrivals: 'New arrivals',
    popularity: 'Popularity',
    brandAsc: 'Brand (A-Z)',
    brandDesc: 'Brand (Z-A)',
    giftCards: 'Gift Cards',
    chooseGiftCard: 'choose your gift card',
  },
  product: {
    otherVintages: 'Other vintages: ',
    tooltip: {
      guide: 'Guide {guide}',
      score: 'score {value} out of {maxValue}',
      year: 'Year: {year}',
    },
    promoLabel: 'Promo',
    addToCart: 'Add to Cart',
    notifyMe: 'notify me',
    notifyMeTitle: 'Notify me when it arrives',
    notifyMeSubtitle: 'Enter your email and we will notify you when the product is available',
    notifyMeNote: 'You will receive an email when the product is available',
    notAvailable: 'Not available',
    notAvailable2: 'Product not available',
    available: 'Available now ({quantity})',
    description: 'Description',
    toEnjoyBetter: 'To enjoy it better',
    awardsAndAcknowledgments: 'Awards',
    producer: 'Producer',
    pairings: 'Pairings',
    temperature: 'Temperature',
    whenDrink: 'When drink',
    guide: 'Guide',
    year: 'Year',
    score: 'Score',
    quote: 'Quote',
    recommendedByCallmewine: 'Recommended by Callmewine',
    mainWines: 'Main wines',
    foundation: 'Foundation Year',
    vineyardHectares: 'Vineyard hectares',
    ownGrapes: 'Own grapes',
    annualProduction: 'Annual production',
    winemaker: 'Winemaker',
    address: 'Address',
    features: 'Features',
    denomination: 'Denomination',
    vines: 'Vines',
    region: 'Region',
    alcoholContent: 'Alcohol content',
    format: 'Format',
    vinification: 'Vinification',
    refinement: 'Refinement',
    additionalNotes: 'Additional Notes',
    proprietaryGrapes: 'proprietary grapes',
  },
  validations: {
    password: {
      title: 'Password must contain:',
      effectiveness: 'Password Effectiveness',
      min: 'at least 8 characters',
      oneNumber: 'one number',
      oneUpperCase: 'one uppercase letter',
      oneLowerCase: 'one lowercase letter',
      oneSpecialChar: 'one special character',
    },
  },
  recoverPwd: {
    title: 'Reset password',
    paragraph: 'Enter the email with which you registered. You will receive a message in your inbox with instructions for changing your password.',
    feedback: 'Se l\'indirizzo {0} è associato ad un profilo registrato, riceverai via mail il link per reimpostare la password del tuo account.',
    feedbackFooter: {
      text: 'Is your profile registered and you haven\'t received the email? Search your junk mail or {0}',
      link: 'request a resend',
    },
  },
  contactForm: {
    motivation: 'Reason for the contact',
    loginRequired: 'requires login',
    selectOrder: 'Select the order',
    selectedOrder: 'Order# {orderNumber} from {date}, by {name} for {total}',
    choices: {
      PAYMENT: 'Notifications relating to the payment of an order',
      ORDER_SHIPMENT: 'Request information on the shipment of an order',
      ORDER_RECEIVED: 'Reports regarding an order received',
      PURCHASE_SUGGEST: 'Purchase suggestion request',
      SITE_IMPROVEMENT: 'Product suggestions to add on Callmewine or site improvements',
      OTHER: 'Other questions or reports',
    },
  },
  waitingForConfirmation: {
    msg: 'Thank you for sending your data, one of our operators will contact you as soon as possible.',
    alreadyApproved: 'You are already approved, you can search in our entire site.',
  },
  bundle: {
    whatIsInTheBox: 'The products that you will receive:',
  },
  productDescriptionTab: '{productTitle} DESCRIPTION',
}
