const createTokenQuery = (email, password) => {
  return JSON.stringify({
    query: `mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
            customerAccessTokenCreate(input: $input) {
                customerAccessToken {
                    accessToken
                }
                customerUserErrors {
                    field
                    message
                }
            }
        }`,
    variables: {
      input: {
        email: email,
        password: password,
      },
    },
  });
};

export default createTokenQuery;
