<template>
  <div class="">
    <b-form @submit="onSubmit" class="px-4 pt-3 py-2">
      <b-form-group id="input-group-1">
        <label class="custom-label" for="input-1">Email</label>
        <b-form-input
          id="input-1"
          class="custom-input"
          v-model="form.email"
          type="email"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2">
        <label class="custom-label" for="input-2">Password</label>

        <b-form-input
          class="custom-input"
          id="input-2"
          v-model="form.password"
          type="password"
          required
        ></b-form-input>
      </b-form-group>

      <!-- <b-form-checkbox
        id="remember"
        v-model="form.remember"
        name="remember"
        value="accepted"
        unchecked-value="not_accepted"
        class="mt-3 mb-5"
      >
        Ricordami
      </b-form-checkbox> -->
      <button type="submit" class="w-100 btn bg-light-red text-white">
        Accedi
      </button>

      <div class="text-center my-3">
        <a href="" class="text-light-red">Hai dimenticato la password</a>
      </div>
    </b-form>
  </div>
</template>

<script>
import userLogin from "../utilities/userLogin";

export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
        remember: false,
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
:deep(form) {
  width: 340px;
}

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
  border-color: #11312b;
  border-width: 2px;
}
</style>
