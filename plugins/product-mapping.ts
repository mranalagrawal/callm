import type { Plugin } from '@nuxt/types'
import { storeToRefs } from 'pinia'
import type { TISO639, TSalesChannel, TStores } from '~/config/themeConfig'
import { useCustomer } from '~/store/customer'
import type { IMoneyV2 } from '~/types/common-objects'
import type { IGiftCardMapped, IGiftCardVariantMapped, IGtmProductData, IProductBreadcrumbs, IProductMapped, TProductFeatures } from '~/types/product'
import type { ObjType } from '~/types/types'
import { getUniqueListBy, pick } from '~/utilities/arrays'
import { getCountryFromStore } from '~/utilities/currency'
import { cleanUrl } from '~/utilities/strings'

interface IProductMapping {
  availableFeatures<T extends KeyType>(
    obj: ObjType<T>,
  ): TProductFeatures[]
  breadcrumbs<T extends KeyType>(
    arr: ObjType<T>[],
  ): IProductBreadcrumbs[]
  pickProductCharacteristics<T extends KeyType>(
    obj: ObjType<T>,
  ): any
  giftCard(
    product: Record<string, any>,
  ): IGiftCardMapped
  fromElastic<T extends KeyType>(
    arr: ObjType<T>[],
  ): IProductMapped[]
  fromShopify<T extends KeyType>(
    arr: ObjType<T>[],
  ): IProductMapped[]
  getGtmProductDataFromCartLine<T extends KeyType>(
    cartLine: ObjType<T>,
  ): IGtmProductData
}

declare module 'vue/types/vue' {
  interface Vue {
    $productMapping: IProductMapping
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $productMapping: IProductMapping
  }
  // nuxtContext.$productMapping
  interface Context {
    $productMapping: IProductMapping
  }
}

declare module 'vuex/types/index' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,unused-imports/no-unused-vars
  interface Store<S> {
    $productMapping: IProductMapping
  }
}

