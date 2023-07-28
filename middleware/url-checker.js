// let count = 0

// eslint-disable-next-line max-len
// const OLD_LETTERS_REGEX = /^\/(.*?)(?<!%)((C(1|2|3|4|54|57|64|66|75|78|87|95|97|99|104|106|109))|(R(1|15|4|5|6|221|238|9|10|275|11|12|282|13|14|16|17|19|20|21|22|23|24|25|233|26|203|188|28|29|241|30|31|32|229|33|34|35|36|38|39|40|196|42|291|43|44|45|46|47|48|247|49|50|51|293|52|186|184|297)))([A-OQ-Z]\d+)?(.*?).htm/
const MACRO_LETTERS = '(1|2|3|4|54|57|64|66|75|78|87|95|97|99|104|106|109)'
const COUNTRY_LETTERS = '(1|4|5|6|9|10|11|12|13|14|15|16|17|19|20|21|22|23|24|25|26|28|29|30|31|32|33|34|35|36|38|39|40|42|43|44|45|46|47|48|49|50|51|52|184|186|188|196|203|221|229|233|238|241|247|275|282|291|293|297)'

// avoid callmewine-api call to get the redirectUrl
const REDIRECT_PUNTUALI = {
  '/champagne-blanc-de-blancs-collin-ulysse-extra-brut-V63B409D4.htm': '/champagne-collin-ulysse-extra-brut-C9B409D4.htm',
  '/champagne-millesimato-laurent-perrier-brut-V65B520D3.htm': '/champagne-laurent-perrier-brut-C9B520D3.htm',
  '/alta-langa-spumante-germano-ettore-pas-dosè-nature-V10B121D5.htm': '/spumanti-germano-ettore-pas-dos%C3%A8-nature-C8B121D5.htm',
  '/spumante-metodo-classico-ferdinando-principiano-extra-brut-V275B711D4.htm': '/spumanti-ferdinando-principiano-extra-brut-C8B711D4.htm',
  '/franciacorta-antica-fratta-pas-dosè-nature-V109B1790D5.htm': '/spumanti-antica-fratta-pas-dos%C3%A8-nature-C8B1790D5.htm',
  '/alta-langa-spumante-ferdinando-principiano-extra-brut-V10B711D4.htm': '/spumanti-ferdinando-principiano-extra-brut-C8B711D4.htm',
  '/spumante-metodo-classico-1701-franciacorta-pas-dosè-nature-V275B1056D5.htm': '/spumanti-1701-franciacorta-pas-dos%C3%A8-nature-C8B1056D5.htm',
  '/franciacorta-castello-bonomi-pas-dosè-nature-V109B788D5.htm': '/spumanti-castello-bonomi-pas-dos%C3%A8-nature-C8B788D5.htm',
  '/pinot-nero-pietro-torti-brut-V222B2496D3.htm': '/vini-pietro-torti-brut-C1B2496D3.htm',
  '/champagne-rosé-tristan-hyest-extra-brut-V67B2452D4.htm': '/champagne-tristan-hyest-extra-brut-C9B2452D4.htm',
  '/cabernet-sauvignon-veneto-2021-V42R78A39.htm': '/vini-cabernet-sauvignon-veneto-C1V42R78.htm',
  '/sancerre-valle-della-loira-2017-V256R87A32.htm': '/vini-sancerre-valle-della-loira-C1V256R87.htm',
  '/pinot-nero-borgogna-2016-V222R83A2.htm': '/vini-pinot-nero-borgogna-C1V222R83.htm',
  '/passito-bordeaux-2017-V202R82A32.htm': '/vini-passito-bordeaux-C1V202R82.htm',
  '/riesling-mosella-2020-V242R100A38.htm': '/vini-riesling-mosella-C1V242R100.htm',
  '/primitivo-puglia-2021-V228R70A39.htm': '/vini-rosati-primitivo-puglia-C7V228R70.htm',
  '/champagne-blanc-de-blancs-francia-2015-V63R15A3.htm': '/champagne-champagne-blanc-de-blancs-francia-C9V63R15.htm', // dopo redirect va in 410
  '/cabernet-franc-valle-della-loira-2020-V41R87A38.htm': '/vini-cabernet-franc-valle-della-loira-C1V41R87.htm', // nel title manca Vini (corrispondente all'M1)
  '/teroldego-italia-2018-V286R1A33.htm': '/vini-teroldego-italia-C1V286R1.htm',
  '/cabernet-sauvignon-veneto-2020-V42R78A38.htm': '/vini-cabernet-sauvignon-veneto-C1V42R78.htm',
  '/vini-rosso-di-montepulciano-bottiglia-75-cl-toscana-2020-C1V250F7R73A38.htm': '/rosso-di-montepulciano-bindella-2020-V250B486A38.htm',
  '/vini-speziati-bitter-bottiglia-70-cl-italia-senza-annata-C53V476F6R1A1.htm': '/bitter-angostura-senza-annata-V476B2057A1.htm',
  '/champagne-champagne-blanc-de-blancs-magnum-150-cl-regione-champagne-senza-annata-C9V63F9R84A1.htm': '/champagne-blanc-de-blancs-agrapart-senza-annata-V63B225A1.htm',
  '/vini-bianchi-bordeaux-blanc-bottiglia-75-cl-bordeaux-2020-C6V32F7R82A38.htm': '/bordeaux-blanc-chateau-jean-faux-2020-V32B1452A38.htm',
  '/vini-garganega-bottiglia-75-cl-veneto-2021-C1V117F7R78A39.htm': '/garganega-anselmi-2021-V117B1274A39.htm',
  '/liquore-liquori-bottiglia-70-cl-poitou-charentes-senza-anno-C27V391F6R90A1.htm': '/liquori-antica-distilleria-quaglia-senza-annata-V391B757A1.htm',
  '/vini-merlot-bottiglia-75-cl-bordeaux-2018-C1V164F7R82A33.htm': '/merlot-tenuta-masseto-2018-V164B1105A33.htm',
  '/spumanti-spumante-rosé-bottiglia-75-cl-friuli-venezia-giulia-senza-annata-C8V276F7R63A1.htm': '/spumante-ros%C3%A9-ca-dei-frati-senza-annata-V276B13A1.htm',
  '/vini-bianchi-traminer-aromatico-bottiglia-75-cl-sicilia-2022-C6V689F7R72A43.htm': '/traminer-aromatico-cantine-fina-2022-V689B1612A43.htm',
  '/vini-piedirosso-bottiglia-75-cl-campania-2021-C1V215F7R61A39.htm': '/piedirosso-casa-setaro-2021-V215B1265A39.htm',
  '/spumante-metodo-classico-chemin-des-vignobles-valle-d-aosta-extra-brut-V275B2165R76D4.htm': '/spumanti-chemin-des-vignobles-extra-brut-C8B2165D4.htm',
  '/spumante-metodo-classico-cherubini-italia-pas-dosè-nature-V275B2646R1D5.htm': '/spumanti-cherubini-pas-dos%C3%A8-nature-C8B2646D5.htm',
  '/spumante-metodo-classico-chemin-de-vignobles-valle-d-aosta-extra-brut-V275B2165R76D4.htm': '/spumanti-chemin-des-vignobles-extra-brut-C8B2165D4.htm',
  '/champagne-pinot-meunier-charpentier-jacky-francia-brut-V66B298R15D3.htm': '/champagne-charpentier-jacky-brut-C9B298D3.htm',
  '/champagne-pinot-meunier-francis-orban-francia-brut-V66B1426R15D3.htm': '/champagne-francis-orban-brut-C9B1426D3.htm',
  '/champagne-blanc-de-blancs-jacques-lassaigne-francia-extra-brut-V63B2448R15D4.htm': '/champagne-jacques-lassaigne-extra-brut-C9B2448D4.htm',
  '/franciacorta-arcari-danesi-italia-pas-dosè-nature-V109B812R1D5.htm': '/spumanti-arcari-danesi-pas-dos%C3%A8-nature-C8B812D5.htm',
  '/franciacorta-gatti-enrico-lombardia-pas-dosè-nature-V109B104R66D5.htm': '/spumanti-gatti-enrico-pas-dos%C3%A8-nature-C8B104D5.htm',
  '/spumante-metodo-classico-contadi-castaldi-italia-brut-V275B24R1D3.htm': '/spumanti-contadi-castaldi-brut-C8B24D3.htm',
  '/franciacorta-nicola-gatta-italia-pas-dosè-nature-V109B1806R1D5.htm': '/spumanti-nicola-gatta-pas-dos%C3%A8-nature-C8B1806D5.htm',
  '/vin-jaune-bottiglia-62-cl-jura-V317F5R80.htm': '/vini-vin-jaune-jura-C1V317R80.htm',
  '/savagnin-bottiglia-62-cl-jura-V264F5R80.htm': '/vini-savagnin-jura-C1V264R80.htm',
  '/pinot-nero-bottiglia-75-cl-alsazia-V222F7R81.htm': '/vini-pinot-nero-alsazia-C1V222R81.htm',
  '/pinot-bianco-bottiglia-75-cl-regione-champagne-V219F7R84.htm': '/vini-pinot-bianco-regione-champagne-C1V219R84.htm',
  '/brandy-bottiglia-70-cl-friuli-venezia-giulia-V367F6R63.htm': '/distillati-brandy-friuli-venezia-giulia-C2V367R63.htm',
  '/sherry-bottiglia-75-cl-spagna-V271F7R45.htm': '/vini-sherry-spagna-C1V271R45.htm',
  '/pinot-nero-bottiglia-75-cl-australia-V222F7R5.htm': '/vini-pinot-nero-australia-C1V222R5.htm',
  '/albana-passito-bottiglia-50-cl-emilia-romagna-V3F4R62.htm': '/vini-albana-passito-emilia-romagna-C1V3R62.htm',
  '/ice-wine-bottiglia-37-5-cl-israele-V396F3R29.htm': '/vini-ice-wine-israele-C1V396R29.htm',
  '/petit-verdot-bottiglia-75-cl-perù-V212F7R38.htm': '/vini-petit-verdot-per%C3%B9-C1V212R38.htm',
}

