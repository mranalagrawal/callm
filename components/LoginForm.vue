<script>
import { storeToRefs } from 'pinia'
import { ref, useContext, useRouter } from '@nuxtjs/composition-api'
import eyeShowIcon from '~/assets/svg/eye-show.svg'
import eyeHideIcon from '~/assets/svg/eye-hide.svg'
import { useCustomer } from '~/store/customer'
import Alert from '~/components/FeedBack/Alert.vue'

export default {
  components: { Alert },
  props: {
    width: { type: String, default: '' },
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
          .then(() => {
            emit('login-success', true)
            !props.skipRedirect && router.push(localeLocation('/profile/my-orders'))
          })
      } else {
        message.value = i18n.t('common.feedback.KO.login')
      }
      isSubmitting.value = false
    }

    return { customerStore, customer, form, passwordIsVisible, isSubmitting, eyeShowIcon, eyeHideIcon, message, onSubmit }
  },
}
</script>

<template>
  <ValidationObserver
    v-slot="{ handleSubmit }"
    slim
  >
    <form
      class="px-4 pt-3 pb-2 mx-auto"
      @submit.prevent="handleSubmit(onSubmit)"
    >
      <InputField
        v-model="form.email"
        type="email"
        name="user-email"
        label="Email"
        placeholder="User email"
        rules="required|email"
      />

      <InputField
        v-model="form.password"
        :type="!passwordIsVisible ? 'password' : 'text'"
        name="user-password"
        label="Password"
        :placeholder="$t('passwordPlaceholder').toString()"
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
        class="sm:cmw-max-w-330px cmw-mt-8"
        type="submit"
        :disabled="isSubmitting"
        :label="$t('navbar.user.signIn').toString()"
      />

      <NuxtLink
        to="/recover"
        class="cmw-block cmw-w-max cmw-my-3 cmw-text-primary-400 hover:(cmw-text-primary-400 cmw-no-underline)"
      >
        {{ $t("navbar.user.forgotPassword") }}
      </NuxtLink>
    </form>
  </ValidationObserver>
</template>
