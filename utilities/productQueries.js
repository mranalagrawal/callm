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
                metafield1: metafield(namespace: "custom", key: "jsontest") {
                    value
                }
            }
        }
    }
    
}`;

const queryProductByHandle = (handle) => `query {
    productByHandle(handle: "${handle}") {
        id
        title
        description
        descriptionHtml
        handle
        vendor
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
}`;

export { queryByCollection, queryProductByHandle };
