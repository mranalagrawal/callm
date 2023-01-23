<script>
import { ref } from '@nuxtjs/composition-api'
import userRegister from '../utilities/userRegister'
import userLogin from '../utilities/userLogin'
import eyeShowIcon from '~/assets/svg/eye-show.svg'
import eyeHideIcon from '~/assets/svg/eye-hide.svg'
import calendarIcon from '~/assets/svg/calendar.svg'
import { regexRules } from '@/utilities/validators'

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
        firstname: '',
        lastname: '',
        email: '',
        password: '',
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
      ]),
    }
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
    },
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault()
      const domain = this.$config.DOMAIN
      const access_token = this.$config.STOREFRONT_ACCESS_TOKEN
      const token = await userRegister(
        this.form.firstname,
        this.form.lastname,
        this.form.email,
        this.form.password,
        this.form.marketing,
        this.form.age,
        domain,
        access_token,
      )
      const user = await userLogin(
        this.form.email,
        this.form.password,
        domain,
        access_token,
      )
      this.$store.commit('user/setUser', user)
      this.$store.commit('user/setWishlist', JSON.parse(user.customer.wishlist.value))
      this.$router.push('/profile')
    },
  },
}
</script>

<template>
  <div class="">
    <ValidationObserver ref="formEl" v-slot="{ errors }" slim>
      <form class="px-4 pt-3 py-2 w-75 mx-auto" @submit="onSubmit">
        <InputField
          v-model="form.firstname"
          name="register-user-firstname" :label="$t('firstName').toString()"
          :placeholder="$t('firstName').toString()" rules="required" theme="gray"
        />

        <InputField
          v-model="form.lastname"
          name="register-user-lastname" :label="$t('lastName').toString()"
          :placeholder="$t('lastName').toString()" rules="required" theme="gray"
        />

        <InputField
          v-model="form.email"
          type="email"
          name="register-user-email" :label="$t('email').toString()"
          :placeholder="$t('email').toString()" rules="required|email" theme="gray"
        />

        <CmwStrongPassword v-model="form.password" theme="gray" :placeholder="$t('passwordPlaceholder').toString()" />

        <InputField
          v-model="form.age"
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