const REDIRECT_SEO_REGEX = {
  // ********************* REDIRECT - 301
  '^\/(.*?)-((C|M)1V\\d+).htm': 301,
  // "vini-meursault-C1V166.htm" : 301,
  '^\/(.*?)-((C|M)2V\\d+).htm': 301,
  // "distillati-grappa-secca-C2V348.htm" : 301,
  '^\/(.*?)-((C|M)3V\\d+).htm': 301,
  // "degustazioni-gewurztraminer-C3V121.htm" : 301,
  // "wine-box-lambrusco-C3V143.htm" : 301,
  '^\/(.*?)-(C13V\\d+).htm': 301,
  // "whisky-whisky-torbato-C13V341.htm" : 301,
  '^\/(.*?)-(C14V\\d+).htm': 301,
  // "rum-rum-agricole-stile-francese-C14V326.htm" : 301,
  '^\/(.*?)-(C15V\\d+).htm': 301,
  // "grappa-grappa-morbida-C15V349.htm" : 301,
  '^\/(.*?)-(C16V\\d+).htm': 301,
  // "gin-gin-compound-bathtub-C16V346.htm" : 301,
  '^\/(.*?)-(C21V\\d+).htm': 301,
  // "tequila-tequila-anejo-C21V355.htm" : 301,
  '^\/(.*?)-(C27V\\d+).htm': 301,
  // "liquore-amaro-C27V372.htm" : 301,
  '^\/(.*?)-(C28V\\d+).htm': 301,
  // "casse-vini-gewurztraminer-C28V121.htm" : 301,
  '^\/(.*?)-(C59V\\d+).htm': 301,
  // "birra-ambrata-birra-iga-C59V521.htm" : 301,
  '^\/(.*?)-(C76V\\d+).htm': 301,
  // "sidro-di-mele-sidro-secco-C76V563.htm" : 301,

  '^\/(.*?)-(C\\d+B\\d+).htm': 301,
  // "champagne-collin-ulysse-C9B409.htm" : 301,

  '^\/(.*?)-(C\\d+V\\d+B\\d+F\\d+R\\d+A\\d+).htm': 301,
  // "armagnac-bas-armagnac-dartigalongue-bottiglia-70-cl-francia-1996-C19V361B854F6R15A22.htm" : 301,

  '^\/(.*?)-(C\\d+B\\d+F\\d+R\\d+A\\d+).htm': 301,
  // "vini-domaine-giacometti-bottiglia-75-cl-corsica-2020-C1B2234F7R260A38.htm" : 301,
  '^\/(.*?)-(C\\d+V\\d+B\\d+R\\d+A\\d+).htm': 301,
  // "rum-rum-invecchiato-transcontinental-rum-line-panama-2011-C14V330B1067R179A7.htm" : 301,
  '^\/(.*?)-(C\\d+V\\d+B\\d+F\\d+A\\d+).htm': 301,
  // "champagne-champagne-millesimato-veuve-clicquot-bottiglia-75-cl-2012-C9V65B1090F7A6" : 301,
  '^\/(.*?)-(C\\d+V\\d+B\\d+F\\d+R\\d+).htm': 301,
  // "vini-ploussard-tony-bornard-bottiglia-75-cl-jura-C1V493B2575F7R80.htm" : 301,
  '^\/(.*?)-(C\\d+V\\d+B\\d+R\\d+D\\d+).htm': 301,
  // "vini-spumante-metodo-classico-rev%C3%AC-italia-pas-dos%C3%A8-nature-C1V275B1334R1D5.htm" : 301,

  '^\/(.*?)-(C\\d+B\\d+D\\d+A\\d+).htm': 301,
  // "champagne-krug-brut-senza-annata-C9B454D3A1.htm" : 301,
  '^\/(.*?)-(C\\d+B\\d+F\\d+A\\d+).htm': 301,
  // "vini-barbacarlo-bottiglia-75-cl-2016-C1B701F7A2.htm" : 301,
  '^\/(.*?)-(C\\d+B\\d+F\\d+R\\d+).htm': 301,
  // "champagne-pol-roger-jeroboam-300-cl-francia-C9B404F10R15.htm" : 301,
  '^\/(.*?)-(C\\d+B\\d+R\\d+A\\d+).htm': 301,
  // "vini-chateau-lafite-rothschild-francia-2010-C1B2090R15A8.htm" : 301,
  '^\/(.*?)-(C\\d+V\\d+B\\d+F\\d+).htm': 301,
  // "vini-rossi-bolgheri-rosso-grattamacco-magnum-150-cl-C5V29B142F9.htm" : 301,
  '^\/(.*?)-(C\\d+V\\d+F\\d+R\\d+).htm': 301,
  // "vini-saperavi-bottiglia-75-cl-georgia-C1V260F7R16.htm" : 301,
  '^\/(.*?)-(C\\d+V\\d+R\\d+A\\d+).htm': 301,
  // "vini-pinot-nero-borgogna-2017-C1V222R83A32.htm" : 301,

  '^\/(.*?)-(C\\d+V\\d+B\\d+).htm': 301,
  // "vini-bianchi-malvasia-di-candia-vino-del-poggio-C6V155B763.htm" : 301,
  '^\/(.*?)-(C\\d+V\\d+D\\d+).htm': 301,
  // "spumanti-nero-buono-extra-brut-C8V187D4.htm" : 301,

  '^\/(.*?)-(V\\d+B\\d+F\\d+R\\d+A\\d+).htm': 301,
  // "malvasia-istriana-zidarich-bottiglia-75-cl-friuli-venezia-giulia-2019-V156B174F7R63A37.htm" : 301,

  '^\/(.*?)-(V\\d+B\\d+F\\d+A\\d+).htm': 301,
  // "schioppettino-bressan-bottiglia-75-cl-2016-V268B224F7A2.htm" : 301,
  '^\/(.*?)-(V\\d+B\\d+F\\d+R\\d+).htm': 301,
  // "champagne-blanc-de-noirs-freres-laherte-bottiglia-75-cl-regione-champagne-V64B518F7R84.htm" : 301,
  '^\/(.*?)-(V\\d+B\\d+R\\d+A\\d+).htm': 301,
  // "barolo-bartolo-mascarello-piemonte-2012-V24B184R69A6.htm" : 301,
  '^\/(.*?)-(V\\d+B\\d+R\\d+D\\d+).htm': 301,
  // "spumante-metodo-classico-chemin-des-vignobles-valle-d-aosta-extra-brut-V275B2165R76D4" : 301,
  '^\/(.*?)-(V\\d+F\\d+R\\d+A\\d+).htm': 301,
  // "vino-bianco-blend-di-uve-bottiglia-75-cl-victoria-2019-V319F7R268A37.htm" : 301,

  '^\/(.*?)-(V\\d+B\\d+D\\d+).htm': 301,
  // "champagne-blanc-de-blancs-collin-ulysse-extra-brut-V63B409D4.htm" : 301,
  '^\/(.*?)-(V\\d+F\\d+R\\d+).htm': 301,
  // "savagnin-bottiglia-62-cl-jura-V264F5R80" : 301,
  '^\/(.*?)-(V\\d+R\\d+A\\d+).htm': 301,
  // "cabernet-sauvignon-veneto-2020-V42R78A38.htm" : 301,

  // DA RIVEDERE '^\/[a-z0-9]+(?:-[a-z0-9]+)*-(B\\d+).htm': 301,
  // "agrapart-B225.htm" : 301,
  // DA RIVEDERE
  // "????? vini-oltrepo-pavese_2.htm" : 301

  // macro categories custom rule to catch macros C to be transformed in M
  // non serve + spostato nel prepareRedirect '^\/(.*?)-(C(?:1|2|3|4|54|57|64|66|75|78|87|95|97|99|104|106|109))(.*?).htm': '/customRedirectMacrocategories',

  // new letters are ok, if is not required a 301
  [`M${MACRO_LETTERS}[A-Z.]`]: 200,
  [`N${COUNTRY_LETTERS}[A-Z.]`]: 200,

  // ********************* STATUS OK - 200
  '^\/(.*?)-(C\\d+B\\d+A\\d+).htm': 200,
  // "champagne-dom-perignon-1996-C9B886A22" : 200,
  '^\/(.*?)-(C\\d+B\\d+R\\d+).htm': 200,
  // "vini-podere-della-civettaja-toscana-C1B1288R73.htm" : 200,
  '^\/(.*?)-(C\\d+B\\d+F\\d+).htm': 200,
  // "champagne-krug-magnum-150-cl-C9B454F9.htm" : 200,
  '^\/(.*?)-(C\\d+B\\d+D\\d+).htm': 200,
  // "spumanti-tasca-d-almerita-brut-C8B87D3.htm" : 200,
  '^\/(.*?)-(C\\d+F\\d+R\\d+).htm': 200,
  // "spumanti-jeroboam-300-cl-italia-C8F10R1.htm" : 200,
  '^\/(.*?)-(C\\d+V\\d+A\\d+).htm': 200,
  // "vini-gevrey-chambertin-2018-C1V120A33.htm" : 200,
  '^\/(.*?)-(C\\d+V\\d+F\\d+).htm': 200,
  // "spumanti-franciacorta-magnum-150-cl-C8V109F9.htm" : 200,
  '^\/(.*?)-(C\\d+V\\d+R\\d+).htm': 200,
  // "vini-dolci-passito-friuli-venezia-giulia-C10V202R63.htm" : 200,
  '^\/(.*?)-(C\\d+A\\d+).htm': 200,
  // "champagne-2008-C9A10.htm" : 200,
  '^\/(.*?)-(C\\d+D\\d+).htm': 200,
  // "spumanti-brut-C8D3.htm" : 200,
  '^\/(.*?)-(C\\d+F\\d+).htm': 200,
  // "spumanti-magnum-150-cl-C8F9.htm" : 200,
  '^\/(.*?)-(C8V\\d+).htm': 200,
  // "spumanti-cremant-C8V91.htm" : 200,
  '^\/(.*?)-(C9V\\d+).htm': 200,
  // "champagne-champagne-pinot-meunier-C9V66.htm" : 200,
  '^\/(.*?)-(C\\d+R\\d+).htm': 200,
  // "gin-giappone-C16R19.htm" : 200,
  '^\/(.*?)-(C\\d+|).htm': 200,
  // "vini-bianchi-C6.htm" : 200,
  '^\/(.*?)-(V\\d+B\\d+A\\d+).htm': 200,
  // "barolo-lorenzo-accomasso-2014-V24B1973A4.htm" : 200,
  '^\/(.*?)-(V\\d+B\\d+F\\d+).htm': 200,
  // "champagne-millesimato-moet-chandon-bottiglia-75-cl-V65B61F7.htm" : 200,
  '^\/(.*?)-(V\\d+B\\d+R\\d+).htm': 200,
  // "pinot-nero-domaine-faiveley-borgogna-V222B867R83.htm" : 200,
  '^\/(.*?)-(V\\d+A\\d+).htm': 200,
  // "barolo-2016-V24A2.htm" : 200,
  '^\/(.*?)-(V\\d+B\\d+).htm': 200,
  // "barolo-giuseppe-rinaldi-V24B369.htm" : 200,
  '^\/(.*?)-(V\\d+D\\d+).htm': 200,
  // "prosecco-pas-dos%C3%A8-nature-V232D5.htm" : 200,
  '^\/(.*?)-(V\\d+F\\d+).htm': 200,
  // "franciacorta-jeroboam-300-cl-V109F10.htm" : 200,
  '^\/(.*?)-(V\\d+R\\d+).htm': 200,
  // "chambolle-musigny-borgogna-V508R83.htm" : 200,
  '^\/(.*?)-(V\\d+).htm': 200,
  // "amarone-V11.htm" : 200,

  '^\/(\\w+)\/(.*?)-(B\\d+).htm$': 200,
  // '^\/$': 200,
}

