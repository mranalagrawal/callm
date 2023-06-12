import type { Plugin } from '@nuxt/types'
import { storeToRefs } from 'pinia'
import type { TISO639, TSalesChannel, TStores } from '~/config/themeConfig'
import themeConfig from '~/config/themeConfig'
import { useCustomer } from '~/store/customer'
import type { IMoneyV2 } from '~/types/common-objects'
import type { IBaseProductMapped, IGiftCardMapped, IProductBreadcrumbs, IProductMapped, TProductFeatures } from '~/types/product'
import { pick } from '~/utilities/arrays'
import { getCountryFromStore } from '~/utilities/currency'
import { cleanUrl } from '~/utilities/strings'

type ObjType<T> = {
  [key in KeyType]: T;
}

interface IProductMapping {
  availableFeatures<T extends KeyType>(
    obj: ObjType<T>,
  ): TProductFeatures[]
  breadcrumbs<T extends KeyType>(
    arr: ObjType<T>[],
  ): IProductBreadcrumbs[]
  giftCard(
    product: Record<string, any>,
  ): IBaseProductMapped
  fromElastic<T extends KeyType>(
    arr: ObjType<T>[],
  ): IProductMapped[]
  fromShopify<T extends KeyType>(
    arr: ObjType<T>[],
  ): IProductMapped[]
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
  // nuxtContext.$cmw
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

const productMapping: Plugin = ({ $config, i18n }, inject) => {
  const customerStore = useCustomer()
  const { getCustomerType } = storeToRefs(customerStore)
  const store: TStores = $config.STORE || 'CMW_UK'
  const sale_channel: TSalesChannel = themeConfig[store]?.salesChannel || 'cmw_uk_b2c'
  const lang: TISO639 = i18n.locale as TISO639

  const productFeatures: TProductFeatures[] = ['favourite', 'isnew', 'isInPromotion', 'foreveryday', 'togift', 'unusualvariety', 'rarewine', 'artisanal', 'organic', 'topsale']

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

    fromElastic: (arr = []) => {
      let products: IProductMapped[] = []

      products = arr.map((p: Record<string, any>) => {
        const compareAtPrice: IMoneyV2 = {
          amount: p._source.price[sale_channel],
          currencyCode: store === 'CMW_UK' ? 'GBP' : 'EUR',
        }
        const id = p._source.feId
        const shopify_product_id = `gid://shopify/Product/${p._source.productId[store]}`
        const shopify_product_variant_id = `gid://shopify/ProductVariant/${p._source.variantId[store]}`
        const priceLists = p._source.pricelists

        return ({
          availableFeatures: $productMapping.availableFeatures(p._source),
          availableForSale: p._source.quantity[store] > 0,
          awards: p._source.awards.map((award: Record<string, any>) => ({
            ...award,
            title: award[`name_${lang}`],
            quote: {
              it: award.quote_it,
              en: award.quote_en,
              fr: award.quote_fr,
              de: award.quote_de,
            },
          })) || [],
          compareAtPrice,
          descriptionHtml: p._source.description,
          priceLists,
          quantityAvailable: p._source.quantity[store],
          details: p._source,
          id,
          handle: p._source.handle_t[lang],
          source_id: `P${id}`,
          shopify_product_id,
          shopify_product_variant_id,
          tags: [`P${id}`],
          title: p._source.name_t[lang],
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
            name: p._source.name_t[lang],
            brand: p._source.brandname,
            category: p._source.macros[0] ? p._source.macros[0].name_it : '',
            subcategory: p._source.categoryname,
            winelist: p._source.winelists[0] ? p._source.winelists[0].name_it : 'missing',
            vintage: p._source.vintageyear,
            favourite: p._source.favourite ? 'yes' : 'no',
            artisanal: p._source.artisanal ? 'yes' : 'no',
            rarewine: p._source.rarewine ? 'yes' : 'no',
            price: priceLists[sale_channel][getCustomerType.value], // We have no access to pinia here
            compare_at_price: Number(compareAtPrice.amount),
            stock_status: p._source.quantity[store] > 0 ? 'in_stock' : 'out_of_stock',
            quantity: 1,
          },
          sku: p._source.sku,
          tbd: {
            description: p._source.description,
            grapes: p._source.grapes,
            regionName: p._source.regionname,
            size: p._source.sizes[`identifier_${lang}`].split('|')[1],
          },
        })
      })

      return products
    },

