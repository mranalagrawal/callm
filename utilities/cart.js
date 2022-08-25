export const createCart = (customerAccessToken) => {
  return JSON.stringify({
    query: `mutation cartCreate {
            cartCreate {
              cart {
                id
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

export const addItem = (cartId, productId) => {
  return JSON.stringify({
    query: `mutation cartLinesAdd($cartId: , $lines: ) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
        }
        userErrors {
          field
          message
        }
      }
    }`,
    variables: {
      input: {
        cartId: cartId,
        lines: {
          merchandiseId: productId,
          quantity: 1,
          attributes: [
            {
              key: "",
              value: "",
            },
          ],
        },
      },
    },
  });
};
