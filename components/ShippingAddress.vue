<template>
  <div class="container-fluid">
    <div class="row">
      <!-- <div v-for="(item, i) in debug" :key="i" class="mb-5">
        {{ item }}
      </div> -->

      <!-- {{ provinces }} -->
      <div class="col-12" v-if="addresses && addresses.length < 1">
        <form @submit="onSubmit" class="px-4 pt-3 py-2 row">
          <div class="col-12 col-md-6 mb-3">
            <b-form-input
              id="name"
              class="custom-input"
              v-model="form.firstName"
              type="text"
              required
              placeholder="Nome"
            ></b-form-input>
          </div>
          <div class="col-12 col-md-6 mb-3">
            <b-form-input
              id="name"
              class="custom-input"
              v-model="form.lastName"
              type="text"
              required
              placeholder="Cognome"
            ></b-form-input>
          </div>

          <div class="col-12 col-md-6 mb-3">
            <b-form-select
              class="custom-input"
              v-model="form.country"
              :options="countries"
            ></b-form-select>
          </div>
          <div class="col-12 col-md-6 mb-3">
            <b-form-input
              id="name"
              class="custom-input"
              v-model="form.city"
              type="text"
              required
              placeholder="Città"
            ></b-form-input>
          </div>
          <div class="col-12 col-md-6 mb-3">
            <b-form-input
              id="name"
              class="custom-input"
              v-model="form.address1"
              type="text"
              required
              placeholder="Indirizzo e numero civico"
            ></b-form-input>
          </div>
          <div class="col-12 col-md-3 mb-3">
            <b-form-input
              id="name"
              class="custom-input"
              v-model="form.zip"
              type="text"
              required
              placeholder="CAP"
            ></b-form-input>
          </div>
          <div class="col-12 col-md-3 mb-3">
            <b-form-select
              class="custom-input"
              v-model="form.province"
              :options="provinces"
            ></b-form-select>

            <!-- <b-form-input
              id="name"
              class="custom-input"
              v-model="form.province"
              type="text"
              required
              placeholder="Provincia"
            ></b-form-input> -->
          </div>
          <div class="col-12 col-md-6 mb-3">
            <b-form-input
              id="name"
              class="custom-input"
              v-model="form.phone"
              type="tel"
              required
              placeholder="+39 123 456 7890"
            ></b-form-input>
          </div>
          <div class="col-12 col-md-6 mb-3">
            <p class="mb-0 small">
              Il numero di telefono sarà utilizzato per contattarti durante la
              spedizione
            </p>
          </div>
          <div class="col-12 mb-3">
            <b-form-input
              id="name"
              class="custom-input"
              v-model="form.message"
              type="text"
              placeholder="Eventuali note"
            ></b-form-input>
          </div>

          <div class="col-12 mt-5 text-right">
            <button type="submit" class="btn btn-light-red text-uppercase">
              Aggiungi indirizzo
            </button>
          </div>
        </form>
      </div>
      <div
        v-for="(address, i) in addresses"
        :key="'address_' + i"
        class="col-12 col-md-6 mb-3"
      >
        <div class="card p-3" style="height: 250px">
          <!-- {{ address }} -->
          <p class="font-weight-bold mb-5">
            {{ address.node.firstName }} {{ address.node.lastName }}

            <span
              v-if="address.node.id.split('?model_name')[0] === defaultAddress"
            >
              <span class="badge badge-pill badge-light-green mx-1 p-2"
                >Predefinito</span
              >
            </span>
          </p>
          {{ address.node.id.split("?model_name")[0] }}
          <p class="mb-0">
            {{ address.node.address1 }} {{ address.node.address2 }}
          </p>
          <p class="mb-0">
            {{ address.node.zip }} {{ address.node.city }}
            {{ address.node.country }} {{ address.node.province }}
          </p>
          <p class="mb-0">{{ address.node.phone }}</p>
          <div class="row">
            <div class="col-12">
              <div class="text-right">
                <b-dropdown
                  id="dropdown-buttons"
                  class="m-2"
                  no-caret
                  right
                  variant="null"
                >
                  <template #button-content>
                    <div
                      style="
                        width: 30px;
                        height: 30px;
                        background: var(--light-red);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border-radius: 50%;
                        color: white;
                      "
                    >
                      <i class="fas fa-ellipsis-v-alt"></i>
                    </div>
                  </template>
                  <b-dropdown-item-button
                    v-if="
                      !(
                        address.node.id.split('?model_name')[0] ===
                        defaultAddress
                      )
                    "
                    class="p-0"
                    @click="setAsDefaultAddress(address.node.id)"
                    ><i class="fal fa-bookmark mr-2"></i>Set as
                    default</b-dropdown-item-button
                  >
                  <b-dropdown-item-button
                    class="p-0"
                    @click="editAddress(address.node)"
                    ><i class="fal fa-edit mr-2"></i
                    >Edit</b-dropdown-item-button
                  >
                  <b-dropdown-item-button
                    class="p-0"
                    @click="deleteAddress(address.node.id)"
                    ><i class="fal fa-trash mr-2"></i
                    >Delete</b-dropdown-item-button
                  >
                </b-dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="col-12 col-md-6 mb-3"
        v-if="addresses && addresses.length > 0"
      >
        <div
          class="card justify-content-center align-items-center p-3 pointer"
          style="border: 2px dotted red; height: 200px"
          @click="showNewAddressModal"
        >
          <p class="mb-0 text-light-red">
            <i class="fas fa-plus mr-2"></i>Aggiungi nuovo indirizzo
          </p>
        </div>
      </div>
    </div>

    <b-modal
      ref="newAddressModal"
      size="lg"
      hide-header
      hide-footer
      centered
      title=""
    >
      <p class="text-center mt-5 mb-2 lead text-light-green">Nuovo indirizzo</p>

      <form @submit="onSubmit" class="px-4 pt-3 py-2 row">
        <div class="col-12 col-md-6 mb-3">
          <b-form-input
            id="name"
            class="custom-input"
            v-model="form.firstName"
            type="text"
            required
            placeholder="Nome"
          ></b-form-input>
        </div>
        <div class="col-12 col-md-6 mb-3">
          <b-form-input
            id="name"
            class="custom-input"
            v-model="form.lastName"
            type="text"
            required
            placeholder="Cognome"
          ></b-form-input>
        </div>

        <div class="col-12 col-md-6 mb-3">
          <b-form-select
            class="custom-input"
            v-model="form.country"
            :options="countries"
          ></b-form-select>
        </div>
        <div class="col-12 col-md-6 mb-3">
          <b-form-input
            id="name"
            class="custom-input"
            v-model="form.city"
            type="text"
            required
            placeholder="Città"
          ></b-form-input>
        </div>
        <div class="col-12 col-md-6 mb-3">
          <b-form-input
            id="name"
            class="custom-input"
            v-model="form.address1"
            type="text"
            required
            placeholder="Indirizzo e numero civico"
          ></b-form-input>
        </div>
        <div class="col-12 col-md-3 mb-3">
          <b-form-input
            id="name"
            class="custom-input"
            v-model="form.zip"
            type="text"
            required
            placeholder="CAP"
          ></b-form-input>
        </div>
        <div class="col-12 col-md-3 mb-3">
          <b-form-select
            class="custom-input"
            v-model="form.province"
            :options="provinces"
          ></b-form-select>

          <!-- <b-form-input
              id="name"
              class="custom-input"
              v-model="form.province"
              type="text"
              required
              placeholder="Provincia"
            ></b-form-input> -->
        </div>
        <div class="col-12 col-md-6 mb-3">
          <b-form-input
            id="name"
            class="custom-input"
            v-model="form.phone"
            type="tel"
            required
            placeholder="+39 123 456 7890"
          ></b-form-input>
        </div>
        <div class="col-12 col-md-6 mb-3">
          <p class="mb-0 small">
            Il numero di telefono sarà utilizzato per contattarti durante la
            spedizione
          </p>
        </div>
        <div class="col-12 mb-3">
          <b-form-input
            id="name"
            class="custom-input"
            v-model="form.message"
            type="text"
            placeholder="Eventuali note"
          ></b-form-input>
        </div>

        <div class="col-12 mt-5 text-right">
          <button type="submit" class="btn btn-light-red text-uppercase">
            Aggiungi indirizzo
          </button>
        </div>
      </form>
    </b-modal>

    <b-modal
      ref="editAddressModal"
      size="lg"
      hide-header
      hide-footer
      centered
      title=""
    >
      <p class="text-center mt-5 mb-2 lead text-light-green">
        Modifica indirizzo
      </p>

      <form @submit="onEditSubmit" class="px-4 pt-3 py-2 row">
        <div class="col-12 col-md-6 mb-3">
          <b-form-input
            id="name"
            class="custom-input"
            v-model="editForm.firstName"
            type="text"
            required
            placeholder="Nome"
          ></b-form-input>
        </div>
        <div class="col-12 col-md-6 mb-3">
          <b-form-input
            id="name"
            class="custom-input"
            v-model="editForm.lastName"
            type="text"
            required
            placeholder="Cognome"
          ></b-form-input>
        </div>

        <div class="col-12 col-md-6 mb-3">
          <b-form-select
            class="custom-input"
            v-model="editForm.country"
            :options="countries"
          ></b-form-select>
        </div>
        <div class="col-12 col-md-6 mb-3">
          <b-form-input
            id="name"
            class="custom-input"
            v-model="editForm.city"
            type="text"
            required
            placeholder="Città"
          ></b-form-input>
        </div>
        <div class="col-12 col-md-6 mb-3">
          <b-form-input
            id="name"
            class="custom-input"
            v-model="editForm.address1"
            type="text"
            required
            placeholder="Indirizzo e numero civico"
          ></b-form-input>
        </div>
        <div class="col-12 col-md-3 mb-3">
          <b-form-input
            id="name"
            class="custom-input"
            v-model="editForm.zip"
            type="text"
            required
            placeholder="CAP"
          ></b-form-input>
        </div>
        <div class="col-12 col-md-3 mb-3">
          <b-form-select
            class="custom-input"
            v-model="editForm.province"
            :options="editProvinces"
          ></b-form-select>

          <!-- <b-form-input
              id="name"
              class="custom-input"
              v-model="editForm.province"
              type="text"
              required
              placeholder="Provincia"
            ></b-form-input> -->
        </div>
        <div class="col-12 col-md-6 mb-3">
          <b-form-input
            id="name"
            class="custom-input"
            v-model="editForm.phone"
            type="tel"
            required
            placeholder="+39 123 456 7890"
          ></b-form-input>
        </div>
        <div class="col-12 col-md-6 mb-3">
          <p class="mb-0 small">
            Il numero di telefono sarà utilizzato per contattarti durante la
            spedizione
          </p>
        </div>
        <div class="col-12 mb-3">
          <b-form-input
            id="name"
            class="custom-input"
            v-model="editForm.message"
            type="text"
            placeholder="Eventuali note"
          ></b-form-input>
        </div>

        <div class="col-12 mt-5 text-right">
          <button type="submit" class="btn btn-light-red text-uppercase">
            Aggiungi indirizzo
          </button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { getUserQuery } from "../utilities/getUser";
