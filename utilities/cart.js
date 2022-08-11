const createCart = (customerAccessToken) => {
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
          email: "s.fiore@dojo.sh",
          phone: "",
        },
        discountCodes: [""],
        lines: [],
        note: "",
      },
    },
  });
};

export default createCart;