function searchRedirectPuntuali(urlPath) {
  for (const [urlFrom, urlRedirectTo] of Object.entries(REDIRECT_PUNTUALI)) {
    if (urlFrom === urlPath || urlPath === encodeURI(urlFrom))
      return urlRedirectTo
  }

  return null
}

function getMatchedRegex(urlPath) {
  return Object.keys(REDIRECT_SEO_REGEX).find((regex) => {
    // console.log(`checking seo_rules urlPath ${urlPath} vs regex ${regex}`)

    const regexToCheck = new RegExp(regex, 'g')
    const matches = urlPath.match(regexToCheck)
    if (matches)
      return true

    return false
  })
}

function isOldMacros(url) {
  const isOldMacros = new RegExp(`C${MACRO_LETTERS}[A-Z.]`, 'g')
  if (url.match(isOldMacros))
    return true

  return false
}

function isOldCountries(url) {
  const isOldCountries = new RegExp(`R${COUNTRY_LETTERS}[A-Z.]`, 'g')
  if (url.match(isOldCountries))
    return true

  return false
}

function needLettersReplace(url) {
  return isOldMacros(url) || isOldCountries(url)
}

function prepareRedirect(redirectUrl) {
  if (isOldMacros(redirectUrl)) {
    const macrosRegex = new RegExp(`C${MACRO_LETTERS}([A-Z.])`)
    redirectUrl = redirectUrl.replace(macrosRegex, 'M$1$2')
    console.log('macrosReplaced', redirectUrl)
  }
  if (isOldCountries(redirectUrl)) {
    const countriesRegex = new RegExp(`R${COUNTRY_LETTERS}([A-Z.])`)
    redirectUrl = redirectUrl.replace(countriesRegex, 'N$1$2')
    console.log('countriesReplaced', redirectUrl)
  }

  return redirectUrl
}

