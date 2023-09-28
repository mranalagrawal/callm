<script>
import { storeToRefs } from 'pinia'
import { defineComponent, ref, useContext, useRouter } from '@nuxtjs/composition-api'
import loginGoogle from '~/assets/svg/login-google.svg'
import loginFacebook from '~/assets/svg/login-facebook.svg'
import loginApple from '~/assets/svg/login-apple.svg'
import eyeShowIcon from '~/assets/svg/eye-show.svg'
import eyeHideIcon from '~/assets/svg/eye-hide.svg'
import { useCustomer } from '~/store/customer'
import Alert from '~/components/FeedBack/Alert.vue'
import socialFacebook from '~/assets/svg/social-facebook.svg'
import socialGoogle from '~/assets/svg/social-google.svg'

export default defineComponent({
  components: { Alert },
  props: {
    skipRedirect: { type: Boolean },
  },
  emits: ['login-success'],
  setup(props, { emit }) {
    const { i18n, localeLocation } = useContext()
    const router = useRouter()
    const customerStore = useCustomer()
    const { customer } = storeToRefs(customerStore)
    const isSubmitting = ref(false)
    const passwordIsVisible = ref(false)
    const message = ref('')
    const form = ref({
      email: '',
      password: '',
    })
    const onSubmit = async () => {
      isSubmitting.value = true

      const valid = await customerStore.login(form.value.email, form.value.password)

      if (valid) {
        await customerStore.getCustomer('login')
          .then(async () => {
            emit('login-success', true)
            !props.skipRedirect && router.push(localeLocation('/profile/my-orders'))
          })
      } else {
        message.value = i18n.t('common.feedback.KO.login')
      }
      isSubmitting.value = false
    }

    return {
      customer,
      customerStore,
      eyeHideIcon,
      eyeShowIcon,
      form,
      isSubmitting,
      loginApple,
      loginFacebook,
      loginGoogle,
      message,
      onSubmit,
      passwordIsVisible,
      socialFacebook,
      socialGoogle,
    }
  },
})
</script>

<template>
  <div>
    <ValidationObserver
      v-slot="{ handleSubmit }"
      slim
    >
      <form
        class="px-4 pt-3 pb-2 md:w-3/4 mx-auto"
        @submit.prevent="handleSubmit(onSubmit)"
      >
        <InputField
          v-model="form.email"
          type="email"
          name="user-email"
          :label="$t('email')"
          :placeholder="$t('emailPlaceholder')"
          rules="required|email"
        />

        <InputField
          v-model="form.password"
          :type="!passwordIsVisible ? 'password' : 'text'"
          name="user-password"
          :label="$t('password')"
          :placeholder="$t('passwordPlaceholder')"
          rules="required|min:4"
          :icon="passwordIsVisible ? eyeHideIcon : eyeShowIcon"
          :click-icon="() => passwordIsVisible = !passwordIsVisible"
        />

        <Alert
          v-if="message"
          severity="error"
        >
          {{ message }}
        </Alert>

        <Button
          class="sm:max-w-330px mt-8"
          type="submit"
          :disabled="isSubmitting"
          :label="$t('navbar.user.signIn')"
        />

        <NuxtLink
          to="/recover"
          class="block w-max my-3 text-primary-400"
        >
          {{ $t("navbar.user.forgotPassword") }}
        </NuxtLink>
        <a v-if="$cmwStore.isIt" class="my-8 cmw-font-bold text-secondary-400" href="https://b2b.callmewine.com">PORTALE
          OPERATORI HO.RE.CA.</a>
      </form>
    </ValidationObserver>
    <div v-if="!$cmwStore.isB2b" class="px-4 pb-2 md:w-3/4 mx-auto">
      <p class="mb-5">
        {{ $t("navbar.user.orLoginWith") }}
      </p>
      <a
        :href="`${$config.MULTIPASS_URL}/social-login/${$config.STORE}/facebook/`"
        class="btn-base w-auto btn-default facebook text-sm sm:max-w-330px btn-base-spacing my-3"
      >
        <VueSvgIcon :data="socialFacebook" color="white" width="30" height="auto" />
        <span class="px-3">{{ $t("navbar.user.facebookLogin") }}</span>
      </a>
      <a :href="`${$config.MULTIPASS_URL}/social-login/${$config.STORE}/google/`" class="btn-base w-auto btn-default google text-sm sm:max-w-330px btn-base-spacing mb-3">
        <VueSvgIcon :data="socialGoogle" original width="30" height="auto" />
        <span class="px-3">{{ $t("navbar.user.googleLogin") }}</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
  .facebook {
    background-color: #004bce !important;
    text-transform: unset;
  }
  .google {
    background-color: #fff !important;
    text-transform: unset;
    color: black;
    border: 1px solid black !important;
  }
</style>
