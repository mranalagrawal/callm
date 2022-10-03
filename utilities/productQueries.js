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

const queryProductByIdAsTag = (handle) => `query {
        products(first: 10, query:"tag:${handle}") {
            edges {
                node {
                    id
                    title
                    description
                    descriptionHtml
                    handle
                    vendor
                    totalInventory
                    variants(first: 1) {
                        nodes {
                            compareAtPrice
                            price
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

export { queryByCollection, queryProductByIdAsTag };
