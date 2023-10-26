import kebabCase from 'lodash.kebabcase'

const djb2Hash = (str: string): number => {
  let hash = 5381

  for (let i = 0; i < str.length; i++) { hash = (hash * 33) ^ str.charCodeAt(i) }

  return hash >>> 0 // Convert to unsigned 32-bit integer
}

const stripHtml = (str = '') => {
  return str.replace(/<\/?[^>]+(>|$)/g, '')
}

const stripHtmlAnchors = (str = '') => {
  return str.replace(/<\/?a[^>]*>/g, '')
}
const generateKey = (str = '') => kebabCase(str)

const cleanUrl = (str = '') =>
  (str
    .replaceAll(' ', '')
    .replaceAll('stage.callmewine.com', '')
    .replaceAll('stage.callmewine.co.uk', '')
    .replaceAll('callmewine.co.uk', '')
    .replaceAll('callmewine.com', ''))

const sleep = (ms: number) => new Promise(
  resolve => setTimeout(resolve, ms))

const escapeJsonSingleQuotes = (str: string) => str.replace(/'/g, '\\\'')

export { djb2Hash, stripHtml, stripHtmlAnchors, generateKey, cleanUrl, sleep, escapeJsonSingleQuotes }
