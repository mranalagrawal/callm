import { getCountryFromStore } from '@/utilities/currency'

export const productFeatures = ['favourite', 'isnew', 'isInPromotion', 'foreveryday', 'togift', 'unusualvariety', 'rarewine', 'artisanal', 'organic', 'topsale']
export const getMappedProducts = (arr = [], lang = 'en', isElastic = false, store = '', sale_channel = '') => {
  let products = []

  if (isElastic) {
    products = arr.map((p) => {
      // return ({ ...p })
      // const details = JSON.parse(p.details.value)
      const compareAtPrice = {
        amount: p._source.price[sale_channel],
        currencyCode: store === 'CMW_UK' ? 'GBP' : 'EUR',
      }
      const shopify_product_id = `gid://shopify/Product/${p._source.productId[store]}`
      const shopify_product_variant_id = `gid://shopify/ProductVariant/${p._source.variantId[store]}`
      const priceLists = p._source.pricelists

      return ({
        availableForSale: p._source.quantity[store] > 0,
        awards: p._source.awards,
        compareAtPrice,
        // price: {
        //   // amount: details.priceLists[this.$config.SALECHANNEL][this.getCustomerType],
        //   // currencyCode: 0,
        // },
        priceLists,
        quantityAvailable: p._source.quantity[store],
        details: p._source,
        shopify_product_id,
        shopify_product_variant_id,
        // tags: p.tags,
        title: p._source.name_t[lang],
        url: `/${p._source.handle_t[lang]}-${p._source.sourceId}.htm`,
        // url: `/${p._source.handle}-${p._source.sourceId}.htm`,
        vendor: p._source.brandname,
        image: {
          thumbnail: {
            url: `${p._source.shopifyImageUrl?.CMW_UK}&width=20&height=36`,
            width: 20,
            height: 36,
            altText: p._source.name_t[lang],
          },
          source: {
            url: `${p._source.shopifyImageUrl?.CMW_UK}&width=300&height=540`,
            width: 300,
            height: 540,
            altText: p._source.name_t[lang],
          },
        },
        gtmProductData: {
          internal_id: shopify_product_id.substring(`${shopify_product_id}`.lastIndexOf('/') + 1),
          stock_id: `shopify_${getCountryFromStore(store)}_${shopify_product_id.substring(`${shopify_product_id}`.lastIndexOf('/') + 1)}_${shopify_product_variant_id.substring(`${shopify_product_variant_id}`.lastIndexOf('/') + 1)}`,
          id: p._source.feId,
          name: p._source.name_t[lang],
          brand: p._source.brandname,
          category: p._source.macros[0].name_it,
          subcategory: p._source.categoryname,
          winelist: p._source.winelists[0].name_it,
          vintage: p._source.vintageyear,
          favourite: p._source.favourite ? 'yes' : 'no',
          artisanal: p._source.artisanal ? 'yes' : 'no',
          rarewine: p._source.rarewine ? 'yes' : 'no',
          // price: finalPrice.value, We have no access to pinia here
          compare_at_price: Number(compareAtPrice.amount),
          stock_status: p._source.quantity[store] > 0 ? 'in_stock' : 'out_of_stock',
          quantity: 1,
        },
      })
    })
  } else {
    products = arr.map((p) => {
      const details = JSON.parse(p.details.value)
      const compareAtPrice = p.variants.nodes[0].compareAtPriceV2
      const shopify_product_id = p.id
      const shopify_product_variant_id = p.variants.nodes[0].id
      const priceLists = details.priceLists

      return ({
        availableForSale: p.availableForSale,
        awards: details.awards,
        compareAtPrice,
        price: {
          // amount: details.priceLists[this.$config.SALECHANNEL][this.getCustomerType],
          // currencyCode: 0,
        },
        priceLists,
        quantityAvailable: p.variants.nodes[0].quantityAvailable,
        details,
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
          id: details.feId,
          name: p.title,
          brand: p.vendor,
          category: details.categoryName,
          subcategory: details.subCategoryName,
          winelist: details.wineListName,
          vintage: details.vintage,
          favourite: details.favourite ? 'yes' : 'no',
          artisanal: details.artisanal ? 'yes' : 'no',
          rarewine: details.rarewine ? 'yes' : 'no',
          // price: priceLists[sale_channel][getCustomerType.value], We have no access to pinia here
          compare_at_price: Number(compareAtPrice.amount),
          stock_status: p.quantityAvailable > 0 ? 'in_stock' : 'out_of_stock',
          quantity: 1,
        },
      })
    })
  }

  return products
}
