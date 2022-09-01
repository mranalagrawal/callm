const setUser = (firstName, lastName, email, password, acceptsMarketing) => {
  return JSON.stringify({
    query: `mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          firstName
          lastName,
          email,
          acceptsMarketing
          orders(first: 10) {
            edges {
                node {
                    id
                    name
                    totalPrice
                    fulfillmentStatus
                }
            }
        }
        }
        customerUserErrors { field, message, code }
      }
    }`,
    variables: {
      input: {
        firstName,
        lastName,
        email,
        password,
        acceptsMarketing,
      },
    },
  });
};

export default setUser;
