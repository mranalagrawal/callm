import kebabCase from 'lodash.kebabcase'

const stripHtml = (str = '') => {
  return str.replace(/<\/?[^>]+(>|$)/g, '')
}

const stripHtmlAnchors = (str = '') => {
  return str.replace(/<\/?a[^>]*>/g, '')
}
const generateKey = (str = '') => kebabCase(str)

const cleanRoutesLocales = (str = '') =>
  (str
    .replaceAll('___en', '')
    .replaceAll('___it', '')
    .replaceAll('___fr', '')
    .replaceAll('___de', '')
  )

const cleanUrl = (str = '') =>
  (str
    .replaceAll(' ', '')
    .replaceAll('stage.callmewine.com', '')
    .replaceAll('stage.callmewine.co.uk', '')
    .replaceAll('callmewine.co.uk', '')
    .replaceAll('callmewine.com', ''))

export { stripHtml, stripHtmlAnchors, generateKey, cleanRoutesLocales, cleanUrl }
