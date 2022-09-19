<template>
  <div>
    <div v-for="(address, i) in addresses" :key="'address_' + i">
      <p>{{ address.node.address1 }} | {{ address.node.country }}</p>
    </div>
    <button class="btn btn-dark-red" @click="createAddress">Crea</button>
  </div>
</template>

<script>
import { getUserOrders } from "../utilities/orders";

export default {
  data() {
    return {
      addresses: null,
    };
  },
  async mounted() {
    const customerAccessToken = this.$store.state.user.user.token;

    const domain = this.$config.DOMAIN;
    const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;

    const getUserAddress = (token) => `query {
        customer(customerAccessToken: "${token}") {
            id
            firstName
            lastName
            acceptsMarketing
            email
            phone
            addresses(first: 10) {
            edges {
                node {
                    lastName
                    firstName
                    address1
                    province
                    country
                    zip
                    city
                }
            }
        }
        }
    }`;

    const userAddressQuery = getUserAddress(customerAccessToken);

    const GRAPHQL_BODY = {
      async: true,
      crossDomain: true,
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": access_token,
        "Content-Type": "application/graphql",
      },
      body: userAddressQuery,
    };

    const response = await fetch(domain, GRAPHQL_BODY);
    const responseJSON = await response.json();
    const userAddress = responseJSON.data.customer;
    this.addresses = userAddress.addresses.edges;
    console.log(userAddress, "response");
  },
  methods: {
    async createAddress() {
      const customerAccessToken = this.$store.state.user.user.token;

      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;

      const setAddress = (customerAccessToken) => {
        return JSON.stringify({
          query: `mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
                    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
                    customerUserErrors {
                    code
                    field
                    message
                    }
                    customerAddress {
                    id
                    }
                }
        }`,
          variables: {
            customerAccessToken: customerAccessToken,
            address: {
              lastName: "Doe",
              firstName: "John",
              address1: Math.random() + " Test Street",
              province: "QC",
              country: "Canada",
              zip: "H3K0X2",
              city: "Montreal",
            },
          },
        });
      };

      const setAddressMutation = setAddress(customerAccessToken);

      const GRAPHQL_BODY = {
        async: true,
        crossDomain: true,
        method: "POST",
        headers: {
          "X-Shopify-Storefront-Access-Token": access_token,
          "Content-Type": "application/json",
        },
        body: setAddressMutation,
      };

      const response = await fetch(domain, GRAPHQL_BODY);
      const responseJSON = await response.json();

      window.location.reload();
      console.log(responseJSON, "response");
    },
  },
};
</script>
