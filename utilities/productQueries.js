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
  productRecommendations,
  queryProductsByVendor,
  queryAllCollections,
}
