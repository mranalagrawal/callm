<template>
  <div class="">
    <form
      @submit="onSubmit"
      class="px-4 pt-3 py-2 mx-auto"
      :style="{ width: width }"
    >
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

      <b-form-group id="input-group-2" class="position-relative">
        <label class="custom-label" for="input-2">Password</label>
        <i
          v-if="passwordIsVisible"
          class="fal fa-eye-slash position-absolute text-light-red pointer"
          style="right: 10px; bottom: 10px"
          @click="passwordIsVisible = !passwordIsVisible"
        ></i>
        <i
          v-else
          class="fal fa-eye position-absolute text-light-red pointer"
          style="right: 10px; bottom: 10px"
          @click="passwordIsVisible = !passwordIsVisible"
        ></i>
        <b-form-input
          class="custom-input"
          id="input-2"
          v-model="form.password"
          :type="passwordIsVisible ? 'text' : 'password'"
          required
        ></b-form-input>
      </b-form-group>

      <p v-if="message" class="small text-danger">{{ message }}</p>
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
        <nuxt-link to="/recover" class="btn text-light-red">
          Hai dimenticato la password ?
        </nuxt-link>
      </div>
    </form>
  </div>
</template>

<script>
import userLogin from "../utilities/userLogin";

export default {
  props: ["width"],
  data() {
    return {
      passwordIsVisible: false,
      form: {
        email: "",
        password: "",
        remember: false,
      },
      message: "",
    };
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault();
      const domain = this.$config.DOMAIN;
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN;
      const user = await userLogin(
        this.form.email,
        this.form.password,
        domain,
        access_token
      );

      if (!user) {
        this.message = "Ops! Sembra che username o password siano errate!";
        return;
      }
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
  bottom: -11px;
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
