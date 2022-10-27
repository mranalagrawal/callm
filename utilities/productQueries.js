const featuredQuery = `query {
    
    products(first: 10) {
        nodes {
            title
            id
            images(first: 1) {
                edges {
                    node {
                        id
                    }
                }
            }
        }
    }
    
}`;

const queryByCollection = (
  collection,
  language
) => `query @inContext(language: ${language}){
        
        collectionByHandle(handle: "${collection}") {
            title
            description
            products(first: 10) {
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
                            compareAtPrice
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
        
    }`;

const queryProductByIdAsTag = (tag) => `query {
        products(first: 10, query:"tag:${tag}") {
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
                            compareAtPrice
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
    }`;

const productRecommendations = (id) => `query {
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
                    compareAtPrice
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
    }`;

const queryProductsByVendor = (vendor) => `query {
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
                        compareAtPrice
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
    }`;

export {
  queryByCollection,
  queryProductByIdAsTag,
  productRecommendations,
  queryProductsByVendor,
};
