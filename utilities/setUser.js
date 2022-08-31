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

/* const setUser = (firstName, lastName, email, password, acceptsMarketing) => {
  return JSON.stringify({
    query: `mutation createCustomerMetafields($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer {
          firstName,
          lastName,
          email,
          password,
          acceptsMarketing,
          metafields(first: 3) {
            edges {
              node {
                id
                namespace
                key
                value
              }
            }
          }
        }
        userErrors {
          message
          field
        }
      }
    }`,
    variables: {
      input: {
        firstName,
        lastName,
        email,
        acceptsMarketing,
        metafields: [
          {
            namespace: "custom",
            key: "birthday",
            type: "date",
            value: "2020-10-10",
          },
        ],
      },
    },
  });
};

export default setUser; */
