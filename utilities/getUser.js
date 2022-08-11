const getUserQuery = (token) => `query {
    customer(customerAccessToken: "${token}") {
        id
        firstName
        lastName
        acceptsMarketing
        email
        phone
        test: metafield(namespace: "custom", key: "birthday") {
            value
            type
        }
    }
}`;

export default getUserQuery;