const productMapping: Plugin = ({ $config, $cmwStore, i18n }, inject) => {
  const customerStore = useCustomer()
  const { getCustomerType } = storeToRefs(customerStore)
  const store: TStores = $config.STORE || 'CMW_UK'
  const sale_channel: TSalesChannel = $cmwStore.settings.salesChannel
  const lang: TISO639 = i18n.locale as TISO639

  const productFeatures: TProductFeatures[] = ['exclusive', 'favourite', 'isnew', 'isInPromotion', 'foreveryday', 'togift', 'unusualvariety', 'rarewine', 'artisanal', 'organic', 'topsale']

  const $productMapping: IProductMapping = {
    availableFeatures(obj): TProductFeatures[] {
      /* Todo: Definitely we need to use some enums here on productFeatures ... */
      let features = pick(obj, productFeatures)

      features = Object.keys(features)
        .reduce((o, key) => {
          if (typeof features[key] === 'object') {
            // @ts-expect-error should be define
            !!features[key][sale_channel] && (o[key] = features[key])
          } else {
            // @ts-expect-error should be define
            features[key] === true && (o[key] = features[key])
          }

          return o
        }, {})

      return Object.keys(features).slice(0, 4) as TProductFeatures[]
    },

    breadcrumbs(arr = []): IProductBreadcrumbs[] {
      return arr.map((breadcrumb: Record<string, any>) => ({
        handle: breadcrumb.handle,
        label: breadcrumb.name,
        to: `/${cleanUrl(breadcrumb.handle)}`,
      }),
      )
    },

    pickProductCharacteristics(obj) {
      return pick(obj, ['denomination', 'subCategory', 'region', 'country', 'grapes', 'alcoholContent', 'size', 'winemaking', 'agingDescription', 'productionPhilosophies', 'productInformations', 'tipology', 'color', 'taste', 'aroma', 'organic', 'bioOperator', 'rarewine'])
    },

    fromElastic: (arr = []) => {
      const products: IProductMapped[] = arr.map((p: Record<string, any>) => {
        const compareAtPrice: IMoneyV2 = {
          amount: (p._source.price && p._source.price[sale_channel]) ? p._source.price[sale_channel] : 0,
          currencyCode: store === 'CMW_UK' ? 'GBP' : 'EUR',
        }
        const id = p._source.feId
        const shopify_product_id = `gid://shopify/Product/${p._source.productId[store]}`
        const shopify_product_variant_id = `gid://shopify/ProductVariant/${p._source.variantId[store]}`
        const priceLists = p._source.pricelists
        const productAwards = p._source.awards?.map((award: Record<string, any>) => ({
          ...award,
          title: award[`name_${lang}`],
          quote: award[`quote_${lang}`],
        })) || []

        // shortDescription_t or shortDescription
        // sometimes for 'it' exists only shortDescription, backend need to fix it and republish all
        const plpDescriptionHtml = (p._source.shortDescription_t && p._source.shortDescription_t[lang]) ? p._source.shortDescription_t[lang] : ((lang === 'it' && p._source.shortDescription) ? p._source.shortDescription : '')

        return ({
          milliliters: p._source.milliliters || 0,
          availableFeatures: $productMapping.availableFeatures(p._source),
          availableForSale: p._source.quantity[store] > 0,
          awards: getUniqueListBy(productAwards, 'id'),
          compareAtPrice,
          descriptionHtml: plpDescriptionHtml,
          priceLists,
          quantityAvailable: p._source.quantity[store],
          details: p._source,
          isGiftCard: p._source.isGiftCard,
          id,
          merchandiseId: shopify_product_variant_id,
          handle: p._source.handle_t[lang],
          source_id: `P${id}`,
          shopify_product_id,
          shopify_product_variant_id,
          tags: [`P${id}`, p._source.type],
          title: p._source.name_t[lang] ?? '',
          url: `/${p._source.handle_t[lang]}-P${p._source.feId}.htm`,
          vendor: p._source.brandname,
          image: {
            thumbnail: {
              url: p._source.shopifyImageUrl ? `${p._source.shopifyImageUrl[store]}&width=20&height=36` : '',
              width: 20,
              height: 36,
              altText: p._source.name_t[lang],
            },
            source: {
              url: p._source.shopifyImageUrl ? `${p._source.shopifyImageUrl[store]}&width=300&height=540` : '',
              width: 300,
              height: 540,
              altText: p._source.name_t[lang],
            },
          },
          gtmProductData: {
            internal_id: shopify_product_id.substring(`${shopify_product_id}`.lastIndexOf('/') + 1),
            stock_id: `shopify_${getCountryFromStore(store)}_${shopify_product_id.substring(`${shopify_product_id}`.lastIndexOf('/') + 1)}_${shopify_product_variant_id.substring(`${shopify_product_variant_id}`.lastIndexOf('/') + 1)}`,
            id,
            name: (p._source.name_t[lang] || '').replaceAll('\'', ''),
            brand: (p._source.brandname || '').replaceAll('\'', ''),
            category: (p._source.macros && p._source.macros[0]) ? p._source.macros[0].name_it : '',
            subcategory: p._source.categoryname,
            winelist: (p._source.winelists && p._source.winelists[0]) ? p._source.winelists[0].name_it : 'missing',
            vintage: p._source.vintageyear,
            favourite: p._source.favourite ? 'yes' : 'no',
            artisanal: p._source.artisanal ? 'yes' : 'no',
            rarewine: p._source.rarewine ? 'yes' : 'no',
            price: priceLists[sale_channel] && priceLists[sale_channel][getCustomerType.value], // We have no access to pinia here
            compare_at_price: Number(compareAtPrice?.amount || 0),
            stock_status: (p._source.quantity && p._source.quantity[store]) > 0 ? 'in_stock' : 'out_of_stock',
            quantity: 1,
          },
          sku: p._source.sku,
          tbd: {
            countryName: p._source.countries[`identifier_${lang}`] ? p._source.countries[`identifier_${lang}`].split('|')[1] : '',
            description: plpDescriptionHtml,
            grapes: p._source.grapes ?? '',
            regionName: p._source.regionname ?? '',
            size: p._source.sizes[`identifier_${lang}`] ? p._source.sizes[`identifier_${lang}`].split('|')[1] : '',
          },
        })
      })

      return products
    },

    fromShopify: (arr = []) => {
      const products: IProductMapped[] = arr.map((p: Record<string, any>) => {
        const details = p.details?.value ? JSON.parse(p.details.value) : {}
        const bundle = JSON.parse(p.bundle?.value || '[]')
        const compareAtPrice = p.variants.nodes[0].compareAtPrice
        const id = details?.feId
        const shopify_product_id = p.id
        const shopify_product_variant_id = p.variants.nodes[0].id
        const priceLists = details?.priceLists
        const productAwards = details?.awards?.map((award: Record<string, any>) => ({
          ...award,
          title: award.title,
          quote: award.quote[lang],
        })) || []

        return ({
          milliliters: details?.milliliters || 0,
          availableFeatures: Object.keys(details).length ? $productMapping.availableFeatures(details) : [],
          availableForSale: p.availableForSale,
          awards: getUniqueListBy(productAwards, 'id'),
          bundle,
          compareAtPrice,
          descriptionHtml: p.descriptionHtml,
          priceLists,
          quantityAvailable: p.totalInventory,
          details,
          isGiftCard: p.isGiftCard,
          id,
          merchandiseId: shopify_product_variant_id,
          handle: details?.handle && details?.handle[lang],
          source_id: `P${id}`,
          shopify_product_id,
          shopify_product_variant_id,
          tags: p.tags,
          title: details?.name && details?.name[lang],
          url: details?.handle && `/${details?.handle[lang]}-${details?.key}.htm`,
          vendor: p.vendor,
          image: {
            thumbnail: {
              url: p.featuredImage?.url ? `${p.featuredImage?.url}&width=20&height=36` : 'https://cdn.shopify.com/s/files/1/0578/7497/2719/files/no-product-image-400x400_6.png?v=1680253923&width=20&height=36',
              width: 20,
              height: 36,
              altText: details?.name && details?.name[lang],
            },
            source: {
              url: p.featuredImage?.url ? `${p.featuredImage?.url}&width=300&height=540` : 'https://cdn.shopify.com/s/files/1/0578/7497/2719/files/no-product-image-400x400_6.png?v=1680253923&width=300&height=540',
              width: 300,
              height: 540,
              altText: details?.name && details?.name[lang],
            },
            hd: {
              url: p.featuredImage?.url ? `${p.featuredImage?.url}&width=500&height=899` : 'https://cdn.shopify.com/s/files/1/0578/7497/2719/files/no-product-image-400x400_6.png?v=1680253923&width=300&height=540',
              width: 500,
              height: 899,
              altText: details?.name && details?.name[lang],
            },
          },
          characteristics: $productMapping.pickProductCharacteristics(details),
          gtmProductData: {
            internal_id: shopify_product_id.substring(`${shopify_product_id}`.lastIndexOf('/') + 1),
            stock_id: `shopify_${getCountryFromStore(store)}_${shopify_product_id.substring(`${shopify_product_id}`.lastIndexOf('/') + 1)}_${shopify_product_variant_id.substring(`${shopify_product_variant_id}`.lastIndexOf('/') + 1)}`,
            id,
            name: (p.title || '').replaceAll('\'', ''),
            brand: (p.vendor || '').replaceAll('\'', ''),
            category: details?.categoryName,
            subcategory: details?.subCategoryName,
            winelist: details?.wineListName,
            vintage: details?.vintage,
            favourite: details?.favourite ? 'yes' : 'no',
            artisanal: details?.artisanal ? 'yes' : 'no',
            rarewine: details?.rarewine ? 'yes' : 'no',
            price: priceLists && priceLists[sale_channel] && priceLists[sale_channel][getCustomerType.value],
            compare_at_price: Number(compareAtPrice?.amount || 0),
            stock_status: p.totalInventory > 0 ? 'in_stock' : 'out_of_stock',
            quantity: 1, // TODO: update when updating cart quantity
          },
          seo: {
            description: p.seo?.description,
            title: p.seo?.title,
          },
          sku: p.variants.nodes[0].sku,
          tbd: {
            countryName: details?.countryName && details?.countryName[lang],
            description: details?.shortDescription && details?.shortDescription[lang],
            grapes: details?.grapes && details?.grapes[lang],
            regionName: details?.regionName && details?.regionName[lang],
            size: details?.size && details?.size[lang],
          },
        })
      })

      return products
    },

    giftCard(product): IGiftCardMapped {
      const getGiftCardVariants = (brand: string): IGiftCardVariantMapped[] => product.variants.nodes.map((v: any) => ({
        isGiftCard: product.isGiftCard,
        id: v.id,
        merchandiseId: v.id,
        shopify_product_variant_id: v.id,
        title: v.title,
        description: v.description || null,
        price: { ...v.price },
        compareAtPrice: v.compareAtPrice,
        quantityAvailable: v.quantityAvailable,
        gtmProductData: {
          artisanal: 'no',
          brand: (brand || 'callmewine').replaceAll('\'', ''),
          category: 'Gift Cards',
          compareAtPrice: v.compareAtPrice,
          favourite: 'no',
          id: v.id,
          internal_id: product.id, // ultimi numeri di shopify id
          name: v.title,
          price: v.price?.amount || 0,
          quantity: 1, // TODO: update when updating cart quantity
          rarewine: 'no',
          stock_id: '', // shopify_IT_7833612517596_43388993994972
          stock_status: 'in_stock',
          subcategory: '',
          vintage: 'novintage',
          winelist: '',
        },
        tags: [],
      })) || []

      const details = JSON.parse(product.details.value)
      const breadcrumbs = JSON.parse(product.breadcrumbs.value)

      return {
        merchandiseId: product.id,
        isGiftCard: product.isGiftCard,
        id: product.id,
        shopify_product_id: product.id,
        shopify_product_variant_id: product.id,
        title: product.title,
        description: details.shortDescription[lang] || null,
        quantityAvailable: 0,
        image: {
          thumbnail: {
            url: product.featuredImage?.url ? `${product.featuredImage?.url}&width=20&height=36` : 'https://cdn.shopify.com/s/files/1/0578/7497/2719/files/no-product-image-400x400_6.png?v=1680253923&width=20&height=36',
            width: 20,
            height: 36,
            altText: details.shortDescription[lang],
          },
          source: {
            url: product.featuredImage?.url ? `${product.featuredImage?.url}&width=300&height=540` : 'https://cdn.shopify.com/s/files/1/0578/7497/2719/files/no-product-image-400x400_6.png?v=1680253923&width=300&height=540',
            width: 300,
            height: 540,
            altText: details.shortDescription[lang],
          },
        },
        availableForSale: product.availableForSale,
        variants: getGiftCardVariants(product.vendor),
        breadcrumbs: Object.keys(breadcrumbs).length ? $productMapping.breadcrumbs(breadcrumbs[lang]) : [],
        href: '', // TODO
        tags: [],
        seo: {
          description: product.seo.description,
          title: product.seo.title,
        },
      }
    },

    getGtmProductDataFromCartLine<T extends KeyType>(cartLine: ObjType<T>): IGtmProductData {
      let gtmProductData = {}
      const p: Record<string, any> = cartLine

      if (p.isGiftCard) {
        gtmProductData = {
          artisanal: 'no',
          brand: 'callmewine',
          category: 'Gift Cards',
          compareAtPrice: p.compareAtPrice,
          favourite: 'no',
          id: p.id,
          internal_id: p.id, // ultimi numeri di shopify id
          name: p.title,
          // price: p.price.amount,
          quantity: 1, // TODO: update when updating cart quantity
          rarewine: 'no',
          stock_id: '', // shopify_IT_7833612517596_43388993994972
          stock_status: 'in_stock',
          subcategory: '',
          vintage: 'novintage',
          winelist: '',
        }
      } else {
        const details = p.details?.value ? JSON.parse(p.details.value) : {}
        const compareAtPrice = p.variants.nodes[0].compareAtPrice
        const id = details?.feId
        const shopify_product_id = p.id
        const shopify_product_variant_id = p.variants.nodes[0].id
        const priceLists = details?.priceLists

        gtmProductData = {
          internal_id: shopify_product_id.substring(`${shopify_product_id}`.lastIndexOf('/') + 1),
          stock_id: `shopify_${getCountryFromStore(store)}_${shopify_product_id.substring(`${shopify_product_id}`.lastIndexOf('/') + 1)}_${shopify_product_variant_id.substring(`${shopify_product_variant_id}`.lastIndexOf('/') + 1)}`,
          id,
          name: (p.title || '').replaceAll('\'', ''),
          brand: p.vendor,
          category: details?.categoryName,
          subcategory: details?.subCategoryName,
          winelist: details?.wineListName,
          vintage: details?.vintage,
          favourite: details?.favourite ? 'yes' : 'no',
          artisanal: details?.artisanal ? 'yes' : 'no',
          rarewine: details?.rarewine ? 'yes' : 'no',
          price: priceLists && priceLists[sale_channel] && priceLists[sale_channel][getCustomerType.value],
          compare_at_price: Number(compareAtPrice?.amount || 0),
          stock_status: p.totalInventory > 0 ? 'in_stock' : 'out_of_stock',
          quantity: 1, // TODO: update when updating cart quantity
        }
      }

      return <IGtmProductData>gtmProductData
    },
  }

  inject('productMapping', $productMapping)
}

export default productMapping
