export const getUserQuery = (token) => `query {
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

export const customerRecoverMutation = (email) => {
  return JSON.stringify({
    query: `mutation customerRecover($email: String!) {
            customerRecover(email: $email) {
                customerUserErrors { message }
            }
        }`,
    variables: {
      email: email,
    },
  });
};

export async function customerRecover(domain, access_token, email) {
  const recoverMutation = customerRecoverMutation(email);

  console.log(JSON.parse(recoverMutation));
  const GRAPHQL_BODY = {
    async: true,
    crossDomain: true,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": access_token,
      "Content-Type": "application/json",
    },
    body: recoverMutation,
  };

  const response = await fetch(domain, GRAPHQL_BODY);

  const responseJSON = await response.json();

  console.log(responseJSON, "customer Recover");
  return;
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
      id: id,
      input: {
        password: password,
        resetToken: resetToken,
      },
    },
  });
};

export async function customerReset(
  domain,
  access_token,
  id,
  password,
  resetToken
) {
  const resetMutation = customerResetMutation(id, password, resetToken);

  console.log(JSON.parse(resetMutation));
  const GRAPHQL_BODY = {
    async: true,
    crossDomain: true,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": access_token,
      "Content-Type": "application/json",
    },
    body: resetMutation,
  };

  const response = await fetch(domain, GRAPHQL_BODY);

  const responseJSON = await response.json();

  console.log(responseJSON, "response from customerReset");
  return responseJSON;
}
