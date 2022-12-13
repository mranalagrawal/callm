<template>
  <div class="">
    <form @submit="onSubmit" class="px-4 pt-3 py-2 w-75 mx-auto">
      <InputField
        v-model="form.firstname"
        name="register-user-firstname" :label="$t('firstName').toString()"
        :placeholder="$t('firstName').toString()" rules="required" theme="gray"/>

      <InputField
        v-model="form.lastname"
        name="register-user-lastname" :label="$t('lastName').toString()"
        :placeholder="$t('lastName').toString()" rules="required" theme="gray"/>

      <InputField
        v-model="form.email"
        type="email"
        name="register-user-email" :label="$t('email').toString()"
        :placeholder="$t('email').toString()" rules="required|email" theme="gray"/>

      <InputField v-model="form.password"
                  :type="!passwordIsVisible ? 'password' : 'text'"
                  name="register-user-password" label="Password"
                  placeholder="User Password" rules="required|min:8"
                  :icon="passwordIsVisible ? eyeHideIcon : eyeShowIcon"
                  :click-icon="() => passwordIsVisible = !passwordIsVisible"
                  theme="gray"
      />

      <InputField v-model="form.age"
                  type="date"
                  name="register-user-age" :label="$t('birthday').toString()"
                  placeholder="dd/mm/yyyy" rules="required"
                  theme="gray"
      />

      <p
        v-if="new Date(now) - new Date(form.age) < 568036800000"
        class="text-danger font-weight-bold small mt-2"
      >
        Devi essere maggiorenne per poterti registrare al sito.
      </p>

      <b-form-checkbox
        id="privacy"
        v-model="form.privacy"
        name="privacy"
        class="mt-3"
      >
        {{ $t("privacyPolicy") }}
      </b-form-checkbox>

      <b-form-checkbox
        id="marketing"
        v-model="form.marketing"
        name="marketing"
        class="mt-3"
      >
        {{ $t("acceptMarketing") }}
      </b-form-checkbox>

      <button
        type="submit"
        class="w-100 btn bg-light-secondary text-white mt-5 btn-lg"
        :class="
          new Date(now) - new Date(form.age) > 568036800000 && form.privacy
            ? ''
            : 'disabled'
        "
      >
        {{ $t("navbar.user.register") }}
      </button>
    </form>
  </div>
</template>

<script>
import userRegister from "../utilities/userRegister";
import userLogin from "../utilities/userLogin";
import eyeShowIcon from '~/assets/svg/eye-show.svg'
import eyeHideIcon from '~/assets/svg/eye-hide.svg'
import calendarIcon from '~/assets/svg/calendar.svg'

export default {
  data() {
    return {
      eyeShowIcon,
      eyeHideIcon,
      calendarIcon,
      passwordIsVisible: false,
      form: {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        privacy: false,
        marketing: false,
        age: '',
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
