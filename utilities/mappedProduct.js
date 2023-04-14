export const productFeatures = ['favourite', 'isnew', 'isInPromotion', 'foreveryday', 'togift', 'unusualvariety', 'rarewine', 'artisanal', 'organic', 'topsale']
export const getMappedProducts = (arr = [], lang = 'en', isElastic = false, store = '', sale_channel = '') => {
  let products = []

  if (isElastic) {
    products = arr.map((p) => {
      // return ({ ...p })
      // const details = JSON.parse(p.details.value)

      return ({
        availableForSale: p._source.quantity[store] > 0,
        awards: p._source.awards,
        compareAtPrice: {
          amount: p._source.price[sale_channel],
          currencyCode: store === 'CMW_UK' ? 'GBP' : 'EUR',
        },
        // price: {
        //   // amount: details.priceLists[this.$config.SALECHANNEL][this.getCustomerType],
        //   // currencyCode: 0,
        // },
        priceLists: p._source.priceLists,
        // quantityAvailable: p.variants.nodes[0].quantityAvailable,
        details: p._source,
        // shopify_product_id: p.id,
        // tags: p.tags,
        title: p._source.name_t[lang],
        url: `/${p._source.handle_t[lang]}-${p._source.sourceId}.htm`,
        // url: `/${p._source.handle}-${p._source.sourceId}.htm`,
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
      })
    })
  } else {
    products = arr.map((p) => {
      const details = JSON.parse(p.details.value)

      return ({
        availableForSale: p.availableForSale,
        awards: details.awards,
        compareAtPrice: p.variants.nodes[0].compareAtPriceV2,
        price: {
          // amount: details.priceLists[this.$config.SALECHANNEL][this.getCustomerType],
          // currencyCode: 0,
        },
        priceLists: details.priceLists,
        quantityAvailable: p.variants.nodes[0].quantityAvailable,
        details,
        shopify_product_id: p.id,
        shopify_product_variant_id: p.variants.nodes[0].id,
        tags: p.tags,
        title: details.name[lang],
        url: `/${details.handle[lang]}-${details.key}.htm`,
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
      })
    })
  }

  return products
}