function pageWithFilterCode(routePath) {
  return routePath.match(/-([A-OQ-Z]\d+)+.htm/) // exclude P product pages
}

export default async function ({ redirect, route, $config, error, localePath, i18n }) {
  console.log({ path: route.path, elasticUrl: $config.ELASTIC_URL })
  // never resetted
  // count++
  // if (count >= 5) {
  //  $sentry.captureException(new Error(`url-checker - too many redirects ${route.path}`))
  //  return
  // }
  // is brand
  if (route.path.match(/[a-z0-9\/]+(?:-[a-z0-9]+)*-(B\d+)+.htm/)) {
    console.log(`${route.path} is a brandPage...`)
    // only /brand-slug-B123.htm, ignore /cantina/brand-slug-B123.htm
    if (route.path.match(/^\/[a-z0-9]+(?:-[a-z0-9]+)*-(B\d+)+.htm/)) {
      console.log(`${route.path} , remove slash ${route.path.substring(1)}`)
      const redirectTo = localePath({
        name: 'winery-handle',
        params: { handle: route.path.substring(1) },
      })
      console.log(`🚥(301) ${route.path} missing folder, redirect to ${redirectTo}`)
      redirect(301, redirectTo)
    }
  } else if (pageWithFilterCode(route.path)) {
  // only pages with at least one filter/code part es C1, M1R13 ecc
    console.log(`${route.path} is a pageWithFilterCode searching for a match...`)
    let redirectTo = null

    // 1. searching in redirect puntuali/fissi
    redirectTo = searchRedirectPuntuali(route.path)
    console.log(`${route.path} is redirectPuntuale ?`, redirectTo)

    if (redirectTo) {
      redirectTo = prepareRedirect(redirectTo)
      console.log(`🚥(301) ${route.path} is redirectPuntuale -> redirectTo ${redirectTo}`)
      return redirect(301, redirectTo)
    }

    // 2. searching in redirect seo rules/regex
    const matched = getMatchedRegex(route.path)
    // need backend to get redirectUrl
    console.log('redirectByRegex matched', matched, REDIRECT_SEO_REGEX[matched])

    if (matched && REDIRECT_SEO_REGEX[matched] === 301) {
      try {
        console.log(`🚥(301) need redirect get ${$config.ELASTIC_URL}seo/get-redirect-url?urlPath=${route.path}`)
        const url = `${$config.ELASTIC_URL}seo/get-redirect-url?urlPath=${route.path}`
        const headers = {
          'x-cmw-locale': i18n.locale,
          'x-cmw-store': $config.STORE,
        }

        const response = await fetch(url, { headers })
        const respBody = await response.json()
        const beRedirectTo = respBody.data.redirectUrl
        redirectTo = prepareRedirect(beRedirectTo)
        console.log(`🚥(301) api redirect response: ${beRedirectTo}, redirectTo --> ${redirectTo}`)
        redirect(301, redirectTo)
      } catch (e) {
        // if bo can't respond - continue with old url instead of broken
        console.log('🚥(301) error', { error: e.message })
      }
    } else if (matched && REDIRECT_SEO_REGEX[matched] === 200) {
      console.log(`🚥${route.path} match ${matched} -> 200 url ok`)

      if (needLettersReplace(route.path)) {
        redirectTo = prepareRedirect(route.path)
        console.log(`🚥(301) ${route.path} contains oldletters need redirect to  -> ${redirectTo}`)
        redirect(301, redirectTo)
      } else {
        console.log(`🚥(200) ${route.path} -> continue`)
      }
    } else {
      console.log(`🚥${route.path} doesn't match regex -> 410`)
      error({ statusCode: 410, message: 'Resource is gone.' })
    }
  }
}