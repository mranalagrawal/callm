export const stripHtml = (str = '') => {
  return str.replace(/<\/?[^>]+(>|$)/g, '')
}

export const stripHtmlAnchors = (str = '') => {
  return str.replace(/<\/?a[^>]*>/g, '')
}
export const generateKey = (str = '') => {
  if (str === 'missing')
    $nuxt.$sentry.captureException(new Error(`Missing Image ${str}`))

  return str.toLowerCase().replaceAll(' ', '-')
}
