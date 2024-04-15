import * as common from '@/locales/it/common'
import * as enums from '@/locales/it/enums'
import * as pages from '@/locales/it/pages'

export default {
  ...common.validations,
  head: {
    description: 'Vendita vino online su Callmewine, la tua enoteca online: il modo migliore per comprare vini, champagne e distillati in offerta a prezzi eccezionali!',
    winery: {
      title: 'Produttori di Vino e Champagne: tutte le Cantine di Callmewine',
      description: 'Scopri le cantine e i produttori di vino selezionati da Callmewine: proponiamo i vini delle migliori aziende vinicole italiane e non solo. Acquista online!',
    },
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
      recommendedProducts: 'Comprati spesso insieme',
    },
  },
  pages: {
    ...pages.notFound,
    ...pages.gone,
    ...pages.billing,
  },
  chooseGiftCard: 'Scegli il buono regalo',
  searchResultLabel: 'I risultati della tua ricerca',
  loading: 'Recuperando i dati...',
  calculating: 'Calcolando...',
  fetchError: 'Si è verificato un errore',
  save: 'Salva',
  phone: 'Telefono',
  phoneNote: 'Il numero di telefono sarà utilizzato per contattarti durante la spedizione',
  phonePlaceholder: 'es. +393498119200',
  note: 'Eventuali note di consegna {0}',
  noteDesktop: '(Presso, Interno, Citofono solo se diverso, Portineria)',
  country: 'Scegli paese',
  recentlySeen: 'Visti di recente',
  sameProducer: 'Dallo stesso produttore',
  viewMore: 'Vedi di più',
  home: 'Home',
  cart: 'Carrello',
  cartDetails: 'Dettaglio carrello',
  continueShopping: 'Vuoi aggiungere altri prodotti alla tua spesa?',
  shipping: {
    discountCode: 'Se hai un <strong>codice sconto</strong> potrai inserirlo in seguito, prima del pagamento.',
    cost: 'Le <strong>spese di spedizione</strong> verranno aggiunte alla cassa, dopo aver scelto la modalità.',
    threshold: {
      info: 'Spedizione gratuita oltre i {amount}',
      reached: 'Hai diritto alla spedizione gratuita',
      remaining: 'Ti manca {amount} per avere la spedizione gratuita',
      progressBarReached: 'Hai ottenuto la spedizione gratuita',
    },
  },
  cartTotal: 'Totale Ordine',
  createYourAccount: 'Crea account',
  city: 'Città',
  civic: 'Indirizzo e numero civico',
  zip: 'CAP',
  province: 'Provincia',
  firstName: 'Nome',
  lastName: 'Cognome',
  businessName: 'Ragione Sociale',
  vatNumber: 'Partita IVA',
  businessType: 'Settore attività',
  email: 'Email',
  emailPlaceholder: 'User email',
  password: 'Password',
  passwordPlaceholder: 'User Password',
  passwordConfirm: 'Confirm Password',
  passwordConfirmPlaceholder: 'Confirm Password',
  newsletter: {
    label: 'Newsletter',
    subscribed: 'sottoscritto',
    unsubscribed: 'non iscritto',
    offer: 'Iscriviti alla nostra Newsletter: ogni giorno info, promozioni e subito per te uno sconto del {discount} sul tuo primo ordine!',
    headline: 'Newsletter con promozioni è novità su tutto il catalogo di Callmewine',
    frequency: {
      DAILY: 'Giornaliera',
      WEEKLY: 'Settimanale',
    },
    splash: {
      headline: 'Iscriviti alla nostra Newsletter per ricevere ogni giorno sconti, promozioni e novità!',
      offer: 'Iscriviti alla nostra Newsletter: ogni giorno info, promozioni e subito per te uno sconto del {discount} sul tuo primo ordine con un carrello minimo {goal}!',
      acceptMarketing: 'Accetto di ricevere newsletter e comunicazioni promozionali da Callmewine, come richiesto dal {0}.',
      profiling: 'Acconsento all\'utilizzo dei miei dati per attività di profilazione finalizzate a migliorare la mia esperienza di navigazione e ricevere offerte relative ai miei interessi e alle mie abitudini di acquisto, come previsto dalla {0}.',
      readMore: 'Per ulteriori informazioni, leggi la nostra {0}',
      privacyPolicy: 'politica sulla riservatezza',
    },
  },
  loginFailed: 'Ops! Sembra che il nome utente o la password non siano corretti!',
  birthday: 'Data di nascita',
  privacyPolicy: 'Dichiaro di aver letto la Privacy Policy di Callmewine',
  acceptMarketing:
    'Accetto di ricevere newsletter e comunicazioni promozionali da Callmewine, come previsto dalla Privacy Policy.',
  footer: {
    company: 'L\'Azienda',
    who: 'Chi Siamo',
    sustainability: 'Sostenibilità',
    faq: 'FAQ',
    services: 'Servizi Offerti',
    restaurantsAndWineShops: 'Enoteche e Ristoranti',
    corporateGifts: 'Regali Aziendali',
    guideToOurWines: 'Guida ai Nostri Vini',
    giftCards: 'Buoni Regalo',
    support: 'Supporto',
    shipping: 'Spedizioni',
    payments: 'Pagamenti',
    termsOfSales: 'Condizioni di Vendita',
    contacts: 'Contatti',
    explore: 'Esplora il Catalogo',
    paymentMethods: 'Metodi di Pagamento',
    privacyPolicy: 'Cliccando su {label}, dichiaro di aver letto la nostra {link}.',
  },
  navbar: {
    search: 'Cosa stai cercando?',
    favorites: 'Preferiti',
    promotions: 'Promozioni',
    cart: {
      total: 'Totale',
      detail: 'Dettaglio carrello',
      checkout: 'Checkout',
      empty: 'Il tuo carrello è vuoto',
      startFromMessage: 'Non sai da dove cominciare?',
      cta: 'Scopri le nostre promozioni',
    },
    user: {
      myOrders: 'I miei Ordini',
      buyAgain: 'Compra di nuovo',
      favorites: 'I miei Preferiti',
      addresses: 'Indirizzi di spedizione',
      accessData: 'Dati di accesso',
      billing: 'Fatturazione',
      cards: 'Carte salvate',
      notRegisteredYet: 'Non hai un account?',
      alreadyRegistered: 'Ho già un account',
      socialLogin: 'Social login',
      socialRegister: 'Social register',
      forgotPassword: 'Password dimenticata?',
      orLoginWith: 'Oppure accedi con',
      orRegisterWith: 'Oppure registrati con',
      facebookLogin: 'Accedi con Facebook',
      googleLogin: 'Accedi con Google',
    },
  },
  profile: {
    orders: {
      print: {
        invoiceNumber: 'Fattura #{0}',
        tableHeaders: {
          code: 'Codice',
          description: 'Descrizione',
          quantity: 'Quantità',
          price: 'Prezzo',
        },
      },
      tableHeaders: {
        order: 'Ordine',
        date: 'Data',
        recipient: 'Destinatario',
        products: 'Prodotti',
        total: 'Totale',
        financialStatus: 'Pagamento',
        fulfillmentStatus: 'Stato',
      },
      card: {
        order: 'Ordine: {0}',
        date: 'Data {0}',
        recipient: 'Destinatario: {0}',
        products: 'Prodotto: | Prodotti:',
        total: 'Totale: {0}',
        financialStatus: 'Pagamento: {0}',
        fulfillmentStatus: 'Stato dell\'ordine: {0}',
        summary: 'Riepilogo',
        shipment: 'Spedizione: {0}',
        shipmentAddress: 'Indirizzo di spedizione',
        billingAddress: 'Indirizzo di fatturazione',
        businessAddress: 'Recapito di lavoro',
        goods: 'articolo | articoli',
        productsTotal: 'Totale prodotti',
        shipmentCost: 'Costo spedizione',
        shipmentCostFree: 'Gratis',
        orderTotal: 'Totale ordine',
        quantity: 'Quantità',
      },
    },
    greeting: 'Ciao {name}',
    noOrder: 'Nessun ordine',
    noFavourite: 'Non hai nessun favorito',
    noProducts: 'Non hai ancora acquistato alcun prodotto',
    myAccount: 'Account',
    myOrders: 'Ordini',
    buyAgain: 'Compra di nuovo',
    favorites: 'Preferiti',
    addresses: 'Indirizzi di spedizione',
    accessData: 'Dati di accesso',
    billing: 'Informazioni di fatturazione',
    cards: 'Carte salvate',
    logout: 'esci',
    editAddress: 'Modifica indirizzo',
    deleteAddress: 'Elimina',
    defaultAddress: 'Predefinito',
    addAddress: 'Nuovo indirizzo',
    addNewAddress: 'Aggiungi nuovo indirizzo',
    setAsDefaultLabel: 'Salva come indirizzo predefinito',
    personalData: 'Dati personali',
    setAsDefaultAddress: 'Imposta come predefinito',
    setNewEmailAddress: 'Imposta nuova mail',
    setNewPassword: 'Imposta nuova password',
    setNewPersonalData: 'Imposta dati personali',
    message: 'Messaggio',
    messagePlaceholder: 'Buon giorno, vorrei un aggiornamento sul mio stato della spedizione, grazie.',
    ratingMessage: 'La mia valutazione (non visibile agli altri utenti)',
    ratingDescriptionPlaceholder: 'Es. Vino eccellente biologico.',
    requestAssistanceTitle: 'Richiedi assistenza per l\'ordine {orderId}',
    requestAssistanceSubtitle: 'Inviaci un messagio e se necessario allega la documentazione in tuo possesso. Ti risponderemo prima possibile.',
    newPassword: 'Nuova password',
    confirmPassword: 'Conferma password',
  },
  collections: {
    breadcrumb: 'Tutte le Selezioni',
  },
  search: {
    giftCards: 'Buoni Regalo',
    search: 'Cerca',
    showMore: 'Mostra di più',
    showLess: 'Mostra meno',
    showFilters: 'Mostra filtri',
    showResults: 'Mostra risultati ({count})',
    products: 'Prodotti',
    selections: 'Selezioni',
    productionTypes: 'Tipi di produzione',
    regions: 'Regioni',
    country: 'Nazione',
    categories: 'Stile del Produttore',
    winelists: 'Carta vini',
    pairings: 'Abbinamenti',
    dosagecontents: 'Dosaggio',
    bodystyles: 'Stile',
    boxes: 'Con confezione',
    areas: 'Area',
    provenience: 'Provenienza',
    brands: 'Produttore',
    noBrands: 'Prova la nostra migliore lista',
    countries: 'Nazione',
    sizes: 'Formato',
    vintages: 'Annate',
    awards: 'Premi',
    agings: 'Invecchiamento',
    philosophies: 'Filosofie',
    price: 'Prezzo',
    priceFrom: 'Prezzo da {from}',
    priceTo: 'Prezzo fino a {to}',
    priceFromTo: 'Prezzo da {from} a {to}',
    results: 'Risultato | Risultati',
    noResultsAlert: 'Non ci sono risultati',
    noResultsMessage: `
      <p class="lead">Suggerimenti per la ricerca:</p>
      <ul>
        <li>Controlla possibili errori</li>
        <li>Prova a cercare parole simili o ad usare meno parole</li>
        <li>Prova ad usare parole più generiche, potrai filtrare ulteriormente coi filtri</li>
        <li>Usa il menu principale e filtra la tua ricerca coi filtri sulla sinistra</li>
      </ul>`,
    activeFilters: 'Filtri attivi',
    removeAll: 'Rimuovi tutti',
    removeFilters: 'Rimuovi i filtri',
  },
  product: {
    lowestPrice: 'Prezzo più basso: {price}',
    lowestPriceSplashTitle: 'Informazioni sul prezzo più basso',
    lowestPriceSplashText: 'Questo valore corrisponde al prezzo più basso che ha raggiunto il prodotto sulla nostra piattaforma nei 30 giorni antecedenti all’applicazione dello sconto e tiene conto anche di precedenti promozioni.',
    lowestPriceSplashExtraText: 'Su Callmewine, i prezzi vengono stabiliti con assoluta trasparenza, conformemente alle leggi europee e alla cosiddetta Direttiva Omnibus; visita la nostra pagina {tosUrl} per ulteriori dettagli.',
    tosUrl: 'Condizioni di Vendita',
    otherVintagesSale: 'Annata in vendita {vintage}',
    otherVintages: 'Altre annate: ',
    tooltip: {
      guide: 'Guida {guide}',
      score: 'punteggio {value} su {maxValue}',
      year: 'Annata: {year}',
    },
    promoLabel: 'Promo',
    notifyMeTitle: 'Avvisami quando arriva',
    notifyMeSubtitle: 'Inserisci la tua mail e ti avviseremo quando il prodotto sarà disponibile',
    notifyMeNote: 'Riceverai una mail quando il prodotto sarà disponibile',
    promo: 'promo',
    notAvailable: 'Non disponibile',
    notAvailable2: 'Prodotto non disponibile',
    available: 'Disponibile ({quantity})',
    description: 'Descrizione',
    toEnjoyBetter: 'Per gustarlo meglio',
    awardsAndAcknowledgments: 'Premi e riconoscimenti',
    producer: 'Produttore',
    pairings: 'Abbinamenti',
    pairingsTitle: 'Perfetto da bere con',
    temperature: 'Temperatura',
    whenOpen: 'Quando aprire',
    whenDrink: 'Quando bere',
    glass: 'Bicchiere',
    longevity: 'Longevità',
    guide: 'Guida',
    year: 'Annata',
    score: 'Punteggio',
    quote: 'Citazione',
    recommendedByCallmewine: 'Consigliato da Callmewine',
    mainWines: 'Vini principali',
    foundation: 'Anno Fondazione',
    vineyardHectares: 'Ettari vitati',
    ownGrapes: 'Proprietà',
    annualProduction: 'Produzione annuale',
    winemaker: 'Enologo',
    address: 'Indirizzo',
    features: 'Caratteristiche',
    denomination: 'Denominazione',
    grapes: 'Vitigni',
    regionCountry: 'Regione',
    alcoholContent: 'Gradazione alcolica',
    size: 'Formato',
    winemaking: 'Vinificazione',
    vineyards: 'Vigneti',
    agingDescription: 'Affinamento',
    productInformations: 'Note addizionali',
    proprietaryGrapes: 'uve di proprietà',
    productionPhilosophies: 'Filosofia produttiva',
    tipology: 'Tipologia',
    color: 'Colore',
    taste: 'Gusto',
    aroma: 'Profumo',
    collectionBottle: 'Bottiglia da collezione, non soggetta a promozioni',
    bioInfo: 'da agricoltura Italia o EU',
    bioOperator: 'Codice Operatore nr.',
    subCategory: 'Tipologia',
  },
  recoverPwd: {
    title: 'Reimposta password',
    paragraph: 'Inserisci l\'email con la quale ti sei registrato. Riceverai nella tua casella di posta un messaggio con le istruzioni per modificare la password.',
    feedback: 'Se l\'indirizzo {0} è associato ad un profilo registrato, riceverai via mail il link per reimpostare la password del tuo account.',
    feedbackFooter: {
      text: 'Il tuo profilo è registrato e non hai ricevuto l\'e-mail? Cerca nella posta indesiderata oppure {0}',
      link: 'richiede un nuovo invio',
    },
  },
  contactForm: {
    motivation: 'Motivazione del contatto',
    loginRequired: 'richiede login',
    selectOrder: 'Seleziona l\'ordine',
    selectedOrder: 'Order# {orderNumber} from {date}, by {name} for {total}',
    choices: {
      PAYMENT: 'Segnalazioni relative al pagamento di un ordine',
      ORDER_SHIPMENT: 'Richiesta informazioni sulla spedizione di un ordine',
      ORDER_RECEIVED: 'Segnalazioni riguardanti un ordine ricevuto',
      PURCHASE_SUGGEST: 'Richiesta di suggerimento di acquisto',
      SITE_IMPROVEMENT: 'Suggerimenti di prodotti da aggiungere su Callmewine o miglioramenti del sito',
      OTHER: 'Altre domande o segnalazioni',
    },
  },
  waitingForConfirmation: {
    msg: 'Grazie per aver inviato i tuoi dati, un nostro operatore ti contatterà quanto prima',
    alreadyApproved: 'Sei già approvato, puoi cercare in tutto il nostro sito.',
  },
  bundle: {
    whatIsInTheBox: 'I prodotti che riceverai:',
  },
  productDescriptionTab: 'DESCRIZIONE DEL {productTitle}',
  eventTitle: 'Il Calendario dell’Avvento di Callmewine',
  eventProductsTitle: 'Prova anche le nostre Mystery Box dell\'Avvento',
  eventUpcomingText: `La promozione di questo giorno non è ancora disponibile!
   Clicca sulla cella corrispondente alla data di oggi per scoprire nuove e fantastiche sorprese firmate Callmewine!`,
  eventCancelButton: 'torna al calendario',
  eventNote: `Con il Calendario dell'Avvento di Callmewine ogni giorno è una sorpresa! Dietro ogni casella si
      nascondono bottiglie scontate, gadget, samples in omaggio e tanto altro: per un avvento fatto di
      grandi brindisi insieme a Callmewine!`,
  eventGiftNote: 'Congratulazioni, hai diritto a quest\'omaggio!',
  eventGiftFree: 'Gratis',
  eventProductExpired: 'La promozione di questo giorno è terminata!',
}
