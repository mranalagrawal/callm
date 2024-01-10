import type { TStores } from '~/config/themeConfig'
import type { ICmwStore } from '~/plugins/cmw-project-config'
import { djb2Hash } from '~/utilities/strings'

export function shopifyRichTextToHTML(content: string): string {
  if (!content) { return '' }
  const parsed = JSON.parse(content)
  return parsed.children.map((node: { type: string; level: any; children: any[]; listType: string }) => {
    if (node.type === 'heading') {
      return `<h${node.level}>${node.children[0].value}</h${node.level}>`
    } else if (node.type === 'list') {
      const listType = node.listType === 'unordered' ? 'ul' : 'ol'
      const listItems = node.children.map(item => `<li>${item.children[0].value}</li>`).join('')
      return `<${listType}>${listItems}</${listType}>`
    } else if (node.type === 'paragraph') {
      const paragraphContent = node.children.map((item) => {
        let itemHtml = ''
        if (item.type === 'text') {
          itemHtml += item.bold ? `<strong>${item.value}</strong> ` : ''
          itemHtml += item.italic ? `<em>${item.value}</em> ` : ''
          itemHtml += (!item.bold && !item.italic) ? item.value : ''
        } else if (item.type === 'link') {
          const linkContent = item.children[0].value
          const linkHtml = item.bold
            ? `<strong>${linkContent}</strong>`
            : item.italic
              ? `<em>${linkContent}</em>`
              : linkContent
          itemHtml += `<a href="${item.url}" target="${item.target}">${linkHtml}</a> `
        }
        return itemHtml
      }).join('')
      return `<p>${paragraphContent}</p>`
    } else {
      return ''
    }
  }).join('')
}

function getCheckoutHostname(cmwStore: ICmwStore): string {
  const { isProd, settings } = cmwStore

  const env = isProd ? 'PROD' : 'STAGE'

  const hostMap: { [k in TStores]: { [k in 'PROD' | 'STAGE']: string } } = {
    CMW: {
      PROD: 'https://checkout.callmewine.com',
      STAGE: 'https://checkout-stage.callmewine.com',
    },
    CMW_FR: {
      PROD: 'https://checkout.callmewine.fr',
      STAGE: 'https://checkout-stage.callmewine.fr',
    },
    CMW_DE: {
      PROD: 'https://checkout.callmewine.de',
      STAGE: 'https://checkout-stage.callmewine.de',
    },
    CMW_UK: {
      PROD: 'https://checkout.callmewine.co.uk',
      STAGE: 'https://checkout-stage.callmewine.co.uk',
    },
    B2B: {
      PROD: 'https://b2b-checkout.callmewine.com',
      STAGE: 'https://b2b-checkout-stage.callmewine.com',
    },
  }

  return hostMap[settings.store][env] || ''
}

function getCustomerId(str: string): string {
  let nv = str.substring(str.lastIndexOf('/') + 1)
  const hashedValue = djb2Hash(str)
  hashedValue.toString().split('').reverse().join('')
  const n = str.substring(`${str}`.lastIndexOf('/') + 1)
  nv = djb2Hash(n.substring(0, n.indexOf('-'))).toString()
  nv.split('').reverse().join('')

  return n
}

export { getCheckoutHostname, getCustomerId }
