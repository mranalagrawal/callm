<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 mt-3">
        <h4>Dati di accesso</h4>
      </div>
      <div class="col-12 col-md-6 mb-3">
        <div class="card p-3">
          <p class="font-weight-bold text-light-green">Email</p>
          <p>{{ currentMail }}</p>
          <p class="text-right mb-0 pointer" @click="showEditMailModal">
            <i class="fal fa-edit text-light-red"></i>
          </p>
        </div>
      </div>
      <div class="col-12 col-md-6 mb-3">
        <div class="card p-3">
          <p class="font-weight-bold text-light-green">Password</p>
          <p>*********</p>
          <p class="text-right mb-0 pointer" @click="showEditPasswordModal">
            <i class="fal fa-edit text-light-red"></i>
          </p>
        </div>
      </div>
      <div class="col-12 mt-3">
        <h4>Dati personali</h4>
      </div>
      <div class="col-12 mb-3">
        <div class="card p-3">
          <div class="row">
            <div class="col-12 col-md-4">
              <p class="font-weight-bold text-light-green">Nome</p>
              <p>{{ currentFirstName }}</p>
            </div>
            <div class="col-12 col-md-4">
              <p class="font-weight-bold text-light-green">Cognome</p>
              <p>{{ currentLastName }}</p>
            </div>
            <div class="col-12 col-md-4">
              <p class="font-weight-bold text-light-green">Telefono</p>
              <p>{{ currentPhone }}</p>
            </div>
            <div class="col-12">
              <p class="text-right mb-0 pointer" @click="showEditPersonalModal">
                <i class="fal fa-edit text-light-red"></i>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-modal ref="editMailModal" size="lg" hide-header hide-footer centered>
      <p class="text-center mt-5 mb-2 lead text-light-green">
        Imposta un nuovo indirizzo e-mail
      </p>

      <form
        @submit="editMail"
        class="px-4 pt-3 py-2 row justify-content-center"
      >
        <div class="col-12 col-md-6 mb-3">
          <label class="custom-label">Email</label>
          <b-form-input
            class="custom-input"
            v-model="newMail"
            type="email"
            required
            :placeholder="currentMail"
          ></b-form-input>
          <button
            type="submit"
            class="btn btn-light-red text-uppercase w-100 mt-5"
          >
            Salva
          </button>
        </div>
      </form>
    </b-modal>

    <b-modal ref="editPasswordModal" size="lg" hide-header hide-footer centered>
      <p class="text-center mt-5 mb-2 lead text-light-green">
        Imposta una nuova password
      </p>

      <form
        @submit="editPassword"
        class="px-4 pt-3 py-2 row justify-content-center"
      >
        <div class="col-12 col-md-6 mb-3">
          <label class="custom-label">Nuova password</label>
          <b-form-input
            class="custom-input"
            v-model="newPassword"
            type="password"
            required
            placeholder="******"
          ></b-form-input>

          <label class="custom-label mt-4">Conferma password</label>
          <b-form-input
            class="custom-input"
            v-model="newPasswordConfirm"
            type="password"
            required
            placeholder="******"
          ></b-form-input>
          <button
            type="submit"
            class="btn btn-light-red text-uppercase w-100 mt-5"
            :class="passwordMatch ? '' : 'disabled'"
          >
            Salva
          </button>
        </div>
      </form>
    </b-modal>

    <b-modal ref="editPersonalModal" size="lg" hide-header hide-footer centered>
      <p class="text-center mt-5 mb-2 lead text-light-green">
        Imposta nuovi dati personale
      </p>

      <form
        @submit="editPersonal"
        class="px-4 pt-3 py-2 row justify-content-center"
      >
        <div class="col-12 col-md-6 mb-3">
          <label class="custom-label">Nome</label>
          <b-form-input
            class="custom-input mb-3"
            v-model="newFirstName"
            type="text"
            required
            :placeholder="currentFirstName"
          ></b-form-input>

          <label class="custom-label">Cognome</label>
          <b-form-input
            class="custom-input mb-3"
            v-model="newLastName"
            type="text"
            required
            :placeholder="currentLastName"
          ></b-form-input>

          <label class="custom-label">Telefono</label>
          <b-form-input
            class="custom-input mb-3"
            v-model="newPhone"
            type="tel"
            required
            :placeholder="currentPhone"
          ></b-form-input>

          <button
            type="submit"
            class="btn btn-light-red text-uppercase w-100 mt-5"
            :class="passwordMatch ? '' : 'disabled'"
          >
            Salva
          </button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newMail: null,
      newPassword: "",
      newPasswordConfirm: "",
      newFirstName: "",
      newLastName: "",
      newPhone: "",
      /* currentMail: this.$store.state.user.user.customer.email, */
    };
  },
  computed: {
    currentMail() {
      return this.$store.state.user.user.customer.email;
    },
    currentFirstName() {
      return this.$store.state.user.user.customer.firstName;
    },
    currentLastName() {
      return this.$store.state.user.user.customer.lastName;
    },
    currentPhone() {
      return this.$store.state.user.user.customer.phone;
    },
    passwordMatch() {
      return this.newPassword === this.newPasswordConfirm;
    },
  },
  methods: {
    showEditMailModal() {
      this.$refs["editMailModal"].show();
    },
    hideEditMailModal() {
      this.$refs["editMailModal"].hide();
    },
    showEditPasswordModal() {
      this.$refs["editPasswordModal"].show();
    },
    hideEditPasswordModal() {
      this.$refs["editPasswordModal"].hide();
    },
    showEditPersonalModal() {
      this.$refs["editPersonalModal"].show();
    },
    hideEditPersonalModal() {
      this.$refs["editPersonalModal"].hide();
    },
    async editMail(e) {
      e.preventDefault();
      const customerAccessToken = this.$store.state.user.user.token;

      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;

      const setNewMail = (customerAccessToken) => {
        return JSON.stringify({
          query: `
          mutation customerUpdate($customer: CustomerUpdateInput!, $customerAccessToken: String!) {
            customerUpdate(customer: $customer, customerAccessToken: $customerAccessToken) {
                    customer {
                    id
                    firstName
                    lastName
                    acceptsMarketing
                    email
                    phone
                    }
                }
            }`,
          variables: {
            customer: {
              email: this.newMail,
            },
            customerAccessToken: customerAccessToken,
          },
        });
      };

      const setNewMailMutation = setNewMail(customerAccessToken);
      const GRAPHQL_BODY = {
        async: true,
        crossDomain: true,
        method: "POST",
        headers: {
          "X-Shopify-Storefront-Access-Token": access_token,
          "Content-Type": "application/json",
        },
        body: setNewMailMutation,
      };

      const response = await fetch(domain, GRAPHQL_BODY);
      const responseJSON = await response.json();

      console.log(responseJSON, "RESPONSE MAIL");

      const updatedEmail = responseJSON.data.customerUpdate.customer.email;

      this.$store.commit("user/updateGenericField", {
        field: "email",
        value: updatedEmail,
      });

      this.hideEditMailModal();
    },
    async editPassword(e) {
      e.preventDefault();
      console.log(e);
      const customerAccessToken = this.$store.state.user.user.token;

      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;

      const setNewPassword = (customerAccessToken) => {
        return JSON.stringify({
          query: `
          mutation customerUpdate($customer: CustomerUpdateInput!, $customerAccessToken: String!) {
            customerUpdate(customer: $customer, customerAccessToken: $customerAccessToken) {
                    customer {
                    id
                    firstName
                    lastName
                    acceptsMarketing
                    email
                    phone
                    }
                    customerAccessToken {
                        accessToken
                    }
                }
            }`,
          variables: {
            customer: {
              password: this.newPassword,
            },
            customerAccessToken: customerAccessToken,
          },
        });
      };

      const setNewPasswordMutation = setNewPassword(customerAccessToken);
      const GRAPHQL_BODY = {
        async: true,
        crossDomain: true,
        method: "POST",
        headers: {
          "X-Shopify-Storefront-Access-Token": access_token,
          "Content-Type": "application/json",
        },
        body: setNewPasswordMutation,
      };

      const response = await fetch(domain, GRAPHQL_BODY);
      const responseJSON = await response.json();

      console.log(responseJSON, "RESPONSE PASSWORD");
      console.log(newAccessToken);
      const newAccessToken =
        responseJSON.data.customerUpdate.customerAccessToken.accessToken;

      this.$store.commit("user/updateAccessToken", newAccessToken);

      this.hideEditPasswordModal();
    },
    async editPersonal(e) {
      e.preventDefault();
      const customerAccessToken = this.$store.state.user.user.token;

      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;

      const setNewPersonalData = (customerAccessToken) => {
        return JSON.stringify({
          query: `
          mutation customerUpdate($customer: CustomerUpdateInput!, $customerAccessToken: String!) {
            customerUpdate(customer: $customer, customerAccessToken: $customerAccessToken) {
                    customer {
                    id
                    firstName
                    lastName
                    acceptsMarketing
                    email
                    phone
                    }
                    customerUserErrors { field, message, code }
                }
            }`,
          variables: {
            customer: {
              firstName: this.newFirstName,
              lastName: this.newLastName,
              phone: this.newPhone,
            },
            customerAccessToken: customerAccessToken,
          },
        });
      };

      const setNewPersonalDataMutation =
        setNewPersonalData(customerAccessToken);

      const GRAPHQL_BODY = {
        async: true,
        crossDomain: true,
        method: "POST",
        headers: {
          "X-Shopify-Storefront-Access-Token": access_token,
          "Content-Type": "application/json",
        },
        body: setNewPersonalDataMutation,
      };

      const response = await fetch(domain, GRAPHQL_BODY);
      const responseJSON = await response.json();

      console.log(responseJSON, "RESPONSE PERSONAL");

      const updatedFirstName =
        responseJSON.data.customerUpdate.customer.firstName;
      const updatedLastName =
        responseJSON.data.customerUpdate.customer.lastName;
      const updatedPhone = responseJSON.data.customerUpdate.customer.phone;

      this.$store.commit("user/updateGenericField", {
        field: "firstName",
        value: updatedFirstName,
      });
      this.$store.commit("user/updateGenericField", {
        field: "lastName",
        value: updatedLastName,
      });
      this.$store.commit("user/updateGenericField", {
        field: "phone",
        value: updatedPhone,
      });

      this.hideEditPersonalModal();
    },
  },
};
</script>
