<template>
  <div class="container-fluid vh-100">
    <div class="row mt-5">
      <div class="col-12 text-center">
        <p class="h2">Reimposta password</p>
        <p class="mt-5 mb-0">
          Inserisci l'email con la quale ti sei registrato.
        </p>
        <p>
          Riceverai nella tua casella di posta un messaggio con le istruzioni
          per modificare la password.
        </p>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-12 col-md-4 text-center">
        <form class="mt-5" @submit="submit">
          <b-form-group id="input-group-1">
            <b-form-input
              id="input-1"
              class="custom-input"
              v-model="email"
              type="email"
              required
              placeholder="Email"
            ></b-form-input>
          </b-form-group>

          <button class="btn btn-light-secondary w-100 mt-5">INVIA</button>
        </form>
      </div>
    </div>

    <!-- <b-modal ref="modal" hide-header centered title="">
      <p class="text-center my-5 lead">Cancellare carrello?</p>
      <template #modal-footer class="border-0">
        <div class="w-100 d-flex justify-content-between">
          <button class="btn btn-outline-dark-secondary" @click="hideModal">
            Annulla
          </button>
          <button class="btn btn-dark-secondary" @click="removeCart">
            Si, cancella
          </button>
        </div>
      </template>
    </b-modal> -->
  </div>
</template>

<script>
import { customerRecover } from "../utilities/getUser";
export default {
  components: {},
  data() {
    return {
      email: "",
    };
  },
  methods: {
    async submit(e) {
      e.preventDefault();
      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;

      const res = await customerRecover(domain, access_token, this.email);

      alert("Ti abbiamo inviato una email!");
    },
  },
};
</script>
