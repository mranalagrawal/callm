const getUserQuery = (token) => `query {
    customer(customerAccessToken: "${token}") {
        id
        firstName
        lastName
        acceptsMarketing
        email
        phone
        orders(first: 10) {
            edges {
                node {
                    id
                    name
                    totalPrice
                    fulfillmentStatus
                    orderNumber
                    processedAt
                    statusUrl
                    financialStatus
                    lineItems(first: 10) {
                        edges {
                            node {
                                quantity
                                title
                                
                                originalTotalPrice {
                                    amount
                                }
                                discountedTotalPrice {
                                    amount
                                }
                                variant {
                                    id
                                    product {
                                        id
                                        title
                                        description
                                        compareAtPriceRange {
                                            maxVariantPrice {
                                                amount
                                            }
                                            minVariantPrice {
                                                amount
                                            }
                                        }
                                        images(first: 1) {
                                            nodes {
                                                url
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}`;

export default getUserQuery;
