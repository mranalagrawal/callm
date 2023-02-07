export const stripHtml = (str = '') => {
  return str.replace(/<\/?[^>]+(>|$)/g, '')
}

export const stripHtmlAnchors = (str = '') => {
  return str.replace(/<\/?a[^>]*>/g, '')
}