export default {
  data() {
    return {
      addresses: null,
      countries: null,
      allCountries: null,
      form: {
        firstName: "",
        lastName: "",
        country: "",
        city: "",
        address1: "",
        province: "",
        phone: "",
        zip: "",
        message: "",
      },
      editForm: {
        firstName: "",
        lastName: "",
        country: "",
        city: "",
        address1: "",
        province: "",
        phone: "",
        zip: "",
        message: "",
        id: "",
      },
    };
  },
  computed: {
    defaultAddress() {
      return this.$store.state.user.user.customer.defaultAddress.id.split(
        "?model_name"
      )[0];
    },
    debug() {
      return this.$store.state.user.user.customer.addresses.edges;
    },
    provinces() {
      if (!this.form.country) return [];

      return this.allCountries
        .find((el) => el.name == this.form.country)
        .provinces.map((el) => el.name);
    },
    editProvinces() {
      if (!this.editForm.country) return [];

      return this.allCountries
        .find((el) => el.name == this.editForm.country)
        .provinces.map((el) => el.name);
    },
  },
  async mounted() {
    this.addresses = this.$store.state.user.user.customer.addresses.edges;

    const countries = await fetch(
      "https://callmewine-api.dojo.sh/api/countries"
    ).then((r) => r.json());

    const mappedCountries = countries.countries.map((el) => el.name);
    this.countries = mappedCountries;
    this.allCountries = countries.countries;
  },
  methods: {
    async getUserAddresses() {
      const customerAccessToken = this.$store.state.user.user.token;

      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;

      // prendo tutto lo user
      const userAddressQuery = getUserQuery(customerAccessToken);

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
    },
    async onSubmit(e) {
      e.preventDefault();

      const customerAccessToken = this.$store.state.user.user.token;

      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;

      const setAddress = (customerAccessToken) => {
        return JSON.stringify({
          query: `
          mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
              customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
              customerUserErrors {
                code
                field
                message
              }
              customerAddress {
                firstName
                lastName
                country
                city
                address1
                province
                phone
                zip
                id
              }
            }
          }`,
          variables: {
            customerAccessToken: customerAccessToken,
            address: {
              lastName: this.form.lastName,
              firstName: this.form.firstName,
              address1: this.form.address1,
              province: this.form.province,
              country: this.form.country,
              zip: this.form.zip,
              city: this.form.city,
              phone: this.form.phone,
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

      const newAddress = {
        node: responseJSON.data.customerAddressCreate.customerAddress,
      };

      this.$store.commit("user/addAddress", newAddress);
      this.hideNewAddressModal();
      /* this.$store.state.user.user.customer.addresses.edges.push(
        responseJSON.data.customerAddressCreate.customerAddress
      ) */
    },
    showNewAddressModal() {
      this.$refs["newAddressModal"].show();
    },
    hideNewAddressModal() {
      this.$refs["newAddressModal"].hide();
    },
    showEditAddressModal() {
      this.$refs["editAddressModal"].show();
    },
    hideEditAddressModal() {
      this.$refs["editAddressModal"].hide();
    },
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
    },
    async setAsDefaultAddress(e) {
      const customerAccessToken = this.$store.state.user.user.token;

      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;

      const setAddress = (customerAccessToken, addressId) => {
        return JSON.stringify({
          query: `
          mutation customerDefaultAddressUpdate($addressId: ID!, $customerAccessToken: String!) {
            customerDefaultAddressUpdate(addressId: $addressId, customerAccessToken: $customerAccessToken) {
              customer {
                id
                defaultAddress {
                firstName
                lastName
                address1
                address2
                country
                city
                province
                zip
                id
                }
              }
              
            }
          }`,
          variables: {
            addressId: addressId,
            customerAccessToken: customerAccessToken,
          },
        });
      };

      const setAddressMutation = setAddress(customerAccessToken, e);
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

      const newDefaultAddress =
        responseJSON.data.customerDefaultAddressUpdate.customer.defaultAddress;

      this.$store.commit("user/updateDefaultAddress", newDefaultAddress);

      this.flashMessage.show({
        status: "",
        message: "Indirizzo impostato come predefinito!",
        time: 1000,
        blockClass: "free-shipping-notification",
      });
    },
    async deleteAddress(e) {
      const customerAccessToken = this.$store.state.user.user.token;

      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;

      const deleteAddress = (customerAccessToken, addressId) => {
        return JSON.stringify({
          query: `
          mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
            customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
              deletedCustomerAddressId
            }
          }`,
          variables: {
            id: addressId,
            customerAccessToken: customerAccessToken,
          },
        });
      };

      const deleteAddressMutation = deleteAddress(customerAccessToken, e);

      const GRAPHQL_BODY = {
        async: true,
        crossDomain: true,
        method: "POST",
        headers: {
          "X-Shopify-Storefront-Access-Token": access_token,
          "Content-Type": "application/json",
        },
        body: deleteAddressMutation,
      };

      const response = await fetch(domain, GRAPHQL_BODY);
      const responseJSON = await response.json();

      this.$store.commit("user/removeFromAddresses", e.split("?model_name")[0]);

      this.flashMessage.show({
        status: "",
        message: "Indirizzo rimosso!",
        time: 1000,
        blockClass: "free-shipping-notification",
      });
    },
    editAddress(e) {
      this.editForm.firstName = e.firstName;
      this.editForm.lastName = e.lastName;
      /* this.editForm.country = e.country; */
      /* this.editForm.city = e.city; */
      /* this.editForm.address1 = e.address1; */
      /* this.editForm.province = this.editProvinces; */
      /* this.editForm.zip = e.zip; */
      this.editForm.phone = e.phone;
      this.editForm.message = e.message;
      this.editForm.id = e.id;
      this.showEditAddressModal();
    },
    async onEditSubmit(e) {
      e.preventDefault();

      const customerAccessToken = this.$store.state.user.user.token;

      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;

      const setAddress = (customerAccessToken) => {
        return JSON.stringify({
          query: `
          mutation customerAddressUpdate($address: MailingAddressInput!, $customerAccessToken: String!, $id: ID!) {
              customerAddressUpdate(address: $address, customerAccessToken: $customerAccessToken, id: $id) {
              customerUserErrors {
                code
                field
                message
              }
              customerAddress {
                firstName
                lastName
                country
                city
                address1
                province
                phone
                zip
                id
              }
            }
          }`,
          variables: {
            customerAccessToken: customerAccessToken,
            address: {
              lastName: this.editForm.lastName,
              firstName: this.editForm.firstName,
              address1: this.editForm.address1,
              province: this.editForm.province,
              country: this.editForm.country,
              zip: this.editForm.zip,
              city: this.editForm.city,
              phone: this.editForm.phone,
            },
            id: this.editForm.id,
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

      const newAddress = {
        node: responseJSON.data.customerAddressUpdate.customerAddress,
      };

      this.$store.commit("user/editAddress", newAddress);
      this.hideEditAddressModal();

      this.flashMessage.show({
        status: "",
        message: "Indirizzo aggiornato!",
        time: 1000,
        blockClass: "free-shipping-notification",
      });
      /* this.$store.state.user.user.customer.addresses.edges.push(
        responseJSON.data.customerAddressCreate.customerAddress
      ) */
    },
  },
};
</script>

<style scoped></style>
