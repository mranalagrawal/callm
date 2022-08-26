export const createCartMutation = (customerAccessToken) => {
  return JSON.stringify({
    query: `mutation cartCreate {
      cartCreate {
        cart {
          id
          updatedAt
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
          countryCode: "UK",
          customerAccessToken: customerAccessToken,
        },
        discountCodes: [""],
        lines: [],
        note: "",
      },
    },
  });
};

export const getCart = (id) => {
  return `
  query {
    cart(
      id: "${id}"
      ) {
        id
        createdAt
        updatedAt
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
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
    }`;
};

export const addItemMutation = (cartId, productId, quantity) => {
  return JSON.stringify({
    query: `mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            updatedAt
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
      cartId: cartId,
      lines: [
        {
          quantity: quantity,
          merchandiseId: productId,
        },
      ],
    },
  });
};

export const createCart = async (domain, access_token) => {
  const user = JSON.parse(localStorage.getItem("call-me-wine-user"));

  const cartQuery = createCartMutation(user.token);

  const GRAPHQL_BODY_USER = {
    async: true,
    crossDomain: true,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": access_token,
      "Content-Type": "application/json",
    },
    body: cartQuery,
  };

  const cart = await fetch(domain, GRAPHQL_BODY_USER)
    .then((res) => res.json())
    .then((res) => {
      const cartId = res.data.cartCreate.cart.id;
      if (process.client) {
        /* console.log(res.data.cartCreate.cart, "cartId from create"); */
      }
      return res.data.cartCreate.cart;
    });
  return cart;
};

export const addProductToCart = async (
  domain,
  access_token,
  product,
  cartId,
  quantity
) => {
  /* const cartId = localStorage.getItem("call-me-wine-cart"); */

  const cartMutation = addItemMutation(
    cartId,
    product.variants.nodes[0].id,
    quantity
  );

  const GRAPHQL_BODY_CART = {
    async: true,
    crossDomain: true,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": access_token,
      "Content-Type": "application/json",
    },
    body: cartMutation,
  };

  const res = await fetch(domain, GRAPHQL_BODY_CART).then((res) => res.json());

  console.log(res.data.cartLinesAdd.cart, "XXX");
  return res.data.cartLinesAdd.cart;
};

export const removeItemMutation = (cartId, lineId) => {
  return JSON.stringify({
    query: `mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            id
            updatedAt
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
      cartId: cartId,
      lineIds: [lineId],
    },
  });
};

export const removeProductFromCart = async (
  domain,
  access_token,
  cartId,
  lineId
) => {
  const cartMutation = removeItemMutation(cartId, lineId);

  const GRAPHQL_BODY_CART = {
    async: true,
    crossDomain: true,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": access_token,
      "Content-Type": "application/json",
    },
    body: cartMutation,
  };

  const res = await fetch(domain, GRAPHQL_BODY_CART).then((res) => res.json());
  const cart = res.data.cartLinesRemove.cart;
  console.log(cart, "RIMOZIONE");
  return cart;
};

export const updateItemMutation = (cartId, lineId, quantity) => {
  return JSON.stringify({
    query: `mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            id
            updatedAt
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
      cartId: cartId,
      lines: [
        {
          id: lineId,
          quantity: quantity,
        },
      ],
    },
  });
};

export const updateItemInCart = async (
  domain,
  access_token,
  lineId,
  cartId,
  quantity
) => {
  /* const cartId = localStorage.getItem("call-me-wine-cart"); */

  const cartMutation = updateItemMutation(cartId, lineId, quantity);

  const GRAPHQL_BODY_CART = {
    async: true,
    crossDomain: true,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": access_token,
      "Content-Type": "application/json",
    },
    body: cartMutation,
  };

  const res = await fetch(domain, GRAPHQL_BODY_CART).then((res) => res.json());

  console.log(res.data.cartLinesUpdate.cart);
  return res.data.cartLinesUpdate.cart;
};
