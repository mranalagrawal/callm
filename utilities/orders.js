export const getUserOrdersQuery = (token) => `query {
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
