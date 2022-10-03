export const getUserOrdersQuery = (token) => `query {
    customer(customerAccessToken: "${token}") {
        id
        firstName
        lastName
        acceptsMarketing
        email
        phone
        orders(first: 100) {
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
                    shippingAddress {
                        city
                        country
                        address1
                        address2
                        zip
                        name
                        phone
                        formattedArea
                    }
                    successfulFulfillments(first: 10) {
                        trackingCompany
                        trackingInfo {
                            number
                        }
                    }
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
                        }
                    }
                }
            }
        }
    }
}`;

export async function getUserOrders(domain, access_token, customerAccessToken) {
  const ordersQuery = getUserOrdersQuery(customerAccessToken);
  const GRAPHQL_BODY = {
    async: true,
    crossDomain: true,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": access_token,
      "Content-Type": "application/graphql",
    },
    body: ordersQuery,
  };

  const customer = await fetch(domain, GRAPHQL_BODY);
  const customerJSON = await customer.json();
  const orders = await customerJSON.data.customer.orders;

  return orders;
}
