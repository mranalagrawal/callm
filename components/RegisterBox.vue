<template>
  <div class="">
    <ValidationObserver ref="formEl" v-slot="{errors}" slim>
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

        <div class="cmw-relative">
          <InputField v-model="form.password"
                      :type="!passwordIsVisible ? 'password' : 'text'"
                      name="new-password" label="Password"
                      placeholder="User Password"
                      rules="required|min:8|oneNumber|oneUpperCase|oneLowerCase|oneSpecialChar"
                      autocomplete="new-password"
                      :icon="passwordIsVisible ? eyeHideIcon : eyeShowIcon"
                      :click-icon="() => passwordIsVisible = !passwordIsVisible"
                      @focus="handleFocus"
                      @blur="handleBlur"
                      theme="gray"
          />
          <transition name="slideFade" mode="out-in">
            <div v-if="showPasswordToast" class="cmw-absolute cmw-w-full cmw-z-100 cmw-transform
           cmw-transition-transform-opacity cmw-translate-x-0 cmw-translate-y-full cmw-bottom-0 cmw-left-0">
              <div class="
            cmw-rounded-lg cmw-bg-white cmw-shadow-popover cmw-py-4 cmw-px-6 cmw-mt-8 cmw-relative
            before:(cmw-content-DEFAULT cmw-absolute cmw-w-0 cmw-h-0 cmw-top-[-0.5rem] cmw-left-[1.75rem])
            before:(cmw-border-l-[0.75rem] cmw-border-l-transparent)
            before:(cmw-border-r-[0.75rem] cmw-border-r-transparent)
            before:(cmw-border-b-[0.5rem] cmw-border-b-white)
">
                <p>{{ $t('validations.password.title') }}</p>
                <ul class="cmw-py-4">
                  <li class="cmw-flex cmw-items-center cmw-gap-2" :class="{'cmw-text-success': passwordValidation.min}">
                    <VueSvgIcon width="18" height="18" :data="require(`@/assets/svg/checkmark.svg`)"/>
                    <span v-text="$t('validations.password.min')"/>
                  </li>
                  <li class="cmw-flex cmw-items-center cmw-gap-2"
                      :class="{'cmw-text-success': passwordValidation.oneNumber}">
                    <VueSvgIcon width="18" height="18" :data="require(`@/assets/svg/checkmark.svg`)"/>
                    <span v-text="$t('validations.password.oneNumber')"/>
                  </li>
                  <li class="cmw-flex cmw-items-center cmw-gap-2"
                      :class="{'cmw-text-success': passwordValidation.oneUpperCase}">
                    <VueSvgIcon width="18" height="18" :data="require(`@/assets/svg/checkmark.svg`)"/>
                    <span v-text="$t('validations.password.oneUpperCase')"/>
                  </li>
                  <li class="cmw-flex cmw-items-center cmw-gap-2"
                      :class="{'cmw-text-success': passwordValidation.oneLowerCase}">
                    <VueSvgIcon width="18" height="18" :data="require(`@/assets/svg/checkmark.svg`)"/>
                    <span v-text="$t('validations.password.oneLowerCase')"/>
                  </li>
                  <li class="cmw-flex cmw-items-center cmw-gap-2"
                      :class="{'cmw-text-success': passwordValidation.oneSpecialChar}">
                    <VueSvgIcon width="18" height="18" :data="require(`@/assets/svg/checkmark.svg`)"/>
                    <span v-text="$t('validations.password.oneSpecialChar')"/>
                  </li>
                </ul>
                <p class="cmw-overline-2">{{ $t('validations.password.effectiveness') }}</p>
                <div class="cmw-w-full cmw-h-2 cmw-bg-gray-lightest cmw-rounded-pill cmw-overflow-hidden">
                  <div class="cmw-h-2 cmw-transition-progress-bar" :style="barProgressStyle"></div>
                </div>
              </div>
            </div>
          </transition>
        </div>

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
    </ValidationObserver>
  </div>
</template>

<script>
import {ref} from "@nuxtjs/composition-api";
import userRegister from "../utilities/userRegister";
import userLogin from "../utilities/userLogin";
import eyeShowIcon from '~/assets/svg/eye-show.svg'
import eyeHideIcon from '~/assets/svg/eye-hide.svg'
import calendarIcon from '~/assets/svg/calendar.svg'
import {regexRules} from "@/utilities/validators";

export default {
  setup() {
    const showPasswordToast = ref(false)

    const handleFocus = () => showPasswordToast.value = true
    const handleBlur = () => showPasswordToast.value = false

    return { showPasswordToast, handleFocus, handleBlur }
  },
  data() {
    return {
      eyeShowIcon,
      eyeHideIcon,
      calendarIcon,
      passwordIsVisible: false,
      barProgressStyle: 'none repeat scroll 0 0 red; width: 0',
      passwordValidation: {
        min: false,
        oneNumber: false,
        oneUpperCase: false,
        oneLowerCase: false,
        oneSpecialChar: false,
      },
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
      progressStyles: Object.freeze([
        'background: none repeat scroll 0 0 #e6362e; width: 0',
        'background: none repeat scroll 0 0 #e6362e; width: 25%',
        'background: none repeat scroll 0 0 #ffb800; width: 50%',
        'background: none repeat scroll 0 0 #93b7db; width: 75%',
        'background: none repeat scroll 0 0 #517aa3; width: 85%',
        'background: none repeat scroll 0 0 #299100; width: 100%',
      ])
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
  watch: {
    'form.password': function (val) {
      this.passwordValidation = {
        min: (val.length >= 8),
        oneNumber: new RegExp(regexRules('oneNumber')).test(val),
        oneUpperCase: new RegExp(regexRules('oneUpperCase')).test(val),
        oneLowerCase: new RegExp(regexRules('oneLowerCase')).test(val),
        oneSpecialChar: new RegExp(regexRules('oneSpecialChar')).test(val),
      }

      const nValidRules = Object.values(this.passwordValidation).filter(v => v === true).length
      this.barProgressStyle = this.progressStyles[nValidRules]
    }
  }
};
</script>

