// TODO: We need to change the language here dynamically language: ${i18n.something}, for now we are just passing it as a parameter
// TODO: Implement filter by period orders(last: 100, query:"processedAt:>2022-08-22") {
export const getUserOrdersQuery = (token, locale) => `query @inContext(language: ${locale}) {
    customer(customerAccessToken: "${token}") {
        id
        firstName
        lastName
        acceptsMarketing
        email
        phone
        orders(first: 10, reverse:true,query:"processed_at:>2022-12-01") {
            edges {
                node {
                    id
                    name
                    currencyCode
                    currentSubtotalPrice { amount, currencyCode }
                    currentTotalDuties { amount, currencyCode }
                    currentTotalPrice { amount, currencyCode }
                    currentTotalTax { amount, currencyCode }
                    subtotalPrice
                    totalShippingPrice
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
                    successfulFulfillments(first: 1) {
                        trackingCompany
                        trackingInfo {
                            number,
                            url
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
                                    price
                                    unitPrice { amount, currencyCode }
                                    compareAtPrice
                                    image { altText, height, url, width }
                                    sku
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
                        }
                    }
                }
            }
        }
    }
}`;

export async function getUserOrders(domain, access_token, customerAccessToken, locale) {
  const ordersQuery = getUserOrdersQuery(customerAccessToken, locale);
  const GRAPHQL_BODY = {
    async: true,
    crossDomain: true,
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token': access_token,
      'Content-Type': 'application/graphql',
    },
    body: ordersQuery,
  };

  const customer = await fetch(domain, GRAPHQL_BODY);
  const customerJSON = await customer.json();
  const orders = await customerJSON.data.customer.orders;

  return orders;
}
