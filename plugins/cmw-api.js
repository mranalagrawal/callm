export default function ({ app, $http, $config }, inject) {
  // See https://github.com/sindresorhus/ky#options
  const $cmw = $http.create()

  $cmw.setBaseURL($config.CMW_API)
  $cmw.setHeader('x-api-key', $config.CMW_API_KEY)
  $cmw.setHeader('X-Cmw-Store', $config.STORE)
  $cmw.setHeader('X-Cmw-Sales-Channel', $config.SALECHANNEL)
  $cmw.setHeader('X-Cmw-Locale', app.i18n.locale)
  $cmw.setHeader('Accept', 'application/json')
  $cmw.setHeader('Content-Type', 'application/json')
  inject('cmw', $cmw)
}
