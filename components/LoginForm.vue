<template>
  <ValidationObserver ref="formEl" v-slot="{ handleSubmit }" slim>
    <form @submit.prevent="handleSubmit(onSubmit)" class="px-4 pt-3 pb-2 mx-auto">

      <InputField v-model="form.email"
                  type="email"
                  name="user-email" label="Email"
                  placeholder="User email" rules="required|email"/>

      <InputField v-model="form.password"
                  :type="!passwordIsVisible ? 'password' : 'text'"
                  name="user-password" label="Password"
                  placeholder="User Password" rules="required|min:4"
                  :icon="passwordIsVisible ? eyeHideIcon : eyeShowIcon"
                  :click-icon="() => passwordIsVisible = !passwordIsVisible"
      />

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
      <p v-if="message" class="cmw-text-sm cmw-text-error mt-3">{{ message }}</p>

      <Button class="sm:cmw-max-w-330px cmw-mt-8" type="submit" :disabled="isSubmitting" :label="$t('navbar.user.signIn').toString()"/>

      <NuxtLink to="/recover" class="cmw-block cmw-w-max cmw-my-3 cmw-text-primary-400 hover:(cmw-text-primary-400 cmw-no-underline)">
        {{ $t("navbar.user.forgotPassword") }}
      </NuxtLink>
    </form>
  </ValidationObserver>
</template>

<script>
import userLogin from "../utilities/userLogin";
import eyeShowIcon from '~/assets/svg/eye-show.svg'
import eyeHideIcon from '~/assets/svg/eye-hide.svg'

export default {
  props: ["width"],
  data() {
    return {
      eyeShowIcon,
      eyeHideIcon,
      passwordIsVisible: false,
      form: {
        email: "",
        password: "",
        test: "",
        remember: false,
      },
      message: "",
      isSubmitting: false,
    };
  },
  methods: {
    async onSubmit() {
      this.isSubmitting = true;
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
        this.isSubmitting = false;
        return;
      }
      this.$store.commit("user/setUser", user);
      await this.$router.push("/profile");
    },
  },
};
</script>
