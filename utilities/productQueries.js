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

const queryByCollection = (collection) => `query {
    
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
                variants(first: 10) {
                    nodes {
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
        handle
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
    }
}`;

export { queryByCollection, queryProductByHandle };
