<template>
  <div class="">
    <b-form @submit="onSubmit" class="px-4 pt-3 py-2 w-75 mx-auto">
      <h3 class="mt-3">Ho già un account</h3>

      <b-form-group class="my-4">
        <b-form-input
          id="login-mail"
          class="custom-input"
          v-model="form.email"
          type="email"
          required
          placeholder="Email"
        ></b-form-input>
      </b-form-group>

      <b-form-group class="my-4 position-relative">
        <b-icon
          :icon="passwordIsVisible ? 'eye-slash' : 'eye'"
          font-scale="2"
          class="position-absolute text-light-red"
          style="right: 10px; top: 4px; cursor: pointer"
          @click="passwordIsVisible = !passwordIsVisible"
        ></b-icon>
        <b-form-input
          class="custom-input"
          id="login-password"
          v-model="form.password"
          required
          :type="passwordIsVisible ? 'text' : 'password'"
          placeholder="Password"
        ></b-form-input>
      </b-form-group>

      <b-form-checkbox
        id="login-remember"
        v-model="form.remember"
        name="marketing"
        value="accepted"
        unchecked-value="not_accepted"
        class="mt-3"
      >
        Ricordami
      </b-form-checkbox>

      <button
        type="submit"
        class="w-100 btn bg-light-red text-white mt-5 btn-lg"
      >
        Accedi
      </button>
    </b-form>
  </div>
</template>

<script>
import userLogin from "../utilities/userLogin";
export default {
  data() {
    return {
      passwordIsVisible: false,
      form: {
        remember: "",
        email: "",
        password: "",
      },
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;
      userLogin(this.form.email, this.form.password, domain, access_token);
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
