<template>
  <div class="">
    <form @submit="onSubmit" class="px-4 pt-3 py-2 w-75 mx-auto">
      <b-form-group class="my-4">
        <b-form-input
          id="name"
          class="custom-input"
          v-model="form.firstname"
          type="text"
          required
          placeholder="Nome"
        ></b-form-input>
      </b-form-group>

      <b-form-group class="my-4">
        <b-form-input
          id="name"
          class="custom-input"
          v-model="form.lastname"
          type="text"
          required
          placeholder="Cognome"
        ></b-form-input>
      </b-form-group>

      <b-form-group class="my-4">
        <b-form-input
          id="input-1"
          class="custom-input"
          v-model="form.email"
          type="email"
          required
          placeholder="Email"
        ></b-form-input>
      </b-form-group>

      <b-form-group class="my-4 position-relative">
        <b-form-input
          class="custom-input"
          id="input-2"
          v-model="form.password"
          required
          :type="passwordIsVisible ? 'text' : 'password'"
          placeholder="Password"
        ></b-form-input>
      </b-form-group>

      <b-form-group class="my-4 position-relative">
        <p class="mb-0 text-muted">Inserisci la tua data di nascita</p>
        <b-form-input
          class="custom-input"
          id="input-2"
          v-model="form.age"
          required
          placeholder="Age"
          type="date"
        ></b-form-input>
        <p
          v-if="new Date(now) - new Date(form.age) < 568036800000"
          class="text-danger font-weight-bold small mt-2"
        >
          Devi essere maggiorenne per poterti registrare al sito.
        </p>
      </b-form-group>

      <b-form-checkbox
        id="privacy"
        v-model="form.privacy"
        name="privacy"
        value="accepted"
        unchecked-value="not_accepted"
        class="mt-3"
      >
        Dichiaro di aver letto la
        <a href="" class="text-light-red">Privacy Policy</a> di Callmewine *.
      </b-form-checkbox>

      <b-form-checkbox
        id="marketing"
        v-model="form.marketing"
        name="marketing"
        class="mt-3"
      >
        Acconsento a ricevere newslettter e comunicazioni promozionali da parte
        di Callmewine, come previsto dalla Privacy Policy.
      </b-form-checkbox>

      <button
        type="submit"
        class="w-100 btn bg-light-red text-white mt-5 btn-lg"
        :class="
          new Date(now) - new Date(form.age) > 568036800000 &&
          Object.values(form).every((e) => Boolean(e) == true)
            ? ''
            : 'disabled'
        "
      >
        Registrati
      </button>
    </form>
  </div>
</template>

<script>
import userRegister from "../utilities/userRegister";
import userLogin from "../utilities/userLogin";

export default {
  data() {
    return {
      passwordIsVisible: false,
      form: {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        privacy: false,
        marketing: false,
        age: null,
      },
      now: new Date(),
    };
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault();
      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;
      const token = await userRegister(
        this.form.firstname,
        this.form.lastname,
        this.form.email,
        this.form.password,
        this.form.marketing,
        this.form.age,
        domain,
        access_token
      );
      const user = await userLogin(
        this.form.email,
        this.form.password,
        domain,
        access_token
      );
      this.$store.commit("user/setUser", user);
      this.$router.push("/profile");
    },
  },
};
</script>

<style scoped>
/* :deep(form) {
  width: 340px;
} */

.custom-label {
  position: relative;
  bottom: -20px;
  left: 12px;
  padding: 0px 4px;
  background: white;
  color: #11312b;
}
.custom-input {
  border-radius: 10px;
  border-color: #999;
  border-width: 1px;
}
</style>