    fromShopify: (arr = []) => {
      let products = []

      products = arr.map((p: Record<string, any>) => {
        const details = JSON.parse(p.details.value)
        const compareAtPrice = p.variants.nodes[0].compareAtPriceV2
        const id = details.feId
        const shopify_product_id = p.id
        const shopify_product_variant_id = p.variants.nodes[0].id
        const priceLists = details.priceLists

        return ({
          availableFeatures: $productMapping.availableFeatures(details),
          availableForSale: p.availableForSale,
          awards: details.awards,
          compareAtPrice,
          descriptionHtml: p.descriptionHtml,
          priceLists,
          quantityAvailable: p.totalInventory,
          details,
          id,
          handle: details.handle[lang],
          source_id: `P${id}`,
          shopify_product_id,
          shopify_product_variant_id,
          tags: p.tags,
          title: details.name[lang],
          url: `/${details.handle[lang]}-${details.key}.htm`,
          vendor: p.vendor,
          image: {
            thumbnail: {
              url: p.featuredImage?.url ? `${p.featuredImage?.url}&width=20&height=36` : 'https://cdn.shopify.com/s/files/1/0578/7497/2719/files/no-product-image-400x400_6.png?v=1680253923&width=20&height=36',
              width: 20,
              height: 36,
              altText: details.name[lang],
            },
            source: {
              url: p.featuredImage?.url ? `${p.featuredImage?.url}&width=300&height=540` : 'https://cdn.shopify.com/s/files/1/0578/7497/2719/files/no-product-image-400x400_6.png?v=1680253923&width=300&height=540',
              width: 300,
              height: 540,
              altText: details.name[lang],
            },
          },
          gtmProductData: {
            internal_id: shopify_product_id.substring(`${shopify_product_id}`.lastIndexOf('/') + 1),
            stock_id: `shopify_${getCountryFromStore(store)}_${shopify_product_id.substring(`${shopify_product_id}`.lastIndexOf('/') + 1)}_${shopify_product_variant_id.substring(`${shopify_product_variant_id}`.lastIndexOf('/') + 1)}`,
            id,
            name: p.title,
            brand: p.vendor,
            category: details.categoryName,
            subcategory: details.subCategoryName,
            winelist: details.wineListName,
            vintage: details.vintage,
            favourite: details.favourite ? 'yes' : 'no',
            artisanal: details.artisanal ? 'yes' : 'no',
            rarewine: details.rarewine ? 'yes' : 'no',
            price: priceLists[sale_channel][getCustomerType.value], // We have no access to pinia here
            compare_at_price: Number(compareAtPrice.amount),
            stock_status: p.totalInventory > 0 ? 'in_stock' : 'out_of_stock',
            quantity: 1,
          },
          sku: p.variants.nodes[0].sku,
          tbd: {
            description: details.shortDescription[lang],
            grapes: details.grapes[lang],
            regionName: details.regionName[lang],
            size: details.size[lang],
          },
        })
      })

      return products
    },

    giftCard(product): IGiftCardMapped {
      const getGiftCardVariants = () => product.variants.nodes.map((v: any) => ({
        id: v.id,
        title: v.title,
        description: v.description || null,
        price: { ...v.price },
        compareAtPrice: v.compareAtPriceV2,
      })) || []

      const details = JSON.parse(product.details.value)
      const breadcrumbs = JSON.parse(product.breadcrumbs.value)

      return {
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
        variants: getGiftCardVariants(),
        breadcrumbs: Object.keys(breadcrumbs).length ? $productMapping.breadcrumbs(breadcrumbs[lang]) : [],
        href: '', // TODO
        seo: {
          description: product.seo.description,
          title: product.seo.title,
        },
      }
    },
  }

  inject('productMapping', $productMapping)
}

export default productMapping
