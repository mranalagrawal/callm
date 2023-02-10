export const createCartMutation = (customerAccessToken) => {
  return JSON.stringify({
    query: `mutation cartCreate {
      cartCreate {
        cart {
          id
          updatedAt
          totalQuantity
          checkoutUrl
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
            totalDutyAmount {
              amount
              currencyCode
            }
          }
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    price
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
                attributes {
                  key
                  value
                }
              }
            }
            
          }
          
        }
        userErrors {
          field
          message
        }
      }
    }`,
    variables: {
      input: {
        buyerIdentity: {
          countryCode: 'UK',
          customerAccessToken,
        },
        discountCodes: [''],
        lines: [],
        note: '',
      },
    },
  })
}

export const addItemMutation = (cartId, lines) => {
  return JSON.stringify({
    query: `mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        ${generalQuery}
      }
    }`,
    variables: {
      cartId,
      lines,
    },
  })
}

export const createCart = async (domain, access_token, user) => {
  const cartQuery = createCartMutation(user.token)

  const GRAPHQL_BODY_USER = {
    async: true,
    crossDomain: true,
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token': access_token,
      'Content-Type': 'application/json',
    },
    body: cartQuery,
  }

  const cart = await fetch(domain, GRAPHQL_BODY_USER)
    .then(res => res.json())
    .then((res) => {
      const cartId = res.data.cartCreate.cart.id
      if (process.client) {
        /* console.log(res.data.cartCreate.cart, "cartId from create"); */
      }
      return res.data.cartCreate.cart
    })
  return cart
}

export const addProductToCart = async (domain, access_token, cartId, lines) => {
  const cartMutation = addItemMutation(cartId, lines)

  const GRAPHQL_BODY_CART = {
    async: true,
    crossDomain: true,
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token': access_token,
      'Content-Type': 'application/json',
    },
    body: cartMutation,
  }

  const res = await fetch(domain, GRAPHQL_BODY_CART).then(res => res.json())

  return res.data.cartLinesAdd.cart
}

export const removeItemMutation = (cartId, lineId) => {
  return JSON.stringify({
    query: `mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
          cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
            cart {
              id
              updatedAt
              totalQuantity
              checkoutUrl
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
                subtotalAmount {
                  amount
                  currencyCode
                }
                totalTaxAmount {
                  amount
                  currencyCode
                }
                totalDutyAmount {
                  amount
                  currencyCode
                }
              }
              lines(first: 10) {
                edges {
                  node {
                    id
                    quantity
                    merchandise {
                      ... on ProductVariant {
                        id
                        price
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
                    attributes {
                      key
                      value
                    }
                  }
                }
                
              }
              
            }
            userErrors {
              field
              message
            }
          }
        }`,
    variables: {
      cartId,
      lineIds: lineId,
    },
  })
}

export const removeProductFromCart = async (
  domain,
  access_token,
  cartId,
  lineId,
) => {
  const cartMutation = removeItemMutation(cartId, lineId)

  const GRAPHQL_BODY_CART = {
    async: true,
    crossDomain: true,
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token': access_token,
      'Content-Type': 'application/json',
    },
    body: cartMutation,
  }

  const res = await fetch(domain, GRAPHQL_BODY_CART).then(res => res.json())

  const cart = res.data.cartLinesRemove.cart

  return cart
}

export const updateItemMutation = (cartId, lineId, quantity) => {
  return JSON.stringify({
    query: `mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
            cartLinesUpdate(cartId: $cartId, lines: $lines) {
              cart {
                id
                updatedAt
                totalQuantity
                checkoutUrl
                cost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                  totalTaxAmount {
                    amount
                    currencyCode
                  }
                  totalDutyAmount {
                    amount
                    currencyCode
                  }
                }
                lines(first: 10) {
                  edges {
                    node {
                      id
                      quantity
                      merchandise {
                        ... on ProductVariant {
                          id
                          price
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
                      attributes {
                        key
                        value
                      }
                    }
                  }
                  
                }
                
              }
              userErrors {
                field
                message
              }
            }
          }`,
    variables: {
      cartId,
      lines: [
        {
          id: lineId,
          quantity,
        },
      ],
    },
  })
}

export const updateItemInCart = async (
  domain,
  access_token,
  lineId,
  cartId,
  quantity,
) => {
  const cartMutation = updateItemMutation(cartId, lineId, quantity)

  const GRAPHQL_BODY_CART = {
    async: true,
    crossDomain: true,
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token': access_token,
      'Content-Type': 'application/json',
    },
    body: cartMutation,
  }

  const res = await fetch(domain, GRAPHQL_BODY_CART).then(res => res.json())

  return res.data.cartLinesUpdate.cart
}

const generalQuery = `
        cart {
          id
          updatedAt
          totalQuantity
          checkoutUrl
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
            totalDutyAmount {
              amount
              currencyCode
            }
          }
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    price
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
                attributes {
                  key
                  value
                }
              }
            }
            
          }
          
        }
        userErrors {
          field
          message
        }
        `
