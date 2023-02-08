const queryByCollection = (
  collection,
  language,
) => `query @inContext(language: ${language}){

        collectionByHandle(handle: "${collection}") {
            title
            description
            products(first: 30) {
                nodes {
                    id
                    title
                    description
                    handle
                    tags
                    totalInventory
                    createdAt
                    availableForSale
                    variants(first: 10) {
                        nodes {
                            id
                            compareAtPriceV2 {
                                amount
                                currencyCode
                            }
                            price
                        }
                    }
                    images(first: 10) {
                        nodes {
                            url
                        }
                    }
                    metafield1: metafield(namespace: "custom", key: "details") {
                        value
                    }
                }
            }
        }

    }`

const queryProductByIdAsTag = tag => `query {
        products(first: 12, query:"tag:${tag}") {
            edges {
                node {
                    id
                    title
                    description
                    descriptionHtml
                    handle
                    vendor
                    totalInventory
                    availableForSale
                    variants(first: 1) {
                        nodes {
                            compareAtPriceV2 {
                                amount
                                currencyCode
                            }
                            priceV2 {
                                amount
                                currencyCode
                            }
                            price
                            id
                        }
                        edges {
                            node {
                                id
                            }
                        }
                    }
                    tags
                    images(first: 10) {
                        nodes {
                            id
                            url
                        }
                    }
                    metafield1: metafield(namespace: "custom", key: "details") {
                        value
                    }
                }
            }
        }
    }`

const productRecommendations = id => `query {
        productRecommendations(productId: "${id}") {
            id
            title
            description
            handle
            tags
            createdAt
            availableForSale
            variants(first: 10) {
                nodes {
                    id
                    compareAtPriceV2 {
                        amount
                        currencyCode
                    }
                    price
                }
            }
            images(first: 10) {
                nodes {
                    url
                }
            }
            metafield1: metafield(namespace: "custom", key: "details") {
                value
            }
        }
    }`

const queryProductsByVendor = vendor => `query {
        products(first: 10, query:"vendor:${vendor}") {
            nodes {
                id
                title
                description
                handle
                tags
                createdAt
                availableForSale
                variants(first: 10) {
                    nodes {
                        id
                        compareAtPriceV2 {
                            amount
                            currencyCode
                        }
                        price
                    }
                }
                images(first: 10) {
                    nodes {
                        url
                    }
                }
                metafield1: metafield(namespace: "custom", key: "details") {
                    value
                }
            }
        }
    }`

const queryAllCollections = language => `query @inContext(language: ${language}){
                collections(first: 20) {
                  edges {
                    node {
                      id
                      title
                      handle
                      description
                      image {
                          url
                      }
                    }
                  }
              }
        }`

export {
  queryByCollection,
  queryProductByIdAsTag,
  productRecommendations,
  queryProductsByVendor,
  queryAllCollections,
}
