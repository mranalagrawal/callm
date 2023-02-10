export const getUserQuery = token => `query {
    customer(customerAccessToken: "${token}") {
        id
        firstName
        lastName
        acceptsMarketing
        email
        phone
        wishlist: metafield(namespace: "custom", key: "wishlist") {
          value
        }
        addresses(first: 30) {
          edges {
              node {
                  firstName
                  lastName
                  address1
                  address2
                  phone
                  country
                  city
                  province
                  zip
                  id
              }
        }
      }
        defaultAddress {
          firstName
          lastName
          address1
          address2
          country
          city
          province
          zip
          id
        }
        
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
}`

export const customerRecoverMutation = (email) => {
  return JSON.stringify({
    query: `mutation customerRecover($email: String!) {
            customerRecover(email: $email) {
                customerUserErrors { message }
            }
        }`,
    variables: {
      email,
    },
  })
}

export async function customerRecover(domain, access_token, email) {
  const recoverMutation = customerRecoverMutation(email)

  const GRAPHQL_BODY = {
    async: true,
    crossDomain: true,
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token': access_token,
      'Content-Type': 'application/json',
    },
    body: recoverMutation,
  }

  const response = await fetch(domain, GRAPHQL_BODY)

  const responseJSON = await response.json()
}

export const customerResetMutation = (id, password, resetToken) => {
  return JSON.stringify({
    query: `mutation customerReset($id: ID!, $input: CustomerResetInput!) {
            customerReset(id: $id, input: $input) {
                customerUserErrors {
                    code
                    field
                    message
                }
                customer {
                    id
                }
            }
        }`,
    variables: {
      id,
      input: {
        password,
        resetToken,
      },
    },
  })
}

export async function customerReset(
  domain,
  access_token,
  id,
  password,
  resetToken,
) {
  const resetMutation = customerResetMutation(id, password, resetToken)

  const GRAPHQL_BODY = {
    async: true,
    crossDomain: true,
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token': access_token,
      'Content-Type': 'application/json',
    },
    body: resetMutation,
  }

  const response = await fetch(domain, GRAPHQL_BODY)

  const responseJSON = await response.json()

  return responseJSON
}
