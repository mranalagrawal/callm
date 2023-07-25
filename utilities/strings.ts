import kebabCase from 'lodash.kebabcase'

const djb2Hash = (str: string): number => {
  let hash = 5381

  for (let i = 0; i < str.length; i++)
    hash = (hash * 33) ^ str.charCodeAt(i)

  return hash >>> 0 // Convert to unsigned 32-bit integer
}

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

const sleep = (ms: number) => new Promise(
  resolve => setTimeout(resolve, ms))

export { djb2Hash, stripHtml, stripHtmlAnchors, generateKey, cleanRoutesLocales, cleanUrl, sleep }
